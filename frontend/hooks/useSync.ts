"use client";

import { useCallback } from 'react';
import { toast } from 'sonner';
import { uploadConfig, saveConfigLocally } from '@/utils/api';
import { usePlansConfig } from '@/services/plansService';
import type { SiteConfig } from '@/types';
import type { Translations } from '@/utils/translations';

interface useSyncProps {
    siteConfig: SiteConfig | null;
    setIsSyncing: React.Dispatch<React.SetStateAction<boolean>>;
    t: Translations;
}

export const useSync = ({ siteConfig, setIsSyncing, t }: useSyncProps) => {
    const { showSaveButton, isSiteEditable, useLocalSiteConfig } = usePlansConfig();
    
    const syncConfig = useCallback(async () => {
        if (!siteConfig) {
            toast.error(t.toolbar.noConfigToSync);
            return;
        }
        // Verifică dacă sincronizarea este activată în plans-config
        if (!showSaveButton) {
            toast.error(t.toolbar.syncIsPremium);
            return;
        }

        setIsSyncing(true);
        const syncToast = toast.loading(t.toolbar.syncing);

        try {
            // Verifică dacă trebuie să salvez local sau pe server
            if (useLocalSiteConfig()) {
                // Salvare locală cu download automat
                await saveConfigLocally(siteConfig);
                toast.success(t.toolbar.syncSuccessLocal, { id: syncToast });
            } else {
                // Salvare pe server prin API
                await uploadConfig(siteConfig);
                toast.success(t.toolbar.syncSuccess, { id: syncToast });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast.error(`${t.toolbar.syncFailed}: ${errorMessage}`, { id: syncToast });
        } finally {
            setIsSyncing(false);
        }
    }, [siteConfig, setIsSyncing, t]);

    return { syncConfig };
};
