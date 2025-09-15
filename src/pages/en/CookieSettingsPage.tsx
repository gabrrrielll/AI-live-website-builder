import React, { useState, useEffect } from 'react';
import { SEO } from '../../components/SEO';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { Settings, Save, RotateCcw, Shield, BarChart3, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    functional: boolean;
    marketing: boolean;
}

const EnglishCookieSettingsPage: React.FC = () => {
    const { siteConfig, getImageUrl } = useSite();
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Always true, cannot be disabled
        analytics: false,
        functional: false,
        marketing: false,
    });
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Load saved preferences from localStorage
        const saved = localStorage.getItem('cookie-preferences');
        if (saved) {
            const parsed = JSON.parse(saved);
            setPreferences(parsed);
        }
    }, []);

    const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
        if (key === 'necessary') return; // Cannot disable necessary cookies

        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
        setHasChanges(false);

        // Apply preferences (you would implement actual cookie management here)
        console.log('Cookie preferences saved:', preferences);

        // Show success message
        alert('Cookie preferences have been saved successfully!');
    };

    const handleReset = () => {
        const defaultPreferences = {
            necessary: true,
            analytics: false,
            functional: false,
            marketing: false,
        };
        setPreferences(defaultPreferences);
        setHasChanges(true);
    };

    const handleAcceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            functional: true,
            marketing: true,
        };
        setPreferences(allAccepted);
        setHasChanges(true);
    };

    const handleRejectAll = () => {
        const allRejected = {
            necessary: true,
            analytics: false,
            functional: false,
            marketing: false,
        };
        setPreferences(allRejected);
        setHasChanges(true);
    };

    if (!siteConfig) {
        return (
            <>
                <SEO
                    title="Cookie Settings"
                    description="Manage cookie preferences for the website"
                    url="/en/cookie-settings"
                />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c29a47]"></div>
                        <p className="mt-4 text-gray-600">Loading page...</p>
                    </div>
                </div>
            </>
        );
    }

    const headerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Header');

    const footerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Footer');

    const footerStyles = resolveBackgroundImage(footerSection?.styles, getImageUrl);

    return (
        <>
            <SEO
                title="Cookie Settings"
                description="Manage cookie preferences for the website"
                url="/en/cookie-settings"
            />

            <App>
                <>
                    {headerSection && <Header sectionId={headerSection.id} />}
                    <main className="bg-gray-50 min-h-screen">
                        {/* Breadcrumb */}
                        <div className="container mx-auto px-6 py-4">
                            <nav className="flex items-center space-x-2 text-sm text-gray-600">
                                <Link to="/" className="flex items-center hover:text-[#c29a47] transition-colors">
                                    <Home size={16} className="mr-1" />
                                    Home
                                </Link>
                                <ChevronRight size={16} />
                                <span className="text-gray-800 font-medium">Cookie Settings</span>
                            </nav>
                        </div>

                        <div className="container mx-auto px-6 py-12">
                            {/* Header */}
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c29a47] bg-opacity-10 rounded-full mb-6">
                                    <Settings className="w-8 h-8 text-[#c29a47]" />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    Cookie Settings
                                </h1>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Manage your preferences for cookies used on our website.
                                </p>
                            </div>

                            {/* Content */}
                            <div className="max-w-4xl mx-auto">
                                {/* Quick Actions */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <button
                                            onClick={handleAcceptAll}
                                            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Shield className="w-5 h-5 mr-2" />
                                            Accept All
                                        </button>
                                        <button
                                            onClick={handleRejectAll}
                                            className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <Shield className="w-5 h-5 mr-2" />
                                            Reject All
                                        </button>
                                    </div>
                                </div>

                                {/* Cookie Categories */}
                                <div className="space-y-6 mb-8">
                                    {/* Necessary Cookies */}
                                    <div className="bg-white rounded-lg shadow-sm p-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <Shield className="w-6 h-6 text-[#c29a47] mr-3" />
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">Essential cookies</h3>
                                                    <p className="text-gray-600">Necessary for basic website functionality</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-500 mr-3">Always active</span>
                                                <div className="w-12 h-6 bg-[#c29a47] rounded-full flex items-center justify-end px-1">
                                                    <div className="w-4 h-4 bg-white rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            These cookies are necessary for the basic functioning of the website.
                                            They cannot be disabled and include session, security and language preference cookies.
                                        </p>
                                    </div>

                                    {/* Analytics Cookies */}
                                    <div className="bg-white rounded-lg shadow-sm p-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <BarChart3 className="w-6 h-6 text-blue-500 mr-3" />
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">Analytics cookies</h3>
                                                    <p className="text-gray-600">Help us understand how you use the site</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={preferences.analytics}
                                                    onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            These cookies allow us to collect information about how you use our website,
                                            such as the pages you visit and time spent on the site.
                                            The information is anonymized and used to improve the website.
                                        </p>
                                    </div>

                                    {/* Functional Cookies */}
                                    <div className="bg-white rounded-lg shadow-sm p-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <Zap className="w-6 h-6 text-green-500 mr-3" />
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">Functional cookies</h3>
                                                    <p className="text-gray-600">Enhance website functionality</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={preferences.functional}
                                                    onChange={(e) => handlePreferenceChange('functional', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            These cookies allow the website to remember choices you make
                                            (such as username, language or region) and provide enhanced,
                                            more personalized features.
                                        </p>
                                    </div>

                                    {/* Marketing Cookies */}
                                    <div className="bg-white rounded-lg shadow-sm p-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <Target className="w-6 h-6 text-purple-500 mr-3" />
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">Marketing cookies</h3>
                                                    <p className="text-gray-600">For personalized advertising</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={preferences.marketing}
                                                    onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                            </label>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            These cookies are used to show you advertisements that are more relevant
                                            to you and your interests.
                                            They may also be used to limit the number of times you see an ad.
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="bg-white rounded-lg shadow-sm p-8">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={handleSave}
                                                disabled={!hasChanges}
                                                className={`flex items-center px-6 py-3 rounded-lg transition-colors ${hasChanges
                                                    ? 'bg-[#c29a47] text-white hover:bg-[#a67c00]'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Save className="w-5 h-5 mr-2" />
                                                Save preferences
                                            </button>
                                            <button
                                                onClick={handleReset}
                                                className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <RotateCcw className="w-5 h-5 mr-2" />
                                                Reset
                                            </button>
                                        </div>
                                        <Link
                                            to="/en/cookie-policy"
                                            className="text-[#c29a47] hover:text-[#a67c00] transition-colors"
                                        >
                                            Read the complete cookie policy
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    {footerSection && (
                        <div style={footerStyles}>
                            <Footer sectionId={footerSection.id} />
                        </div>
                    )}
                </>
            </App>
        </>
    );
};

export default EnglishCookieSettingsPage;


