"use client";

import { useEffect, useState } from 'react';
import type { SiteConfig } from '@/types';
import { SITE_CONFIG_API_URL } from '@/constants.js';

// Hook pentru încărcarea configurației site-ului
export function useSiteConfig() {
    const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSiteConfig = async () => {
            try {
                setIsLoading(true);

                // 1. Încearcă să încarce din localStorage (mod editare)
                const localConfig = localStorage.getItem('site-config');
                if (localConfig) {
                    const parsed = JSON.parse(localConfig);
                    setSiteConfig(parsed);
                    setIsLoading(false);
                    return;
                }

                // 2. Încearcă să încarce din API (mod vizualizare)
                const currentDomain = window.location.hostname;
                const response = await fetch(`${SITE_CONFIG_API_URL}/${currentDomain}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': window.location.origin
                    }
                });

                if (response.ok) {
                    const config = await response.json();
                    setSiteConfig(config);
                } else {
                    // 3. Fallback la configurația default
                    const defaultResponse = await fetch('/site-config.json');
                    const defaultConfig = await defaultResponse.json();
                    setSiteConfig(defaultConfig);
                }
            } catch (err) {
                console.error('Error loading site config:', err);
                setError('Failed to load site configuration');

                // Fallback la configurația default
                try {
                    const defaultResponse = await fetch('/site-config.json');
                    const defaultConfig = await defaultResponse.json();
                    setSiteConfig(defaultConfig);
                } catch (fallbackErr) {
                    setError('Failed to load any site configuration');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadSiteConfig();
    }, []);

    return { siteConfig, isLoading, error };
}

// Hook pentru salvarea configurației
export function useSiteConfigSaver() {
    const saveToLocalStorage = (config: SiteConfig) => {
        try {
            localStorage.setItem('site-config', JSON.stringify(config));
            return { success: true };
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return { success: false, error: 'Failed to save to localStorage' };
        }
    };

    const saveToServer = async (config: SiteConfig, domain: string) => {
        try {
            const response = await fetch(SITE_CONFIG_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
                },
                body: JSON.stringify({
                    domain,
                    config,
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.message };
            }
        } catch (error) {
            console.error('Error saving to server:', error);
            return { success: false, error: 'Failed to save to server' };
        }
    };

    return { saveToLocalStorage, saveToServer };
}

