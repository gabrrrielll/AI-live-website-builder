import type { SiteConfig } from '@/types';
import { configService } from '@/services/ConfigService';

export async function getSiteConfig(): Promise<SiteConfig> {
    try {
        await configService.loadConfig();
        const siteConfig = configService.getState().siteConfig;
        if (!siteConfig) {
            throw new Error('Site config not found');
        }
        return siteConfig;
    } catch (error) {
        console.error('Error loading site config:', error);
        throw new Error('Failed to load site configuration');
    }
}

