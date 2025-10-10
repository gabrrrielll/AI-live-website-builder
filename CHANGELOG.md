# Changelog

All notable changes to this project will be documented in this file.

## [2025-10-10] - Critical Fixes: Cross-Domain Authentication & Save Logic

### 🔥 PROBLEMA MAJORĂ #1: 403 Forbidden la salvarea configurației (zile de debugging!)

**SIMPTOMUL:** Când utilizatorii încercau să salveze configurația site-ului de pe `editor.ai-web.site` către `ai-web.site`, primeau **403 Forbidden** pentru POST requests mari (1.6MB+). Funcționa perfect pe localhost, dar eșua pe producție.

#### Investigația (zile întregi de debugging):

**Ipoteze testate și eliminate:**
1. ❌ **LiteSpeed Server limits** - Am testat cu `.htaccess`, dar cererea ajungea la PHP
2. ❌ **ModSecurity/WAF** - Cererea trecea de firewall, logurile PHP o arătau
3. ❌ **PHP limits** (`post_max_size`, `memory_limit`) - Toate erau configurate corect
4. ❌ **WordPress REST API permissions** - `permission_callback: __return_true` era setat
5. ❌ **CORS issues** - Headers-urile erau corecte, OPTIONS requests funcționau

**Descoperirea crucială:**
- Cererea ajungea la PHP ✅
- REST API route era înregistrat ✅  
- Callback-ul `rest_save_website_config()` NU ERA APELAT NICIODATĂ ❌
- WordPress întorcea 403 ÎNAINTE să ajungă la callback-ul nostru

#### Cauza Root (găsită după zile de logging extensiv):

**EROAREA PRINCIPALĂ: Frontend trimitea `credentials: 'omit'` în loc de `credentials: 'include'`!**

```typescript
// GREȘIT (în api.ts):
fetch(url, {
    credentials: 'omit'  // ❌ Cookie-urile WordPress NU erau trimise!
});

// CORECT:
fetch(url, {
    credentials: 'include'  // ✅ Cookie-urile sunt trimise cross-domain
});
```

**Efectul cascadă:**
1. Frontend NU trimitea cookie-urile WordPress către server
2. `get_current_user_id()` returna 0 (user neautentificat)
3. WordPress REST API verifica nonce-ul și îl invalidă (user 0 ≠ user din nonce)
4. Returna **403 Forbidden** ÎNAINTE să ajungă la endpoint-ul nostru
5. `permission_callback` și `callback` NU se mai executau niciodată

#### Soluția Implementată:

**FIX PRINCIPAL: Schimbat `credentials: 'omit'` în `credentials: 'include'` în frontend:**

```typescript
// frontend/utils/api.ts
const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce,
    },
    credentials: 'include', // ✅ FIX PRINCIPAL - trimite cookie-urile WordPress!
    body: JSON.stringify(config)
});
```

**FIX-URI SUPLIMENTARE pentru autentificare cross-domain robustă:**

**1. Bypass WordPress nonce verification cu manual cookie parsing:**
```php
// În class-website-manager.php
add_filter('rest_authentication_errors', array($this, 'bypass_nonce_for_test'), 1);

public function bypass_nonce_for_test($result) {
    if (strpos($_SERVER['REQUEST_URI'], '/ai-web-site/v1/website-config') !== false) {
        $nonce = $_SERVER['HTTP_X_WP_NONCE'] ?? '';
        $user_id = $this->get_user_id_from_cookie(); // Parse manual cookie
        
        if ($user_id && wp_verify_nonce($nonce, 'wp_rest')) {
            return true; // Bypass default WordPress check
        }
    }
    return $result;
}
```

**2. CORS headers pentru credentials:**
```php
header('Access-Control-Allow-Origin: https://editor.ai-web.site');
header('Access-Control-Allow-Credentials: true'); // Permite cookies cross-domain
header('Access-Control-Allow-Headers: Content-Type, X-WP-Nonce');
```

### 📊 Impact #1:
- ✅ POST requests mari (1.6MB+) funcționează cross-domain
- ✅ Autentificarea cross-domain funcționează corect
- ✅ Nonce verification în contextul corect
- ✅ User ID identificat corect din cookies

### 🔧 Fișiere Cheie #1:
- `ai-web-site-plugin/includes/class-website-manager.php` - Bypass nonce + cookie parsing
- `frontend/utils/api.ts` - `credentials: 'include'`

### 💡 Lecții învățate #1:
1. **🔥 LECȚIA PRINCIPALĂ: `credentials: 'omit'` blochează cookie-urile!** - Fără `credentials: 'include'`, browser-ul NU trimite cookies cross-domain, chiar dacă CORS headers sunt corecte
2. **WordPress REST API verifică autentificarea ÎNAINTE de permission_callback** - dacă cookie-urile lipsesc, returnează 403 fără să ajungă la endpoint
3. **`get_current_user_id()` returnează 0 fără cookies** - chiar dacă user-ul e logat în alt tab/subdomain
4. **CORS `Access-Control-Allow-Credentials: true`** este necesar ÎMPREUNĂ cu `credentials: 'include'`
5. **Manual cookie parsing** oferă fallback robust pentru cross-domain authentication
6. **Debugging sistematic** - verifică întâi basics (credentials, cookies) înainte de soluții complexe

---

## [2025-10-10] - Critical Fix: Site Configuration Save Logic

### 🐛 Critical Bug Fix

