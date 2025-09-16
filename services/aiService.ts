"use client";

// Backend AI service integration
import {
    canUseService,
    useService,
    getServiceUsageLeft,
    getServiceProvider,
    getDomainType
} from './plansService';

// Generare text cu retry logic - now using backend service
export const generateTextWithRetry = async (
    prompt: string,
    format: 'text' | 'json' = 'text',
    maxRetries: number = 3,
    toastId?: string
): Promise<string> => {
    // Verifică dacă serviciul poate fi folosit
    if (!canUseService('ai_text_generation')) {
        throw new Error('Service usage limit reached for text generation');
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
                action: 'generate_text',
                prompt,
                format,
                maxRetries
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to generate text');
        }

        // Incrementează contorul pentru serviciu
        useService('ai_text_generation');

        return result.text;

    } catch (error: any) {
        console.error('AI text generation error:', error);
        
        const errorMessage = error.message || "An unknown error occurred with the AI service.";
        
        // Verifică pentru mesaje specifice legate de siguranță
        if (error.toString().includes('SAFETY') || error.toString().includes('blocked')) {
            throw new Error("The request was blocked due to safety settings. Please modify your prompt.");
        }
        
        throw new Error(errorMessage);
    }
};

// Generare imagine cu Craiyon (gratuit) - unchanged as it uses free service
export const generateImage = async (prompt: string): Promise<string> => {
    // Verifică dacă serviciul poate fi folosit
    if (!canUseService('ai_image_generation')) {
        throw new Error('Service usage limit reached for image generation');
    }

    try {
        const { generateImage: imageGenerateImage } = await import('./imageGenerationService');

        const result = await imageGenerateImage(prompt);

        return result;
    } catch (error: any) {
        const errorMessage = error.message || "An unknown error occurred with the AI service.";

        // Verifică pentru mesaje specifice legate de siguranță
        if (error.toString().includes('SAFETY') || error.toString().includes('blocked')) {
            throw new Error("The request was blocked due to safety settings. Please modify your prompt.");
        }

        throw new Error(errorMessage);
    }
};

// Funcție simplă pentru generare text (pentru compatibilitate)
export const generateText = async (prompt: string, format: 'text' | 'json' = 'text'): Promise<string> => {
    return generateTextWithRetry(prompt, format);
};