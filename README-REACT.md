# AI Live Website Editor - React Version

Aplicația a fost migrată cu succes de la Next.js la React.js cu Vite pentru build static.

## 🚀 Tehnologii Folosite

- **React 18** - Biblioteca principală pentru UI
- **Vite** - Build tool rapid și modern
- **React Router v6** - Routing pentru SPA
- **react-helmet-async** - Management SEO și metadata
- **TypeScript** - Tipizare statică
- **Tailwind CSS** - Framework CSS
- **Radix UI** - Componente UI accesibile
- **PWA Support** - Progressive Web App features

## 📁 Structura Proiectului

```
├── src/
│   ├── components/
│   │   ├── SEO.tsx              # Component pentru SEO
│   │   └── Router.tsx           # Configurația rutelor
│   ├── pages/                   # Toate paginile aplicației
│   │   ├── HomePage.tsx
│   │   ├── BlogPage.tsx
│   │   ├── ArticlePage.tsx
│   │   ├── PrivacyPolicyPage.tsx
│   │   ├── TermsAndConditionsPage.tsx
│   │   ├── CookiePolicyPage.tsx
│   │   ├── CookieSettingsPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── en/                  # Pagini în engleză
│   ├── App.tsx                  # Componenta principală
│   ├── main.tsx                 # Entry point
│   └── index.css               # Stiluri globale
├── components/                  # Componente existente (păstrate)
├── services/                    # Servicii (actualizate pentru React)
├── utils/                       # Utilitare (actualizate)
├── constants.js                 # Constante (actualizate pentru Vite)
├── vite.config.ts              # Configurația Vite
├── tsconfig.json               # Configurația TypeScript
└── index.html                  # HTML entry point
```

## 🛠️ Comenzi Disponibile

```bash
# Instalare dependențe
npm install

# Development server
npm run dev

# Build pentru producție
npm run build

# Build cu generarea SEO files
npm run build:static

# Preview build-ul
npm run preview

# Linting
npm run lint

# Curățare
npm run clean
```

## 🌐 Variabile de Mediu

Creează un fișier `.env` în root-ul proiectului:

```env
# AI Services
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_UNSPLASH_API_KEY=your_unsplash_api_key_here

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Site Configuration
VITE_BASE_SITE_URL=https://yourdomain.com
```

## 🔧 Caracteristici

### ✅ **Păstrate din Next.js:**
- Toate componentele UI existente
- Serviciile AI și API-urile
- Funcționalitățile de editare în timp real
- Sistemul de configurare a site-ului
- PWA features (Service Worker, manifest)
- Multi-lang support (RO/EN)
- Toate stilurile și design-ul

### 🆕 **Noi cu React:**
- **SEO Management** - react-helmet-async pentru metadata dinamică
- **Client-Side Routing** - React Router pentru navigare smooth
- **Build Static** - Vite pentru build rapid și optimizat
- **Better Performance** - Bundle mai mic, încărcare mai rapidă
- **Flexibility** - Control complet asupra build process-ului

## 📱 PWA Features

Aplicația include suport complet pentru PWA:
- Service Worker pentru caching
- Manifest.json pentru instalare
- Offline support
- Push notifications ready

## 🔍 SEO Optimizations

- **Dynamic Meta Tags** - Title, description, Open Graph, Twitter Cards
- **Structured Data** - Schema.org markup
- **Sitemap Generation** - Automat în timpul build-ului
- **Robots.txt** - Generat automat
- **Canonical URLs** - Pentru fiecare pagină

## 🚀 Deployment

### Build Static
```bash
npm run build:static
```

Acest comand va:
1. Genera sitemap.xml și robots.txt
2. Face build-ul aplicației cu Vite
3. Crea directorul `dist/` cu toate fișierele statice

### Hosting
Fișierele din `dist/` pot fi hostate pe:
- Apache/Nginx
- CDN-uri (Cloudflare, AWS CloudFront)
- GitHub Pages
- Netlify/Vercel (ca static site)

## 🔄 Migrarea de la Next.js

### Ce a fost schimbat:
1. **Next.js App Router** → **React Router v6**
2. **generateMetadata()** → **react-helmet-async**
3. **next.config.js** → **vite.config.ts**
4. **app/ directory** → **src/pages/**
5. **process.env** → **import.meta.env**

### Ce a fost păstrat:
- Toate componentele existente
- Serviciile și API-urile
- Stilurile și design-ul
- Funcționalitățile de editare
- PWA features

## 🐛 Troubleshooting

### Probleme comune:

1. **Erori de import** - Verifică că toate fișierele au extensiile corecte
2. **Environment variables** - Asigură-te că sunt prefixate cu `VITE_`
3. **Routing issues** - Verifică că React Router este configurat corect
4. **Build errors** - Rulează `npm run clean` și încearcă din nou

### Debug:
```bash
# Verifică configurația Vite
npm run dev -- --debug

# Verifică build-ul
npm run build -- --debug
```

## 📞 Support

Pentru probleme sau întrebări:
- Verifică log-urile din consolă
- Testează cu `npm run dev`
- Verifică că toate dependențele sunt instalate

---

**Aplicația a fost migrată cu succes și este gata pentru producție! 🎉**

