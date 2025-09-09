"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSiteEditable } from '@/services/plansService';

type SiteMode = 'edit' | 'view';

interface SiteModeContextType {
    mode: SiteMode;
    isEditMode: boolean;
    isViewMode: boolean;
    switchToEditMode: () => void;
    switchToViewMode: () => void;
    currentDomain: string;
}

const SiteModeContext = createContext<SiteModeContextType | undefined>(undefined);

export function SiteModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<SiteMode>('view');
    const [currentDomain, setCurrentDomain] = useState<string>('');

    useEffect(() => {
        // Detectează domeniul curent
        const domain = window.location.hostname;
        setCurrentDomain(domain);

        // Verifică dacă site-ul poate fi editat
        const editable = isSiteEditable();
        
        if (!editable) {
            // Dacă site-ul nu este editabil, forțează modul view
            setMode('view');
            return;
        }

        // Detectează modul bazat pe URL sau localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const editMode = urlParams.get('edit') === 'true';
        const hasLocalConfig = localStorage.getItem('site-config') !== null;

        if (editMode || hasLocalConfig) {
            setMode('edit');
        } else {
            setMode('view');
        }
    }, []);

    const switchToEditMode = () => {
        // Verifică dacă site-ul poate fi editat
        if (!isSiteEditable()) {
            return; // Nu permite trecerea în modul edit dacă site-ul nu este editabil
        }
        
        setMode('edit');
        // Adaugă parametrul edit în URL
        const url = new URL(window.location.href);
        url.searchParams.set('edit', 'true');
        window.history.replaceState({}, '', url.toString());

        // Dacă nu există configurație în localStorage, o vom avea disponibilă în următorul render
        // SiteContext va detecta că suntem în edit mode și va salva configurația automată
    };

    const switchToViewMode = () => {
        setMode('view');
        // Elimină parametrul edit din URL
        const url = new URL(window.location.href);
        url.searchParams.delete('edit');
        window.history.replaceState({}, '', url.toString());
        // NU mai șterge configurația din localStorage - să rămână pentru performanță
    };

    const value: SiteModeContextType = {
        mode,
        isEditMode: mode === 'edit',
        isViewMode: mode === 'view',
        switchToEditMode,
        switchToViewMode,
        currentDomain
    };

    return (
        <SiteModeContext.Provider value={value}>
            {children}
        </SiteModeContext.Provider>
    );
}

export function useSiteMode() {
    const context = useContext(SiteModeContext);
    if (context === undefined) {
        throw new Error('useSiteMode must be used within a SiteModeProvider');
    }
    return context;
}

