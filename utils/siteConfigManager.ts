import fs from 'fs';
import path from 'path';
import type { SiteConfig, Article } from '@/types';
import { getSiteConfig } from './siteConfigLoader';

// Funcție pentru actualizarea automată a configurației site-ului
export async function updateSiteConfig(updatedConfig: SiteConfig): Promise<void> {
    try {
        const configPath = path.join(process.cwd(), 'public', 'site-config.json');
        fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
    } catch (error) {
        console.error('Error updating site configuration:', error);
        throw new Error('Failed to update site configuration');
    }
}

// Funcție pentru adăugarea unui articol nou
export async function addNewArticle(article: Article): Promise<void> {
    try {
        const configPath = path.join(process.cwd(), 'public', 'site-config.json');
        const configData = fs.readFileSync(configPath, 'utf8');
        const siteConfig: SiteConfig = JSON.parse(configData);

        // Adaugă articolul nou
        if (!siteConfig.articles) {
            siteConfig.articles = [];
        }
        siteConfig.articles.push(article);

        // Salvează configurația actualizată
        await updateSiteConfig(siteConfig);
    } catch (error) {
        console.error('Error adding new article:', error);
        throw new Error('Failed to add new article');
    }
}

// Funcție pentru actualizarea unui articol existent
export async function updateArticleById(articleId: string, updatedArticle: Article): Promise<void> {
    try {
        const configPath = path.join(process.cwd(), 'public', 'site-config.json');
        const configData = fs.readFileSync(configPath, 'utf8');
        const siteConfig: SiteConfig = JSON.parse(configData);

        // Găsește și actualizează articolul
        if (!siteConfig.articles) {
            siteConfig.articles = [];
        }
        const articleIndex = siteConfig.articles.findIndex(article => article.id === articleId);
        if (articleIndex !== -1) {
            siteConfig.articles[articleIndex] = updatedArticle;
            await updateSiteConfig(siteConfig);
        } else {
            throw new Error('Article not found');
        }
    } catch (error) {
        console.error('Error updating article:', error);
        throw new Error('Failed to update article');
    }
}

// Funcție pentru ștergerea unui articol
export async function deleteArticle(slug: string): Promise<void> {
    try {
        const configPath = path.join(process.cwd(), 'public', 'site-config.json');
        const configData = fs.readFileSync(configPath, 'utf8');
        const siteConfig: SiteConfig = JSON.parse(configData);

        // Șterge articolul
        if (!siteConfig.articles) {
            siteConfig.articles = [];
        }
        siteConfig.articles = siteConfig.articles.filter(article => article.slug !== slug);

        await updateSiteConfig(siteConfig);
    } catch (error) {
        console.error('Error deleting article:', error);
        throw new Error('Failed to delete article');
    }
}

// Funcție pentru generarea sitemap-ului
export async function generateSitemap(): Promise<void> {
    try {
        const siteConfig = await getSiteConfig();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';

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
    ${(siteConfig.articles || []).map(article => `
    <url>
        <loc>${baseUrl}/blog/${article.slug}</loc>
        <lastmod>${article.updatedAt}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>`).join('')}
</urlset>`;

        const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
        fs.writeFileSync(sitemapPath, sitemap);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        throw new Error('Failed to generate sitemap');
    }
}
