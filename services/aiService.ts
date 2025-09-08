"use client";

import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from '@/env';
import {
    canUseService,
    useService,
    getServiceUsageLeft,
    getServiceProvider,
    getDomainType
} from './plansService';

// Generare text cu retry logic
export const generateTextWithRetry = async (
    prompt: string,
    format: 'text' | 'json' = 'text',
    maxRetries: number = 3,
    toastId?: string
): Promise<string> => {
    console.log('📝 [AI Service] Starting text generation...');
    console.log('📝 [AI Service] Prompt:', prompt.substring(0, 100) + '...');
    console.log('📝 [AI Service] Domain type:', getDomainType());
    console.log('📝 [AI Service] Can use service:', canUseService('ai_text_generation'));

    // Verifică dacă serviciul poate fi folosit
    if (!canUseService('ai_text_generation')) {
        console.log('❌ [AI Service] Service usage limit reached');
        throw new Error('Service usage limit reached for text generation');
    }

    // Use real AI for all domains
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            let finalPrompt = prompt;
            if (format === 'json') {
                finalPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. Do not include any text before or after the JSON. Do not use markdown formatting like \`\`\`json\`. The response must start with { and end with }.`;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: finalPrompt,
            });

            let responseText = response.text.trim();

            // Clean up the response if it contains markdown formatting
            if (format === 'json') {
                // Remove markdown code blocks
                responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
                // Remove any leading/trailing whitespace
                responseText = responseText.trim();

                // Validate that it starts and ends with braces
                if (!responseText.startsWith('{') || !responseText.endsWith('}')) {
                    throw new Error(`Invalid JSON format: ${responseText.substring(0, 100)}...`);
                }

                // Try to parse to validate JSON
                try {
                    JSON.parse(responseText);
                } catch (parseError) {
                    throw new Error(`Invalid JSON: ${parseError.message}`);
                }
            }

            // Incrementează contorul pentru serviciu
            useService('ai_text_generation');
            console.log('✅ [AI Service] Text generation successful!');

            return responseText;
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

// Generare imagine cu Craiyon (gratuit)
export const generateImage = async (prompt: string): Promise<string> => {
    console.log('🖼️ [AI Service] Starting image generation...');
    console.log('🖼️ [AI Service] Prompt:', prompt);
    console.log('🖼️ [AI Service] Domain type:', getDomainType());
    console.log('🖼️ [AI Service] Can use service:', canUseService('ai_image_generation'));

    // Verifică dacă serviciul poate fi folosit
    if (!canUseService('ai_image_generation')) {
        console.log('❌ [AI Service] Service usage limit reached');
        throw new Error('Service usage limit reached for image generation');
    }

    try {
        console.log('🖼️ [AI Service] Importing image generation service...');
        const { generateImage: imageGenerateImage } = await import('./imageGenerationService');

        console.log('🖼️ [AI Service] Calling image generation API...');
        console.log('🖼️ [AI Service] This may take 30-60 seconds...');

        const result = await imageGenerateImage(prompt);

        console.log('✅ [AI Service] Image generation successful!');
        console.log('🖼️ [AI Service] Result type:', typeof result);
        console.log('🖼️ [AI Service] Result length:', result?.length || 0);

        return result;
    } catch (error: any) {
        console.error('❌ [AI Service] Image generation failed:');
        console.error('❌ [AI Service] Error type:', typeof error);
        console.error('❌ [AI Service] Error message:', error.message);
        console.error('❌ [AI Service] Error toString:', error.toString());
        console.error('❌ [AI Service] Full error object:', error);

        const errorMessage = error.message || "An unknown error occurred with the AI service.";

        // Verifică pentru mesaje specifice legate de siguranță
        if (error.toString().includes('SAFETY') || error.toString().includes('blocked')) {
            console.log('❌ [AI Service] Safety error detected');
            throw new Error("The request was blocked due to safety settings. Please modify your prompt.");
        }

        throw new Error(errorMessage);
    }
};

// Funcție simplă pentru generare text (pentru compatibilitate)
export const generateText = async (prompt: string, format: 'text' | 'json' = 'text'): Promise<string> => {
    return generateTextWithRetry(prompt, format);
};

// Funcții de compatibilitate pentru codul existent
export const canUseRebuild = (): boolean => {
    return canUseService('ai_text_generation');
};

export const canUseImageGen = (): boolean => {
    return canUseService('ai_image_generation');
};

export const useRebuild = (): void => {
    useService('ai_text_generation');
};

export const useImageGen = (): void => {
    useService('ai_image_generation');
};

export const getRebuildsLeft = (): number => {
    return getServiceUsageLeft('ai_text_generation');
};

export const getImagesLeft = (): number => {
    return getServiceUsageLeft('ai_image_generation');
};