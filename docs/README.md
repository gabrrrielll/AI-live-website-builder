# AI Live Website Builder

Website builder multi-tenant: un singur SPA React servește editorul și toate site-urile live; un plugin WordPress stochează config-urile, proxy-uiește AI-ul și creează subdomenii prin cPanel.

> **Structură curentă (sursă de adevăr):** `frontend/` + submodule `ai-web-site-plugin/` + `ai-web-site-dist/`. Layout-ul vechi `backend/` / `shared/` nu mai există.

## Arhitectură

```
AI-live-website-builder/
├── frontend/               # React + Vite SPA (sursă)
├── ai-web-site-plugin/     # Plugin WordPress (submodule public)
├── ai-web-site-dist/       # Build static pentru cPanel (submodule public)
├── docs/                   # Documentație
└── scripts/                # Deploy helpers
```

| Host | Mod | Rol |
|------|-----|-----|
| `localhost` / `editor.ai-web.site` | EDITOR | Editare, toolbar, save |
| `admin.ai-web.site` | ADMIN | Administrare |
| `*.ai-web.site` (alt host) | VIEWER | Site live read-only |

## Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind, Radix, PWA
- **Backend:** WordPress REST (`ai-web-site/v1`), MySQL, cPanel UAPI, Gemini, UMP/IHC

## Development

```bash
# Frontend
cd frontend && npm install && npm run dev

# Plugin: clone/activate în wp-content/plugins/
# Configurează în WP Admin → AI Web Site: cPanel, Gemini, UMP
# WP_DEBUG + local_dev_api_key (min 16 chars) doar pentru local
```

## Deploy

```bash
npm run deploy:all        # plugin + frontend
npm run deploy:frontend   # build → ai-web-site-dist
npm run deploy:plugin     # push submodule plugin
```

## Securitate (important)

- Cheile AI / cPanel doar în WP options — niciodată în frontend sau git
- Auth: cookies WP validate HMAC + nonce `save_site_config`
- CORS allowlist (editor / ai-web.site / localhost doar cu WP_DEBUG)
- `/logs` doar pentru `manage_options`
- Cote AI zilnice server-side (`ai_text_daily_limit`, `ai_image_daily_limit`)
- Nu embeda imagini base64 mari în SiteConfig — folosește Media/CDN + URL

Detalii frontend: [`frontend/README.md`](../frontend/README.md)  
Detalii plugin: [`ai-web-site-plugin/README.md`](../ai-web-site-plugin/README.md)

## Documente aferente

- `ARCHITECTURE.md` — poate conține path-uri vechi; preferă acest README + cod
- `WEBSITE_MANAGEMENT.md` — workflow-uri subdomain / DB
- `BACKEND_SETUP.md` — setup WP / cPanel (opțiunile sunt în WP Admin, nu în `constants.php`)
