"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSite } from '@/context/SiteContext';
import { X, Bot, Sparkles, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { useTestMode } from '@/context/TestModeContext';

type ModalView = 'prompt' | 'loading' | 'explanation' | 'error';

const AIRebuildModal: React.FC = () => {
    const { isRebuildModalOpen, closeRebuildModal, rebuildSiteWithAI } = useSite();
    const { language } = useLanguage();
    const t = useMemo(() => translations[language].aiRebuild, [language]);
    const { useRebuild } = useTestMode();

    const [prompt, setPrompt] = useState('');
    const [explanation, setExplanation] = useState('');
    const [error, setError] = useState('');
    const [view, setView] = useState<ModalView>('prompt');

    const [progress, setProgress] = useState(0);
    const [statusTextKey, setStatusTextKey] = useState('');
    const simulationRef = useRef<number | null>(null);

    const onProgress = useCallback((newProgress: number, newStatusKey: string) => {
        if (simulationRef.current) {
            cancelAnimationFrame(simulationRef.current);
            simulationRef.current = null;
        }
        setProgress(newProgress);
        setStatusTextKey(newStatusKey);
    }, []);

    useEffect(() => {
        if (statusTextKey === 'generatingPlan') {
            let startTime: number | null = null;
            const duration = 20000; // 20s for the "thinking" part
            const startProgress = progress; // Should be around 10
            const targetProgress = 49.9; // Stop just before 50

            const frame = (currentTime: number) => {
                if (startTime === null) startTime = currentTime;
                const elapsedTime = currentTime - startTime;
                const rawProgress = Math.min(elapsedTime / duration, 1);

                const currentProgress = startProgress + rawProgress * (targetProgress - startProgress);

                setProgress(currentProgress);

                if (elapsedTime < duration) {
                    simulationRef.current = requestAnimationFrame(frame);
                }
            };
            simulationRef.current = requestAnimationFrame(frame);
        }

        return () => {
            if (simulationRef.current) {
                cancelAnimationFrame(simulationRef.current);
                simulationRef.current = null;
            }
        };
    }, [statusTextKey, progress]);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        useRebuild();
        setView('loading');
        setProgress(0);
        setStatusTextKey('');

        try {
            const result = await rebuildSiteWithAI(prompt, onProgress);

            if (result) {
                setExplanation(result);
                setView('explanation');
            } else {
                setError('AI-ul nu a putut procesa cererea. Te rog încearcă din nou cu un prompt mai simplu.');
                setView('error');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "A apărut o eroare neprevăzută.";
            setError(errorMessage);
            setView('error');
        }
    };

    const handleClose = () => {
        closeRebuildModal();
        setTimeout(() => {
            setPrompt('');
            setExplanation('');
            setError('');
            setView('prompt');
            setProgress(0);
            setStatusTextKey('');
        }, 300);
    };

    if (!isRebuildModalOpen) return null;

    const getStatusText = () => {
        const statusKey = statusTextKey.split(' ')[0];
        const statusArgs = statusTextKey.substring(statusKey.indexOf(' ')).trim();
        const baseText = t.status[statusKey as keyof typeof t.status] || t.generatingDescription;
        return `${baseText} ${statusArgs}`;
    }

    const renderContent = () => {
        switch (view) {
            case 'loading':
                return (
                    <div className="p-8 text-center flex flex-col items-center justify-center space-y-4 min-h-[450px]">
                        <img
                            src="/AI-site-working.gif"
                            alt="AI is working..."
                            className="w-full max-w-md h-auto rounded-lg"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">{t.generatingTitle}</h3>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                            <div
                                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-linear"
                                style={{ width: `${progress}%` }}>
                            </div>
                        </div>
                        <p className="text-gray-600 max-w-sm h-5">{getStatusText()}</p>
                    </div>
                );
            case 'explanation':
                return (
                    <>
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <CheckCircle size={22} className="mr-2 text-green-600" />
                                {t.success}
                            </h3>
                            <div className="prose prose-sm max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: explanation }} />
                        </div>
                        <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
                            <button
                                onClick={handleClose}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
                            >
                                Închide
                            </button>
                        </div>
                    </>
                );
            case 'prompt':
            default:
                return (
                    <>
                        <div className="p-6 space-y-4">
                            <p className="text-gray-600">{t.description}</p>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t.placeholder}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 resize-none"
                                rows={5}
                            />
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm text-yellow-800">
                                <strong>Warning:</strong> {t.warning}
                            </div>
                        </div>
                        <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
                            <button
                                onClick={handleGenerate}
                                disabled={!prompt.trim()}
                                className="px-6 py-2.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px] font-semibold"
                            >
                                <Sparkles size={20} className="mr-2" />
                                <span>{t.generateButton}</span>
                            </button>
                        </div>
                    </>
                );
            case 'error':
                return (
                    <>
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <X size={22} className="mr-2 text-red-600" />
                                Eroare la Generare
                            </h3>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800">{error}</p>
                            </div>
                        </div>
                        <div className="flex justify-between p-4 border-t bg-gray-50 rounded-b-lg">
                            <button
                                onClick={() => setView('prompt')}
                                className="px-6 py-2.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-semibold"
                            >
                                Încearcă din nou
                            </button>
                            <button
                                onClick={handleClose}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
                            >
                                Închide
                            </button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div
            id="ai-rebuild-modal"
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={view !== 'loading' ? handleClose : undefined}
        >
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Bot size={24} className="mr-2 text-purple-600" />
                        {t.title}
                    </h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600" disabled={view === 'loading'}>
                        <X size={24} />
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default AIRebuildModal;