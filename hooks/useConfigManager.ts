"use client";

import { useCallback } from 'react';
import { toast } from 'sonner';
import { fromZodError } from 'zod-validation-error';
import type { SiteConfig } from '@/types';
import type { Translations } from '@/utils/translations';
import { siteConfigSchema } from '@/utils/validation';
import { sanitizeHTML } from '@/utils/sanitize';

interface useConfigManagerProps {
    siteConfig: SiteConfig | null;
    initialConfig: SiteConfig | null;
    setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
    initializeHistory: (config: SiteConfig) => void;
    t: Translations;
}

export const useConfigManager = ({ siteConfig, initialConfig, setSiteConfig, initializeHistory, t }: useConfigManagerProps) => {

    const resetToDefaults = useCallback(() => {
        if (initialConfig && window.confirm(t.toolbar.resetToDefaults)) {
            localStorage.removeItem('siteConfig');
            setSiteConfig(initialConfig);
            initializeHistory(initialConfig);
        }
    }, [initialConfig, setSiteConfig, initializeHistory, t]);

    const exportConfig = useCallback(async () => {
        if (!siteConfig) {
            toast.error("No configuration available to export.");
            return;
        }
        try {
            // Configurația conține deja imaginile ca base64 în siteConfig.images
            const jsonString = JSON.stringify(siteConfig, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'site-config.json';
            a.click();
            URL.revokeObjectURL(url);
            toast.success(t.toolbar.configExported);
        } catch (error) {
            console.error("Failed to export config:", error);
            toast.error("Export failed", { description: "Could not generate file." });
        }
    }, [siteConfig, t]);

    const importConfig = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const result = event.target?.result as string;
                const parsedJson = JSON.parse(result);

                const validationResult = siteConfigSchema.safeParse(parsedJson);
                if (!validationResult.success) {
                    const validationError = fromZodError(validationResult.error);
                    console.error("Validation Error:", validationError);
                    toast.error(`${t.toolbar.importFailed}: Invalid file structure.`, { description: validationError.message });
                    return;
                }

                let newConfig = validationResult.data as SiteConfig;

                // Handle embedded local images
                if ((newConfig as any)._localImages) {
                    const localImages = (newConfig as any)._localImages;
                    const imagePromises = Object.entries(localImages).map(([id, dataUrl]) => {
                         return db.saveImage(id, dataUrl as string);
                    });
                    await Promise.all(imagePromises);
                    delete (newConfig as any)._localImages; // Clean up temp property
                }

                // Sanitize all rich text fields
                for (const sectionId in newConfig.sections) {
                    for (const key in newConfig.sections[sectionId].elements) {
                        const element = newConfig.sections[sectionId].elements[key];
                        if (element.type === 'rich-text') {
                            (element.content as any).ro = sanitizeHTML(element.content.ro);
                            (element.content as any).en = sanitizeHTML(element.content.en);
                        }
                    }
                }
                if (newConfig.pages) {
                    for (const pageId in newConfig.pages) {
                        for (const key in newConfig.pages[pageId].elements) {
                            const element = newConfig.pages[pageId].elements[key];
                            if (element.type === 'rich-text') {
                                (element.content as any).ro = sanitizeHTML(element.content.ro);
                                (element.content as any).en = sanitizeHTML(element.content.en);
                            }
                        }
                    }
                }
                
                setSiteConfig(newConfig);
                initializeHistory(newConfig);
                toast.success(t.toolbar.configImported, {
                    description: "Reloading to apply local images..."
                });

                // Reload the page to ensure the image cache is populated from the newly imported images in DB.
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                console.error("Failed to import config:", error);
                const errorMessage = error instanceof Error ? error.message : "Could not read file.";
                toast.error(`${t.toolbar.importFailed}: ${errorMessage}`);
            }
        };
        reader.readAsText(file);
    }, [setSiteConfig, initializeHistory, t]);

    return {
        resetToDefaults,
        exportConfig,
        importConfig,
    };
};
