

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { SiteConfig, SiteElement, Section, Article } from '@/types';
import { useSiteConfig, useSiteConfigSaver } from '@/hooks/useSiteConfig';
import { useSiteMode } from './SiteModeContext';
import { toast } from 'sonner';
import { useHistory } from '@/hooks/useHistory';

interface SiteContextType {
    siteConfig: SiteConfig | null;
    isLoading: boolean;
    error: string | null;
    isEditMode: boolean;
    updateSiteConfig: (newConfig: SiteConfig) => void;
    saveConfig: () => Promise<void>;
    getElement: (sectionId: string, elementId: string) => SiteElement | undefined;
    updateElement: (sectionId: string, elementId: string, newElement: SiteElement) => void;
    updateSectionStyles: (sectionId: string, newStyles: React.CSSProperties) => void;
    updateSectionLayout: (sectionId: string, layoutChanges: Partial<Section['layout']>, cardStyles: Section['cardStyles']) => void;
    addArticle: () => Article | null;
    updateArticle: (articleId: string, updatedArticle: Article, onComplete?: (newSlug: string) => void) => void;
    deleteArticle: (articleId: string) => void;
    getArticleBySlug: (slug: string) => Article | undefined;
    getImageUrl: (id: string) => string | undefined;
    storeImage: (dataUrl: string) => Promise<string>;
    // Funcții pentru editor (pentru compatibilitate)
    showHiddenInEditor: boolean;
    toggleShowHiddenInEditor: () => void;
    // Funcții pentru AI (pentru compatibilitate)
    isRebuildModalOpen: boolean;
    openRebuildModal: () => void;
    closeRebuildModal: () => void;
    rebuildSiteWithAI: (prompt: string) => Promise<string>;
    // Funcții pentru editarea elementelor
    editingElement: { sectionId: string; elementId: string; element: SiteElement } | null;
    startEditing: (sectionId: string, elementId: string) => void;
    stopEditing: () => void;
    // Funcții pentru gestionarea secțiunilor
    editingSectionId: string | null;
    editingSectionLayoutId: string | null;
    toggleSectionVisibility: (sectionId: string) => void;
    toggleNavLinkVisibility: (sectionId: string) => void;
    startEditingSectionStyles: (sectionId: string) => void;
    stopEditingSectionStyles: () => void;
    startEditingSectionLayout: (sectionId: string) => void;
    stopEditingSectionLayout: () => void;
    moveSection: (sectionId: string, direction: 'up' | 'down') => void;
    deleteSection: (sectionId: string) => void;
    duplicateSection: (sectionId: string) => void;
    // Funcții pentru editarea slide-urilor
    editingSlide: { sectionId: string; slideId: number } | null;
    startEditingSlideStyles: (sectionId: string, slideId: number) => void;
    stopEditingSlideStyles: () => void;
    updateSlideItemStyles: (sectionId: string, slideId: number, newStyles: React.CSSProperties) => void;
    // Funcții pentru istoric
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { siteConfig: initialConfig, isLoading, error } = useSiteConfig();
    const { saveToLocalStorage, saveToServer } = useSiteConfigSaver();
    const { isEditMode, currentDomain } = useSiteMode();
    
    // Hook pentru gestionarea istoricului
    const { undo: historyUndo, redo: historyRedo, canUndo, canRedo, initializeHistory, updateHistory } = useHistory();

    const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
    const [showHiddenInEditor, setShowHiddenInEditor] = useState(true);
    const [isRebuildModalOpen, setIsRebuildModalOpen] = useState(false);
    const [editingElement, setEditingElement] = useState<{ sectionId: string; elementId: string; element: SiteElement } | null>(null);
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [editingSectionLayoutId, setEditingSectionLayoutId] = useState<string | null>(null);
    const [editingSlide, setEditingSlide] = useState<{ sectionId: string; slideId: number } | null>(null);

