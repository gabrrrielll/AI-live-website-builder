"use client";

// Unsplash backend endpoint was removed; use a stable image fallback provider
// so AI flows can continue without 404/CORS errors.

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

    const normalizedQuery = encodeURIComponent(query.trim().toLowerCase());

    // Build deterministic image candidates so repeated queries stay coherent.
    return Array.from({ length: 12 }, (_, index) => {
        const seed = `${normalizedQuery}-${index + 1}`;
        const full = `https://picsum.photos/seed/${seed}/1600/900`;
        const regular = `https://picsum.photos/seed/${seed}/1200/675`;
        const small = `https://picsum.photos/seed/${seed}/640/360`;

        return {
            id: `fallback-${seed}`,
            urls: {
                full,
                regular,
                small,
            },
            alt_description: query.trim(),
            description: `Image result for ${query.trim()}`,
        };
    });
};