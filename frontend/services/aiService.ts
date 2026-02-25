"use client";

// Backend AI service integration
import {
    canUseService,
    useService,
    getServiceUsageLeft,
    getServiceProvider,
    getDomainType
} from './plansService';

export interface GeminiModelLimits {
    model: string;
    inputTokenLimit: number;
    outputTokenLimit: number;
    recommendedPromptInputTokens: number;
}

const parseJsonFromAIText = (rawText: string): any => {
    const candidates: string[] = [];
    const trimmed = (rawText || '').trim();
    candidates.push(trimmed);

    // Extract fenced JSON if present.
    const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fencedMatch?.[1]) {
        candidates.push(fencedMatch[1].trim());
    }

    // Remove common markdown fences directly.
    const unfenced = trimmed
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
    candidates.push(unfenced);

    // If model adds prose, try extracting the first JSON object/array block.
    const firstBrace = unfenced.indexOf('{');
    const lastBrace = unfenced.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        candidates.push(unfenced.slice(firstBrace, lastBrace + 1).trim());
    }

    const firstBracket = unfenced.indexOf('[');
    const lastBracket = unfenced.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
        candidates.push(unfenced.slice(firstBracket, lastBracket + 1).trim());
    }

    const uniqueCandidates = Array.from(new Set(candidates.filter(Boolean)));
    let lastError: unknown = null;

    for (const candidate of uniqueCandidates) {
        try {
            // Remove problematic invisible control chars that occasionally leak into model output.
            const sanitized = candidate.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
            return JSON.parse(sanitized);
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError instanceof Error
        ? lastError
        : new Error('Could not parse JSON from AI response');
};

export const getGeminiModelLimits = async (): Promise<GeminiModelLimits | null> => {
    try {
        const { API_CONFIG } = await import('@/constants.js');
        const url = `${API_CONFIG.BASE_URL}/wp-json/ai-web-site/v1/ai/model-limits`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            return null;
        }

        const result = await response.json();
        if (!result?.success) {
            return null;
        }

        return {
            model: result.model || 'models/gemini-1.5-flash',
            inputTokenLimit: Number(result.inputTokenLimit || 0),
            outputTokenLimit: Number(result.outputTokenLimit || 0),
            recommendedPromptInputTokens: Number(result.recommendedPromptInputTokens || 0),
        };
    } catch (error) {
        console.warn('Could not fetch Gemini model limits:', error);
        return null;
    }
};

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
        const { API_CONFIG } = await import('@/constants.js');
        // New endpoint path
        const url = `${API_CONFIG.BASE_URL}/wp-json/ai-web-site/v1/ai/generate-text`;

        // Call the backend endpoint
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization header if needed, or rely on cookie auth if same domain/cors
                // Usually for WP REST API nonces are good, but for external calls we might need to handle auth differently
                // For now assuming the backend handles auth via session cookies if logged in, or allows public if configured (but we really want it secured)
                // The backend implementation checks for 'check_authenticated_permission' which checks current_user_id()
                // So the user must be logged in to WP for this to work.
            },
            body: JSON.stringify({
                prompt,
                format,
                provider: 'gemini' // defaulting to gemini, could be parameter
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
                return parseJsonFromAIText(result.text || '');
            } catch (parseError) {
                console.error('Failed to parse AI response as JSON:', parseError);
                console.error('AI JSON raw preview:', String(result.text || '').slice(0, 800));
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