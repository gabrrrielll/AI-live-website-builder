"use client";

import {
    canUseService,
    useService,
    getServiceUsageLeft,
    getServiceProvider,
    getServiceFallbackProvider,
    getDomainType
} from './plansService';

// Generare imagine cu Pollinations.ai (GRATUIT și client-side!)
export const generateImage = async (prompt: string): Promise<string> => {
    // Verifică dacă serviciul poate fi folosit
    if (!(await canUseService('ai_image_generation'))) {
        throw new Error('Service usage limit reached for image generation');
    }

    // Pollinations.ai - serviciu gratuit, fără API key necesar!
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&seed=${Date.now()}`;
    const generatedImage = await urlToBase64(imageUrl);

    // Incrementează contorul pentru serviciu
    await useService('ai_image_generation');
    return generatedImage;
};

// Funcții de compatibilitate pentru codul existent
export const canUseImageGen = async (): Promise<boolean> => {
    return await canUseService('ai_image_generation');
};

export const useImageGen = async (): Promise<void> => {
    await useService('ai_image_generation');
};

export const getImagesLeft = (): number => {
    return getServiceUsageLeft('ai_image_generation');
};

// Convertim URL-ul imaginii în base64
async function urlToBase64(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const responsePreview = (await response.text()).slice(0, 300);
            throw new Error(`Image provider returned HTTP ${response.status}. Body: ${responsePreview}`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.startsWith('image/')) {
            throw new Error(`Unexpected content type: ${contentType || 'unknown'}`);
        }

        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('❌ [Image Service] Failed to convert URL to base64:', error);
        const message = error instanceof Error ? error.message : 'Failed to convert image URL to base64';
        throw new Error(message);
    }
}