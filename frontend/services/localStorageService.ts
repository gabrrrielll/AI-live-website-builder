import type { SiteConfig } from '@/types';

/**
 * Serviciu pentru gestionarea localStorage cu restricții de domeniu
 * Funcționează DOAR pe:
 * - https://editor.ai-web.site/
 * - localhost (dezvoltare)
 */
class LocalStorageService {
    private readonly STORAGE_KEY = 'site-config';

    /**
     * Verifică dacă localStorage poate fi folosit pe domeniul curent
     */
    private canUseLocalStorage(): boolean {
        if (typeof window === 'undefined') {
            return false;
        }

        const hostname = window.location.hostname.toLowerCase();
        const protocol = window.location.protocol;

        // Permite doar pe localhost (dezvoltare)
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            console.log('🔧 LocalStorageService: localhost detectat - localStorage activat');
            return true;
        }

        // Permite doar pe editor.ai-web.site cu HTTPS
        if (hostname === 'editor.ai-web.site' && protocol === 'https:') {
            console.log('🔧 LocalStorageService: editor.ai-web.site detectat - localStorage activat');
            return true;
        }

        console.log('🔧 LocalStorageService: localStorage dezactivat pentru domeniul:', hostname);
        return false;
    }

    /**
     * Salvează configurația site-ului în localStorage
     */
    public saveSiteConfig(config: SiteConfig): boolean {
        if (!this.canUseLocalStorage()) {
            console.log('💾 LocalStorageService: Salvarea dezactivată - domeniu nepermis');
            return false;
        }

        try {
            const configJson = JSON.stringify(config);
            localStorage.setItem(this.STORAGE_KEY, configJson);
            console.log('💾 LocalStorageService: Configurația salvată în localStorage');
            return true;
        } catch (error) {
            console.error('❌ LocalStorageService: Eroare la salvarea în localStorage:', error);
            return false;
        }
    }

    /**
     * Încarcă configurația site-ului din localStorage
     */
    public loadSiteConfig(): SiteConfig | null {
        if (!this.canUseLocalStorage()) {
            console.log('📁 LocalStorageService: Încărcarea dezactivată - domeniu nepermis');
            return null;
        }

        try {
            const configJson = localStorage.getItem(this.STORAGE_KEY);

            if (!configJson) {
                console.log('📁 LocalStorageService: Nu există configurație în localStorage');
                return null;
            }

            const config = JSON.parse(configJson) as SiteConfig;
            console.log('📁 LocalStorageService: Configurația încărcată din localStorage');
            console.log('🔍 LocalStorageService: Plans-config prezent:', config['plans-config'] ? 'DA' : 'NU');

            return config;
        } catch (error) {
            console.error('❌ LocalStorageService: Eroare la încărcarea din localStorage:', error);
            return null;
        }
    }

    /**
     * Șterge configurația din localStorage
     */
    public clearSiteConfig(): boolean {
        if (!this.canUseLocalStorage()) {
            console.log('🗑️ LocalStorageService: Ștergerea dezactivată - domeniu nepermis');
            return false;
        }

        try {
            localStorage.removeItem(this.STORAGE_KEY);
            console.log('🗑️ LocalStorageService: Configurația ștearsă din localStorage');
            return true;
        } catch (error) {
            console.error('❌ LocalStorageService: Eroare la ștergerea din localStorage:', error);
            return false;
        }
    }

    /**
     * Verifică dacă există configurație în localStorage
     */
    public hasSiteConfig(): boolean {
        if (!this.canUseLocalStorage()) {
            return false;
        }

        return localStorage.getItem(this.STORAGE_KEY) !== null;
    }

    /**
     * Returnează informații despre domeniul curent și disponibilitatea localStorage
     */
    public getDomainInfo(): {
        hostname: string;
        protocol: string;
        canUseLocalStorage: boolean;
        reason: string;
    } {
        if (typeof window === 'undefined') {
            return {
                hostname: 'unknown',
                protocol: 'unknown',
                canUseLocalStorage: false,
                reason: 'Server-side rendering'
            };
        }

        const hostname = window.location.hostname.toLowerCase();
        const protocol = window.location.protocol;
        const canUse = this.canUseLocalStorage();

        let reason = '';
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            reason = 'localhost (dezvoltare)';
        } else if (hostname === 'editor.ai-web.site' && protocol === 'https:') {
            reason = 'editor.ai-web.site (HTTPS)';
        } else {
            reason = `domeniu nepermis: ${hostname}`;
        }

        return {
            hostname,
            protocol,
            canUseLocalStorage: canUse,
            reason
        };
    }
}

// Singleton instance
export const localStorageService = new LocalStorageService();
