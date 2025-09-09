import fs from 'fs';
import path from 'path';
import type { SiteConfig } from '@/types';
import { APP_CONFIG } from '@/constants.js';

// Funcție pentru generarea sitemap-ului în timpul build-ului
export async function generateSitemapDuringBuild(): Promise<void> {
    try {
        const configPath = path.join(process.cwd(), 'public', 'site-config.json');
        const configData = fs.readFileSync(configPath, 'utf8');
        const siteConfig: SiteConfig = JSON.parse(configData);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || APP_CONFIG.BASE_SITE_URL;

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
    ${siteConfig.articles?.map(article => `
    <url>
        <loc>${baseUrl}/blog/${article.slug}</loc>
        <lastmod>${article.updatedAt}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>`).join('') || ''}
</urlset>`;

        const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
        fs.writeFileSync(sitemapPath, sitemap);
    } catch (error) {
        console.error('❌ Error generating sitemap during build:', error);
    }
}
