import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const { siteConfig, getImageUrl } = useSite();

    if (!siteConfig) {
        return (
            <PageWrapper
                title="Page Not Found - 404"
                description="The page you are looking for could not be found"
                url="/404"
            >
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c29a47]"></div>
                        <p className="mt-4 text-gray-600">Loading page...</p>
                    </div>
                </div>
            </PageWrapper>
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
        <PageWrapper
            title="Page Not Found - 404"
            description="The page you are looking for could not be found"
            url="/404"
        >
            <App>
                <>
                    {headerSection && <Header sectionId={headerSection.id} />}
                    <main className="bg-gray-50 min-h-screen flex items-center justify-center">
                        <div className="container mx-auto px-6 py-12">
                            <div className="max-w-2xl mx-auto text-center">
                                {/* 404 Icon */}
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-8">
                                    <AlertCircle className="w-12 h-12 text-red-600" />
                                </div>

                                {/* Error Code */}
                                <div className="text-8xl font-bold text-gray-300 mb-4">404</div>

                                {/* Error Message */}
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    Page Not Found
                                </h1>

                                <p className="text-xl text-gray-600 mb-8">
                                    Sorry, the page you are looking for doesn't exist or has been moved.
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                                    <Link
                                        to="/"
                                        className="inline-flex items-center px-6 py-3 bg-[#c29a47] text-white rounded-lg hover:bg-[#a67c00] transition-colors"
                                    >
                                        <Home className="w-5 h-5 mr-2" />
                                        Go Home
                                    </Link>
                                    <button
                                        onClick={() => window.history.back()}
                                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Go Back
                                    </button>
                                </div>

                                {/* Popular Pages */}
                                <div className="bg-white rounded-lg shadow-sm p-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center justify-center">
                                        <Search className="w-6 h-6 text-[#c29a47] mr-2" />
                                        Popular Pages
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Link
                                            to="/"
                                            className="p-4 border border-gray-200 rounded-lg hover:border-[#c29a47] hover:bg-[#c29a47] hover:bg-opacity-5 transition-colors"
                                        >
                                            <h3 className="font-medium text-gray-900 mb-1">Home</h3>
                                            <p className="text-sm text-gray-600">Return to the homepage</p>
                                        </Link>
                                        <Link
                                            to="/blog"
                                            className="p-4 border border-gray-200 rounded-lg hover:border-[#c29a47] hover:bg-[#c29a47] hover:bg-opacity-5 transition-colors"
                                        >
                                            <h3 className="font-medium text-gray-900 mb-1">Blog</h3>
                                            <p className="text-sm text-gray-600">Read our latest articles</p>
                                        </Link>
                                        <Link
                                            to="/privacy-policy"
                                            className="p-4 border border-gray-200 rounded-lg hover:border-[#c29a47] hover:bg-[#c29a47] hover:bg-opacity-5 transition-colors"
                                        >
                                            <h3 className="font-medium text-gray-900 mb-1">Privacy Policy</h3>
                                            <p className="text-sm text-gray-600">Learn about data protection</p>
                                        </Link>
                                        <Link
                                            to="/terms-and-conditions"
                                            className="p-4 border border-gray-200 rounded-lg hover:border-[#c29a47] hover:bg-[#c29a47] hover:bg-opacity-5 transition-colors"
                                        >
                                            <h3 className="font-medium text-gray-900 mb-1">Terms & Conditions</h3>
                                            <p className="text-sm text-gray-600">Service terms and usage</p>
                                        </Link>
                                    </div>
                                </div>

                                {/* Help Text */}
                                <div className="mt-8 text-center">
                                    <p className="text-gray-500 mb-2">
                                        Still can't find what you're looking for?
                                    </p>
                                    <p className="text-gray-500">
                                        Try using the search function or{' '}
                                        <a
                                            href="mailto:support@yourdomain.com"
                                            className="text-[#c29a47] hover:text-[#a67c00] transition-colors"
                                        >
                                            contact our support team
                                        </a>
                                    </p>
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
        </PageWrapper>
    );
};

export default NotFoundPage;