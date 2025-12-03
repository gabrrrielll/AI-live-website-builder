"use client";

// GDPR Banner Component - Last updated: 2025-12-01 22:47
import React, { useState, useEffect } from 'react';
import { X, Settings, Shield, Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
}

const GDPRBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false
    });

    useEffect(() => {
        // Verifică dacă utilizatorul a dat deja consimțământul
        const consent = localStorage.getItem('gdpr-consent');
        if (!consent) {
            setIsVisible(true);
        } else {
            try {
                const savedPreferences = JSON.parse(consent);
                setPreferences(savedPreferences);
            } catch (e) {
                console.error("Failed to parse cookie preferences", e);
            }
        }
    }, []);

    const handleAcceptAll = () => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true
        };
        setPreferences(allAccepted);
        localStorage.setItem('gdpr-consent', JSON.stringify(allAccepted));
        setIsVisible(false);
    };

    const handleRejectAll = () => {
        const onlyNecessary: CookiePreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false
        };
        setPreferences(onlyNecessary);
        localStorage.setItem('gdpr-consent', JSON.stringify(onlyNecessary));
        setIsVisible(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem('gdpr-consent', JSON.stringify(preferences));
        setIsVisible(false);
    };

    const togglePreference = (key: keyof CookiePreferences) => {
        if (key === 'necessary') return; // Cannot toggle necessary
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] max-h-[90vh] overflow-y-auto">
            <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
                {!showDetails ? (
                    <div className="flex flex-col gap-4">
                        {/* Header with close button */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Cookie className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                    Respectăm confidențialitatea ta 🔒
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                                aria-label="Închide"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Section */}
                        <div className="space-y-3">
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Folosim cookie-uri pentru a îmbunătăți experiența ta pe site, pentru analiză și personalizare.
                                Cookie-urile necesare sunt întotdeauna active, dar poți alege pentru celelalte.
                            </p>

                            {/* Links Section */}
                            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-gray-500">
                                <Shield className="w-3.5 h-3.5 mr-0.5 inline-block" />
                                <span>Citește mai multe în</span>
                                <Link to="/privacy-policy" className="text-blue-600 hover:underline font-medium">
                                    Politica de Confidențialitate
                                </Link>
                                <span>și</span>
                                <Link to="/cookie-policy" className="text-blue-600 hover:underline font-medium">
                                    Politica Cookie-urilor
                                </Link>
                            </div>
                        </div>

                        {/* Buttons Section */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                            <button
                                onClick={handleRejectAll}
                                className="w-full sm:flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:ring-2 focus:ring-gray-300 focus:outline-none"
                            >
                                Respinge toate
                            </button>
                            <button
                                onClick={() => setShowDetails(true)}
                                className="w-full sm:flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                            >
                                <Settings className="w-4 h-4" />
                                Personalizează
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="w-full sm:flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                Acceptă toate
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Settings className="w-5 h-5 mr-2 text-gray-500" />
                                Preferințe Cookie-uri
                            </h3>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">Necesare</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.necessary}
                                        disabled
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Esențiale pentru funcționarea site-ului. Nu pot fi dezactivate.
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">Analiză</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.analytics}
                                        onChange={() => togglePreference('analytics')}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Ne ajută să înțelegem cum folosești site-ul pentru a-l îmbunătăți.
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">Marketing</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.marketing}
                                        onChange={() => togglePreference('marketing')}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Folosite pentru a-ți afișa reclame relevante intereselor tale.
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">Funcționale</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.functional}
                                        onChange={() => togglePreference('functional')}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Permit site-ului să țină minte alegerile tale (ex: limba).
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowDetails(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Înapoi
                            </button>
                            <button
                                onClick={handleSavePreferences}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                            >
                                Salvează Preferințele
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GDPRBanner;
