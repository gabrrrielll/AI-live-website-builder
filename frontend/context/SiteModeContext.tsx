"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePlansConfig } from '@/context/ConfigProvider';
import { useLocalStorage as shouldUseLocalStorage } from '@/constants.js';

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
    const location = useLocation();
    const navigate = useNavigate();
    const { isSiteEditable, loadConfig } = usePlansConfig();

    useEffect(() => {
        // Detectează domeniul curent
        const domain = window.location.hostname;
        setCurrentDomain(domain);

        // Încarcă configurația și verifică dacă site-ul poate fi editat
        const initializeAndCheck = async () => {
            await loadConfig();
            
            if (!isSiteEditable) {
                // Dacă site-ul nu este editabil, forțează modul view
                setMode('view');
                return;
            }
        };

        initializeAndCheck().catch(console.error);

        // Detectează modul bazat pe URL sau localStorage (doar în modul EDITOR)
        const urlParams = new URLSearchParams(location.search);
        const editMode = urlParams.get('edit') === 'true';
        
        // Verifică localStorage DOAR dacă suntem în modul EDITOR
        const hasLocalConfig = shouldUseLocalStorage() && localStorage.getItem('site-config') !== null;

        if (editMode || hasLocalConfig) {
            setMode('edit');
        } else {
            setMode('view');
        }
    }, []); // Doar o dată la mount, nu la fiecare schimbare de ruta

    const switchToEditMode = () => {
        // Verifică dacă site-ul poate fi editat
        if (!isSiteEditable) {
            return; // Nu permite trecerea în modul edit dacă site-ul nu este editabil
        }

        setMode('edit');
        // Adaugă parametrul edit în URL folosind React Router
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('edit', 'true');
        navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });

        // Dacă nu există configurație în localStorage, o vom avea disponibilă în următorul render
        // SiteContext va detecta că suntem în edit mode și va salva configurația automată
    };

    const switchToViewMode = () => {
        setMode('view');
        // Elimină parametrul edit din URL folosind React Router
        const urlParams = new URLSearchParams(location.search);
        urlParams.delete('edit');
        const newSearch = urlParams.toString();
        const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
        navigate(newUrl, { replace: true });
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

