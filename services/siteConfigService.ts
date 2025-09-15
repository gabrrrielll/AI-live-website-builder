import { SITE_CONFIG_API_URL } from '@/constants.js';
import type { SiteConfig } from '@/types';

export interface SiteConfigService {
    loadSiteConfig(): Promise<SiteConfig | null>;
    loadSiteConfigSync(): SiteConfig | null; // Pentru build time
}

class SiteConfigServiceImpl implements SiteConfigService {
    private cachedConfig: SiteConfig | null = null;

    async loadSiteConfig(): Promise<SiteConfig | null> {
        try {
            // 1. Verifică dacă site-ul este montat și există date în localStorage
            if (typeof window !== 'undefined') {
                const localConfig = localStorage.getItem('site-config');
                if (localConfig) {
                    const config = JSON.parse(localConfig);
                    this.cachedConfig = config;
                    return config;
                }
            }

            // 2. Prima încărcare sau localStorage gol - doar apel API cu retry
            return await this.loadFromAPIWithRetry();
        } catch (error) {
            console.warn('Eroare la încărcarea site-config:', error);
        }

        return null;
    }

    private async loadFromAPIWithRetry(): Promise<SiteConfig | null> {
        const maxRetries = 5;
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`Încercare ${attempt}/${maxRetries} de încărcare din API...`);

                const response = await fetch(SITE_CONFIG_API_URL, {
                    cache: 'no-store'
                });

                if (response.ok) {
                    const config = await response.json();
                    this.cachedConfig = config;

                    // Salvează automat în localStorage dacă nu există
                    if (typeof window !== 'undefined') {
                        const existingConfig = localStorage.getItem('site-config');
                        if (!existingConfig) {
                            localStorage.setItem('site-config', JSON.stringify(config));
                            console.log(`Site-config salvat automat în localStorage (încercarea ${attempt})`);
                        }
                    }

                    console.log(`Site-config încărcat cu succes din API (încercarea ${attempt})`);
                    return config;
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                console.warn(`Eroare la încercarea ${attempt}/${maxRetries}:`, lastError.message);

                // Nu așteaptă după ultima încercare
                if (attempt < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff, max 5s
                    console.log(`Aștept ${delay}ms înainte de următoarea încercare...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        console.error(`Eșec la încărcarea site-config după ${maxRetries} încercări:`, lastError);
        return null;
    }

    loadSiteConfigSync(): SiteConfig | null {
        // Pentru build time - doar cache-ul existent
        return this.cachedConfig;
    }
}

export const siteConfigService = new SiteConfigServiceImpl();
