<?php

/**
 * API Keys Configuration Example
 *
 * Copy this file to constants.php and fill in your actual API keys.
 * NEVER commit constants.php to version control!
 */

// AI Services
define('GEMINI_API_KEY', 'your_gemini_api_key_here');
define('UNSPLASH_API_KEY', 'your_unsplash_api_key_here');

// EmailJS Configuration
define('EMAILJS_SERVICE_ID', 'your_emailjs_service_id');
define('EMAILJS_TEMPLATE_ID', 'your_emailjs_template_id');
define('EMAILJS_PUBLIC_KEY', 'your_emailjs_public_key');

// Server Configuration
define('API_VERSION', '1.0');
define('MAX_RETRIES', 3);
define('TIMEOUT_SECONDS', 30);

// CORS Headers
define('ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://ai-web.site'
]);

// Rate Limiting (requests per minute)
define('RATE_LIMIT_REQUESTS', 60);
define('RATE_LIMIT_WINDOW', 60); // seconds

