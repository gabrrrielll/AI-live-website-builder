/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // ELIMINAT pentru a permite slug-uri complet dinamice
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Include environment variables în build pentru frontend
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    UNSPLASH_API_KEY: process.env.UNSPLASH_API_KEY,
    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
  }
}

module.exports = nextConfig
