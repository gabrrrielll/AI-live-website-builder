# AI Live Website Builder

Un website builder inteligent cu React.js frontend și WordPress backend pentru crearea și gestionarea subdomeniilor.

## 🏗️ Arhitectura Proiectului

```
AI-live-website-builder/
├── backend/                    # WordPress + API-uri PHP
│   ├── api/                   # API-uri pentru AI și configurări
│   │   ├── ai-service.php     # Servicii AI (Gemini, Unsplash)
│   │   └── api-site-config.php # API pentru configurații site
│   ├── config/                # Configurații backend
│   │   └── constants.php      # Chei API și configurări
│   └── wordpress/             # WordPress cu plugin
│       └── wp-content/plugins/ai-web-site/
├── frontend/                  # React.js cu Vite
│   ├── src/                   # Codul sursă React
│   ├── components/            # Componente React
│   ├── context/               # Context providers
│   ├── hooks/                 # Custom hooks
│   ├── services/              # Servicii frontend
│   ├── utils/                 # Utilități
│   ├── dist/                  # Build-ul static pentru producție
│   └── package.json           # Dependențe NPM
├── shared/                    # Resurse comune
│   ├── constants/             # Constante partajate
│   └── types/                 # Tipuri TypeScript
└── docs/                      # Documentație
```

## 🚀 Tehnologii

### Frontend
- **React 18** - Framework principal
- **Vite** - Build tool rapid
- **TypeScript** - Tipizare statică
- **Tailwind CSS** - Framework CSS
- **React Router** - Routing SPA

### Backend
- **WordPress** - CMS și gestionare utilizatori
- **PHP** - API-uri pentru AI și configurări
- **MySQL** - Baza de date pentru subdomenii
- **cPanel API** - Gestionare automată subdomenii

## 💡 Concept

### Modul de Funcționare

1. **Editor**: `editor.ai-web.site` - interfața de editare ReactJS
2. **Subdomenii**: `subdom1.ai-web.site`, `subdom2.ai-web.site` - site-uri live
3. **Backend**: WordPress pentru gestionare și API-uri PHP pentru AI

### Fluxul de Date

```
Editor (React) → WordPress API → Subdomeniu Live
      ↓              ↓              ↓
  Editare       Stocare       Afișare
```

## 🔧 Configurare Dezvoltare

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend
- Instalează WordPress în `backend/wordpress/`
- Activează plugin-ul din `backend/wordpress/wp-content/plugins/ai-web-site/`
- Configurează `backend/config/constants.php` cu cheile API

### 3. cPanel
- Creează API token în cPanel
- Configurează în WordPress Admin → Settings → AI Web Site

## 📦 Deployment

### Frontend (editor.ai-web.site)
```bash
cd frontend
npm run build
# Upload dist/ la /editor.ai-web.site/
```

### Backend (ai-web.site)
- Upload WordPress în root
- Upload API-uri PHP în `/api/`
- Configurează baza de date

## 🎯 Funcționalități

### ✅ Implementate
- [x] Arhitectură backend/frontend separată
- [x] Plugin WordPress pentru gestionare subdomenii
- [x] API-uri PHP pentru AI și configurări
- [x] Interface React pentru editare
- [x] Integrare cPanel API

### 🚧 În Dezvoltare
- [ ] Dashboard utilizatori în WordPress
- [ ] Sistem de plăți pentru subdomenii
- [ ] Template marketplace
- [ ] Analytics pentru site-uri

## 🔐 Securitate

- Toate cheile API sunt stocate securizat în backend
- Autentificare prin WordPress
- Validare input-uri și sanitizare
- Rate limiting pentru API-uri

## 📱 Subdomenii

Fiecare utilizator poate crea subdomenii care:
- Pointează către același build ReactJS (`editor.ai-web.site`)
- Încarcă configurații diferite din WordPress
- Afișează site-uri complet personalizate
- Sunt gestionate automat prin cPanel API

## 🛠️ Dezvoltare

Pentru a adăuga noi funcționalități:

1. **Frontend**: Lucrează în `frontend/src/`
2. **Backend**: Extinde plugin-ul WordPress
3. **API**: Adaugă endpoint-uri în `backend/api/`
4. **Shared**: Constante comune în `shared/`

## 📞 Support

Pentru probleme sau întrebări, consultă documentația din folderul `docs/`.