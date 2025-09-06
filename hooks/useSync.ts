"use client";

import { useCallback } from 'react';
import { toast } from 'sonner';
import { uploadConfig } from '@/utils/api';
import type { SiteConfig } from '@/types';
import type { Translations } from '@/utils/translations';

interface useSyncProps {
    siteConfig: SiteConfig | null;
    setIsSyncing: React.Dispatch<React.SetStateAction<boolean>>;
    t: Translations;
}

export const useSync = ({ siteConfig, setIsSyncing, t }: useSyncProps) => {
    const syncConfig = useCallback(async () => {
        if (!siteConfig) {
            toast.error(t.toolbar.noConfigToSync);
            return;
        }
        if (siteConfig.metadata.userType !== 'premium') {
            toast.error(t.toolbar.syncIsPremium);
            return;
        }
    
        setIsSyncing(true);
        const syncToast = toast.loading(t.toolbar.syncing);
    
        try {
            await uploadConfig(siteConfig);
            toast.success(t.toolbar.syncSuccess, { id: syncToast });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast.error(`${t.toolbar.syncFailed}: ${errorMessage}`, { id: syncToast });
        } finally {
            setIsSyncing(false);
        }
    }, [siteConfig, setIsSyncing, t]);

    return { syncConfig };
};
