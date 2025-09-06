"use client";

import { useState, useCallback } from 'react';
import type { SiteConfig, Section, Page } from '@/types';

const MAX_HISTORY_LENGTH = 50;

export interface HistoryEntry {
  sections: { [id: string]: Section };
  sectionOrder: string[];
  pages?: { [id: string]: Page };
}

const createHistoryEntry = (config: SiteConfig): HistoryEntry => ({
    sections: config.sections,
    sectionOrder: config.sectionOrder,
    pages: config.pages,
});

export const useHistory = () => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);

    const updateHistory = useCallback((newConfig: SiteConfig) => {
        const newHistoryEntry: HistoryEntry = createHistoryEntry(newConfig);
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newHistoryEntry);
        if (newHistory.length > MAX_HISTORY_LENGTH) {
            newHistory.shift();
        }
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            return history[newIndex];
        }
        return null;
    }, [history, historyIndex]);
    
    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            return history[newIndex];
        }
        return null;
    }, [history, historyIndex]);
    
    const initializeHistory = useCallback((config: SiteConfig) => {
        const entry = createHistoryEntry(config);
        setHistory([entry]);
        setHistoryIndex(0);
    }, []);

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    return {
        updateHistory,
        initializeHistory,
        undo,
        redo,
        canUndo,
        canRedo,
    };
};
