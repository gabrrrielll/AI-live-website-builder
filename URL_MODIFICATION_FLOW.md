# SCHEMA LOGICĂ - PROCESUL DE MODIFICARE URL LA ARTICOLE

## 🔄 FLOW-UL COMPLET DE MODIFICARE URL

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER ACTION                                  │
│  User modifică slug-ul în ArticleEditor                        │
│  Input: "Articol despre AI și Machine Learning"                │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                ArticleEditor.tsx                               │
│  handleSlugChange() → slugify(input) → setArticle()           │
│  Input: "Articol despre AI și Machine Learning"               │
│  Output: "articol-despre-ai-si-machine-learning"              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                utils/slugify.ts                                │
│  slugify() transformă textul în slug valid:                   │
│  1. toLowerCase()                                             │
│  2. replace(/\s+/g, '-') // spații cu -                       │
│  3. replace(special chars) // caractere speciale             │
│  4. replace(/[^\w\-]+/g, '') // caractere non-word           │
│  5. replace(/\-\-+/g, '-') // multiple - cu unul singur     │
│  6. trim('-') // elimină - de la început/sfârșit             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                User apasă "Salvează"                            │
│  handleSave() verifică dacă slug-ul s-a schimbat               │
│  if (articleToSave.slug !== initialArticle.slug)               │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              SETEAZĂ STARE REDIRECTING                        │
│  setIsRedirecting(true)                                        │
│  Afișează: "Se actualizează URL-ul..."                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              APELEAZĂ updateArticle()                          │
│  updateArticle(articleToSave.id, articleToSave, onUpdateComplete)│
│  Parametri: ID, articolul cu noul slug, callback              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              hooks/useSiteData.ts - updateArticle()           │
│  setSiteConfig(prevConfig => {                                 │
│    const newConfig = JSON.parse(JSON.stringify(prevConfig));   │
│    const articleIndex = newConfig.articles.findIndex(...);    │
│    if (articleIndex !== -1) {                                 │
│      newConfig.articles[articleIndex] = finalArticle;         │
│      updateHistory(newConfig);                                │
│      if (onComplete) {                                        │
│        onComplete(finalArticle.slug); ← APELEAZĂ CALLBACK     │
│      }                                                        │
│    }                                                          │
│    return newConfig;                                          │
│  });                                                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              SALVARE ÎN LOCALSTORAGE                          │
│  updateHistory() salvează configurația în localStorage        │
│  localStorage.setItem('siteConfig', JSON.stringify(newConfig))│
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              CALLBACK onUpdateComplete SE EXECUTĂ             │
│  setTimeout(() => {                                            │
│    toast.success(t.articleSaved);                             │
│    toast.info(t.urlChangedRedirect);                          │
│    setIsRedirecting(false);                                   │
│    router.push(`/blog/${newSlug}`); ← NAVIGHEAZĂ LA NOUL URL  │
│  }, 200);                                                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              NAVIGARE LA NOUL URL                             │
│  router.push(`/blog/${newSlug}`)                              │
│  URL nou: /blog/articol-despre-ai-si-machine-learning/       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              PROBLEMA: generateStaticParams()                 │
│  Next.js încearcă să găsească slug-ul în generateStaticParams()│
│  Dar slug-ul nou NU există în lista pre-generată!             │
│  REZULTAT: Error: Page missing param in generateStaticParams()│
└─────────────────────────────────────────────────────────────────┘
```

## 🚨 PROBLEMA FUNDAMENTALĂ

### **Conflictul între Static Export și Dynamic Content:**

1. **Next.js cu `output: 'export'`** necesită ca TOATE slug-urile să fie cunoscute la build time
2. **Aplicația permite modificarea dinamică** a slug-urilor în runtime
3. **generateStaticParams()** trebuie să prezică TOATE slug-urile posibile
4. **Imposibil de prezis** slug-urile generate dinamic de utilizatori

### **Exemple de slug-uri imposibil de prezis:**
- `articol-despre-inteligenta-artificiala-si-machine-learning`
- `ghid-complet-pentru-dezvoltarea-aplicatiilor-web-moderne`
- `10-sfaturi-pentru-optimizarea-seo-si-ranking-google`
- `cum-sa-creezi-un-site-web-profesional-in-2024`

## 💡 SOLUȚII POSIBILE

### **1. ELIMINAREA `output: 'export'`**
```javascript
// next.config.js
module.exports = {
  // output: 'export', // ELIMINAT
  trailingSlash: true,
  images: { unoptimized: true }
}
```
**Avantaje:** Funcționează cu slug-uri dinamice
**Dezavantaje:** Nu mai este static, necesită server Node.js

### **2. HYBRID APPROACH - Client-side Routing**
```typescript
// Pentru slug-uri necunoscute, folosește client-side routing
if (!isKnownSlug) {
  return <ArticlePageClient article={null} siteConfig={null} slug={slug} />;
}
```
**Avantaje:** Păstrează static export pentru slug-uri cunoscute
**Dezavantaje:** SEO mai slab pentru slug-uri dinamice

### **3. PRE-GENERARE LA RUNTIME**
```typescript
// Generează slug-uri la runtime și le salvează în cache
const generateSlugsAtRuntime = async () => {
  const config = await loadSiteConfig();
  const slugs = config.articles.map(a => a.slug);
  // Salvează în cache pentru următoarea build
};
```
**Avantaje:** Slug-uri actualizate
**Dezavantaje:** Complexitate mare, cache management

### **4. SERVER-SIDE RENDERING (SSR)**
```typescript
// Folosește SSR în loc de static export
export async function getServerSideProps({ params }) {
  const article = await loadArticle(params.slug);
  return { props: { article } };
}
```
**Avantaje:** Slug-uri complet dinamice
**Dezavantaje:** Nu mai este static, necesită server

## 🎯 RECOMANDAREA FINALĂ

**Pentru o aplicație cu slug-uri complet dinamice, cea mai bună soluție este:**

1. **Eliminarea `output: 'export'`** din `next.config.js`
2. **Folosirea SSR** pentru articolele dinamice
3. **Păstrarea static export** doar pentru paginile statice (home, about, etc.)

**Aceasta va permite:**
- ✅ Slug-uri complet dinamice și nelimitate
- ✅ SEO complet pentru toate articolele
- ✅ Flexibilitate maximă în modificarea URL-urilor
- ✅ Eliminarea completă a problemelor cu `generateStaticParams()`
