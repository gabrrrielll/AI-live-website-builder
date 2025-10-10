"use client";

import { useEffect, useState, useCallback } from 'react';
import type { SiteConfig } from '@/types';
import { configService } from '@/services/ConfigService';
import { SITE_CONFIG_API_URL } from '@/constants.js';
import { localStorageService } from '@/services/localStorageService';

// Hook pentru încărcarea configurației site-ului
export function useSiteConfig() {
    const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        console.log('🔄 useSiteConfig useEffect apelat, retryCount:', retryCount);

        const loadSiteConfig = async () => {
            try {
                console.log('🔄 useSiteConfig: Începe încărcarea...');
                setIsLoading(true);
                setError(null);

                // Folosește serviciul pentru încărcarea configurației
                await configService.loadConfig();
                const config = configService.getState().siteConfig;
                console.log('🔄 useSiteConfig: Rezultat din configService:', config ? 'SUCCESS' : 'NULL');

                if (config) {
                    setSiteConfig(config);
                    console.log('✅ Configurația încărcată cu succes prin serviciu');
                } else {
                    console.log('❌ Configurația este null, setează eroarea');
                    setError('Failed to load site configuration');
                }
            } catch (err) {
                console.error('💥 Error loading site config:', err);
                setError('Failed to load site configuration');
            } finally {
                setIsLoading(false);
                console.log('🏁 useSiteConfig: isLoading setat pe false');
            }
        };

        loadSiteConfig();
    }, [retryCount]);

    const retryLoad = () => {
        setRetryCount(prev => prev + 1);
        setError(null);
    };

    return { siteConfig, isLoading, error, retryLoad };
}

// Hook pentru salvarea configurației site-ului
export function useSiteConfigSaver() {
    const saveToLocalStorage = useCallback((config: SiteConfig): boolean => {
        // Folosește noul serviciu localStorage cu restricții de domeniu
        return localStorageService.saveSiteConfig(config);
    }, []);

    const saveToServer = useCallback(async (config: SiteConfig, domain: string): Promise<boolean> => {
        try {
            const response = await fetch(`${SITE_CONFIG_API_URL}/${domain}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            });

            if (response.ok) {
                console.log('Configurația salvată pe server');
                return true;
            } else {
                console.error('Failed to save to server:', response.status, response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error saving to server:', error);
            return false;
        }
    }, []);

    return { saveToLocalStorage, saveToServer };
}