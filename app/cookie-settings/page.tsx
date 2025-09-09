"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Cookie, Shield, BarChart3, Target, Settings } from 'lucide-react';
import Link from 'next/link';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import App from '@/App';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { ChevronRight, Home } from 'lucide-react';

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
}

const CookieSettingsPage: React.FC = () => {
    const { siteConfig, getImageUrl } = useSite();
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false
    });

    useEffect(() => {
        const consent = localStorage.getItem('gdpr-consent');
        if (consent) {
            const savedPreferences = JSON.parse(consent);
            setPreferences(savedPreferences);
        }
    }, []);

    if (!siteConfig) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c29a47]"></div>
                    <p className="mt-4 text-gray-600">Se încarcă pagina...</p>
                </div>
            </div>
        );
    }

    const headerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Header');

    const footerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Footer');

    const footerStyles = resolveBackgroundImage(footerSection?.styles, getImageUrl);

    const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
        if (key === 'necessary') return; // Cookie-urile necesare nu pot fi dezactivate
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const handleSavePreferences = () => {
        localStorage.setItem('gdpr-consent', JSON.stringify(preferences));
        // Redirecționează înapoi la pagina principală
        window.location.href = '/';
    };

    const cookieTypes = [
        {
            key: 'necessary' as keyof CookiePreferences,
            title: 'Cookie-uri Necesare',
            description: 'Aceste cookie-uri sunt esențiale pentru funcționarea site-ului și nu pot fi dezactivate.',
            icon: Shield,
            examples: ['Sesiuni de utilizator', 'Preferințe de limbă', 'Securitate'],
            alwaysActive: true
        },
        {
            key: 'analytics' as keyof CookiePreferences,
            title: 'Cookie-uri de Analiză',
            description: 'Ne ajută să înțelegem cum interacționezi cu site-ul pentru a-l îmbunătăți.',
            icon: BarChart3,
            examples: ['Google Analytics', 'Statistici de utilizare', 'Raportare de erori']
        },
        {
            key: 'functional' as keyof CookiePreferences,
            title: 'Cookie-uri Funcționale',
            description: 'Permit funcționalități avansate și personalizare.',
            icon: Settings,
            examples: ['Preferințe de afișare', 'Setări personalizate', 'Funcții interactive']
        },
        {
            key: 'marketing' as keyof CookiePreferences,
            title: 'Cookie-uri de Marketing',
            description: 'Folosite pentru a afișa reclame relevante și pentru măsurarea eficienței campaniilor.',
            icon: Target,
            examples: ['Reclame personalizate', 'Retargeting', 'Măsurarea conversiilor']
        }
    ];

    return (
        <App>
            <>
                {headerSection && <Header sectionId={headerSection.id} />}
                <main>
                    {/* Breadcrumb */}
                    <div className="container mx-auto px-6 py-4">
                        <nav className="flex items-center space-x-2 text-sm text-gray-600">
                            <Link href="/" className="flex items-center hover:text-[#c29a47] transition-colors">
                                <Home size={16} className="mr-1" />
                                Acasă
                            </Link>
                            <ChevronRight size={16} />
                            <span className="text-gray-800 font-medium">
                                Setări Cookie-uri
                            </span>
                        </nav>
                    </div>

                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <Cookie className="w-8 h-8 text-blue-600 mr-3" />
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Setări Cookie-uri
                                    </h1>
                                </div>

                                <p className="text-gray-600 text-lg">
                                    Gestionează preferințele tale pentru cookie-uri. Poți activa sau dezactiva diferite tipuri de cookie-uri.
                                </p>
                            </div>

                    {/* Cookie Types */}
                    <div className="space-y-6 mb-8">
                        {cookieTypes.map((type) => {
                            const IconComponent = type.icon;
                            const isActive = preferences[type.key];

                            return (
                                <div key={type.key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-3">
                                                <IconComponent className="w-6 h-6 text-blue-600 mr-3" />
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {type.title}
                                                </h3>
                                            </div>

                                            <p className="text-gray-600 mb-4">
                                                {type.description}
                                            </p>

                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Exemple de cookie-uri:
                                                </h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {type.examples.map((example, index) => (
                                                        <li key={index} className="flex items-center">
                                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                                                            {example}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="ml-6">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isActive}
                                                    onChange={(e) => handlePreferenceChange(type.key, e.target.checked)}
                                                    disabled={type.alwaysActive}
                                                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                                <span className="ml-2 text-sm font-medium text-gray-700">
                                                    {type.alwaysActive ? 'Întotdeauna activ' : (isActive ? 'Activat' : 'Dezactivat')}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <div className="text-sm text-gray-600">
                                <p>
                                    Modificările vor fi aplicate imediat. Poți reveni la aceste setări oricând.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        const onlyNecessary: CookiePreferences = {
                                            necessary: true,
                                            analytics: false,
                                            marketing: false,
                                            functional: false
                                        };
                                        setPreferences(onlyNecessary);
                                    }}
                                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Respinge toate
                                </button>

                                <button
                                    onClick={() => {
                                        const allAccepted: CookiePreferences = {
                                            necessary: true,
                                            analytics: true,
                                            marketing: true,
                                            functional: true
                                        };
                                        setPreferences(allAccepted);
                                    }}
                                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Acceptă toate
                                </button>

                                <button
                                    onClick={handleSavePreferences}
                                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                    Salvează preferințele
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>
                            Pentru mai multe informații, consultă{' '}
                            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                                Politica de Confidențialitate
                            </Link>
                            {' '}și{' '}
                            <Link href="/cookie-policy" className="text-blue-600 hover:underline">
                                Politica Cookie-urilor
                            </Link>
                        </p>
                    </div>
                        </div>
                    </div>
                </main>
                {footerSection && (
                    <div id={footerSection.id} style={footerStyles}>
                        <Footer sectionId={footerSection.id} />
                    </div>
                )}
            </>
        </App>
    );
};

export default CookieSettingsPage;