    // Actualizează siteConfig când se încarcă configurația inițială
    useEffect(() => {
        if (initialConfig) {
            setSiteConfig(initialConfig);
            // Inițializează istoricul cu configurația inițială
            initializeHistory(initialConfig);
        }
    }, [initialConfig, initializeHistory]);

    // Salvează configurația în localStorage când se trece în mod editare
    useEffect(() => {
        // Așteptăm ca configurația să se încarce complet și să fim în mod editare
        if (siteConfig && isEditMode && !isLoading) {
            const hasLocalConfig = localStorage.getItem('site-config') !== null;
            if (!hasLocalConfig) {
                // Salvează configurația actuală în localStorage pentru a activa modul editare
                const result = saveToLocalStorage(siteConfig);
            }
        }
    }, [siteConfig, isEditMode, isLoading, saveToLocalStorage]);

    // Funcție pentru actualizarea configurației
    const updateSiteConfig = useCallback((newConfig: SiteConfig, skipHistory = false) => {
        setSiteConfig(newConfig);

        // Actualizează istoricul doar dacă nu este o operație de undo/redo
        if (!skipHistory) {
            updateHistory(newConfig);
        }

        // Salvează automat în localStorage ÎNTOTDEAUNA pentru persistență
        const result = saveToLocalStorage(newConfig);
    }, [saveToLocalStorage, updateHistory]);

    // Funcție pentru salvarea configurației pe server
    const saveConfig = useCallback(async () => {
        if (!siteConfig) return;

        if (isEditMode) {
            const result = await saveToServer(siteConfig, currentDomain);
            if (result.success) {
                toast.success('Configurația a fost salvată pe server!');
            } else {
                toast.error(`Eroare la salvarea pe server: ${result.error}`);
            }
        }
    }, [siteConfig, isEditMode, currentDomain, saveToServer]);

    // Funcții pentru gestionarea elementelor
    const getElement = useCallback((sectionId: string, elementId: string) => {
        if (!siteConfig) return undefined;
        const section = siteConfig.sections[sectionId];
        return section?.elements?.[elementId];
    }, [siteConfig]);

    const updateElement = useCallback((sectionId: string, elementId: string, newElement: SiteElement) => {
        if (!siteConfig) return;

        const newConfig = { ...siteConfig };
        if (!newConfig.sections[sectionId]) {
            newConfig.sections[sectionId] = {
                id: sectionId,
                component: 'Unknown',
                visible: true,
                elements: {}
            };
        }
        newConfig.sections[sectionId].elements[elementId] = newElement;

        updateSiteConfig(newConfig);
    }, [siteConfig, updateSiteConfig]);

    const updateSectionStyles = useCallback((sectionId: string, newStyles: React.CSSProperties) => {
        if (!siteConfig) return;

        const newConfig = { ...siteConfig };
        if (!newConfig.sections[sectionId]) {
            newConfig.sections[sectionId] = {
                id: sectionId,
                component: 'Unknown',
                visible: true,
                elements: {},
                styles: {}
            };
        }
        newConfig.sections[sectionId].styles = newStyles;

        updateSiteConfig(newConfig);
    }, [siteConfig, updateSiteConfig]);

    const updateSectionLayout = useCallback((sectionId: string, layoutChanges: Partial<Section['layout']>, cardStyles: Section['cardStyles']) => {
        if (!siteConfig) return;

        const newConfig = { ...siteConfig };
        if (!newConfig.sections[sectionId]) {
            newConfig.sections[sectionId] = {
                id: sectionId,
                component: 'Unknown',
                visible: true,
                elements: {},
                layout: {},
                cardStyles: {}
            };
        }
        newConfig.sections[sectionId].layout = { ...newConfig.sections[sectionId].layout, ...layoutChanges };
        newConfig.sections[sectionId].cardStyles = cardStyles;

        updateSiteConfig(newConfig);
    }, [siteConfig, updateSiteConfig]);

