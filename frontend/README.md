# AI Live Website Builder — Frontend

SPA React multi-tenant: **un singur build** servește editorul și toate site-urile live. Hostname-ul decide modul (EDITOR / VIEWER / ADMIN); conținutul vine dintr-un JSON `SiteConfig` per domeniu, încărcat din WordPress REST.

## Ideea centrală

| Host | Mod | Comportament |
|------|-----|--------------|
| `localhost` / `editor.ai-web.site` | **EDITOR** | Editare, toolbar, localStorage, save către WP |
| `admin.ai-web.site` | **ADMIN** | Mod administrare |
| orice alt `*.ai-web.site` | **VIEWER** | Site live read-only, fără toolbar |

Logica de mod este în `constants.js` (`getAppMode`, `isSiteEditable`, `useLocalStorage`, `showImportExport`).

### Topologie

```
Utilizator → Editor / Viewer
                ↓
         REST /wp-json/ai-web-site/v1  (ai-web.site)
                ↓
         Plugin WordPress (config MySQL, AI, auth, cPanel)
                ↓
         ai-web-site-dist  ← același build static pentru toate host-urile
```

- **Editor:** `editor.ai-web.site` (sau localhost în dev)
- **Viewer:** `client.ai-web.site` etc. — același SPA, alt `SiteConfig` după hostname
- **Backend:** WordPress pe `ai-web.site` (plugin `ai-web-site-plugin`)

## Stack

- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS** + Radix UI + Framer Motion
- **React Router v6**, react-helmet-async (SEO)
- **PWA** (vite-plugin-pwa / Workbox)
- zod, DOMPurify, react-quill, react-beautiful-dnd, react-image-crop, Sonner

## Structura proiectului

```
frontend/
├── src/              # App shell, pages, SEO, routing (main.tsx, App.tsx)
├── components/       # Secțiuni, carduri, toolbar, modale (~117 TSX)
├── context/          # Config, site, edit/view, language, test mode
├── services/         # Config, AI, images, Unsplash, plans, localStorage
├── hooks/            # AI, history, sync, debounce, site config
├── utils/            # API save, sanitize, SEO build, validation
├── public/           # site-config.json, PWA, .htaccess, nginx.conf
├── scripts/          # build-seo.js, deploy-to-server.js
├── constants.js      # API base, moduri EDITOR/VIEWER/ADMIN, feature gates
├── types.ts          # SiteConfig, secțiuni, plans-config
└── dist/             # Build local Vite (generat)
```

### Providers (App.tsx)

`LanguageProvider` → `TestModeProvider` → `ConfigProvider` → `SiteModeProvider` → `SiteProvider` → rute + modale editor.

## Funcționalități

### Editor & conținut

- Editare vizuală in-place (dbl-click pe elemente)
- Toggle Edit / View + toolbar
- Bibliotecă secțiuni: Header, Hero, About, Services, HowItWorks, Stats, Pricing, Team, Testimonials, Clients, Portfolio, Blog, FAQ, Contact, Footer
- Template-uri multiple per secțiune (ex. About: image-left / right / top / overlay)
- Blog + articole CRUD (`/blog`, `/blog/:slug`)
- Conținut bilingv RO / EN (`LocalizedString`, `LanguageContext`)
- GDPR / cookies + pagini legale (RO + EN)
- PWA (Service Worker)

### AI & platformă

- Rebuild text AI (Gemini, via plugin proxy)
- Generare imagini AI + Unsplash
- Limite pe tip domeniu (`plans-config`: localhost / test_domain / public_domain)
- Import/Export config — **doar pe localhost**
- localStorage — **doar în EDITOR**

## Modelul SiteConfig

Inima multi-tenancy — un JSON per domeniu:

| Câmp | Rol |
|------|-----|
| `metadata` | version, lastModified, userType (`free` \| `premium`) |
| `sections` | map id → Section (conținut + template) |
| `sectionOrder` | ordinea de randare pe `HomePage` |
| `pages` / `articles` | pagini & blog |
| `images` | id → base64 (opțional) |
| `plans-config` | limite AI, feature flags, tipuri domeniu |

