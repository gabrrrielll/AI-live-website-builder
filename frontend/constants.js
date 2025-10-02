// Configurații globale pentru aplicație
const API_CONFIG = {
    // URL-ul API-ului backend pentru configurația site-ului
    BASE_URL: 'https://ai-web.site',

    // Endpoint-uri specifice
    ENDPOINTS: {
        SITE_CONFIG: '/api-site-config.php',
        WORDPRESS_REST: '/wp-json/ai-web-site/v1/website-config',
    }
};

// Funcție pentru a determina URL-ul pentru site-config bazat pe domeniul curent
function getSiteConfigUrl() {
    // Verifică dacă suntem în browser (pentru runtime)
    if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) {
        // În development (localhost), folosește configurația editorului
        if (import.meta.env.MODE === 'development') {
            const editorUrl = import.meta.env.VITE_EDITOR_URL || 'https://editor.ai-web.site';
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
    }
};

// Funcție pentru a determina modul de funcționare al aplicației
function getAppMode() {
    const hostname = window.location.hostname;

    if (hostname === 'editor.ai-web.site') {
        return 'EDITOR'; // Modul editare
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

// Export pentru Node.js (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        SITE_CONFIG_API_URL,
        APP_CONFIG,
        getAppMode,
        getCurrentSubdomain
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
}

// Pentru compatibilitate cu import ES6
export { API_CONFIG, SITE_CONFIG_API_URL, APP_CONFIG, getAppMode, getCurrentSubdomain };
