"use client";

import React from 'react';
import { ArrowLeft, Cookie, Clock, Shield, BarChart3, Target, Settings } from 'lucide-react';
import Link from 'next/link';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import App from '@/App';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { ChevronRight, Home } from 'lucide-react';

const CookiePolicyPage: React.FC = () => {
    const { siteConfig, getImageUrl } = useSite();

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
    const cookieTypes = [
        {
            type: 'Necessary',
            icon: Shield,
            color: 'green',
            description: 'These cookies are essential for the website to function.',
            examples: [
                { name: 'session_id', purpose: 'Maintains user session', duration: 'Session' },
                { name: 'language_pref', purpose: 'Saves language preference', duration: '1 year' },
                { name: 'csrf_token', purpose: 'Protection against CSRF attacks', duration: 'Session' }
            ],
            alwaysActive: true
        },
        {
            type: 'Analytics',
            icon: BarChart3,
            color: 'blue',
            description: 'Help us understand how you interact with the website.',
            examples: [
                { name: '_ga', purpose: 'Google Analytics - unique identification', duration: '2 years' },
                { name: '_gid', purpose: 'Google Analytics - session identification', duration: '24 hours' },
                { name: 'page_views', purpose: 'Number of pages visited', duration: '30 days' }
            ],
            alwaysActive: false
        },
        {
            type: 'Functional',
            icon: Settings,
            color: 'purple',
            description: 'Enable advanced features and personalization.',
            examples: [
                { name: 'theme_preference', purpose: 'Saves chosen theme (dark/light)', duration: '1 year' },
                { name: 'font_size', purpose: 'Preferred font size', duration: '6 months' },
                { name: 'sidebar_collapsed', purpose: 'Sidebar state', duration: 'Session' }
            ],
            alwaysActive: false
        },
        {
            type: 'Marketing',
            icon: Target,
            color: 'orange',
            description: 'Used for personalized ads and conversion tracking.',
            examples: [
                { name: '_fbp', purpose: 'Facebook Pixel - conversion tracking', duration: '90 days' },
                { name: 'ad_clicked', purpose: 'Ad click tracking', duration: '30 days' },
                { name: 'campaign_source', purpose: 'Marketing campaign source', duration: '7 days' }
            ],
            alwaysActive: false
        }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            green: 'bg-green-50 border-green-200 text-green-800',
            blue: 'bg-blue-50 border-blue-200 text-blue-800',
            purple: 'bg-purple-50 border-purple-200 text-purple-800',
            orange: 'bg-orange-50 border-orange-200 text-orange-800'
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

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
                                Cookie Policy
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
                                        Cookie Policy
                                    </h1>
                                </div>

                                <p className="text-gray-600 text-lg">
                                    Last updated: {new Date().toLocaleDateString('en-US')}
                                </p>
                            </div>

                            {/* Content */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">

                        {/* Introduction */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                What are cookies?
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Cookies are small text files that are placed on your device when you visit a website.
                                They are used to make websites work more efficiently and to provide information
                                to website owners.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                We use cookies to improve your experience on our website, for analytics, and to provide
                                personalized features.
                            </p>
                        </section>

                        {/* Cookie types */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                Types of cookies we use
                            </h2>

                            <div className="space-y-6">
                                {cookieTypes.map((cookieType, index) => {
                                    const IconComponent = cookieType.icon;
                                    const colorClasses = getColorClasses(cookieType.color);

                                    return (
                                        <div key={index} className={`border rounded-lg p-6 ${colorClasses}`}>
                                            <div className="flex items-center mb-4">
                                                <IconComponent className="w-6 h-6 mr-3" />
                                                <h3 className="text-xl font-semibold">
                                                    {cookieType.type} Cookies
                                                </h3>
                                                {cookieType.alwaysActive && (
                                                    <span className="ml-3 px-2 py-1 text-xs font-medium bg-white bg-opacity-50 rounded-full">
                                                        Always active
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mb-4 opacity-90">
                                                {cookieType.description}
                                            </p>

                                            <div>
                                                <h4 className="font-medium mb-3">Cookie examples:</h4>
                                                <div className="space-y-2">
                                                    {cookieType.examples.map((example, exampleIndex) => (
                                                        <div key={exampleIndex} className="bg-white bg-opacity-50 p-3 rounded">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <span className="font-mono text-sm font-medium">
                                                                        {example.name}
                                                                    </span>
                                                                    <p className="text-sm opacity-80 mt-1">
                                                                        {example.purpose}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center text-xs opacity-70">
                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                    {example.duration}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Managing cookies */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                How you can manage cookies
                            </h2>

                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-900 mb-2">
                                        Through the consent banner
                                    </h3>
                                    <p className="text-blue-800 text-sm">
                                        On your first visit, you'll see a banner that allows you to choose which types of cookies to accept.
                                    </p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-green-900 mb-2">
                                        Through cookie settings
                                    </h3>
                                    <p className="text-green-800 text-sm">
                                        You can modify your preferences anytime through{' '}
                                        <Link href="/en/cookie-settings" className="underline">
                                            cookie settings
                                        </Link>.
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">
                                        Through your browser
                                    </h3>
                                    <p className="text-gray-700 text-sm">
                                        Most browsers allow you to control cookies through their settings.
                                        You can delete existing cookies or block new ones.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Third-party cookies */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Third-party cookies
                            </h2>

                            <p className="text-gray-600 mb-4">
                                Our website may contain cookies from third parties for services such as:
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900 mb-2">Google Analytics</h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        For traffic analysis and user behavior insights.
                                    </p>
                                    <a
                                        href="https://policies.google.com/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 text-sm hover:underline"
                                    >
                                        Google Privacy Policy
                                    </a>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900 mb-2">Facebook Pixel</h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        For conversion tracking and personalized ads.
                                    </p>
                                    <a
                                        href="https://www.facebook.com/privacy/explanation"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 text-sm hover:underline"
                                    >
                                        Facebook Privacy Policy
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Impact of disabling */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Impact of disabling cookies
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                                    <div>
                                        <strong className="text-gray-900">Necessary cookies:</strong>
                                        <span className="text-gray-600 ml-2">
                                            The website will not function properly without these.
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                                    <div>
                                        <strong className="text-gray-900">Analytics cookies:</strong>
                                        <span className="text-gray-600 ml-2">
                                            We won't be able to analyze website usage for improvements.
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                                    <div>
                                        <strong className="text-gray-900">Functional cookies:</strong>
                                        <span className="text-gray-600 ml-2">
                                            Some personalized features will not be available.
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                                    <div>
                                        <strong className="text-gray-900">Marketing cookies:</strong>
                                        <span className="text-gray-600 ml-2">
                                            Ads will not be personalized to your preferences.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Useful links */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Useful Links
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <Link
                                    href="/en/cookie-settings"
                                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <h3 className="font-medium text-gray-900 mb-2">Cookie Settings</h3>
                                    <p className="text-gray-600 text-sm">
                                        Manage your cookie preferences
                                    </p>
                                </Link>

                                <Link
                                    href="/en/privacy-policy"
                                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <h3 className="font-medium text-gray-900 mb-2">Privacy Policy</h3>
                                    <p className="text-gray-600 text-sm">
                                        Complete information about data protection
                                    </p>
                                </Link>
                            </div>
                        </section>
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

export default CookiePolicyPage;
