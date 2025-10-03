import { API_CONFIG } from '@/constants.js';
import type { SiteConfig } from '@/types';

export interface PlansConfig {
    isEditable: boolean;
    show_import_export_config: boolean;
    useLocal_site_config: boolean;
    show_save_button: boolean;
    services: Record<string, any>;
    domain_types: Record<string, any>;
    version: string;
    last_updated: string;
}

export interface ConfigState {
    siteConfig: SiteConfig | null;
    plansConfig: PlansConfig | null;
    isLoading: boolean;
    error: string | null;
    lastUpdated: number | null;
}

export type ConfigEventType = 'loading' | 'loaded' | 'error' | 'updated';

export interface ConfigEvent {
    type: ConfigEventType;
    data?: any;
    error?: string;
}

type ConfigEventListener = (event: ConfigEvent) => void;

/**
 * Serviciu central pentru gestionarea tuturor configurațiilor
 * - Un singur punct de adevăr pentru site-config și plans-config
 * - Cache inteligent cu localStorage și API
 * - Event system pentru notificări
 * - Retry logic și error handling
 */
class ConfigService {
    private state: ConfigState = {
        siteConfig: null,
        plansConfig: null,
        isLoading: false,
        error: null,
        lastUpdated: null
    };

    private listeners: ConfigEventListener[] = [];
    private isInitialized: boolean = false; // Flag pentru a preveni încărcări multiple
    // retryCount nu mai este folosit - eliminat
    private readonly maxRetries: number = 5;
    private readonly baseDelay: number = 1000;

    // Event system
    public addEventListener(listener: ConfigEventListener): () => void {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    private emit(event: ConfigEvent): void {
        this.listeners.forEach(listener => listener(event));
    }

    // State management
    public getState(): ConfigState {
        return { ...this.state };
    }

    private updateState(updates: Partial<ConfigState>): void {
        this.state = { ...this.state, ...updates };
    }

    // Cache management
    private getCacheKey(): string {
        return 'site-config-v2';
    }

    private saveToCache(siteConfig: SiteConfig): void {
        if (typeof window === 'undefined') return;

        try {
            const cacheData = {
                siteConfig,
                plansConfig: (siteConfig as any)['plans-config'] || null,
                timestamp: Date.now()
            };
            localStorage.setItem(this.getCacheKey(), JSON.stringify(cacheData));
            console.log('💾 Configurație salvată în cache');
        } catch (error) {
            console.warn('❌ Eroare la salvarea în cache:', error);
        }
    }

    private loadFromCache(): { siteConfig: SiteConfig; plansConfig: PlansConfig | null } | null {
        if (typeof window === 'undefined') return null;

        try {
            console.log('🔍 loadFromCache: Citesc din localStorage...');
            const cached = localStorage.getItem(this.getCacheKey());

            if (!cached) {
                console.log('ℹ️ loadFromCache: Nu există cache');
                return null;
            }

            console.log('📦 loadFromCache: Cache găsit, lungime:', cached.length);
            console.log('📦 loadFromCache: Primele 200 caractere:', cached.substring(0, 200));

            const parsed = JSON.parse(cached) as { siteConfig: SiteConfig; plansConfig: PlansConfig | null; timestamp: number };
            console.log('✅ loadFromCache: JSON parsat cu succes');

            const { siteConfig, plansConfig, timestamp } = parsed;

            console.log('🔍 loadFromCache: siteConfig exists:', !!siteConfig);
            console.log('🔍 loadFromCache: plansConfig exists:', !!plansConfig);
            console.log('🔍 loadFromCache: timestamp:', new Date(timestamp).toISOString());

            // Verifică dacă cache-ul nu este prea vechi (24 ore)
            const maxAge = 24 * 60 * 60 * 1000; // 24 ore
            const age = Date.now() - timestamp;
            console.log('🔍 loadFromCache: Cache age (hours):', (age / (60 * 60 * 1000)).toFixed(2));

            if (age > maxAge) {
                console.log('⏰ Cache expirat, va fi încărcat din API');
                return null;
            }

            console.log('✅ Configurație încărcată din cache (valid)');
            return { siteConfig, plansConfig };
        } catch (error) {
            console.error('❌ Eroare la încărcarea din cache:', error);
            console.error('❌ Tip eroare:', error instanceof Error ? error.message : String(error));
            return null;
        }
    }

    private clearCache(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.getCacheKey());
        console.log('🗑️ Cache șters');
    }

    // URL management
    private getConfigUrl(): string {
        // În development (localhost), folosește configurația editorului
        if (typeof import.meta !== 'undefined' && (import.meta as any).env?.MODE === 'development') {
            const editorUrl = (import.meta as any).env?.VITE_EDITOR_URL || `${API_CONFIG.BASE_URL.replace('ai-web.site', 'editor.ai-web.site')}`;
            const editorDomain = new URL(editorUrl).hostname;
            const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORDPRESS_REST}/${editorDomain}`;
            console.log('🔧 Development mode - URL:', apiUrl);
            return apiUrl;
        }

        // În production, folosește domeniul curent
        const currentDomain = window.location.hostname;
        const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORDPRESS_REST}/${currentDomain}`;
        console.log('🌐 Production mode - URL:', apiUrl);
        return apiUrl;
    }

