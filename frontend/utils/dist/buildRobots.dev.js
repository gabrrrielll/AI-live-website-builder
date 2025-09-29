"use strict";

var fs = require('fs');

var path = require('path');

var _require = require('../constants.js'),
    APP_CONFIG = _require.APP_CONFIG; // Funcție pentru generarea robots.txt în timpul build-ului


function generateRobotsTxtDuringBuild() {
  var baseUrl, robotsTxt, robotsPath;
  return regeneratorRuntime.async(function generateRobotsTxtDuringBuild$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            baseUrl = process.env.NEXT_PUBLIC_BASE_URL || APP_CONFIG.BASE_SITE_URL;
            robotsTxt = "User-agent: *\nAllow: /\n\n# Sitemap\nSitemap: ".concat(baseUrl, "/sitemap.xml\n\n# Crawl-delay\nCrawl-delay: 1\n\n# Disallow admin areas (if any)\nDisallow: /admin/\nDisallow: /api/\n\n# Allow all other content\nAllow: /blog/\nAllow: /images/\nAllow: /assets/");
            robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
            fs.writeFileSync(robotsPath, robotsTxt);
            console.log('✅ Robots.txt generated successfully during build');
          } catch (error) {
            console.error('❌ Error generating robots.txt during build:', error);
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = {
  generateRobotsTxtDuringBuild: generateRobotsTxtDuringBuild
};
//# sourceMappingURL=buildRobots.dev.js.map
