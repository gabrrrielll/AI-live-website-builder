import fs from 'fs';
import path from 'path';
import type { SiteConfig } from '@/types';

export async function getSiteConfig(): Promise<SiteConfig> {
    try {
        // Încearcă să încarce din localStorage dacă există o versiune mai nouă
        const configPath = path.join(process.cwd(), 'public', 'site-config.json');
        const configData = fs.readFileSync(configPath, 'utf8');
        const siteConfig: SiteConfig = JSON.parse(configData);

        return siteConfig;
    } catch (error) {
        console.error('Error loading site config:', error);
        throw new Error('Failed to load site configuration');
    }
}