**PROBLEMA:** Când utilizatorii salvau configurația site-ului de pe `editor.ai-web.site`, sistemul crea întotdeauna un site NOU în baza de date în loc să actualizeze site-ul existent. Acest lucru ducea la duplicate entries și pierderea subdomain-urilor configurate.

#### Cauza Root:
- Logica de identificare a site-ului existent folosea 3 criterii: `user_id`, `domain` și `subdomain`
- Când salvai de pe editor, subdomain-ul era "editor"
- Când adăugai un subdomain real (ex: "test"), acesta devenea "test" în DB
- La următoarea salvare de pe editor, query-ul SQL nu mai găsea site-ul (subdomain diferit) → crea entry nou

#### Soluția Implementată:

**1. Logică nouă de identificare site:**
```php
// ÎNAINTE: Căuta după user_id + domain + subdomain
// ACUM: Caută DOAR după user_id + domain (ignoră subdomain)

$existing = $wpdb->get_row($wpdb->prepare(
    "SELECT * FROM {$table_name} 
     WHERE user_id = %d AND domain = %s",
    $user_id,
    $domain
));
```

**2. Gestionare corectă subdomain:**
- Când salvezi de pe `editor.ai-web.site` → subdomain se setează automat la `""` (empty)
- La UPDATE, subdomain-ul existent se păstrează dacă nu furnizezi unul nou
- Permite utilizatorilor să adauge subdomain mai târziu fără să piardă configurația

**3. Validare îmbunătățită:**
```php
// Permite subdomain gol (pentru site-uri editate dar nedeploiate)
if (!empty($subdomain) && !preg_match('/^[a-z0-9-]+$/', $subdomain)) {
    return new WP_Error('invalid_subdomain', 'Invalid subdomain format');
}
```

### 📊 Impact:
- ✅ Salvările de pe editor acum ACTUALIZEAZĂ site-ul existent corect
- ✅ Subdomain-urile adăugate se păstrează la salvări ulterioare
- ✅ Nu se mai creează duplicate entries în baza de date
- ✅ User ID-ul se identifică corect din cookies (nu se mai salvează pe user greșit)

### 🔧 Fișiere Modificate:
- `ai-web-site-plugin/includes/class-website-manager.php` - Logica de salvare
- `ai-web-site-plugin/includes/class-database.php` - Query-uri optimizate
- `frontend/utils/api.ts` - Gestionare corectă credentials pentru cookies

---

## [2024-09-29] - Major Restructure

### 🏗️ Architecture Changes
- **BREAKING**: Restructured project from monolithic to backend/frontend separation
- **NEW**: Backend now uses WordPress + PHP APIs instead of direct file management
- **NEW**: Frontend is now a separate React.js application with Vite

### 📁 Project Structure
```
AI-live-website-builder/
├── backend/                    # WordPress + API-uri PHP
│   ├── api/                   # AI services and site config APIs
│   ├── config/                # Backend configuration
│   └── wordpress/             # WordPress with custom plugin
├── frontend/                  # React.js with Vite
│   ├── src/, components/, hooks/ # React application
│   ├── services/, utils/      # Frontend services
│   └── dist/                  # Static build output
└── docs/                      # Updated documentation
```

### ✨ New Features
- **WordPress Plugin**: Custom plugin for subdomain management
- **cPanel API Integration**: Automatic subdomain creation via cPanel API
- **Subdomain Architecture**: Single React build serves multiple subdomains
- **Database Integration**: WordPress MySQL database for site configurations

### 🔧 Technical Changes
- **Backend**: PHP APIs for AI services (Gemini, Unsplash)
- **Frontend**: React.js with TypeScript, Tailwind CSS, Radix UI
- **Build System**: Vite for fast development and optimized builds
- **Subdomain Routing**: All subdomains point to single React build with different configs

### 📚 Documentation
- **NEW**: `docs/README.md` - Complete project overview
- **NEW**: `docs/ARCHITECTURE.md` - Detailed architecture documentation
- **NEW**: `docs/BACKEND_SETUP.md` - WordPress and cPanel setup guide
- **UPDATED**: `docs/README-REACT.md` - Frontend documentation

### 🗑️ Removed
- **REMOVED**: Old dual-mode approach documentation
- **REMOVED**: Static build only approach
- **REMOVED**: Local file-based configuration
- **REMOVED**: Test API documentation for old architecture
- **REMOVED**: URL modification flows for old system

### 🐛 Bug Fixes
- **FIXED**: Import paths for constants.js after restructuring
- **FIXED**: Missing framer-motion dependency
- **FIXED**: File organization and cleanup

### 🔄 Migration Notes
- **From**: Single React app with local storage
- **To**: WordPress backend + React frontend
- **Subdomains**: Now managed through WordPress plugin
- **Config**: Stored in WordPress database instead of local files

### 📋 Next Steps
- [ ] WordPress installation and setup
- [ ] cPanel API configuration
- [ ] Plugin activation and testing
- [ ] Subdomain creation testing
- [ ] Frontend deployment to editor.ai-web.site

---

## Previous Versions

### [2024-09-25] - React Migration
- Migrated from Next.js to React.js with Vite
- Implemented static build capability
- Added PWA support

### [2024-09-15] - Initial Release
- AI-powered website builder
- Real-time editing capabilities
- AI content generation (Gemini, Unsplash)
- Multi-language support
- Blog system with CRUD operations
