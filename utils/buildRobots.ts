import fs from 'fs';
import path from 'path';
import { APP_CONFIG } from '@/constants.js';

// Funcție pentru generarea robots.txt în timpul build-ului
export async function generateRobotsTxtDuringBuild(): Promise<void> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || APP_CONFIG.BASE_SITE_URL;

        const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin areas (if any)
Disallow: /admin/
Disallow: /api/

# Allow all other content
Allow: /blog/
Allow: /images/
Allow: /assets/`;

        const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
        fs.writeFileSync(robotsPath, robotsTxt);
    } catch (error) {
        console.error('❌ Error generating robots.txt during build:', error);
    }
}
