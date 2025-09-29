import type { SiteConfig } from '@/types';
import { siteConfigService } from '@/services/siteConfigService';

export async function getSiteConfig(): Promise<SiteConfig> {
    try {
        const siteConfig = await siteConfigService.loadSiteConfig();
        if (!siteConfig) {
            throw new Error('Site config not found');
        }
        return siteConfig;
    } catch (error) {
        console.error('Error loading site config:', error);
        throw new Error('Failed to load site configuration');
    }
}

