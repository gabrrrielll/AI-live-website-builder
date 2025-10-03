# Backend Setup - WordPress + cPanel Integration

Ghid complet pentru configurarea backend-ului cu WordPress și integrarea cPanel.

## 🏗️ Arhitectura Backend

```
backend/
├── wordpress/                  # WordPress installation
│   ├── wp-content/
│   │   └── plugins/
│   │       └── ai-web-site/   # Plugin custom pentru subdomenii
├── api/                       # API services PHP
│   ├── ai-service.php        # AI integration (Gemini, Unsplash)
│   └── (removed - now using WordPress REST API)
└── config/
    └── constants.php         # API keys și configurări
```

## 📋 Cerințe Sistem

- **PHP** 8.0+
- **MySQL** 5.7+
- **WordPress** 6.0+
- **cPanel** access cu API token
- **SSL Certificate** pentru HTTPS

## 🚀 Instalare WordPress

### 1. Download și Setup
```bash
# Download WordPress latest
wget https://wordpress.org/latest.zip
unzip latest.zip -d backend/wordpress/

# Configurare permissions
chmod 755 backend/wordpress/
chmod 644 backend/wordpress/wp-config.php
```

### 2. Configurare Database
```php
// wp-config.php
define('DB_NAME', 'ai_web_builder');
define('DB_USER', 'your_db_user');
define('DB_PASSWORD', 'your_db_password');
define('DB_HOST', 'localhost');

// WordPress security keys
define('AUTH_KEY', 'your-unique-phrase');
// ... generate all keys at https://api.wordpress.org/secret-key/1.1/salt/
```

### 3. Instalare Plugin AI Web Site
```bash
# Plugin-ul este deja în backend/wordpress/wp-content/plugins/ai-web-site/
# Activează din WordPress Admin
```

## 🔧 Configurare cPanel API

### 1. Generare API Token
1. Login în cPanel
2. Mergi la **Security** → **Manage API Tokens**
3. Creează token nou:
   - **Name**: ai-web-site-manager
   - **Expiration**: No expiration (sau setează data)
4. Copiază token-ul generat

### 2. Configurare Plugin WordPress
1. Login în WordPress Admin
2. Mergi la **Settings** → **AI Web Site**
3. Completează:
   - **cPanel Username**: username-ul tău cPanel
   - **cPanel Host**: ai-web.site (sau IP server)
   - **API Token**: token-ul generat la pasul anterior
   - **Main Domain**: ai-web.site

### 3. Test Conexiune
Click **Test Connection** pentru a verifica configurația.

## 🔑 Configurare API Keys

### 1. Editare constants.php
```php
// backend/config/constants.php
<?php

// AI Services
define('GEMINI_API_KEY', 'your_gemini_api_key_here');
define('UNSPLASH_API_KEY', 'your_unsplash_api_key_here');

// EmailJS Configuration
define('EMAILJS_SERVICE_ID', 'your_emailjs_service_id');
define('EMAILJS_TEMPLATE_ID', 'your_emailjs_template_id');
define('EMAILJS_PUBLIC_KEY', 'your_emailjs_public_key');

// Server Configuration
define('API_VERSION', '1.0');
define('CORS_ORIGINS', [
    'https://editor.ai-web.site',
    'https://ai-web.site'
]);
```

### 2. Securitate API Keys
```bash
# Protejează fișierul constants.php
chmod 600 backend/config/constants.php

# Adaugă în .htaccess dacă nu există
echo "deny from all" > backend/config/.htaccess
```

## 🌐 Configurare Subdomenii

### 1. Wildcard DNS (Opțional)
Pentru a permite toate subdomeniile automat:
```
*.ai-web.site A 192.168.1.100  # IP-ul serverului
```

### 2. SSL pentru Subdomenii
```bash
# Wildcard SSL certificate
# Contactează hosting provider pentru wildcard SSL
```

## 🔄 API Endpoints

### WordPress REST API
```
# Site config management
GET    /wp-json/ai-web-site/v1/site-config?subdomain=xxx
POST   /wp-json/ai-web-site/v1/site-config
PUT    /wp-json/ai-web-site/v1/site-config/{id}
DELETE /wp-json/ai-web-site/v1/site-config/{id}

# Subdomain management
POST   /wp-json/ai-web-site/v1/subdomains
DELETE /wp-json/ai-web-site/v1/subdomains/{id}
```

### PHP API Services
```
# AI services
POST /api/ai-service.php
Body: { "action": "generate_text", "prompt": "..." }

# Site config by subdomain
GET /wp-json/ai-web-site/v1/website-config/{domain}
```

## 🗄️ Structura Baza de Date

Plugin-ul creează automat tabela:

```sql
CREATE TABLE wp_ai_web_sites (
    id mediumint(9) NOT NULL AUTO_INCREMENT,
    user_id bigint(20) NOT NULL,
    subdomain varchar(255) NOT NULL,
    domain varchar(255) NOT NULL,
    site_config longtext NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status enum('active', 'inactive', 'suspended') DEFAULT 'active',
    PRIMARY KEY (id),
    UNIQUE KEY unique_subdomain (subdomain, domain)
);
```

## 🔐 Securitate

### 1. WordPress Security
```php
// wp-config.php - securitate suplimentară
define('DISALLOW_FILE_EDIT', true);
define('WP_DEBUG', false);
define('FORCE_SSL_ADMIN', true);
```

### 2. API Rate Limiting
```php
// În plugin - implementat automat
- 10 requests/minute pentru crearea subdomeniilor
- 100 requests/minute pentru API-urile de configurare
```

### 3. Input Validation
- Toate input-urile sunt sanitizate
- SQL injection prevention
- XSS protection activă

## 🚨 Troubleshooting

### Plugin nu se activează
```bash
# Verifică permissions
chmod -R 755 backend/wordpress/wp-content/plugins/ai-web-site/

# Verifică logs WordPress
tail -f wp-content/debug.log
```

### cPanel API nu funcționează
1. Verifică username și token
2. Testează manual: `curl -H "Authorization: cpanel user:token" https://domain:2083/execute/StatsBar/get_stats`
3. Verifică firewall restrictions

### Subdomeniile nu se creează
1. Verifică cPanel permissions
2. Verifică quota subdomeniilor
3. Verifică logs în WordPress

## 📊 Monitoring

### Logs Important
```bash
# WordPress logs
tail -f backend/wordpress/wp-content/debug.log

# Apache/Nginx logs
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log

# cPanel API logs (în plugin)
# Vezi WordPress Admin → Tools → Site Health
```

### Performance Monitoring
- Monitorizează query-urile database
- Verifică response time API
- Urmărește usage subdomeniilor

## 🔄 Backup Strategy

### 1. Database Backup
```bash
# Backup automat zilnic
mysqldump ai_web_builder > backup_$(date +%Y%m%d).sql
```

### 2. Files Backup
```bash
# Backup WordPress și plugin
tar -czf wordpress_backup_$(date +%Y%m%d).tar.gz backend/wordpress/
```

### 3. Restore Procedure
1. Restore database din backup
2. Restore files
3. Verifică permissions
4. Test funcionarea plugin-ului