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
        console.log('updateHistory called with config:', newConfig);
        const newHistoryEntry: HistoryEntry = createHistoryEntry(newConfig);
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newHistoryEntry);
        if (newHistory.length > MAX_HISTORY_LENGTH) {
            newHistory.shift();
        }
        console.log('updateHistory: new history length:', newHistory.length, 'new index:', newHistory.length - 1);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const undo = useCallback(() => {
        console.log('useHistory undo called, historyIndex:', historyIndex, 'history length:', history.length);
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            console.log('useHistory undo: returning history entry at index', newIndex, ':', history[newIndex]);
            setHistoryIndex(newIndex);
            return history[newIndex];
        }
        console.log('useHistory undo: no history available');
        return null;
    }, [history, historyIndex]);
    
    const redo = useCallback(() => {
        console.log('useHistory redo called, historyIndex:', historyIndex, 'history length:', history.length);
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            console.log('useHistory redo: returning history entry at index', newIndex, ':', history[newIndex]);
            setHistoryIndex(newIndex);
            return history[newIndex];
        }
        console.log('useHistory redo: no history available');
        return null;
    }, [history, historyIndex]);
    
    const initializeHistory = useCallback((config: SiteConfig) => {
        console.log('initializeHistory called with config:', config);
        const entry = createHistoryEntry(config);
        console.log('initializeHistory: created entry:', entry);
        setHistory([entry]);
        setHistoryIndex(0);
        console.log('initializeHistory: initialized with index 0');
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
