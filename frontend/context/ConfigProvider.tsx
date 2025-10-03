"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { configService, type ConfigState, type ConfigEvent } from '@/services/ConfigService';
import type { SiteConfig } from '@/types';

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

    // Încarcă configurația la inițializare
    useEffect(() => {
        console.log('🚀 ConfigProvider: Inițializare...');
        loadConfig();
    }, []);

    // Ascultă evenimentele de la configService
    useEffect(() => {
        const removeListener = configService.addEventListener((event: ConfigEvent) => {
            console.log('📡 ConfigProvider: Eveniment primit:', event.type);
            
            // Actualizează state-ul local cu cel din serviciu
            setState(configService.getState());
        });

        return removeListener;
    }, []);

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
        isSiteEditable: plansConfig?.isEditable || false,
        useLocalSiteConfig: plansConfig?.['useLocal_site-config'] === true
    };
};
