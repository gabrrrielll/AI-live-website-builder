import fs from 'fs';
import path from 'path';
import { APP_CONFIG } from '@/constants.js';

// Funcție pentru generarea sitemap-ului în timpul build-ului
export async function generateSitemapDuringBuild(): Promise<void> {
    try {
        const baseUrl = process.env.VITE_BASE_SITE_URL || APP_CONFIG.BASE_SITE_URL;

        // Simplified sitemap - will be populated dynamically by the app
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/blog</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy-policy</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/terms-and-conditions</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/cookie-policy</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
</urlset>`;

        const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
        fs.writeFileSync(sitemapPath, sitemap);
        console.log('✅ Sitemap generated successfully');
    } catch (error) {
        console.error('❌ Error generating sitemap during build:', error);
    }
}
