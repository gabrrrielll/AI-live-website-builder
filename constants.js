// Configurații globale pentru aplicație
const API_CONFIG = {
    // URL-ul API-ului backend pentru configurația site-ului
    BASE_URL: 'https://bibic.ro/api',

    // Endpoint-uri specifice
    ENDPOINTS: {
        SITE_CONFIG: '/api-site-config.php',
    }
};

// URL complet pentru API-ul de configurație
const SITE_CONFIG_API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SITE_CONFIG}`;

// Alte constante utile
const APP_CONFIG = {
    // URL-ul de bază pentru site (pentru sitemap, robots.txt, etc.)
    BASE_SITE_URL: 'https://yourdomain.com',

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