În EDITOR, config-ul poate veni din `public/site-config.json` (flag `SITE_CONFIG_LOADING.useLocal_site_config`) sau din API. În VIEWER se încarcă mereu după hostname.

## Integrare API

Base: `https://ai-web.site/wp-json/ai-web-site/v1` (vezi `constants.js`)

| Method | Route | Rol |
|--------|-------|-----|
| GET | `/website-config/{domain}` | Încarcă config |
| POST | `/website-config` | Salvează config (auth: cookies + `X-WP-Nonce`) |
| GET | `/wp-nonce` | Nonce WordPress |
| POST | `/ai/generate-text` | Proxy Gemini text |
| POST | `/ai/generate-image` | Proxy generare imagine |
| GET | `/ai/model-limits` | Limite token model |

Cheile AI **nu** sunt în frontend — stau în WP Admin (plugin). Frontend-ul apelează doar proxy-ul autentificat.

## Fluxuri tipice

1. **Edit & save** — login pe `ai-web.site` → deschide editor → load config → edit mode → AI opțional → Save (nonce + POST) → MySQL  
2. **Vizitor live** — hit pe `client.ai-web.site` → VIEWER → GET config pe hostname → randare `sectionOrder` + rute blog/legale  
3. **Subdomeniu** — se creează din WordPress (`[ai_user_sites]`); același build SPA, alt `SiteConfig`

## Development

```bash
npm install
npm run dev          # Vite pe :3000 (mod EDITOR pe localhost)
```

Variabile utile (vezi `env.ts`): `VITE_BASE_SITE_URL`, `VITE_EDITOR_URL`. Nu pune chei de provider AI în `.env` — acestea aparțin plugin-ului WP.

```bash
npm run build        # include build:seo → Vite build
```

## Deployment

Build-ul de producție ajunge în submodule-ul public [`ai-web-site-dist`](https://github.com/gabrrrielll/ai-web-site-dist), de unde cPanel face Git pull. Același dist servește `editor.ai-web.site` și toate subdomeniile viewer.

### Din root-ul monorepo

```bash
npm run deploy:frontend   # build + push în ai-web-site-dist
npm run deploy:all        # plugin + frontend
```

### Din `frontend/`

```bash
npm run deploy            # build + deploy-to-server.js → dist repo
```

Scriptul:

1. Rulează build-ul (`npm run build`)
2. Copiază artifactele în `ai-web-site-dist`
3. Commit + push pe repo-ul public pentru deploy pe server

### Manual

```bash
npm run build
npm run deploy
```

## Securitate (frontend)

- Fără secrete AI în client — doar apeluri către proxy WP
- Save: `credentials: 'include'` + nonce real (fără test-nonce / chei hardcoded)
- Local DEV: setează `VITE_LOCAL_API_KEY` în `.env.local` **doar** dacă în WP (cu `WP_DEBUG`) există același `local_dev_api_key` (≥16 chars)
- Sanitizare (DOMPurify) pe toate path-urile HTML (`Editable`, Hero, Article, AI modal)
- Feature gates pe hostname: localStorage / Import-Export doar unde e permis
- `useLocal_site_config` default **false** — config din API după hostname
- Imagini: preferă URL Media/CDN; serverul respinge `data:image` > ~100KB

## Context monorepo

| Folder | Rol |
|--------|-----|
| `frontend/` | Sursa acestui SPA (repo privat) |
| `ai-web-site-plugin/` | Backend WordPress (submodule public) |
| `ai-web-site-dist/` | Build static deployat (submodule public) |

Documentația din `docs/` poate încă menționa layout-ul vechi (`backend/`, `shared/`). Sursa de adevăr pentru frontend este acest folder + `constants.js` / `types.ts`.

---

**Last updated:** 2026-07-23
