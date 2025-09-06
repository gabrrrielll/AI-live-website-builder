"use client";

import React from 'react';
import { useSiteMode } from '@/context/SiteModeContext';
import { useSite } from '@/context/SiteContext';
import { Edit, Eye, Save, Download } from 'lucide-react';
import { toast } from 'sonner';

export function ModeToggle() {
    const { isEditMode, isViewMode, switchToEditMode, switchToViewMode } = useSiteMode();
    const { saveConfig } = useSite();

    const handleSaveToServer = async () => {
        try {
            await saveConfig();
        } catch (error) {
            console.error('Error saving to server:', error);
        }
    };

    const handleDownloadConfig = () => {
        const { siteConfig } = useSite();
        if (!siteConfig) return;

        const configBlob = new Blob([JSON.stringify(siteConfig, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(configBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'site-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Configurația a fost descărcată!');
    };

    return (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
            {isViewMode && (
                <button
                    onClick={switchToEditMode}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Edit size={16} />
                    Editează Site-ul
                </button>
            )}

            {isEditMode && (
                <>
                    <button
                        onClick={switchToViewMode}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <Eye size={16} />
                        Vezi Site-ul
                    </button>

                    <button
                        onClick={handleSaveToServer}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Save size={16} />
                        Salvează pe Server
                    </button>

                    <button
                        onClick={handleDownloadConfig}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Download size={16} />
                        Descarcă Config
                    </button>
                </>
            )}
        </div>
    );
}
