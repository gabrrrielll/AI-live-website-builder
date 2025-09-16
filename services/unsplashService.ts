"use client";

// Backend Unsplash service integration

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
        // Get API base URL from constants
        const { API_CONFIG } = await import('@/constants.js');
        const url = `${API_CONFIG.BASE_URL}/ai-service.php`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'search_images',
                query: query.trim(),
                per_page: 12
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to search images');
        }

        return result.photos || [];
    } catch (error: any) {
        console.error("Error fetching from Unsplash:", error);
        throw new Error(error.message || "An unknown error occurred.");
    }
};