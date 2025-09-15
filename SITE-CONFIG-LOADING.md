# Site Config Loading Configuration

## Overview

Aplicația poate fi configurată să folosească fie `site-config.json` local (din folderul `public/`), fie să facă apel API pentru încărcarea configurației site-ului.

## Configuration

### plans-config.json

Adaugă următoarea variabilă în `plans-config.json`:

```json
{
    "useLocal_site-config": true
}
```

### Opțiuni disponibile:

- **`"useLocal_site-config": true`** - Aplicația va folosi `public/site-config.json` local
- **`"useLocal_site-config": false`** - Aplicația va face apel API la `https://bibic.ro/api/api-site-config.php`

## Comportament

### Prima încărcare (când localStorage este gol):

1. **useLocal_site-config = true**: 
   - Încarcă `public/site-config.json`
   - Salvează în localStorage pentru următoarele încărcări

2. **useLocal_site-config = false**:
   - Face apel API la server
   - Salvează în localStorage pentru următoarele încărcări

### Încărcări ulterioare:

- **Întotdeauna** se folosește `localStorage.getItem('site-config')`
- Nu se mai face apel API sau nu se mai citește fișierul local
- Configurația din localStorage are prioritate absolută

## Logging

Aplicația va afișa în console:
- Sursa folosită pentru încărcare (local file sau API)
- Statusul încărcării
- Erorile dacă există

## Fallback Behavior

Dacă `plans-config.json` nu poate fi încărcat:
- **Development**: folosește `public/site-config.json`
- **Production**: folosește API

## Testing

Pentru a testa funcționalitatea:

1. Șterge localStorage: `localStorage.removeItem('site-config')`
2. Refresh pagina
3. Verifică console pentru mesaje de logging
4. Verifică că site-ul se încarcă corect

## Files Modified

- `plans-config.json` - Adăugat `useLocal_site-config`
- `services/siteConfigService.ts` - Logica de încărcare
- `constants.js` - Configurația URL-urilor
