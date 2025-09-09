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
                    <p className="mt-4 text-gray-600">Loading page...</p>
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
        if (key === 'necessary') return; // Necessary cookies cannot be disabled
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const handleSavePreferences = () => {
        localStorage.setItem('gdpr-consent', JSON.stringify(preferences));
        // Redirect back to main page
        window.location.href = '/';
    };

    const cookieTypes = [
        {
            key: 'necessary' as keyof CookiePreferences,
            title: 'Necessary Cookies',
            description: 'These cookies are essential for the website to function and cannot be disabled.',
            icon: Shield,
            examples: ['User sessions', 'Language preferences', 'Security'],
            alwaysActive: true
        },
        {
            key: 'analytics' as keyof CookiePreferences,
            title: 'Analytics Cookies',
            description: 'Help us understand how you interact with the website to improve it.',
            icon: BarChart3,
            examples: ['Google Analytics', 'Usage statistics', 'Error reporting']
        },
        {
            key: 'functional' as keyof CookiePreferences,
            title: 'Functional Cookies',
            description: 'Enable advanced features and personalization.',
            icon: Settings,
            examples: ['Display preferences', 'Custom settings', 'Interactive features']
        },
        {
            key: 'marketing' as keyof CookiePreferences,
            title: 'Marketing Cookies',
            description: 'Used to display relevant ads and measure campaign effectiveness.',
            icon: Target,
            examples: ['Personalized ads', 'Retargeting', 'Conversion tracking']
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
                                Home
                            </Link>
                            <ChevronRight size={16} />
                            <span className="text-gray-800 font-medium">
                                Cookie Settings
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
                                        Cookie Settings
                                    </h1>
                                </div>

                                <p className="text-gray-600 text-lg">
                                    Manage your cookie preferences. You can enable or disable different types of cookies.
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
                                                    Cookie examples:
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
                                                    {type.alwaysActive ? 'Always active' : (isActive ? 'Enabled' : 'Disabled')}
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
                                    Changes will be applied immediately. You can return to these settings anytime.
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
                                    Reject all
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
                                    Accept all
                                </button>

                                <button
                                    onClick={handleSavePreferences}
                                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                    Save preferences
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>
                            For more information, see{' '}
                            <Link href="/en/privacy-policy" className="text-blue-600 hover:underline">
                                Privacy Policy
                            </Link>
                            {' '}and{' '}
                            <Link href="/en/cookie-policy" className="text-blue-600 hover:underline">
                                Cookie Policy
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
