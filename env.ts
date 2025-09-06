// IMPORTANT: Do not commit this file to version control.
// This is for local development only. In a real application,
// these keys should be handled by a secure backend proxy.

// Gemini API key from environment variables or default
export const GEMINI_API_KEY: string = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

// Replace "YOUR_UNSPLASH_API_KEY" with your actual Unsplash API key
export const UNSPLASH_API_KEY: string = process.env.UNSPLASH_API_KEY || process.env.NEXT_PUBLIC_UNSPLASH_API_KEY || "ZtqOQdjZm8ApH5Wzf2KqlTXIzeLLBaAeBMio8a1qsu0";

// EmailJS Configuration
// Replace with your actual IDs from your EmailJS account dashboard.
// These are required for the contact form to send emails.
export const EMAILJS_SERVICE_ID: string = process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_nlwyykk";
export const EMAILJS_TEMPLATE_ID: string = process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_iq1mr59";
export const EMAILJS_PUBLIC_KEY: string = process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "xDSsP7Y4B8yBvlSn5";
