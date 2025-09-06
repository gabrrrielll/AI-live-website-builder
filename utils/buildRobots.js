const fs = require('fs');
const path = require('path');
const { APP_CONFIG } = require('../constants.js');

// Funcție pentru generarea robots.txt în timpul build-ului
async function generateRobotsTxtDuringBuild() {
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
        console.log('✅ Robots.txt generated successfully during build');
    } catch (error) {
        console.error('❌ Error generating robots.txt during build:', error);
    }
}

module.exports = { generateRobotsTxtDuringBuild };
