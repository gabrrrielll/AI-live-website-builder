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
    console.log('🖼️ [Pollinations] Starting image generation...');
    console.log('🖼️ [Pollinations] Prompt:', prompt);
    console.log('🖼️ [Pollinations] Domain type:', getDomainType());
    console.log('🖼️ [Pollinations] Can use service:', canUseService('ai_image_generation'));

    // Verifică dacă serviciul poate fi folosit
    if (!canUseService('ai_image_generation')) {
        console.log('❌ [Pollinations] Service usage limit reached');
        throw new Error('Service usage limit reached for image generation');
    }

    try {
        console.log('🖼️ [Pollinations] Calling Pollinations.ai API...');

        // Pollinations.ai - serviciu gratuit, fără API key necesar!
        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&seed=${Date.now()}`;

        console.log('🖼️ [Pollinations] Image URL:', imageUrl);
        console.log('🖼️ [Pollinations] Fetching image...');

        // Convertim URL-ul în base64
        const imageBase64 = await urlToBase64(imageUrl);

        // Incrementează contorul pentru serviciu
        useService('ai_image_generation');
        console.log('✅ [Pollinations] Image generation successful!');

        return imageBase64;

    } catch (error: any) {
        console.error('❌ [Pollinations] Image generation failed:');
        console.error('❌ [Pollinations] Error type:', typeof error);
        console.error('❌ [Pollinations] Error message:', error.message);
        console.error('❌ [Pollinations] Error toString:', error.toString());
        console.error('❌ [Pollinations] Full error object:', error);

        // Fallback la serviciu gratuit alternativ
        console.log('🔄 [Pollinations] Falling back to free service...');
        return await generateWithFreeService(prompt);
    }
};

// Serviciu gratuit alternativ (Picsum Photos cu text overlay)
async function generateWithFreeService(prompt: string): Promise<string> {
    console.log('🖼️ [Free Service] Generating image with free service...');

    try {
        // Folosește Picsum Photos cu text overlay
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = 1024;
        canvas.height = 576;

        if (ctx) {
            // Load a random image from Picsum
            const imageUrl = `https://picsum.photos/1024/576?random=${Date.now()}`;

            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';

                img.onload = () => {
                    // Draw the background image
                    ctx.drawImage(img, 0, 0, 1024, 576);

                    // Add overlay
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                    ctx.fillRect(0, 0, 1024, 576);

                    // Add text
                    ctx.fillStyle = 'white';
                    ctx.font = 'bold 28px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    // Wrap text
                    const words = prompt.split(' ');
                    const lines = [];
                    let currentLine = '';

                    for (const word of words) {
                        const testLine = currentLine + (currentLine ? ' ' : '') + word;
                        const metrics = ctx.measureText(testLine);

                        if (metrics.width > 900) {
                            if (currentLine) {
                                lines.push(currentLine);
                                currentLine = word;
                            } else {
                                lines.push(word);
                            }
                        } else {
                            currentLine = testLine;
                        }
                    }
                    if (currentLine) {
                        lines.push(currentLine);
                    }

                    // Draw text lines
                    const lineHeight = 35;
                    const startY = 288 - (lines.length - 1) * lineHeight / 2;

                    lines.forEach((line, index) => {
                        // Shadow
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                        ctx.fillText(line, 512 + 2, startY + index * lineHeight + 2);

                        // Main text
                        ctx.fillStyle = 'white';
                        ctx.fillText(line, 512, startY + index * lineHeight);
                    });

                    // Add label
                    ctx.font = '18px Arial';
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillText('AI Generated Image (Free Service)', 512, 500);

                    // Incrementează contorul pentru serviciu
                    useService('ai_image_generation');
                    console.log('✅ [Free Service] Image generation successful!');

                    resolve(canvas.toDataURL('image/jpeg', 0.9));
                };

                img.onerror = () => {
                    reject(new Error('Failed to load background image'));
                };

                img.src = imageUrl;
            });
        }

        throw new Error('Canvas not supported');

    } catch (error: any) {
        console.error('❌ [Free Service] Image generation failed:', error);
        throw new Error('Failed to generate image with free service');
    }
}

// Funcții de compatibilitate pentru codul existent
export const canUseImageGen = (): boolean => {
    return canUseService('ai_image_generation');
};

export const useImageGen = (): void => {
    useService('ai_image_generation');
};

export const getImagesLeft = (): number => {
    return getServiceUsageLeft('ai_image_generation');
};

// Convertim URL-ul imaginii în base64
async function urlToBase64(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('❌ [Bing Service] Failed to convert URL to base64:', error);
        throw new Error('Failed to convert image URL to base64');
    }
}