# 🔒 Subscription Management System

## 📋 Overview

Sistemul de management al abonamentelor verifică dacă utilizatorii au abonament activ înainte de a le permite să salveze configurații de site-uri.

---

## 🏗️ Architecture

### **1. class-subscription-manager.php**

Clasa centrală pentru managementul abonamentelor.

#### **Funcționalități principale:**

- ✅ **Verificare IHC Plugin** - Detectează dacă InfoHub Membership este activ
- ✅ **Verificare Abonament Activ** - Verifică status-ul abonamentului utilizatorului
- ✅ **Fallback Admin** - Administratorii pot salva fără abonament
- ✅ **Logging Detaliat** - Toate verificările sunt înregistrate

#### **Metode publice:**

```php
// Verifică dacă IHC este activ
public function is_ihc_active(): bool

// Verifică abonamentul utilizatorului
public function check_user_subscription($user_id): array

// Verifică dacă userul poate salva configurații
public function can_save_configuration($user_id): array

// Obține info pentru REST API response
public function get_subscription_info_for_api($user_id): array
```

---

## 🔐 Security Flow

### **Flow complet de securitate pentru salvare:**

```
1. REQUEST POST /wp-json/ai-web-site/v1/website-config
   ↓
2. VERIFICARE ORIGIN + TEST-NONCE
   ├─ Localhost → ✅ ALLOW (development)
   └─ Production + test-nonce → ❌ BLOCK (403)
   ↓
3. VERIFICARE USER LOGGED IN
   ├─ Not logged in → ❌ 401 (Authentication required)
   └─ Logged in → Continue
   ↓
4. VERIFICARE ABONAMENT ACTIV ⭐ NEW!
   ├─ Has subscription → ✅ ALLOW
   ├─ Is admin (no IHC) → ✅ ALLOW
   └─ No subscription → ❌ 403 (subscription_required)
   ↓
5. VERIFICARE NONCE (CSRF Protection)
   ├─ Valid nonce → ✅ SAVE
   └─ Invalid nonce → ❌ 403
```

---

## 📊 Response Examples

### **✅ Success - User has subscription:**

```json
{
  "success": true,
  "message": "Configuration saved successfully",
  "website_id": "3",
  "timestamp": "2025-10-04T05:00:00+00:00"
}
```

### **❌ Error - No subscription:**

```json
{
  "code": "subscription_required",
  "message": "Pentru a salva configurații, trebuie să ai un abonament activ. Te rugăm să achiziționezi un abonament pentru a continua.",
  "data": {
    "status": 403,
    "reason": "no_active_subscription",
    "action_required": "subscribe",
    "subscribe_url": "https://ai-web.site/abonamente/"
  }
}
```

### **❌ Error - User not logged in:**

```json
{
  "code": "not_logged_in",
  "message": "Trebuie să fii autentificat pentru a salva configurații",
  "data": {
    "status": 401
  }
}
```

---

## 🧪 Testing

### **Test 1: Localhost (Development) - SHOULD WORK**

```bash
curl -X POST http://localhost:3000/api/save \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d '{"config": {...}}'
```

**Result:** ✅ 200 OK (bypass all checks)

---

### **Test 2: Production - User NOT logged in - SHOULD FAIL**

```bash
curl -X POST https://ai-web.site/wp-json/ai-web-site/v1/website-config \
  -H "Content-Type: application/json" \
  -d '{"config": {...}}'
```

**Result:** ❌ 401 (not_logged_in)

---

### **Test 3: Production - Logged in WITHOUT subscription - SHOULD FAIL**

```bash
curl -X POST https://ai-web.site/wp-json/ai-web-site/v1/website-config \
  -H "Content-Type: application/json" \
  -H "Cookie: wordpress_logged_in_..." \
  -H "X-WP-Nonce: abc123" \
  -d '{"config": {...}}'
```

**Result:** ❌ 403 (subscription_required)

**Response:**
```json
{
  "code": "subscription_required",
  "message": "Pentru a salva configurații, trebuie să ai un abonament activ...",
  "data": {
    "status": 403,
    "action_required": "subscribe",
    "subscribe_url": "https://ai-web.site/abonamente/"
  }
}
```

