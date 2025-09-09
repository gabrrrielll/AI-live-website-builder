# FLOW-UL DE REDENUMIRE URL LA ARTICOLE

## 🔄 PROCESUL COMPLET DE REDENUMIRE URL

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER ACTION                                  │
│  User modifică slug-ul în ArticleEditor                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                ArticleEditor.tsx                               │
│  handleSlugChange() → setArticle(prev => ({...prev, slug}))   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                User apasă "Salvează"                            │
│  handleSave() este apelat                                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              VERIFICARE SLUG SCHIMBAT                           │
│  if (articleToSave.slug !== initialArticle.slug)               │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              SETEAZĂ STARE REDIRECTING                        │
│  setIsRedirecting(true)                                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              CREEAZĂ CALLBACK onUpdateComplete                 │
│  const onUpdateComplete = (newSlug: string) => {              │
│    setTimeout(() => {                                          │
│      toast.success(t.articleSaved);                           │
│      toast.info(t.urlChangedRedirect);                        │
│      setIsRedirecting(false);                                 │
│      router.push(`/blog/${newSlug}`);                         │
│    }, 100);                                                    │
│  }                                                             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              APELEAZĂ updateArticle()                          │
│  updateArticle(articleToSave.id, articleToSave, onUpdateComplete)│
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              useSiteData.ts - updateArticle()                  │
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
│              CALLBACK onUpdateComplete SE EXECUTĂ             │
│  setTimeout(() => {                                            │
│    toast.success(t.articleSaved);                             │
│    toast.info(t.urlChangedRedirect);                          │
│    setIsRedirecting(false);                                   │
│    router.push(`/blog/${newSlug}`); ← NAVIGHEAZĂ LA NOUL URL  │
│  }, 100);                                                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              FALLBACK TIMEOUT (5 secunde)                     │
│  setTimeout(() => {                                            │
│    if (isRedirecting) {                                        │
│      setIsRedirecting(false);                                 │
│      toast.error('Eroare la actualizarea URL-ului...');       │
│    }                                                          │
│  }, 5000);                                                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              REZULTAT FINAL                                   │
│  ✅ Success: User este redirecționat la noul URL              │
│  ❌ Error: Mesaj de eroare după 5 secunde                     │
└─────────────────────────────────────────────────────────────────┘
```

## 🚨 PROBLEMELE IDENTIFICATE

### 1. **TIMEOUT DE 5 SECUNDE**
- **Locație**: `ArticleEditor.tsx` linia 119-124
- **Problema**: Dacă callback-ul nu se execută în 5 secunde, se afișează eroarea
- **Cauza**: Posibilă problemă cu state management sau React batching

### 2. **DEPENDENȚA DE STATE MANAGEMENT**
- **Locație**: `useSiteData.ts` linia 296-314
- **Problema**: `updateArticle` depinde de `setSiteConfig` care poate fi lent
- **Cauza**: Deep cloning cu `JSON.parse(JSON.stringify(prevConfig))`

### 3. **RACE CONDITION**
- **Problema**: `isRedirecting` state poate să nu se actualizeze corect
- **Cauza**: Multiple `setTimeout`-uri care se execută simultan

### 4. **NAVIGATION TIMING**
- **Problema**: `router.push()` se execută înainte ca state-ul să fie propagat
- **Cauza**: `setTimeout` de 100ms poate fi insuficient

## 🔧 SOLUȚII RECOMANDATE

### 1. **Îmbunătățirea Callback-ului**
```typescript
const onUpdateComplete = (newSlug: string) => {
    // Verifică dacă state-ul s-a actualizat
    const checkStateUpdated = () => {
        if (siteConfig?.articles?.find(a => a.slug === newSlug)) {
            toast.success(t.articleSaved);
            toast.info(t.urlChangedRedirect);
            setIsRedirecting(false);
            router.push(`/blog/${newSlug}`);
        } else {
            // Retry după 200ms
            setTimeout(checkStateUpdated, 200);
        }
    };
    checkStateUpdated();
};
```

### 2. **Eliminarea Fallback Timeout**
- Înlocuiește timeout-ul fix cu o verificare inteligentă
- Folosește `useEffect` pentru a monitoriza schimbările de state

### 3. **Optimizarea State Management**
- Folosește `useCallback` pentru `updateArticle`
- Implementează `useMemo` pentru configurația clonată

### 4. **Debugging Îmbunătățit**
- Adaugă logging pentru a urmări flow-ul
- Implementează error boundaries pentru a captura erorile
