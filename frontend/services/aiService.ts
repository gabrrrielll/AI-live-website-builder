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
    toastId?: string
): Promise<string> => {
    // Verifică dacă serviciul poate fi folosit
    if (!(await canUseService('ai_text_generation'))) {
        throw new Error('Service usage limit reached for text generation');
    }

    try {
        // For development - check if backend is available
        const { API_CONFIG } = await import('@/constants.js');
        const url = `${API_CONFIG.BASE_URL}/ai-service.php`;

        // Call the backend directly
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'generate_text',
                prompt,
                format
            })
        });

        if (!response.ok) {
            const responseText = await response.text();
            console.error('AI Service Error Response:', responseText);
            try {
                const errorData = JSON.parse(responseText);
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            } catch (parseError) {
                throw new Error(`HTTP ${response.status}: ${response.statusText} - Response: ${responseText.substring(0, 200)}`);
            }
        }

        const responseText = await response.text();
        console.log('AI Service Response:', responseText.substring(0, 500));
        const result = JSON.parse(responseText);

        if (!result.success) {
            throw new Error(result.message || 'Failed to generate text');
        }

        // Incrementează contorul pentru serviciu
        await useService('ai_text_generation');

        // Always return parsed object for consistency
        if (format === 'json') {
            try {
                return JSON.parse(result.text);
            } catch (parseError) {
                console.error('Failed to parse AI response as JSON:', parseError);
                throw new Error('Invalid JSON response from AI service');
            }
        }

        return result.text;

    } catch (error: any) {
        console.error('AI text generation error:', error);

        const errorMessage = error.message || "An unknown error occurred with the AI service.";

        // Verifică pentru mesaje specifice legate de siguranță
        if (error.toString().includes('SAFETY') || error.toString().includes('blocked')) {
            throw new Error("The request was blocked due to safety settings. Please modify your prompt.");
        }

        // Verifică pentru erori de server (503, 502, 504)
        if (errorMessage.includes('HTTP 503') || errorMessage.includes('HTTP 502') || errorMessage.includes('HTTP 504')) {
            throw new Error("AI service is temporarily unavailable. Please try again in a few moments.");
        }

        // Verifică pentru timeout
        if (errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT')) {
            throw new Error("Request timed out. The AI service is taking longer than expected. Please try again.");
        }

        throw new Error(errorMessage);
    }
};

// Generare imagine cu Craiyon (gratuit) - unchanged as it uses free service
export const generateImage = async (prompt: string): Promise<string> => {
    // Verifică dacă serviciul poate fi folosit
    if (!(await canUseService('ai_image_generation'))) {
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