"use client";

import { UNSPLASH_API_KEY } from '@/env';

export interface UnsplashPhoto {
    id: string;
    urls: {
        full: string;
        regular: string;
        small: string;
    };
    alt_description: string;
    description: string;
}

export const searchUnsplashPhotos = async (query: string): Promise<UnsplashPhoto[]> => {
    if (!query.trim()) {
        throw new Error("Search query is required.");
    }

    try {
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.errors ? `Unsplash error: ${data.errors.join(', ')}` : `Unsplash API error: ${response.status}`;
            console.error('Unsplash API error:', errorMessage);
            throw new Error(errorMessage);
        }

        return data.results || [];
    } catch (error: any) {
        console.error("Error fetching from Unsplash:", error);
        throw new Error(error.message || "An unknown error occurred.");
    }
};
