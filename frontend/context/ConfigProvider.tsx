"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { configService, type ConfigState, type ConfigEvent } from '@/services/ConfigService';
import type { SiteConfig } from '@/types';
import { isSiteEditable } from '@/constants.js';

interface ConfigContextType {
    // State
    siteConfig: SiteConfig | null;
    plansConfig: any | null;
    isLoading: boolean;
    error: string | null;
    lastUpdated: number | null;

    // Actions
    loadConfig: () => Promise<void>;
    refreshConfig: () => Promise<void>;
    updateSiteConfig: (config: SiteConfig) => void;
    retryLoad: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
    children: React.ReactNode;
}

/**
 * Provider centralizat pentru toate configurațiile
 * - Injectează siteConfig și plansConfig prin context
 * - Gestionează state-ul global al configurațiilor
 * - Disponibil în toată aplicația
 */
export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
    const [state, setState] = useState<ConfigState>(configService.getState());
    const initializedRef = useRef(false);

    // IMPORTANT: Setăm listener-ul ÎNAINTE de a încărca configurația
    // Ascultă evenimentele de la configService
    useEffect(() => {
        console.log('🎧 ConfigProvider: Setup event listener (PRIMUL)');
        const removeListener = configService.addEventListener((event: ConfigEvent) => {
            console.log('📡 ConfigProvider: Eveniment primit:', event.type, event);

            // Actualizează state-ul local cu cel din serviciu
            const newState = configService.getState();
            console.log('📡 ConfigProvider: New state:', {
                hasSiteConfig: !!newState.siteConfig,
                hasPlansConfig: !!newState.plansConfig,
                isLoading: newState.isLoading,
                error: newState.error
            });
            setState(newState);
        });

        // După ce listener-ul este setat, încarcă configurația
        if (!initializedRef.current) {
            console.log('🚀 ConfigProvider: Inițializare (după setup listener)...');
            initializedRef.current = true;

            // Apelează loadConfig asincron
            (async () => {
                await loadConfig();
                // După încărcare, forțează o actualizare a state-ului
                console.log('🔄 ConfigProvider: Actualizare state după loadConfig');
                setState(configService.getState());
            })();
        }

        return removeListener;
    }, []); // Empty dependency array - rulează doar o dată la mount

    const loadConfig = useCallback(async () => {
        console.log('🔄 ConfigProvider: Încarcă configurația...');
        await configService.loadConfig();
    }, []);

    const refreshConfig = useCallback(async () => {
        console.log('🔄 ConfigProvider: Refresh configurația...');
        await configService.refreshConfig();
    }, []);

    const updateSiteConfig = useCallback((config: SiteConfig) => {
        console.log('📝 ConfigProvider: Actualizează configurația...');
        configService.updateSiteConfig(config);
    }, []);

    const retryLoad = useCallback(() => {
        console.log('🔄 ConfigProvider: Retry încărcare...');
        loadConfig();
    }, [loadConfig]);

    const value: ConfigContextType = {
        // State
        siteConfig: state.siteConfig,
        plansConfig: state.plansConfig,
        isLoading: state.isLoading,
        error: state.error,
        lastUpdated: state.lastUpdated,

        // Actions
        loadConfig,
        refreshConfig,
        updateSiteConfig,
        retryLoad
    };

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
};

/**
 * Hook pentru a accesa configurațiile din context
 */
export const useConfig = (): ConfigContextType => {
    const context = useContext(ConfigContext);

    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }

    return context;
};

/**
 * Hook specializat pentru siteConfig
 */
export const useSiteConfig = () => {
    const { siteConfig, isLoading, error, loadConfig, retryLoad } = useConfig();

    return {
        siteConfig,
        isLoading,
        error,
        loadConfig,
        retryLoad
    };
};

/**
 * Hook specializat pentru plansConfig
 */
export const usePlansConfig = () => {
    const { plansConfig, isLoading, error, loadConfig } = useConfig();

    return {
        plansConfig,
        isLoading,
        error,
        loadConfig,
        // Convenience getters
        showSaveButton: plansConfig?.show_save_button || false,
        showImportExportConfig: plansConfig?.show_import_export_config || false,
        isSiteEditable: isSiteEditable(), // Uses hostname check (editor.ai-web.site)
        useLocalSiteConfig: plansConfig?.['useLocal_site-config'] === true
    };
};