    // API calls
    private async loadFromAPI(): Promise<SiteConfig | null> {
        const configUrl = this.getConfigUrl();

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                console.log(`🔄 Încercare ${attempt}/${this.maxRetries}: ${configUrl}`);

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
                    const siteConfig = await response.json();
                    console.log('✅ Configurație încărcată din API');

                    // plansConfig este extras din site-config în loadConfig()

                    // Salvează în cache
                    this.saveToCache(siteConfig);

                    return siteConfig;
                } else if (response.status === 404) {
                    console.error('❌ Configurația nu există (404)');
                    this.emit({ type: 'error', error: 'Configurația nu a fost găsită' });
                    return null;
                } else {
                    console.warn(`⚠️ HTTP ${response.status} pentru ${configUrl}`);

                    if (attempt < this.maxRetries) {
                        const delay = this.baseDelay * Math.pow(2, attempt - 1);
                        console.log(`⏳ Aștept ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    } else {
                        console.error('❌ Toate încercările au eșuat');
                        this.emit({ type: 'error', error: 'Nu s-a putut încărca configurația' });
                        return null;
                    }
                }
            } catch (error) {
                console.warn(`❌ Eroare la încercarea ${attempt}/${this.maxRetries}:`, error);

                if (attempt < this.maxRetries) {
                    const delay = this.baseDelay * Math.pow(2, attempt - 1);
                    console.log(`⏳ Aștept ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    if (error instanceof Error && error.name === 'AbortError') {
                        console.error('⏰ Timeout la încărcarea din API');
                        this.emit({ type: 'error', error: 'Timeout la încărcarea configurației' });
                    } else {
                        console.error('💥 Eroare la încărcarea din API:', error);
                        const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută';
                        this.emit({ type: 'error', error: errorMessage });
                    }
                    return null;
                }
            }
        }

        return null;
    }

    // Public methods
    public async loadConfig(): Promise<void> {
        // Dacă deja este inițializat, returnează imediat
        if (this.isInitialized && this.state.siteConfig) {
            console.log('✅ ConfigService: Deja inițializat, folosesc configurația existentă');
            return;
        }

        if (this.state.isLoading) {
            console.log('⏳ Încărcare deja în desfășurare...');
            return;
        }

        console.log('🚀 ConfigService.loadConfig() START');
        this.updateState({ isLoading: true, error: null });
        this.emit({ type: 'loading' });

        try {
            // Încearcă să încarce din cache mai întâi
            console.log('🔍 Verific cache-ul...');
            const cached = this.loadFromCache();

            if (cached) {
                console.log('✅ Cache găsit - verific validitatea...');
                console.log('📦 Cache siteConfig există:', !!cached.siteConfig);
                console.log('📦 Cache plansConfig există:', !!cached.plansConfig);

                // Verifică dacă configurația din cache este validă
                if (!cached.siteConfig || !cached.plansConfig) {
                    console.warn('⚠️ Cache incomplet - încarcă din API');
                    this.clearCache();
                } else {
                    this.updateState({
                        siteConfig: cached.siteConfig,
                        plansConfig: cached.plansConfig,
                        isLoading: false,
                        lastUpdated: Date.now()
                    });
                    this.isInitialized = true; // Marchează ca inițializat
                    this.emit({ type: 'loaded', data: cached });
                    console.log('✅ Configurație încărcată din cache + INITIALIZED');
                    return;
                }
            } else {
                console.log('ℹ️ Nu există cache');
            }

            // Dacă nu există cache sau este invalid, încarcă din API
            console.log('🌐 Încarcă din API...');
            const siteConfig = await this.loadFromAPI();

            if (siteConfig) {
                const plansConfig = (siteConfig as any)['plans-config'] || null;

                this.updateState({
                    siteConfig,
                    plansConfig,
                    isLoading: false,
                    error: null,
                    lastUpdated: Date.now()
                });
                this.isInitialized = true; // Marchează ca inițializat
                this.emit({ type: 'loaded', data: { siteConfig, plansConfig } });
                console.log('✅ Configurație încărcată din API + INITIALIZED');
            } else {
                this.updateState({
                    isLoading: false,
                    error: 'Nu s-a putut încărca configurația'
                });
                this.emit({ type: 'error', error: 'Nu s-a putut încărca configurația' });
            }
        } catch (error) {
            console.error('💥 Eroare la încărcarea configurației:', error);
            const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută';
            this.updateState({
                isLoading: false,
                error: errorMessage
            });
            this.emit({ type: 'error', error: errorMessage });
        } finally {
            // isLoading este actualizat prin updateState în fiecare caz
        }
    }

    public async refreshConfig(): Promise<void> {
        console.log('🔄 Refresh configurație...');
        this.clearCache();
        await this.loadConfig();
    }

    public updateSiteConfig(siteConfig: SiteConfig): void {
        console.log('📝 updateSiteConfig() called');
        console.log('📝 Config type:', typeof siteConfig);
        console.log('📝 Config keys:', siteConfig ? Object.keys(siteConfig).slice(0, 10) : 'null'); // Primele 10 chei

        const plansConfig = (siteConfig as any)['plans-config'] || null;
        console.log('📝 PlansConfig exists:', !!plansConfig);

        this.updateState({
            siteConfig,
            plansConfig,
            lastUpdated: Date.now()
        });

        console.log('💾 Salvez în cache...');
        this.saveToCache(siteConfig);
        console.log('✅ Cache salvat');

        this.emit({ type: 'updated', data: { siteConfig, plansConfig } });
        console.log('✅ Configurație actualizată');
    }

    public getSiteConfig(): SiteConfig | null {
        return this.state.siteConfig;
    }

    public getPlansConfig(): PlansConfig | null {
        return this.state.plansConfig;
    }

    public isLoading(): boolean {
        return this.state.isLoading;
    }

    public getError(): string | null {
        return this.state.error;
    }
}

// Singleton instance
export const configService = new ConfigService();
