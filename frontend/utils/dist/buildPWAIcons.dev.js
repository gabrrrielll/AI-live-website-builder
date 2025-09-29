"use strict";

var fs = require('fs');

var path = require('path'); // Funcție pentru verificarea iconițelor PWA în timpul build-ului


function generatePWAIconsDuringBuild() {
  var publicPath, icon192Path, icon512Path;
  return regeneratorRuntime.async(function generatePWAIconsDuringBuild$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            publicPath = path.join(process.cwd(), 'public'); // Verifică dacă există iconițele

            icon192Path = path.join(publicPath, 'icon-192.png');
            icon512Path = path.join(publicPath, 'icon-512.png');

            if (!fs.existsSync(icon192Path)) {
              console.log('⚠️  Icon-192.png not found. Please add a 192x192 icon.');
            }

            if (!fs.existsSync(icon512Path)) {
              console.log('⚠️  Icon-512.png not found. Please add a 512x512 icon.');
            }

            console.log('✅ PWA icons check completed');
          } catch (error) {
            console.error('❌ Error checking PWA icons during build:', error);
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = {
  generatePWAIconsDuringBuild: generatePWAIconsDuringBuild
};
//# sourceMappingURL=buildPWAIcons.dev.js.map
