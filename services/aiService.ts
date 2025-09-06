"use client";

import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from '@/env';
import { APP_CONFIG } from '@/constants.js';

// Rate limiting pentru test mode
const REBUILD_LIMIT = APP_CONFIG.TEST_MODE.REBUILD_LIMIT;
const IMAGE_GEN_LIMIT = APP_CONFIG.TEST_MODE.IMAGE_GEN_LIMIT;

// Helper pentru localStorage
const getUsage = (key: string): number => {
    if (typeof window === 'undefined') return 0;
    try {
        const item = localStorage.getItem(key);
        return item ? parseInt(item, 10) : 0;
    } catch {
        return 0;
    }
};

const setUsage = (key: string, count: number) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, count.toString());
    } catch (error) {
        console.error("Could not save usage to localStorage", error);
    }
};

// Verifică dacă suntem în test mode
const isTestMode = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.location.href.includes('test');
};

// Verifică dacă poate folosi rebuild
export const canUseRebuild = (): boolean => {
    if (!isTestMode()) return true;
    const usage = getUsage('ai_rebuild_usage');
    return usage < REBUILD_LIMIT;
};

// Verifică dacă poate folosi image generation
export const canUseImageGen = (): boolean => {
    if (!isTestMode()) return true;
    const usage = getUsage('ai_image_gen_usage');
    return usage < IMAGE_GEN_LIMIT;
};

// Incrementează contorul rebuild
export const useRebuild = (): void => {
    if (isTestMode()) {
        const currentUsage = getUsage('ai_rebuild_usage');
        setUsage('ai_rebuild_usage', currentUsage + 1);
    }
};

// Incrementează contorul image generation
export const useImageGen = (): void => {
    if (isTestMode()) {
        const currentUsage = getUsage('ai_image_gen_usage');
        setUsage('ai_image_gen_usage', currentUsage + 1);
    }
};

// Obține numărul de utilizări rămase
export const getRebuildsLeft = (): number => {
    if (!isTestMode()) return Infinity;
    const usage = getUsage('ai_rebuild_usage');
    return Math.max(0, REBUILD_LIMIT - usage);
};

export const getImagesLeft = (): number => {
    if (!isTestMode()) return Infinity;
    const usage = getUsage('ai_image_gen_usage');
    return Math.max(0, IMAGE_GEN_LIMIT - usage);
};

// Generare text cu retry logic
export const generateTextWithRetry = async (
    prompt: string,
    format: 'text' | 'json' = 'text',
    maxRetries: number = 3,
    toastId?: string
): Promise<string> => {
    // Verifică limitările pentru test mode
    if (!canUseRebuild()) {
        throw new Error('Usage limit reached for test mode');
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            let finalPrompt = prompt;
            if (format === 'json') {
                finalPrompt = `${prompt}\n\nReturn only valid JSON.`;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: finalPrompt,
            });

            // Incrementează contorul pentru test mode
            useRebuild();

            return response.text;
        } catch (error: any) {
            const errorMessage = error.message || '';

            // Dacă este o eroare de overload și nu am epuizat retry-urile, așteaptă și încearcă din nou
            if ((errorMessage.includes('overloaded') || errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE')) && attempt < maxRetries) {
                const waitTime = attempt * 2000; // 2s, 4s, 6s
                console.log(`Gemini overloaded, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`);

                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }

            // Dacă nu este o eroare de overload sau am epuizat retry-urile, aruncă eroarea
            throw error;
        }
    }

    throw new Error('Max retries exceeded');
};

// Generare imagine
export const generateImage = async (prompt: string): Promise<string> => {
    // Verifică limitările pentru test mode
    if (!canUseImageGen()) {
        throw new Error('Usage limit reached for image generation in test mode');
    }

    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt
        });

        if (!response.generatedImages?.[0]?.image?.imageBytes) {
            throw new Error("AI did not return a valid image. The prompt may have been blocked for safety reasons.");
        }

        // Incrementează contorul pentru test mode
        useImageGen();

        return response.generatedImages[0].image.imageBytes;
    } catch (error: any) {
        console.error("Image generation failed:", error);
        const errorMessage = error.message || "An unknown error occurred with the AI service.";

        // Verifică pentru mesaje specifice legate de siguranță
        if (error.toString().includes('SAFETY')) {
            throw new Error("The request was blocked due to safety settings. Please modify your prompt.");
        }

        throw new Error(errorMessage);
    }
};

// Funcție simplă pentru generare text (pentru compatibilitate)
export const generateText = async (prompt: string, format: 'text' | 'json' = 'text'): Promise<string> => {
    return generateTextWithRetry(prompt, format);
};

