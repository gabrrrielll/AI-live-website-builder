"use strict";

var fs = require('fs');

var path = require('path');

var _require = require('../constants.js'),
    APP_CONFIG = _require.APP_CONFIG; // Funcție pentru generarea sitemap-ului în timpul build-ului


function generateSitemapDuringBuild() {
  var configPath, configData, siteConfig, baseUrl, sitemap, sitemapPath;
  return regeneratorRuntime.async(function generateSitemapDuringBuild$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            configPath = path.join(process.cwd(), 'public', 'site-config.json');
            configData = fs.readFileSync(configPath, 'utf8');
            siteConfig = JSON.parse(configData);
            baseUrl = process.env.NEXT_PUBLIC_BASE_URL || APP_CONFIG.BASE_SITE_URL;
            sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n    <url>\n        <loc>".concat(baseUrl, "</loc>\n        <lastmod>").concat(new Date().toISOString(), "</lastmod>\n        <changefreq>daily</changefreq>\n        <priority>1.0</priority>\n    </url>\n    <url>\n        <loc>").concat(baseUrl, "/blog</loc>\n        <lastmod>").concat(new Date().toISOString(), "</lastmod>\n        <changefreq>daily</changefreq>\n        <priority>0.8</priority>\n    </url>\n    ").concat(siteConfig.articles.map(function (article) {
              return "\n    <url>\n        <loc>".concat(baseUrl, "/blog/").concat(article.slug, "</loc>\n        <lastmod>").concat(article.updatedAt, "</lastmod>\n        <changefreq>weekly</changefreq>\n        <priority>0.6</priority>\n    </url>");
            }).join(''), "\n</urlset>");
            sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
            fs.writeFileSync(sitemapPath, sitemap);
            console.log('✅ Sitemap generated successfully during build');
          } catch (error) {
            console.error('❌ Error generating sitemap during build:', error);
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = {
  generateSitemapDuringBuild: generateSitemapDuringBuild
};
//# sourceMappingURL=buildSitemap.dev.js.map
