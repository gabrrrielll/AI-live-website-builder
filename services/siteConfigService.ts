import { SITE_CONFIG_API_URL } from '@/constants.js';
import type { SiteConfig } from '@/types';

export interface SiteConfigService {
    loadSiteConfig(): Promise<SiteConfig | null>;
    loadSiteConfigSync(): SiteConfig | null; // Pentru build time
}

class SiteConfigServiceImpl implements SiteConfigService {
    private cachedConfig: SiteConfig | null = null;
    private plansConfig: any = null;

    // Încarcă plans-config.json pentru a determina sursa site-config
    private async loadPlansConfig(): Promise<any> {
        if (this.plansConfig) {
            return this.plansConfig;
        }

        try {
            const response = await fetch('/plans-config.json', {
                cache: 'no-store'
            });
            
            if (response.ok) {
                this.plansConfig = await response.json();
                console.log('Plans config încărcat:', this.plansConfig);
                return this.plansConfig;
            }
        } catch (error) {
            console.warn('Nu s-a putut încărca plans-config.json:', error);
        }

        return null;
    }

    // Determină URL-ul pentru site-config bazat pe plans-config
    private async getSiteConfigUrl(): Promise<string> {
        const plansConfig = await this.loadPlansConfig();
        
        // Verifică setarea useLocal_site-config
        if (plansConfig && plansConfig['useLocal_site-config'] === true) {
            console.log('Folosind site-config.json local (useLocal_site-config = true)');
            return '/site-config.json';
        } else if (plansConfig && plansConfig['useLocal_site-config'] === false) {
            console.log('Folosind API pentru site-config (useLocal_site-config = false)');
            return SITE_CONFIG_API_URL;
        } else {
            // Fallback la comportamentul default
            console.log('Folosind comportamentul default pentru site-config');
            return import.meta.env.MODE === 'development' 
                ? '/site-config.json' 
                : SITE_CONFIG_API_URL;
        }
    }

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

            // 2. Prima încărcare sau localStorage gol - determină sursa și încarcă
            const configUrl = await this.getSiteConfigUrl();
            return await this.loadFromUrlWithRetry(configUrl);
        } catch (error) {
            console.warn('Eroare la încărcarea site-config:', error);
        }

        return null;
    }

    private async loadFromUrlWithRetry(configUrl: string): Promise<SiteConfig | null> {
        const maxRetries = 5;
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const source = configUrl === '/site-config.json' ? 'local file' : 'API';
                console.log(`Încercare ${attempt}/${maxRetries} de încărcare din ${source} (${configUrl})...`);

                const response = await fetch(configUrl, {
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

                    console.log(`Site-config încărcat cu succes din ${source} (încercarea ${attempt})`);
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

        console.error(`Eșec la încărcarea site-config din ${configUrl} după ${maxRetries} încercări:`, lastError);
        return null;
    }

    loadSiteConfigSync(): SiteConfig | null {
        // Pentru build time - doar cache-ul existent
        return this.cachedConfig;
    }
}

export const siteConfigService = new SiteConfigServiceImpl();
