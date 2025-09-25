"use client";

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
            const savedPreferences = JSON.parse(consent);
            setPreferences(savedPreferences);
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

    const handleCustomize = () => {
        // Deschide pagina de setări cookies
        window.location.href = '/cookie-settings';
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 lg:pr-4">
                        <div className="flex items-center mb-2">
                            <Cookie className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mr-2 flex-shrink-0" />
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                Respectăm confidențialitatea ta
                            </h3>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                            Folosim cookie-uri pentru a îmbunătăți experiența ta pe site, pentru analiză și personalizare.
                            Cookie-urile necesare sunt întotdeauna active, dar poți alege pentru celelalte.
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 gap-1 sm:gap-0">
                            <div className="flex items-center">
                                <Shield className="w-3 sm:w-4 h-3 sm:h-4 mr-1 flex-shrink-0" />
                                <span className="whitespace-nowrap">Citește mai multe în</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                                <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                                    Politica de Confidențialitate
                                </Link>
                                <span className="hidden sm:inline"> și </span>
                                <Link href="/cookie-policy" className="text-blue-600 hover:underline">
                                    Politica Cookie-urilor
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:ml-4 lg:flex-shrink-0">
                        <button
                            onClick={handleRejectAll}
                            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Respinge toate
                        </button>
                        <button
                            onClick={handleCustomize}
                            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <Settings className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                            Personalizează
                        </button>
                        <button
                            onClick={handleAcceptAll}
                            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            Acceptă toate
                        </button>
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-3 right-3 lg:relative lg:top-auto lg:right-auto lg:ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 sm:w-5 h-4 sm:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GDPRBanner;
