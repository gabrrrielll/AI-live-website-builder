// IMPORTANT: Do not commit this file to version control.
// This is for local development only. In a real application,
// these keys should be handled by a secure backend proxy.

// Environment variables for Vite (prefixed with VITE_)
export const GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY || "";

// Replace "YOUR_UNSPLASH_API_KEY" with your actual Unsplash API key
export const UNSPLASH_API_KEY: string = import.meta.env.VITE_UNSPLASH_API_KEY || "ZtqOQdjZm8ApH5Wzf2KqlTXIzeLLBaAeBMio8a1qsu0";

// EmailJS Configuration
// Replace with your actual IDs from your EmailJS account dashboard.
// These are required for the contact form to send emails.
export const EMAILJS_SERVICE_ID: string = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_nlwyykk";
export const EMAILJS_TEMPLATE_ID: string = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_iq1mr59";
export const EMAILJS_PUBLIC_KEY: string = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "xDSsP7Y4B8yBvlSn5";
