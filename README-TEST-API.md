# 🧪 API de Test pentru Site-Config

Acest set de fișiere permite testarea încărcării configurației site-ului prin API.

## 📁 Fișiere necesare

```
├── api-site-config.php    # API-ul principal
├── .htaccess              # Configurație Apache pentru URL-uri frumoase  
├── site-config.json       # Fișierul de configurație
└── README-TEST-API.md     # Aceste instrucțiuni
```

## 🚀 Cum să testezi

### 1. **Setup pe domeniul de test**

Uploadeaza fișierele pe domeniul tău de test:
```
https://bibic.ro/api/
├── api-site-config.php
├── .htaccess  
├── site-config.json
```

### 2. **Configurează constants.js**

Editează `constants.js` din aplicația Next.js:
```javascript
const API_CONFIG = {
  BASE_URL: 'https://bibic.ro/api',  // ← Domeniul tău de test
  ENDPOINTS: {
    SITE_CONFIG: '/api-site-config.php',
  }
};
```

### 3. **Testează API-ul**

**Încărcare configurație (GET):**
```bash
curl https://bibic.ro/api/api-site-config.php
# sau pentru un domeniu specific:
curl https://bibic.ro/api/api-site-config.php/localhost
```

**Salvare configurație (POST):**
```bash
curl -X POST https://bibic.ro/api/api-site-config.php \
  -H "Content-Type: application/json" \
  -d '{"domain":"localhost","config":{"test":true}}'
```

### 4. **Testează din Next.js**

Pornește aplicația Next.js:
```bash
npm run dev
```

Aplicația va încerca să încarce configurația din:
1. localStorage (dacă există)
2. `https://bibic.ro/api/api-site-config.php/localhost` (API-ul tău)
3. `/site-config.json` (fallback local)

## 🔍 Debugging

### Verifică log-urile
Fișierul `api-requests.log` va conține toate cererile:
```bash
tail -f api-requests.log
```

### Testează CORS
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://bibic.ro/api/api-site-config.php
```

### Verifică configurația
```bash
# Verifică dacă JSON-ul este valid
curl https://bibic.ro/api/api-site-config.php | jq .
```

## 🛠️ Personalizare

### Schimbă domeniul permis (CORS)
În `api-site-config.php`, linia 11:
```php
header('Access-Control-Allow-Origin: http://localhost:3000'); // ← Schimbă aici
```

### Adaugă autentificare
Decomentează și configurează în `api-site-config.php`:
```php
// Verifică API key (opțional)
$apiKey = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if ($apiKey !== 'Bearer your-secret-key') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}
```

## 📊 URL-uri suportate

- `GET /api-site-config.php` → Încarcă configurația
- `GET /api-site-config.php/domain.com` → Încarcă pentru domeniul specific
- `POST /api-site-config.php` → Salvează configurația
- `OPTIONS /api-site-config.php` → Preflight CORS

## ⚠️ Notă de securitate

Acest API este pentru **testare**! Pentru producție:
- Adaugă autentificare
- Validează input-ul
- Limitează rate-ul de cereri  
- Folosește HTTPS
- Restricționează CORS la domeniile tale
