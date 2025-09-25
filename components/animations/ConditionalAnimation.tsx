import React, { ReactNode } from 'react';
import { useSite } from '@/context/SiteContext';
import { ScrollAnimation, WaterRiseAnimation, StaggerAnimation, ParallaxAnimation } from './ScrollAnimation';

interface ConditionalAnimationProps {
    children: ReactNode;
    sectionId: string;
    animationType?: 'scroll' | 'water' | 'stagger' | 'parallax';
    direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
    distance?: number;
    delay?: number;
    duration?: number;
    staggerDelay?: number;
    speed?: number;
    className?: string;
    fallbackClassName?: string;
}

export const ConditionalAnimation: React.FC<ConditionalAnimationProps> = ({
    children,
    sectionId,
    animationType = 'scroll',
    direction = 'up',
    distance = 50,
    delay = 0,
    duration = 0.6,
    staggerDelay = 0.1,
    speed = 0.5,
    className = '',
    fallbackClassName = ''
}) => {
    const { siteConfig } = useSite();

    const section = siteConfig?.sections[sectionId];
    const animationsEnabled = section?.animations?.enabled ?? true; // Default enabled

    // If animations are disabled, render children without animation wrapper
    if (!animationsEnabled) {
        return (
            <div className={fallbackClassName}>
                {children}
            </div>
        );
    }

    // Render with appropriate animation based on type
    switch (animationType) {
        case 'water':
            return (
                <WaterRiseAnimation
                    delay={delay}
                    duration={duration}
                    className={className}
                >
                    {children}
                </WaterRiseAnimation>
            );

        case 'stagger':
            return (
                <StaggerAnimation
                    staggerDelay={staggerDelay}
                    delay={delay}
                    direction={direction}
                    distance={distance}
                    className={className}
                >
                    {Array.isArray(children) ? children : [children]}
                </StaggerAnimation>
            );

        case 'parallax':
            return (
                <ParallaxAnimation
                    speed={speed}
                    className={className}
                >
                    {children}
                </ParallaxAnimation>
            );

        case 'scroll':
        default:
            return (
                <ScrollAnimation
                    direction={direction}
                    distance={distance}
                    delay={delay}
                    duration={duration}
                    className={className}
                >
                    {children}
                </ScrollAnimation>
            );
    }
};
