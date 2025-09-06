import React from 'react';

export const resolveBackgroundImage = (
    styles: React.CSSProperties | undefined,
    getImageUrl: (id: string) => string | undefined
): React.CSSProperties | undefined => {
    if (!styles || !styles.background) return styles;
    const bg = styles.background as string;
    if (bg.includes('url(')) {
        // Regex to find a URL containing our specific local image prefix
        const urlMatch = bg.match(/url\((['"]?)(local-img-.+?)\1\)/);
        if (urlMatch && urlMatch[2]) {
            const imageId = urlMatch[2];
            const dataUrl = getImageUrl(imageId);
            if (dataUrl) {
                // Replace the ID with the actual Base64 data URL
                const newBg = bg.replace(imageId, dataUrl);
                return { ...styles, background: newBg };
            }
        }
    }
    return styles;
};
