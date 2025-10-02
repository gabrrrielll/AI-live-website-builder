import { SITE_CONFIG_API_URL } from '@/constants.js';
import { toast } from 'sonner';
import type { SiteConfig } from '@/types';

export interface SiteConfigService {
    loadSiteConfig(): Promise<SiteConfig | null>;
    loadSiteConfigSync(): SiteConfig | null; // Pentru build time
}

class SiteConfigServiceImpl implements SiteConfigService {
    private cachedConfig: SiteConfig | null = null;
    private plansConfig: any = null;
    private isLoading: boolean = false;
    private hasTriedLocal: boolean = false;

    // Încarcă plans-config din site-config.json pentru a determina sursa site-config
    private async loadPlansConfig(): Promise<any> {
        if (this.plansConfig) {
            return this.plansConfig;
        }

        try {
            // Încarcă site-config.json și extrage plans-config din el
            const siteConfig = await this.loadSiteConfig();
            if (siteConfig && (siteConfig as any)['plans-config']) {
                this.plansConfig = (siteConfig as any)['plans-config'];
                console.log('Plans config încărcat din site-config.json:', this.plansConfig);
                return this.plansConfig;
            }
        } catch (error) {
            console.warn('Nu s-a putut încărca plans-config din site-config.json:', error);
        }

        return null;
    }

    // Determină URL-ul pentru site-config bazat pe domeniul curent
    private async getSiteConfigUrl(): Promise<string> {
        // În development (localhost), folosește configurația editorului
        if (import.meta.env.MODE === 'development') {
            const editorUrl = import.meta.env.VITE_EDITOR_URL || 'https://editor.ai-web.site';
            const editorDomain = new URL(editorUrl).hostname;
            const apiUrl = `${SITE_CONFIG_API_URL.replace('/website-config', '')}/website-config/${editorDomain}`;
            console.log('Development mode - folosind configurația editorului:', apiUrl);
            return apiUrl;
        }

        // În production, folosește domeniul curent din browser
        const currentDomain = window.location.hostname;
        const apiUrl = `${SITE_CONFIG_API_URL.replace('/website-config', '')}/website-config/${currentDomain}`;
        console.log('Production mode - folosind domeniul curent:', apiUrl);
        return apiUrl;
    }

    async loadSiteConfig(): Promise<SiteConfig | null> {
        // Previne multiple încărcări simultane
        if (this.isLoading) {
            console.log('Încărcare deja în desfășurare, aștept...');
            return this.cachedConfig;
        }

        try {
            this.isLoading = true;

            // 1. Verifică dacă site-ul este montat și există date în localStorage
            if (typeof window !== 'undefined') {
                const localConfig = localStorage.getItem('site-config');
                if (localConfig) {
                    const config = JSON.parse(localConfig);
                    this.cachedConfig = config;
                    console.log('Site-config încărcat din localStorage');
                    return config;
                }
            }

            // 2. Prima încărcare sau localStorage gol - determină sursa și încarcă
            const configUrl = await this.getSiteConfigUrl();
            return await this.loadFromUrlWithRetry(configUrl);
        } catch (error) {
            console.warn('Eroare la încărcarea site-config:', error);
        } finally {
            this.isLoading = false;
            // Reset flag-urile pentru următoarea încărcare
            this.hasTriedLocal = false;
        }

        return null;
    }

    private async loadFromUrlWithRetry(configUrl: string): Promise<SiteConfig | null> {
        try {
            console.log(`Încărcare din API (${configUrl})...`);

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
                        console.log(`Site-config salvat automat în localStorage`);
                    }
                }

                console.log(`Site-config încărcat cu succes din API`);
                return config;
            } else if (response.status === 404) {
                console.error(`Configurația pentru domeniul curent nu există (404) - site-ul nu se poate încărca`);
                return null;
            } else {
                console.warn(`HTTP ${response.status} pentru ${configUrl}`);
                return null;
            }
        } catch (error) {
            console.error(`Eroare la încărcarea din API:`, error);
            return null;
        }
    }

    loadSiteConfigSync(): SiteConfig | null {
        // Pentru build time - doar cache-ul existent
        return this.cachedConfig;
    }
}

export const siteConfigService = new SiteConfigServiceImpl();
