// Configurații globale pentru aplicație
const API_CONFIG = {
    // URL-ul API-ului backend pentru configurația site-ului
    BASE_URL: 'https://ai-web.site',

    // Endpoint-uri specifice
    ENDPOINTS: {
        WORDPRESS_REST: '/wp-json/ai-web-site/v1/website-config',
        WORDPRESS_NONCE: '/wp-json/wp/v2/users/me', // Pentru obținerea nonce-ului
    }
};

// Funcție pentru a determina URL-ul pentru site-config bazat pe domeniul curent
function getSiteConfigUrl() {
    // Verifică dacă suntem în browser (pentru runtime)
    if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) {
        // În development (localhost), folosește configurația editorului
        if (import.meta.env.MODE === 'development') {
            const editorUrl = import.meta.env.VITE_EDITOR_URL || `${API_CONFIG.BASE_URL.replace('ai-web.site', 'editor.ai-web.site')}`;
            const editorDomain = new URL(editorUrl).hostname;
            return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORDPRESS_REST}/${editorDomain}`;
        }

        // În production, folosește domeniul curent din browser
        const currentDomain = window.location.hostname;
        return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORDPRESS_REST}/${currentDomain}`;
    }

    // Fallback pentru build time - returnează URL generic
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORDPRESS_REST}`;
}

// URL complet pentru API-ul de configurație
const SITE_CONFIG_API_URL = getSiteConfigUrl();

// Alte constante utile
const APP_CONFIG = {
    // URL-ul de bază pentru site (pentru sitemap, robots.txt, etc.)
    BASE_SITE_URL: import.meta?.env?.VITE_BASE_SITE_URL || 'https://ai-web.site',

    // Setări pentru rate limiting
    TEST_MODE: {
        REBUILD_LIMIT: 3,
        IMAGE_GEN_LIMIT: 3,
    },

    // Setare pentru modul de încărcare al configurației site-ului
    SITE_CONFIG_LOADING: {
        useLocal_site_config: false  // Switch pentru încărcarea locală vs API
    }
};

// Funcție pentru a determina modul de funcționare al aplicației
function getAppMode() {
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === 'editor.ai-web.site') {
        return 'EDITOR'; // Modul editare (localhost + editor subdomain)
    } else if (hostname === 'admin.ai-web.site') {
        return 'ADMIN'; // Modul administrare
    } else {
        return 'VIEWER'; // Modul afișare site
    }
}

// Funcție pentru a obține subdomeniul curent
function getCurrentSubdomain() {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    if (parts.length >= 3) {
        return parts[0]; // subdom1, subdom2, etc.
    }

    return null;
}

// Funcție pentru a determina dacă site-ul este editabil
// Site-ul este editabil DOAR pe localhost și editor.ai-web.site
function isSiteEditable() {
    // Verifică dacă suntem în browser
    if (typeof window === 'undefined') {
        return false;
    }

    return getAppMode() === 'EDITOR';
}

// Funcție pentru a determina dacă butoanele Import/Export trebuie afișate
// Acestea sunt disponibile DOAR pe localhost pentru development
function showImportExport() {
    // Verifică dacă suntem în browser
    if (typeof window === 'undefined') {
        return false;
    }

    const hostname = window.location.hostname;
    return hostname === 'localhost';
}

// Funcție pentru a determina dacă trebuie folosit localStorage
// localStorage se folosește DOAR în modul EDITOR (localhost + editor.ai-web.site)
function useLocalStorage() {
    // Verifică dacă suntem în browser
    if (typeof window === 'undefined') {
        return false;
    }

    return getAppMode() === 'EDITOR';
}

// Export pentru Node.js (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        SITE_CONFIG_API_URL,
        APP_CONFIG,
        getAppMode,
        getCurrentSubdomain,
        isSiteEditable,
        showImportExport,
        useLocalStorage
    };
}

// Export pentru ES6 modules (pentru TypeScript/Next.js)
if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    // Pentru browser sau Next.js
    if (typeof exports === 'undefined') {
        // Creează obiectul exports dacă nu există
        globalThis.exports = {};
    }

    globalThis.API_CONFIG = API_CONFIG;
    globalThis.SITE_CONFIG_API_URL = SITE_CONFIG_API_URL;
    globalThis.APP_CONFIG = APP_CONFIG;
    globalThis.getAppMode = getAppMode;
    globalThis.getCurrentSubdomain = getCurrentSubdomain;
    globalThis.isSiteEditable = isSiteEditable;
    globalThis.showImportExport = showImportExport;
    globalThis.useLocalStorage = useLocalStorage;
}

// Pentru compatibilitate cu import ES6
export { API_CONFIG, SITE_CONFIG_API_URL, APP_CONFIG, getAppMode, getCurrentSubdomain, isSiteEditable, showImportExport, useLocalStorage };
