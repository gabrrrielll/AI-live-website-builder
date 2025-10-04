# Plugin Development Workflow

## ⚠️ IMPORTANT - Structura Proiectului

### Folder-e ACTIVE:
- ✅ `ai-web-site-plugin/` - Singurul folder pentru plugin
- ✅ `frontend/` - Aplicația React/TypeScript
- ✅ `scripts/` - Scripts de deployment

### Folder-e ELIMINATE (NU trebuie să existe):
- ❌ `backend/` - **ELIMINAT** - era duplicat al `ai-web-site-plugin/`
- ❌ `wordpress/` - **ELIMINAT** - era structură veche

## 🔄 Workflow Corect pentru Modificări Plugin

### 1. **Editare Fișiere Plugin**
```bash
# Editează DIRECT în ai-web-site-plugin/
code ai-web-site-plugin/includes/class-database.php
code ai-web-site-plugin/admin/admin-page.php
# etc.
```

### 2. **Deploy Plugin**
```bash
npm run deploy:plugin
```

Acest script:
- Face push în repository separat: https://github.com/gabrrrielll/ai-web-site-plugin
- NU mai copiază nimic în `backend/` (folder-ul nu mai există)

### 3. **Deploy pe Server (cPanel)**
```
Git Version Control → Deploy HEAD Commit
Repository: ai-web-site-plugin
```

## 🚫 Ce NU trebuie făcut:

### ❌ NU copia fișiere în `backend/`
```bash
# ❌ GREȘIT - recreează folder-ul backend
Copy-Item "ai-web-site-plugin/file.php" "backend/file.php"

# ✅ CORECT - editează direct în ai-web-site-plugin
code ai-web-site-plugin/includes/file.php
```

### ❌ NU folosi `npm run deploy:backend`
- Acest script nu mai există
- A fost eliminat odată cu folder-ul `backend/`

## 🛡️ Protecție Automată

### .gitignore
Folder-ele `backend/` și `wordpress/` sunt în `.gitignore`:
- Dacă sunt recreate accidental, Git le va ignora
- Nu vor fi commit-ate automat

### Verificare Structură
Pentru a verifica că structura e corectă:
```bash
# Aceste folder-e NU trebuie să existe:
ls backend/     # should return: cannot find path
ls wordpress/   # should return: cannot find path

# Aceste folder-e TREBUIE să existe:
ls ai-web-site-plugin/
ls frontend/
ls scripts/
```

## 📝 Rezumat

**ÎNAINTE (structură veche cu duplicat):**
```
├── backend/              ❌ duplicat
├── wordpress/            ❌ structură veche
├── ai-web-site-plugin/  ✅
└── frontend/            ✅
```

**ACUM (structură curată):**
```
├── ai-web-site-plugin/  ✅ SINGURUL folder pentru plugin
├── frontend/            ✅ aplicația React
└── scripts/             ✅ deployment scripts
```

## 🎯 Regula de Aur

> **Orice modificare la plugin se face DOAR în `ai-web-site-plugin/`**
> **Nu există `backend/` - dacă apare, e o greșeală!**

