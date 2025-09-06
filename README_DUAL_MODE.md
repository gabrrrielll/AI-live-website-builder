# AI Live Website Editor - Arhitectură Dual-Mode

## 🚀 Conceptul

Această aplicație funcționează în **două moduri**:

### **1. Mod Editare (Builder)**
- Userul configurează site-ul cu funcții AI
- Toate modificările se salvează în `localStorage`
- Funcționalități complete de editare
- AI generation disponibil

### **2. Mod Vizualizare (Site Live)**
- Site-ul este afișat ca site normal
- Configurația se încarcă din API pe domeniul clientului
- Fără funcții de editare
- SEO complet optimizat

## 🔄 Fluxul de Lucru

### **Pentru User (Client)**
1. **Accesează builder-ul**: `https://builder.yourdomain.com` (configurabil în `constants.js`)
2. **Configurează site-ul**: Folosește AI și funcții de editare
3. **Salvează local**: Configurația se salvează în browser
4. **Achită site-ul**: Plătește pentru site-ul configurat
5. **Primește build static**: Fișierele statice + configurația JSON
6. **Deployează pe serverul său**: Apache, Nginx, etc.

### **Pentru Server (API)**
1. **Salvează configurația**: Pe serverul tău cu CORS restrictii
2. **API endpoint**: `https://api.yourdomain.com/site-config/{domain}` (configurabil în `constants.js`)
3. **CORS policy**: Doar domeniul clientului poate accesa configurația
4. **Build static**: Generat automat cu toate funcționalitățile

## 🏗️ Arhitectura Tehnică

### **Detectarea Modului**
```typescript
// context/SiteModeContext.tsx
const { isEditMode, isViewMode } = useSiteMode();

// Detectează automat bazat pe:
// 1. URL parameter: ?edit=true
// 2. localStorage: site-config
// 3. Domain: builder.yourdomain.com vs clientdomain.com (configurabil în constants.js)
```

### **Încărcarea Configurației**
```typescript
// hooks/useSiteConfig.ts
const { siteConfig, isLoading, error } = useSiteConfig();

// Ordinea de încărcare:
// 1. localStorage (mod editare)
// 2. API call (mod vizualizare)
// 3. Fallback la default config
```

### **Salvarea Configurației**
```typescript
// hooks/useSiteConfig.ts
const { saveToLocalStorage, saveToServer } = useSiteConfigSaver();

// Mod editare: localStorage
// Mod vizualizare: API server
```

## 📁 Structura Fișierelor

### **Build Static (Pentru Client)**
```
out/
├── index.html          # Home page
├── blog/
│   ├── index.html      # Blog listing
│   └── [slug]/
│       └── index.html  # Article pages
├── _next/static/       # Assets
├── sitemap.xml         # Generat dinamic
├── robots.txt          # Generat dinamic
├── manifest.json       # PWA manifest
└── .htaccess           # Apache config
```

### **API Server (Pentru Tine)**
```
api/
├── site-config/
│   ├── GET /{domain}   # Returnează config pentru domeniu
│   └── POST /          # Salvează config nou
├── CORS policy         # Restricții pe domeniu
└── Database           # Stocare configurații
```

## 🔧 Configurare

### **Variabile de Mediu**
```env
# Pentru build static
GEMINI_API_KEY=your_gemini_api_key
UNSPLASH_API_KEY=your_unsplash_api_key
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Pentru API server
NEXT_PUBLIC_API_KEY=your_api_key
NEXT_PUBLIC_BASE_URL=https://api.yourdomain.com  # Sau editează în constants.js
```

### **Configurarea URL-urilor (constants.js)**
```javascript
// constants.js - Configurații centralizate
const API_CONFIG = {
  BASE_URL: 'https://api.yourdomain.com',  // ← Schimbă aici domeniul API
  ENDPOINTS: {
    SITE_CONFIG: '/site-config',
  }
};

const APP_CONFIG = {
  BASE_SITE_URL: 'https://yourdomain.com',  // ← Schimbă aici domeniul site-ului
};
```

### **CORS Policy (API Server)**
```javascript
// Restricții pentru fiecare domeniu client
app.use(cors({
  origin: function (origin, callback) {
    // Verifică dacă origin-ul este domeniul clientului
    const allowedDomains = ['client1.com', 'client2.com'];
    if (allowedDomains.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

## 🎯 Avantaje

### **Pentru Client**
- ✅ Site complet funcțional
- ✅ SEO perfect optimizat
- ✅ Fără dependențe de server
- ✅ Performanță maximă
- ✅ Control complet asupra site-ului

### **Pentru Tine (Server)**
- ✅ Model de business clar
- ✅ Control asupra configurațiilor
- ✅ Posibilitate de backup/restore
- ✅ Analytics și monitoring
- ✅ Upselling pentru funcții premium

## 🚀 Deployment

### **Pentru Client**
```bash
# Build static
npm run build:static

# Upload la serverul clientului
# Include toate fișierele din 'out/'
```

### **Pentru API Server**
```bash
# Deploy pe serverul tău
# Configurare CORS pentru fiecare client
# Database pentru stocarea configurațiilor
```

## 📊 Monitorizare

### **API Analytics**
- Câte configurații sunt salvate
- Care domenii folosesc API-ul
- Performanța API-ului
- Erori și debugging

### **Client Analytics**
- Câte site-uri sunt generate
- Care funcții sunt folosite cel mai mult
- Conversia de la trial la plată

**Această arhitectură permite să oferi un serviciu complet de site building cu control total asupra business-ului! 🎉**

