import React from 'react';
import { SEO } from '../../components/SEO';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { Cookie, Settings, Shield, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const EnglishCookiePolicyPage: React.FC = () => {
    const { siteConfig, getImageUrl } = useSite();

    if (!siteConfig) {
        return (
            <>
                <SEO
                    title="Cookie Policy"
                    description="Information about cookies used on our website"
                    url="/en/cookie-policy"
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
                title="Cookie Policy"
                description="Information about cookies used on our website"
                url="/en/cookie-policy"
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
                                <span className="text-gray-800 font-medium">Cookie Policy</span>
                            </nav>
                        </div>

                        <div className="container mx-auto px-6 py-12">
                            {/* Header */}
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c29a47] bg-opacity-10 rounded-full mb-6">
                                    <Cookie className="w-8 h-8 text-[#c29a47]" />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    Cookie Policy
                                </h1>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Information about the cookies we use and how you can manage them.
                                </p>
                                <div className="mt-6 text-sm text-gray-500">
                                    Last updated: {new Date().toLocaleDateString('en-US')}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="max-w-4xl mx-auto">
                                {/* What are cookies */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <Info className="w-6 h-6 text-[#c29a47] mr-3" />
                                        What are cookies?
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Cookies are small text files that are stored on your device when you visit a website.
                                        They allow the site to remember your actions and preferences over a period of time.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        Cookies help us provide you with a better and more personalized experience
                                        when using our services.
                                    </p>
                                </div>

                                {/* Types of cookies */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Types of cookies we use
                                    </h2>
                                    <div className="space-y-6">
                                        <div className="border-l-4 border-[#c29a47] pl-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Essential cookies</h3>
                                            <p className="text-gray-700 leading-relaxed mb-2">
                                                These are necessary for the basic functioning of the website and cannot be disabled.
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                                <li>Session cookies for navigation</li>
                                                <li>Security cookies</li>
                                                <li>Language preference cookies</li>
                                                <li>Form management cookies</li>
                                            </ul>
                                        </div>
                                        <div className="border-l-4 border-blue-500 pl-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Performance cookies</h3>
                                            <p className="text-gray-700 leading-relaxed mb-2">
                                                These help us understand how you interact with our website.
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                                <li>Analytics and statistics cookies</li>
                                                <li>Performance monitoring cookies</li>
                                                <li>Loading optimization cookies</li>
                                            </ul>
                                        </div>
                                        <div className="border-l-4 border-green-500 pl-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Functional cookies</h3>
                                            <p className="text-gray-700 leading-relaxed mb-2">
                                                These enhance the functionality of the website and user experience.
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                                <li>User preference cookies</li>
                                                <li>Interface customization cookies</li>
                                                <li>Editor settings cookies</li>
                                            </ul>
                                        </div>
                                        <div className="border-l-4 border-purple-500 pl-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Marketing cookies</h3>
                                            <p className="text-gray-700 leading-relaxed mb-2">
                                                These are used to show you relevant and personalized content.
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                                <li>Targeted advertising cookies</li>
                                                <li>Social media cookies</li>
                                                <li>Conversion tracking cookies</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Cookie management */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <Settings className="w-6 h-6 text-[#c29a47] mr-3" />
                                        Cookie management
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-gray-700 leading-relaxed">
                                            You can control and manage cookies in several ways:
                                        </p>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Browser settings</h3>
                                            <p className="text-gray-700 leading-relaxed mb-2">
                                                Most browsers allow you to:
                                            </p>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                <li>See what cookies you have and delete them individually</li>
                                                <li>Block cookies from certain websites</li>
                                                <li>Block third-party cookies</li>
                                                <li>Block all cookies</li>
                                                <li>Delete all cookies when you close the browser</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Our settings</h3>
                                            <p className="text-gray-700 leading-relaxed mb-2">
                                                You can manage cookie preferences using:
                                            </p>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <Link
                                                    to="/en/cookie-settings"
                                                    className="inline-flex items-center px-4 py-2 bg-[#c29a47] text-white rounded-lg hover:bg-[#a67c00] transition-colors"
                                                >
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Manage cookies
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Third party cookies */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Third-party cookies
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Our website may contain cookies from third-party services for:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics and statistics</h3>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                                                <li>Google Analytics</li>
                                                <li>Hotjar</li>
                                                <li>Facebook Pixel</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">External services</h3>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                                                <li>Google Fonts</li>
                                                <li>CDNs for resources</li>
                                                <li>Mapping services</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Privacy and security */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <Shield className="w-6 h-6 text-[#c29a47] mr-3" />
                                        Privacy and security
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        We are committed to protecting your privacy and using cookies
                                        responsibly and transparently.
                                    </p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                                        <li>Our cookies do not contain personally identifiable information</li>
                                        <li>We do not sell or share information collected through cookies</li>
                                        <li>We implement security measures to protect data</li>
                                        <li>We comply with GDPR and applicable legislation</li>
                                    </ul>
                                </div>

                                {/* Contact */}
                                <div className="bg-gradient-to-r from-[#c29a47] to-[#a67c00] rounded-lg p-8 text-white">
                                    <h2 className="text-2xl font-semibold mb-4">Questions about cookies?</h2>
                                    <p className="mb-6">
                                        If you have questions about our cookie policy, you can contact us at:
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

export default EnglishCookiePolicyPage;


