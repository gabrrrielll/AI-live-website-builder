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

    // Încarcă plans-config din API pentru a determina sursa site-config
    private async loadPlansConfig(): Promise<any> {
        if (this.plansConfig) {
            return this.plansConfig;
        }

        try {
            // Încarcă din API și extrage plans-config din el
            const siteConfig = await this.loadSiteConfig();
            if (siteConfig && (siteConfig as any)['plans-config']) {
                this.plansConfig = (siteConfig as any)['plans-config'];
                console.log('Plans config încărcat din API:', this.plansConfig);
                return this.plansConfig;
            }
        } catch (error) {
            console.warn('Nu s-a putut încărca plans-config din API:', error);
        }

        return null;
    }

    // Determină URL-ul pentru site-config bazat pe domeniul curent
    private async getSiteConfigUrl(): Promise<string> {
        // În development (localhost), folosește configurația editorului
        if (import.meta.env.MODE === 'development') {
            const editorUrl = import.meta.env.VITE_EDITOR_URL || 'https://editor.ai-web.site';
            const editorDomain = new URL(editorUrl).hostname;
            const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORDPRESS_REST}/${editorDomain}`;
            console.log('Development mode - folosind configurația editorului:', apiUrl);
            return apiUrl;
        }

        // În production, folosește domeniul curent din browser
        const currentDomain = window.location.hostname;
        const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORDPRESS_REST}/${currentDomain}`;
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

            // Verifică cache-ul din localStorage pentru performanță
            if (typeof window !== 'undefined') {
                const localConfig = localStorage.getItem('site-config');
                if (localConfig) {
                    const config = JSON.parse(localConfig);
                    this.cachedConfig = config;
                    console.log('Site-config încărcat din cache (localStorage)');
                    return config;
                }
            }

            // Prima încărcare sau cache gol - încarcă din API
            const configUrl = await this.getSiteConfigUrl();
            console.log('Încărcare din API (fără fallback pe fișiere locale):', configUrl);
            return await this.loadFromUrlWithRetry(configUrl);
        } catch (error) {
            console.error('Eroare la încărcarea site-config din API:', error);
        } finally {
            this.isLoading = false;
        }

        return null;
    }

    private async loadFromUrlWithRetry(configUrl: string): Promise<SiteConfig | null> {
        const maxRetries = 5;
        const baseDelay = 1000; // 1 secundă

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`Încărcare din API (încercarea ${attempt}/${maxRetries}): ${configUrl}`);

                // Timeout de 30 de secunde pentru API
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000);

                const response = await fetch(configUrl, {
                    cache: 'no-store',
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const config = await response.json();
                    this.cachedConfig = config;

                    // Salvează automat în localStorage după încărcarea cu succes din API
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('site-config', JSON.stringify(config));
                        console.log(`Site-config salvat în localStorage după încărcarea din API`);
                    }

                    console.log(`Site-config încărcat cu succes din API (${response.status}) la încercarea ${attempt}`);
                    return config;
                } else if (response.status === 404) {
                    console.error(`Configurația pentru domeniul curent nu există (404) - site-ul nu se poate încărca`);
                    return null;
                } else {
                    console.warn(`HTTP ${response.status} pentru ${configUrl} la încercarea ${attempt}`);

                    // Dacă nu este ultima încercare, continuă
                    if (attempt < maxRetries) {
                        const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
                        console.log(`Aștept ${delay}ms înainte de următoarea încercare...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    } else {
                        console.error(`Toate încercările au eșuat - site-ul nu se poate încărca`);
                        return null;
                    }
                }
            } catch (error) {
                console.warn(`Eroare la încercarea ${attempt}/${maxRetries}:`, error);

                if (attempt < maxRetries) {
                    const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
                    console.log(`Aștept ${delay}ms înainte de următoarea încercare...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    if (error.name === 'AbortError') {
                        console.error(`Timeout la încărcarea din API (30s) după ${maxRetries} încercări`);
                    } else {
                        console.error(`Toate încercările au eșuat - eroare:`, error);
                    }
                    return null;
                }
            }
        }

        return null;
    }

    loadSiteConfigSync(): SiteConfig | null {
        // Pentru build time - doar cache-ul existent
        return this.cachedConfig;
    }
}

export const siteConfigService = new SiteConfigServiceImpl();
