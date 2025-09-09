"use client";

import React, { useState, useEffect } from 'react';
import { X, Settings, Shield, Cookie } from 'lucide-react';
import Link from 'next/link';

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
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                        <div className="flex items-center mb-2">
                            <Cookie className="w-5 h-5 text-blue-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Respectăm confidențialitatea ta
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            Folosim cookie-uri pentru a îmbunătăți experiența ta pe site, pentru analiză și personalizare. 
                            Cookie-urile necesare sunt întotdeauna active, dar poți alege pentru celelalte.
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                            <Shield className="w-4 h-4 mr-1" />
                            <span>
                                Citește mai multe în{' '}
                                <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                                    Politica de Confidențialitate
                                </Link>
                                {' '}și{' '}
                                <Link href="/cookie-policy" className="text-blue-600 hover:underline">
                                    Politica Cookie-urilor
                                </Link>
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 ml-4">
                        <button
                            onClick={handleRejectAll}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Respinge toate
                        </button>
                        <button
                            onClick={handleCustomize}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                        >
                            <Settings className="w-4 h-4 mr-1" />
                            Personalizează
                        </button>
                        <button
                            onClick={handleAcceptAll}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            Acceptă toate
                        </button>
                    </div>
                    
                    <button
                        onClick={() => setIsVisible(false)}
                        className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GDPRBanner;
