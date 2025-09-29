import fs from 'fs';
import path from 'path';

// Funcție pentru verificarea iconițelor PWA în timpul build-ului
export async function generatePWAIconsDuringBuild(): Promise<void> {
    try {
        const publicPath = path.join(process.cwd(), 'public');

        // Verifică dacă există iconițele
        const icon192Path = path.join(publicPath, 'icon-192.png');
        const icon512Path = path.join(publicPath, 'icon-512.png');

        if (!fs.existsSync(icon192Path)) {
            // Icon-192.png not found
        }

        if (!fs.existsSync(icon512Path)) {
            // Icon-512.png not found
        }
    } catch (error) {
        console.error('❌ Error checking PWA icons during build:', error);
    }
}