    // Funcții pentru gestionarea articolelor
    const addArticle = useCallback((): Article | null => {
        if (!siteConfig) return null;

        const newArticle: Article = {
            id: `article-${Date.now()}`,
            slug: `articol-${Date.now()}`,
            title: { ro: 'Articol Nou', en: 'New Article' },
            excerpt: { ro: 'Descriere articol nou', en: 'New article description' },
            content: { ro: '<p>Conținut articol nou</p>', en: '<p>New article content</p>' },
            imageUrl: '',
            imageAlt: { ro: 'Articol nou', en: 'New article' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metaTitle: { ro: 'Articol Nou', en: 'New Article' },
            metaDescription: { ro: 'Descriere articol nou', en: 'New article description' }
        };

        const newConfig = { ...siteConfig };
        if (!newConfig.articles) {
            newConfig.articles = [];
        }
        newConfig.articles.push(newArticle);
        updateSiteConfig(newConfig);

        return newArticle;
    }, [siteConfig, updateSiteConfig]);

    const updateArticle = useCallback((articleId: string, updatedArticle: Article, onComplete?: (newSlug: string) => void) => {
        if (!siteConfig) return;

        const newConfig = { ...siteConfig };
        if (!newConfig.articles) {
            newConfig.articles = [];
        }
        const articleIndex = newConfig.articles.findIndex(article => article.id === articleId);
        if (articleIndex !== -1) {
            newConfig.articles[articleIndex] = { ...updatedArticle, updatedAt: new Date().toISOString() };
            updateSiteConfig(newConfig);

            // Execută callback-ul dacă există
            if (onComplete) {
                onComplete(updatedArticle.slug);
            }
        }
    }, [siteConfig, updateSiteConfig]);

    const deleteArticle = useCallback((articleId: string) => {
        if (!siteConfig) return;

        const newConfig = { ...siteConfig };
        if (!newConfig.articles) {
            newConfig.articles = [];
        }
        newConfig.articles = newConfig.articles.filter(article => article.id !== articleId);
        updateSiteConfig(newConfig);
    }, [siteConfig, updateSiteConfig]);

    const getArticleBySlug = useCallback((slug: string) => {
        if (!siteConfig || !siteConfig.articles) return undefined;
        return siteConfig.articles.find(article => article.slug === slug);
    }, [siteConfig]);

    // Funcții pentru gestionarea imaginilor
    const getImageUrl = useCallback((id: string) => {
        if (!siteConfig) return undefined;
        return siteConfig.images?.[id];
    }, [siteConfig]);

    const storeImage = useCallback(async (dataUrl: string): Promise<string> => {
        if (!siteConfig) throw new Error('Site config not loaded');

        const id = `local-img-${Date.now()}`;
        const newConfig = { ...siteConfig };

        // Inițializează obiectul images dacă nu există
        if (!newConfig.images) {
            newConfig.images = {};
        }

        // Salvează imaginea ca base64 în configurație
        newConfig.images[id] = dataUrl;

        // Actualizează configurația (care se salvează automat în localStorage)
        updateSiteConfig(newConfig);

        return id;
    }, [siteConfig, updateSiteConfig]);

    // Funcții pentru editor (pentru compatibilitate)
    const toggleShowHiddenInEditor = useCallback(() => {
        setShowHiddenInEditor(prev => !prev);
    }, []);

    // Funcții pentru AI (pentru compatibilitate)
    const openRebuildModal = useCallback(() => {
        setIsRebuildModalOpen(true);
    }, []);

    const closeRebuildModal = useCallback(() => {
        setIsRebuildModalOpen(false);
    }, []);

    const rebuildSiteWithAI = useCallback(async (prompt: string): Promise<string> => {
        // Implementare simplă - returnează un explanation
        return `Site-ul va fi reconstruit pe baza prompt-ului: "${prompt}"`;
    }, []);

    // Funcții pentru editarea elementelor
    const startEditing = useCallback((sectionId: string, elementId: string) => {
        const element = getElement(sectionId, elementId);
        if (element) {
            setEditingElement({ sectionId, elementId, element });
        }
    }, [getElement]);

    const stopEditing = useCallback(() => {
        setEditingElement(null);
    }, []);

    // Funcții pentru gestionarea secțiunilor
    const toggleSectionVisibility = useCallback((sectionId: string) => {
        if (!siteConfig) return;
        const newConfig = { ...siteConfig };
        if (newConfig.sections[sectionId]) {
            newConfig.sections[sectionId].visible = !newConfig.sections[sectionId].visible;
            updateSiteConfig(newConfig);
        }
    }, [siteConfig, updateSiteConfig]);

    const toggleNavLinkVisibility = useCallback((sectionId: string) => {
        if (!siteConfig) return;
        const newConfig = { ...siteConfig };
        if (newConfig.sections[sectionId]) {
            newConfig.sections[sectionId].navLinkVisible = !newConfig.sections[sectionId].navLinkVisible;
            updateSiteConfig(newConfig);
        }
    }, [siteConfig, updateSiteConfig]);

    const startEditingSectionStyles = useCallback((sectionId: string) => {
        setEditingSectionId(sectionId);
    }, []);

    const stopEditingSectionStyles = useCallback(() => {
        setEditingSectionId(null);
    }, []);

    const startEditingSectionLayout = useCallback((sectionId: string) => {
        setEditingSectionLayoutId(sectionId);
    }, []);

    const stopEditingSectionLayout = useCallback(() => {
        setEditingSectionLayoutId(null);
    }, []);

    const moveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
        if (!siteConfig) return;
        const newConfig = { ...siteConfig };
        const sectionOrder = [...newConfig.sectionOrder];
        const currentIndex = sectionOrder.indexOf(sectionId);

        if (direction === 'up' && currentIndex > 1) {
            [sectionOrder[currentIndex], sectionOrder[currentIndex - 1]] = [sectionOrder[currentIndex - 1], sectionOrder[currentIndex]];
        } else if (direction === 'down' && currentIndex < sectionOrder.length - 2) {
            [sectionOrder[currentIndex], sectionOrder[currentIndex + 1]] = [sectionOrder[currentIndex + 1], sectionOrder[currentIndex]];
        }

        newConfig.sectionOrder = sectionOrder;
        updateSiteConfig(newConfig);
    }, [siteConfig, updateSiteConfig]);

    const deleteSection = useCallback((sectionId: string) => {
        if (!siteConfig) return;
        if (!confirm('Sigur vrei să ștergi această secțiune?')) return;

        const newConfig = { ...siteConfig };
        delete newConfig.sections[sectionId];
        newConfig.sectionOrder = newConfig.sectionOrder.filter(id => id !== sectionId);
        updateSiteConfig(newConfig);
    }, [siteConfig, updateSiteConfig]);

    const duplicateSection = useCallback((sectionId: string) => {
        if (!siteConfig) return;
        const section = siteConfig.sections[sectionId];
        if (!section) return;

        const newSectionId = `${sectionId}-clone-${Date.now()}`;
        const newSection = JSON.parse(JSON.stringify(section));
        newSection.id = newSectionId;

        // Actualizează ID-urile elementelor pentru a evita conflictele
        const newElements: { [key: string]: any } = {};

        Object.keys(newSection.elements).forEach(elementId => {
            // Pentru Hero, înlocuiește prefixul "hero-" cu noul ID al secțiunii
            let newElementId = elementId;
            if (sectionId === 'hero' && elementId.startsWith('hero-')) {
                newElementId = elementId.replace('hero-', newSectionId + '-');
            } else if (elementId.startsWith(sectionId + '-')) {
                // Pentru alte secțiuni, înlocuiește prefixul exact al secțiunii
                newElementId = elementId.replace(sectionId + '-', newSectionId + '-');
            }
            newElements[newElementId] = { ...newSection.elements[elementId] };
        });

        newSection.elements = newElements;

        // Pentru Hero, actualizează și ID-urile item-urilor pentru a se potrivi cu elementele
        if (sectionId === 'hero' && newSection.items) {
            newSection.items = newSection.items.map((item: any) => {
                const newItemId = `${newSectionId}-item-${item.id}`;
                return { ...item, id: newItemId };
            });
        }

        const newConfig = { ...siteConfig };
        newConfig.sections[newSectionId] = newSection;

        const currentIndex = newConfig.sectionOrder.indexOf(sectionId);
        newConfig.sectionOrder.splice(currentIndex + 1, 0, newSectionId);

        updateSiteConfig(newConfig);
    }, [siteConfig, updateSiteConfig]);

    // Funcții pentru editarea slide-urilor
    const startEditingSlideStyles = useCallback((sectionId: string, slideId: number) => {
        setEditingSlide({ sectionId, slideId });
    }, []);

    const stopEditingSlideStyles = useCallback(() => {
        setEditingSlide(null);
    }, []);

    const updateSlideItemStyles = useCallback((sectionId: string, slideId: number, newStyles: React.CSSProperties) => {
        if (!siteConfig) return;
        const newConfig = { ...siteConfig };
        if (newConfig.sections[sectionId] && newConfig.sections[sectionId].items) {
            const slideItem = newConfig.sections[sectionId].items?.find((item: any) => item.id === slideId);
            if (slideItem) {
                slideItem.styles = { ...slideItem.styles, ...newStyles };
                updateSiteConfig(newConfig);
            }
        }
    }, [siteConfig, updateSiteConfig]);

    // Funcții pentru istoric
    const undo = useCallback(() => {
        const historyEntry = historyUndo();
        if (historyEntry && siteConfig) {
            const newConfig = {
                ...siteConfig,
                sections: historyEntry.sections,
                sectionOrder: historyEntry.sectionOrder,
                pages: historyEntry.pages,
            };
            updateSiteConfig(newConfig, true); // skipHistory = true pentru a evita loop-ul
            toast.success('Modificare anulată');
        }
    }, [historyUndo, siteConfig, updateSiteConfig]);

    const redo = useCallback(() => {
        const historyEntry = historyRedo();
        if (historyEntry && siteConfig) {
            const newConfig = {
                ...siteConfig,
                sections: historyEntry.sections,
                sectionOrder: historyEntry.sectionOrder,
                pages: historyEntry.pages,
            };
            updateSiteConfig(newConfig, true); // skipHistory = true pentru a evita loop-ul
            toast.success('Modificare refăcută');
        }
    }, [historyRedo, siteConfig, updateSiteConfig]);

    const value: SiteContextType = {
        siteConfig,
        isLoading,
        error,
        isEditMode,
        updateSiteConfig,
        saveConfig,
        getElement,
        updateElement,
        updateSectionStyles,
        updateSectionLayout,
        addArticle,
        updateArticle,
        deleteArticle,
        getArticleBySlug,
        getImageUrl,
        storeImage,
        showHiddenInEditor,
        toggleShowHiddenInEditor,
        isRebuildModalOpen,
        openRebuildModal,
        closeRebuildModal,
        rebuildSiteWithAI,
        editingElement,
        startEditing,
        stopEditing,
        editingSectionId,
        editingSectionLayoutId,
        toggleSectionVisibility,
        toggleNavLinkVisibility,
        startEditingSectionStyles,
        stopEditingSectionStyles,
        startEditingSectionLayout,
        stopEditingSectionLayout,
        moveSection,
        deleteSection,
        duplicateSection,
        editingSlide,
        startEditingSlideStyles,
        stopEditingSlideStyles,
        updateSlideItemStyles,
        undo,
        redo,
        canUndo,
        canRedo
    };

    return (
        <SiteContext.Provider value={value}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSite = () => {
    const context = useContext(SiteContext);
    if (context === undefined) {
        throw new Error('useSite must be used within a SiteProvider');
    }
    return context;
};