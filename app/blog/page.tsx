"use client";

import { useEffect, useState } from 'react';
import BlogListingClient from '@/components/sections/BlogListingClient';
import type { SiteConfig } from '@/types';

export default function BlogPage() {
    const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load site config from localStorage or API
        const loadConfig = async () => {
            try {
                // Try localStorage first
                const localConfig = localStorage.getItem('site-config');
                if (localConfig) {
                    const config = JSON.parse(localConfig);
                    setSiteConfig(config);
                } else {
                    // Fallback to API
                    const response = await fetch('https://bibic.ro/api/api-site-config.php');
                    if (response.ok) {
                        const config = await response.json();
                        setSiteConfig(config);
                    }
                }
            } catch (error) {
                console.error('Error loading site config:', error);
            } finally {
                setLoading(false);
            }
        };

        loadConfig();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c29a47]"></div>
                    <p className="mt-4 text-gray-600">Se încarcă blog-ul...</p>
                </div>
            </div>
        );
    }

    if (!siteConfig) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Eroare la încărcare</h1>
                    <p className="text-gray-600">Nu s-a putut încărca configurația site-ului.</p>
                </div>
            </div>
        );
    }

    return <BlogListingClient siteConfig={siteConfig} />;
}
