/**
 * Environment Configuration
 * 
 * NOTE: API keys have been moved to backend for security.
 * All AI services (Gemini, Unsplash, EmailJS) now use the backend ai-service.php endpoint.
 * 
 * This file now only contains frontend-specific environment variables.
 */

// Environment variables for Vite (prefixed with VITE_)
// No API keys needed in frontend anymore - all handled by backend

// Base URL for the application (used for SEO and sharing)
export const BASE_SITE_URL: string = import.meta.env.VITE_BASE_SITE_URL || "http://localhost:3000";

// Development mode flag
export const IS_DEVELOPMENT: boolean = import.meta.env.DEV;

// Build mode flag  
export const IS_PRODUCTION: boolean = import.meta.env.PROD;