---

### **Test 4: Production - Logged in WITH subscription - SHOULD WORK**

```bash
curl -X POST https://ai-web.site/wp-json/ai-web-site/v1/website-config \
  -H "Content-Type: application/json" \
  -H "Cookie: wordpress_logged_in_..." \
  -H "X-WP-Nonce: abc123" \
  -d '{"config": {...}}'
```

**Result:** ✅ 200 OK

---

## 🔌 IHC Integration

### **Funcții IHC folosite:**

```php
// Verifică dacă userul este activ
ihc_is_user_active($user_id): bool

// Obține toate nivelurile de abonament
ihc_get_all_levels(): array

// Verifică dacă un nivel a expirat
ihc_user_level_has_expired($user_id, $level_id): bool

// Obține URL-ul paginii de abonamente
ihc_get_subscription_page_url(): string
```

---

## 🛡️ Fallback Logic

### **Dacă IHC NU este activ:**

1. **Administratori** → ✅ ALLOW (poate salva fără abonament)
2. **Alți useri** → ❌ BLOCK (subscription system not available)

```php
// În class-subscription-manager.php
if (!$this->is_ihc_active()) {
    $user = get_userdata($user_id);
    if ($user && in_array('administrator', $user->roles)) {
        return array(
            'has_subscription' => true,
            'reason' => 'admin_user'
        );
    }
    // ... block non-admin users
}
```

---

## 📝 Logging

### **Toate verificările sunt înregistrate:**

```
[AI-WEB-SITE: check_save_permissions() CALLED]
[AI-WEB-SITE: User logged in: YES]
[AI-WEB-SITE: User ID: 123]
[SUBSCRIPTION_MANAGER: Checking subscription for user 123]
[SUBSCRIPTION_MANAGER: IHC plugin status: active]
[SUBSCRIPTION_MANAGER: User has active subscription]
[SUBSCRIPTION_MANAGER: Active subscription levels: [1, 2]]
[AI-WEB-SITE: ✅ User has active subscription - Save allowed]
```

---

## 🚀 Deployment

### **Pentru a activa sistemul:**

1. **Deploy plugin în cPanel:**
   ```
   Repository: https://github.com/gabrrrielll/ai-web-site-plugin.git
   Path: wp-content/plugins/ai-web-site-plugin
   ```

2. **Activate IHC Plugin** (dacă nu este deja activ)

3. **Testează cu utilizatori:**
   - User cu abonament → Salvare OK
   - User fără abonament → Eroare 403
   - Admin → Salvare OK (chiar fără IHC)

---

## 🎯 Frontend Integration

### **Handling error în frontend:**

```typescript
// În api.ts sau useSync.ts
try {
  const response = await uploadConfig(config);
  // ... success
} catch (error) {
  if (error.code === 'subscription_required') {
    // Afișează mesaj către user
    showNotification({
      type: 'error',
      message: error.message,
      action: {
        label: 'Achiziționează abonament',
        url: error.data.subscribe_url
      }
    });
  }
}
```

---

## ✅ Implementation Checklist

- ✅ **class-subscription-manager.php** - Created
- ✅ **IHC Integration** - Functions implemented
- ✅ **Fallback for Admin** - Implemented
- ✅ **Error Messages** - Clear and user-friendly
- ✅ **Logging** - Comprehensive debugging
- ✅ **Security** - Origin check + Subscription check
- ✅ **Deployed** - Plugin pushed to GitHub
- ⏳ **Testing** - Needs testing with real IHC setup
- ⏳ **Frontend** - Needs error handling UI

---

## 📋 Next Steps

1. **Deploy în cPanel** - Activate latest plugin version
2. **Activate IHC** - Ensure membership plugin is active
3. **Create test users:**
   - User cu abonament activ
   - User fără abonament
   - User admin
4. **Test all scenarios** - Verify error messages
5. **Update frontend** - Add error handling UI

---

**Status:** ✅ **IMPLEMENTED & READY FOR TESTING**

