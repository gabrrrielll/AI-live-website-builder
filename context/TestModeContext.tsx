"use client";

import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const REBUILD_LIMIT = 3;
const IMAGE_GEN_LIMIT = 3;

// Helper to get usage from localStorage
const getUsage = (key: string): number => {
    if (typeof window === 'undefined') return 0;
    try {
        const item = localStorage.getItem(key);
        return item ? parseInt(item, 10) : 0;
    } catch {
        return 0;
    }
};

// Helper to set usage in localStorage
const setUsage = (key: string, count: number) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, count.toString());
    } catch (error) {
        console.error("Could not save usage to localStorage", error);
    }
};

interface TestModeContextType {
    isTestMode: boolean;
    rebuildsLeft: number;
    imagesLeft: number;
    canUseRebuild: () => boolean;
    canUseImageGen: () => boolean;
    useRebuild: () => void;
    useImageGen: () => void;
    isLimitModalOpen: boolean;
    showLimitModal: () => void;
    closeLimitModal: () => void;
}

const TestModeContext = createContext<TestModeContextType | undefined>(undefined);

export const TestModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isTestMode, setIsTestMode] = useState(false);

    useEffect(() => {
        setIsTestMode(window.location.href.includes('test'));
    }, []);

    const [rebuildUsage, setRebuildUsage] = useState(() => getUsage('ai_rebuild_usage'));
    const [imageGenUsage, setImageGenUsage] = useState(() => getUsage('ai_image_gen_usage'));
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

    const rebuildsLeft = Math.max(0, REBUILD_LIMIT - rebuildUsage);
    const imagesLeft = Math.max(0, IMAGE_GEN_LIMIT - imageGenUsage);

    const canUseRebuild = useCallback(() => !isTestMode || rebuildsLeft > 0, [isTestMode, rebuildsLeft]);
    const canUseImageGen = useCallback(() => !isTestMode || imagesLeft > 0, [isTestMode, imagesLeft]);

    const useRebuild = useCallback(() => {
        if (isTestMode) {
            const newUsage = rebuildUsage + 1;
            setRebuildUsage(newUsage);
            setUsage('ai_rebuild_usage', newUsage);
        }
    }, [isTestMode, rebuildUsage]);

    const useImageGen = useCallback(() => {
        if (isTestMode) {
            const newUsage = imageGenUsage + 1;
            setImageGenUsage(newUsage);
            setUsage('ai_image_gen_usage', newUsage);
        }
    }, [isTestMode, imageGenUsage]);

    const showLimitModal = useCallback(() => setIsLimitModalOpen(true), []);
    const closeLimitModal = useCallback(() => setIsLimitModalOpen(false), []);
    
    const { language } = useLanguage();
    const translations = {
        ro: {
            title: "Limită Atinsă",
            message: "Ați atins limita de utilizare pentru această funcționalitate în versiunea de test.",
            close: "Închide"
        },
        en: {
            title: "Limit Reached",
            message: "You have reached the usage limit for this feature in the test version.",
            close: "Close"
        }
    }
    const t = translations[language];

    const value = {
        isTestMode,
        rebuildsLeft,
        imagesLeft,
        canUseRebuild,
        canUseImageGen,
        useRebuild,
        useImageGen,
        isLimitModalOpen,
        showLimitModal,
        closeLimitModal,
    };

    return (
        <TestModeContext.Provider value={value}>
            {children}
            {isLimitModalOpen && (
                 <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={closeLimitModal}>
                    <div 
                        className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all text-center p-6" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">{t.title}</h2>
                        <p className="text-gray-600 mb-6">{t.message}</p>
                        <button 
                            onClick={closeLimitModal}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {t.close}
                        </button>
                    </div>
                </div>
            )}
        </TestModeContext.Provider>
    );
};

export const useTestMode = (): TestModeContextType => {
    const context = useContext(TestModeContext);
    if (context === undefined) {
        throw new Error('useTestMode must be used within a TestModeProvider');
    }
    return context;
};
