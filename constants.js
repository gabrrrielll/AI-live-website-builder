// Configurații globale pentru aplicație
const API_CONFIG = {
    // URL-ul API-ului backend pentru configurația site-ului
    BASE_URL: 'https://bibic.ro/api',

    // Endpoint-uri specifice
    ENDPOINTS: {
        SITE_CONFIG: '/api-site-config.php',
    }
};

// Funcție pentru a determina URL-ul pentru site-config
function getSiteConfigUrl() {
    // Verifică dacă există plans-config.json și citește setarea useLocal_site-config
    try {
        // Încarcă plans-config.json din public
        const plansConfigUrl = '/plans-config.json';

        // Nu mai forțez fișierul local în development - să folosesc logica din siteConfigService
        // Pentru production, verifică plans-config.json
        return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SITE_CONFIG}`;
    } catch (error) {
        console.warn('Nu s-a putut citi plans-config.json, folosind API:', error);
        return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SITE_CONFIG}`;
    }
}

// URL complet pentru API-ul de configurație
const SITE_CONFIG_API_URL = getSiteConfigUrl();

// Alte constante utile
const APP_CONFIG = {
    // URL-ul de bază pentru site (pentru sitemap, robots.txt, etc.)
    BASE_SITE_URL: import.meta?.env?.VITE_BASE_SITE_URL || 'https://yourdomain.com',

    // Setări pentru rate limiting
    TEST_MODE: {
        REBUILD_LIMIT: 3,
        IMAGE_GEN_LIMIT: 3,
    }
};

// Export pentru Node.js (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        SITE_CONFIG_API_URL,
        APP_CONFIG
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
}

// Pentru compatibilitate cu import ES6
export { API_CONFIG, SITE_CONFIG_API_URL, APP_CONFIG };
