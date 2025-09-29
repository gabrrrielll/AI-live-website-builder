import React from 'react';
import { SEO } from '../../components/SEO';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { ArrowLeft, Shield, Eye, Database, Users, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const EnglishPrivacyPolicyPage: React.FC = () => {
    const { siteConfig, getImageUrl } = useSite();

    if (!siteConfig) {
        return (
            <>
                <SEO
                    title="Privacy Policy"
                    description="Privacy policy and personal data protection"
                    url="/en/privacy-policy"
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
                title="Privacy Policy"
                description="Privacy policy and personal data protection"
                url="/en/privacy-policy"
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
                                <span className="text-gray-800 font-medium">Privacy Policy</span>
                            </nav>
                        </div>

                        <div className="container mx-auto px-6 py-12">
                            {/* Header */}
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c29a47] bg-opacity-10 rounded-full mb-6">
                                    <Shield className="w-8 h-8 text-[#c29a47]" />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    Privacy Policy
                                </h1>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    We protect your personal data and explain how we use it in accordance with GDPR.
                                </p>
                                <div className="mt-6 text-sm text-gray-500">
                                    Last updated: {new Date().toLocaleDateString('en-US')}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="max-w-4xl mx-auto">
                                {/* Introduction */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <Eye className="w-6 h-6 text-[#c29a47] mr-3" />
                                        Introduction
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        This Privacy Policy describes how we collect, use, protect and disclose your information
                                        when you use our services.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        We respect your privacy rights and are committed to protecting your personal data
                                        in accordance with the General Data Protection Regulation (GDPR).
                                    </p>
                                </div>

                                {/* Data Collection */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <Database className="w-6 h-6 text-[#c29a47] mr-3" />
                                        Data We Collect
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Identifying Information</h3>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                <li>First and last name</li>
                                                <li>Email address</li>
                                                <li>Phone number (optional)</li>
                                                <li>IP address</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Data</h3>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                <li>Device and browser information</li>
                                                <li>Site activities (pages visited, time spent)</li>
                                                <li>Preferences and settings</li>
                                                <li>Created and edited content</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Usage */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <Users className="w-6 h-6 text-[#c29a47] mr-3" />
                                        How We Use Your Data
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Essential Services</h3>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                <li>Providing our services</li>
                                                <li>Personalizing user experience</li>
                                                <li>Technical support and communication</li>
                                                <li>Service improvements</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Communication</h3>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                <li>Answering questions</li>
                                                <li>Important notifications</li>
                                                <li>Service updates</li>
                                                <li>Newsletter (only with consent)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Protection */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <Lock className="w-6 h-6 text-[#c29a47] mr-3" />
                                        Data Protection
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-gray-700 leading-relaxed">
                                            We implement technical and organizational security measures to protect your data
                                            against unauthorized access, alteration, disclosure or destruction.
                                        </p>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>SSL/TLS encryption for all transmissions</li>
                                            <li>Restricted access to data</li>
                                            <li>Continuous security monitoring</li>
                                            <li>Regular and secure backups</li>
                                            <li>Regular staff training</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Your Rights */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Your Rights
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Access and Portability</h3>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                <li>Right to access your data</li>
                                                <li>Right to receive a copy of data</li>
                                                <li>Right to data portability</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Control and Deletion</h3>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                <li>Right to rectification</li>
                                                <li>Right to erasure ("right to be forgotten")</li>
                                                <li>Right to restriction</li>
                                                <li>Right to object</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="bg-gradient-to-r from-[#c29a47] to-[#a67c00] rounded-lg p-8 text-white">
                                    <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                                    <p className="mb-6">
                                        For questions about this privacy policy or to exercise your rights, you can contact us at:
                                    </p>
                                    <div className="space-y-2">
                                        <p><strong>Email:</strong> privacy@yourdomain.com</p>
                                        <p><strong>Phone:</strong> +40 XXX XXX XXX</p>
                                        <p><strong>Address:</strong> Example Street, No. 1, Bucharest, Romania</p>
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

export default EnglishPrivacyPolicyPage;


