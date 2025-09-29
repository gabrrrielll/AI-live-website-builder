import React from 'react';
import { SEO } from '../../components/SEO';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { FileText, AlertTriangle, Scale, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const EnglishTermsAndConditionsPage: React.FC = () => {
    const { siteConfig, getImageUrl } = useSite();

    if (!siteConfig) {
        return (
            <>
                <SEO
                    title="Terms and Conditions"
                    description="Terms and conditions of use for our services"
                    url="/en/terms-and-conditions"
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
                title="Terms and Conditions"
                description="Terms and conditions of use for our services"
                url="/en/terms-and-conditions"
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
                                <span className="text-gray-800 font-medium">Terms and Conditions</span>
                            </nav>
                        </div>

                        <div className="container mx-auto px-6 py-12">
                            {/* Header */}
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c29a47] bg-opacity-10 rounded-full mb-6">
                                    <FileText className="w-8 h-8 text-[#c29a47]" />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    Terms and Conditions
                                </h1>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Terms and conditions for using our website building services.
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
                                        <Users className="w-6 h-6 text-[#c29a47] mr-3" />
                                        1. Acceptance of Terms
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        By accessing and using our services, you agree to be bound by and comply with these
                                        Terms and Conditions. If you do not agree with any of the terms, please do not use our services.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        These terms apply to all visitors, users and other persons who access or use the service.
                                    </p>
                                </div>

                                {/* Service Description */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        2. Service Description
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Our services include:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                                        <li>Interactive website builder with real-time editing</li>
                                        <li>AI features for content generation</li>
                                        <li>Design and customization tools</li>
                                        <li>Blog article management and editing</li>
                                        <li>Technical support and documentation</li>
                                    </ul>
                                </div>

                                {/* User Responsibilities */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <AlertTriangle className="w-6 h-6 text-[#c29a47] mr-3" />
                                        3. User Responsibilities
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Responsible Use</h3>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                <li>Do not use the service for illegal or unauthorized activities</li>
                                                <li>Do not attempt to access other users' accounts or systems</li>
                                                <li>Do not distribute malware, viruses or harmful code</li>
                                                <li>Respect intellectual property rights</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Created Content</h3>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                <li>You are responsible for the content you create</li>
                                                <li>Do not create offensive, discriminatory or illegal content</li>
                                                <li>Respect other people's copyrights</li>
                                                <li>Do not upload images or content protected by copyright</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Intellectual Property */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <Scale className="w-6 h-6 text-[#c29a47] mr-3" />
                                        4. Intellectual Property
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-gray-700 leading-relaxed">
                                            Our service and its original content, features and functionality are and will remain
                                            our property and that of our licensors.
                                        </p>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Your Content</h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                We retain all rights to the content you create using our services.
                                                We do not claim ownership of your original content.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">License to Use</h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                We grant you a limited, non-exclusive, non-transferable license to use
                                                our service in accordance with these terms.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Limitation of Liability */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        5. Limitation of Liability
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Our service is provided "as is" and "as available". We do not guarantee that
                                        the service will be uninterrupted, secure or error-free.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        In no event shall we be liable for any direct, indirect, incidental, special,
                                        consequential or punitive damages resulting from the use of our service.
                                    </p>
                                </div>

                                {/* Changes to Terms */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        6. Changes to Terms
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        We reserve the right to modify or replace these Terms and Conditions at any time.
                                        Changes will take effect immediately upon posting on this page.
                                        Continued use of the service after changes constitutes acceptance of the new terms.
                                    </p>
                                </div>

                                {/* Contact */}
                                <div className="bg-gradient-to-r from-[#c29a47] to-[#a67c00] rounded-lg p-8 text-white">
                                    <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                                    <p className="mb-6">
                                        For questions about these terms and conditions, you can contact us at:
                                    </p>
                                    <div className="space-y-2">
                                        <p><strong>Email:</strong> legal@yourdomain.com</p>
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

export default EnglishTermsAndConditionsPage;


