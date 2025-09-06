"use client";

const getErrorMessage = (error: any): string => {
    if (typeof error === 'object' && error !== null && error.error) {
        return error.error;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
};

export const generateText = async (prompt: string, format: 'text' | 'json' = 'text'): Promise<string> => {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'text',
                prompt,
                config: {
                    ...(format === 'json' && { responseMimeType: 'application/json' })
                }
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate text.');
        }

        return data.text;
    } catch (error) {
        console.error("Error generating text:", error);
        throw new Error(getErrorMessage(error));
    }
};

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export const generateImage = async (prompt: string, aspectRatio: AspectRatio = '16:9'): Promise<string> => {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'image',
                prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: aspectRatio,
                }
            })
        });
        
        const data = await response.json();
        if (!response.ok) {
             throw new Error(data.error || 'Failed to generate image.');
        }

        if (!data.base64Image) {
            throw new Error("AI response was malformed or the image could not be generated.");
        }
        
        return `data:image/jpeg;base64,${data.base64Image}`;
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error(getErrorMessage(error));
    }
};
