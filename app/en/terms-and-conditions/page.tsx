"use client";

import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import App from '@/App';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { ChevronRight, Home, FileText } from 'lucide-react';
import Link from 'next/link';

export default function TermsAndConditionsPage() {
    const { siteConfig, getImageUrl } = useSite();

    if (!siteConfig) {
        return <div>Loading...</div>;
    }

    const headerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Header');

    const footerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Footer');

    const footerStyles = resolveBackgroundImage(footerSection?.styles, getImageUrl);

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
                                Terms & Conditions
                            </span>
                        </nav>
                    </div>

                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <FileText className="w-8 h-8 text-blue-600 mr-3" />
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Terms & Conditions
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
                                        Please read these terms and conditions carefully before using our service.
                                        By accessing or using our service, you agree to be bound by these terms.
                                    </p>
                                </section>

                                {/* Definitions */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Definitions
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-2">Service</h3>
                                            <p className="text-gray-600 text-sm">
                                                Refers to our web platform and all associated services offered through it.
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-2">User</h3>
                                            <p className="text-gray-600 text-sm">
                                                Any person who accesses or uses our service.
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-2">Content</h3>
                                            <p className="text-gray-600 text-sm">
                                                All information, data, texts, images, and other materials available through our service.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Acceptance of Terms */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Acceptance of Terms
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        By using our service, you confirm that:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                        <li>You have read and understood these terms and conditions</li>
                                        <li>You agree to comply with all provisions herein</li>
                                        <li>You have the legal capacity to enter into this agreement</li>
                                        <li>Use of the service is in accordance with applicable law</li>
                                    </ul>
                                </section>

                                {/* Use of Service */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Use of Service
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-2">Permitted Use</h3>
                                            <p className="text-gray-600 text-sm">
                                                Our service may only be used for lawful purposes and in accordance with these terms.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-2">Prohibited Use</h3>
                                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-4">
                                                <li>Violation of any applicable laws or regulations</li>
                                                <li>Transmission of illegal, harmful, or offensive content</li>
                                                <li>Attempting to compromise the security of the service</li>
                                                <li>Using the service for unauthorized commercial activities</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* Intellectual Property */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Intellectual Property
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        All intellectual property rights in our service and its content belong exclusively 
                                        to our company or our licensors.
                                    </p>
                                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                                        <p className="text-yellow-800 text-sm">
                                            <strong>Note:</strong> You do not have the right to reproduce, distribute, or modify 
                                            the content of our service without our written authorization.
                                        </p>
                                    </div>
                                </section>

                                {/* Limitation of Liability */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Limitation of Liability
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        Our service is provided "as is" and "as available". 
                                        We do not guarantee that the service will be uninterrupted or error-free.
                                    </p>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <p className="text-red-800 text-sm">
                                            <strong>Liability Exclusion:</strong> We are not liable for direct, indirect, 
                                            incidental, or consequential damages resulting from the use of our service.
                                        </p>
                                    </div>
                                </section>

                                {/* Changes */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Changes to Terms
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        We reserve the right to modify these terms and conditions at any time. 
                                        Changes will take effect immediately after the updated version is published on our website. 
                                        Continued use of the service after changes constitutes acceptance of the new terms.
                                    </p>
                                </section>

                                {/* Governing Law */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Governing Law
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        These terms and conditions are governed by and construed in accordance with 
                                        the laws of Romania. Any disputes will be resolved by the competent courts of Romania.
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
}
