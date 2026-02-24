/**
 * Environment Configuration
 * 
 * NOTE: API keys have been moved to backend for security.
 * All AI services (Gemini, Unsplash, EmailJS) now use the backend ai-service.php endpoint.
 * 
 * This file now only contains frontend-specific environment variables.
 */

// Environment variables for Vite (prefixed with VITE_)
// No provider API keys needed in frontend anymore - all handled by backend

// Base URL for the application (used for SEO and sharing)
export const BASE_SITE_URL: string = import.meta.env.VITE_BASE_SITE_URL || "http://localhost:3000";

// Editor URL used in development fallbacks
export const EDITOR_URL: string =
  import.meta.env.VITE_EDITOR_URL || "https://editor.ai-web.site";

// Local development key used by backend local auth bypass.
// Keep empty in production builds.
export const LOCAL_API_KEY: string = import.meta.env.VITE_LOCAL_API_KEY || "";

// AI key for local development only (exposed in frontend bundle by Vite).
// Do NOT use this in production. Production must use backend-stored secrets.
export const GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY || "";

// Development mode flag
export const IS_DEVELOPMENT: boolean = import.meta.env.DEV;

// Build mode flag  
export const IS_PRODUCTION: boolean = import.meta.env.PROD;