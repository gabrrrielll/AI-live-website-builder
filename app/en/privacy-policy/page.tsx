"use client";

import React from 'react';
import { ArrowLeft, Shield, Eye, Database, Users, Lock } from 'lucide-react';
import Link from 'next/link';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import App from '@/App';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { ChevronRight, Home } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
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
                                Privacy Policy
                            </span>
                        </nav>
                    </div>

                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <Shield className="w-8 h-8 text-blue-600 mr-3" />
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Privacy Policy
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
                                Introduction
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                We respect your privacy and are committed to protecting your personal data.
                                This privacy policy explains how we collect, use, and protect your information
                                when you visit our website.
                            </p>
                        </section>

                        {/* Data collected */}
                        <section>
                            <div className="flex items-center mb-4">
                                <Database className="w-6 h-6 text-blue-600 mr-2" />
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    What data we collect
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                                        Automatically collected data:
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>IP address and browser information</li>
                                        <li>Pages visited and time spent on site</li>
                                        <li>Referrer (the site you came from)</li>
                                        <li>Device and browser information</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                                        Data you voluntarily provide:
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>Name and email address (when filling forms)</li>
                                        <li>Messages sent through contact forms</li>
                                        <li>Cookie preferences</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* How we use data */}
                        <section>
                            <div className="flex items-center mb-4">
                                <Eye className="w-6 h-6 text-blue-600 mr-2" />
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    How we use your data
                                </h2>
                            </div>

                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>To improve website functionality and user experience</li>
                                <li>To respond to your questions and requests</li>
                                <li>To analyze website usage and generate statistics</li>
                                <li>To comply with legal obligations</li>
                                <li>To prevent fraud and ensure security</li>
                            </ul>
                        </section>

                        {/* Cookies */}
                        <section>
                            <div className="flex items-center mb-4">
                                <Users className="w-6 h-6 text-blue-600 mr-2" />
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Cookies
                                </h2>
                            </div>

                            <p className="text-gray-600 mb-4">
                                We use cookies to improve your experience on our website.
                                You can manage your cookie preferences in{' '}
                                <Link href="/en/cookie-settings" className="text-blue-600 hover:underline">
                                    cookie settings
                                </Link>.
                            </p>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-800 mb-2">Types of cookies we use:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li><strong>Necessary cookies:</strong> For basic website functionality</li>
                                    <li><strong>Analytics cookies:</strong> To understand how you use the site</li>
                                    <li><strong>Functional cookies:</strong> For advanced features</li>
                                    <li><strong>Marketing cookies:</strong> For personalized ads</li>
                                </ul>
                            </div>
                        </section>

                        {/* Data security */}
                        <section>
                            <div className="flex items-center mb-4">
                                <Lock className="w-6 h-6 text-blue-600 mr-2" />
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Data Security
                                </h2>
                            </div>

                            <p className="text-gray-600 mb-4">
                                We implement technical and organizational security measures to protect
                                your data against unauthorized access, modification, disclosure, or destruction.
                            </p>

                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Data encryption in transit and at rest</li>
                                <li>Restricted access to personal data</li>
                                <li>Regular monitoring of security systems</li>
                                <li>Staff training on data protection</li>
                            </ul>
                        </section>

                        {/* Your rights */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Your GDPR Rights
                            </h2>

                            <p className="text-gray-600 mb-4">
                                Under GDPR, you have the following rights regarding your personal data:
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-900 mb-2">Right of Access</h3>
                                    <p className="text-blue-800 text-sm">
                                        You can request information about your personal data that we process.
                                    </p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-green-900 mb-2">Right of Rectification</h3>
                                    <p className="text-green-800 text-sm">
                                        You can request correction of inaccurate or incomplete data.
                                    </p>
                                </div>

                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-red-900 mb-2">Right of Erasure</h3>
                                    <p className="text-red-800 text-sm">
                                        You can request deletion of your data under certain circumstances.
                                    </p>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-yellow-900 mb-2">Right of Portability</h3>
                                    <p className="text-yellow-800 text-sm">
                                        You can request transfer of your data to another controller.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Contact */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Contact
                            </h2>

                            <p className="text-gray-600 mb-4">
                                For questions about this privacy policy or to exercise your GDPR rights,
                                you can contact us at:
                            </p>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700">
                                    <strong>Email:</strong> privacy@example.com<br />
                                    <strong>Phone:</strong> +40 XXX XXX XXX<br />
                                    <strong>Address:</strong> Example Street, No. 1, Bucharest, Romania
                                </p>
                            </div>
                        </section>

                        {/* Changes */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Policy Changes
                            </h2>

                            <p className="text-gray-600">
                                We reserve the right to update this privacy policy.
                                Any changes will be published on this page with the update date.
                                We encourage you to check this page periodically to stay informed about changes.
                            </p>
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

export default PrivacyPolicyPage;
