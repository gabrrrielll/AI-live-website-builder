"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Editable from '@/components/Editable';
import { useSite } from '@/context/SiteContext';
import { resolveBackgroundImage } from '@/utils/styleUtils';

interface HeroProps {
    sectionId: string;
}

export const Hero: React.FC<HeroProps> = ({ sectionId }) => {
    const { siteConfig, getImageUrl } = useSite();
    const section = siteConfig?.sections[sectionId];

    const [currentSlide, setCurrentSlide] = useState(0);

    const items = section?.items || [];
    const totalSlides = items.length;
    const duration = section?.layout?.duration || 5;
    const variant = section?.layout?.variant || 'slider';

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, [totalSlides]);

    const prevSlide = () => {
        setCurrentSlide(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    useEffect(() => {
        if (totalSlides > 1) {
            const timer = setTimeout(nextSlide, duration * 1000); // Use configurable duration
            return () => clearTimeout(timer);
        }
    }, [currentSlide, nextSlide, totalSlides, duration]);

    if (!section) {
        return null; // Or a fallback component
    }

    // Render gradient waves variant
    if (variant === 'gradient-waves') {
        return <GradientWavesHero sectionId={sectionId} />;
    }

    // Default slider variant
    if (!items || totalSlides === 0) {
        return null;
    }

    return (
        <section className="relative w-full h-[60vh] overflow-hidden">
            {/* Slides Container */}
            <div className="w-full h-full relative">
                {items.map((item, index) => {
                    const resolvedStyles = resolveBackgroundImage(item.styles, getImageUrl);
                    return (
                        <div
                            key={item.id}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                            style={resolvedStyles || {}}
                        >
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center text-white p-4 max-w-3xl">
                                    <Editable sectionId={sectionId} elementId={`${sectionId}-title-${item.id.toString().split('-').pop()}`} as="h1" className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-shadow" />
                                    <Editable sectionId={sectionId} elementId={`${sectionId}-subtitle-${item.id.toString().split('-').pop()}`} as="div" className="text-lg md:text-xl text-gray-200 mb-8" />
                                    <Editable sectionId={sectionId} as="button" elementId={`${sectionId}-cta-${item.id.toString().split('-').pop()}`} className="bg-[#c29a47] hover:bg-[#b58b3c] text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Arrows */}
            {totalSlides > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={28} />
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            {totalSlides > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>
            )}
        </section>
    );
};

// Gradient Waves Hero Component - NEW APPROACH
const GradientWavesHero: React.FC<{ sectionId: string }> = ({ sectionId }) => {
    const { siteConfig } = useSite();
    const section = siteConfig?.sections[sectionId];

    const gradientColors = section?.layout?.gradientColors || {
        color1: '#ff1744',
        color2: '#00e5ff',
        color3: '#ff6f00',
        color4: '#76ff03'
    };

    const waveAnimation = section?.layout?.waveAnimation || {
        speed: 1,
        intensity: 1.2,
        spacing: 0.1,
        diffusion: 50
    };

    return (
        <section className="relative w-full h-[80vh] overflow-hidden">
            {/* Gradient Background */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    background: `linear-gradient(135deg, ${gradientColors.color1}, ${gradientColors.color2}, ${gradientColors.color3}, ${gradientColors.color4})`,
                    backgroundSize: '300% 300%',
                    animation: `gradientShift ${6 / waveAnimation.speed}s ease infinite`,
                    opacity: 0.7
                }}
                key={`gradient-${gradientColors.color1}-${gradientColors.color2}-${gradientColors.color3}-${gradientColors.color4}`}
            />

            {/* Animated SVG Waves - Full Hero Coverage */}
            <div className="absolute inset-0 w-full h-full overflow-visible">
                <svg
                    className="waves"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 150 100"
                    preserveAspectRatio="none"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '150%',
                        top: '50%',
                        left: '0px'
                    }}
                >
                    <defs>
                        <path
                            id={`gentle-wave-${sectionId}`}
                            d={`M-160 ${20 - (8 * waveAnimation.intensity)}c15 0 29-${8 * waveAnimation.intensity} 44-${8 * waveAnimation.intensity}s29 ${8 * waveAnimation.intensity} 44 ${8 * waveAnimation.intensity} 29-${8 * waveAnimation.intensity} 44-${8 * waveAnimation.intensity} 29 ${8 * waveAnimation.intensity} 44 ${8 * waveAnimation.intensity} 29-${8 * waveAnimation.intensity} 44-${8 * waveAnimation.intensity} 29 ${8 * waveAnimation.intensity} 44 ${8 * waveAnimation.intensity} 29-${8 * waveAnimation.intensity} 44-${8 * waveAnimation.intensity} 29 ${8 * waveAnimation.intensity} 44 ${8 * waveAnimation.intensity} 29-${8 * waveAnimation.intensity} 44-${8 * waveAnimation.intensity} 29 ${8 * waveAnimation.intensity} 44 ${8 * waveAnimation.intensity} 29-${8 * waveAnimation.intensity} 44-${8 * waveAnimation.intensity} 29 ${8 * waveAnimation.intensity} 44 ${8 * waveAnimation.intensity}v${60 + (8 * waveAnimation.intensity)}h-352z`}
                        />
                        <filter id={`wave-shadow-${sectionId}`}>
                            <feGaussianBlur stdDeviation={`${waveAnimation.diffusion / 20}`} result="coloredOut" />
                            <feMerge>
                                <feMergeNode in="coloredOut" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <g className="parallax">
                        <use
                            xlinkHref={`#gentle-wave-${sectionId}`}
                            x="48"
                            y="20"
                            fill={gradientColors.color1}
                            filter={`url(#wave-shadow-${sectionId})`}
                            style={{
                                animation: `move-forever-1 ${7 / waveAnimation.speed}s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite`,
                                animationDelay: '-2s'
                            }}
                        />
                        <use
                            xlinkHref={`#gentle-wave-${sectionId}`}
                            x="48"
                            y={20 + (waveAnimation.spacing || 0.1) * 0.5}
                            fill={gradientColors.color2}
                            filter={`url(#wave-shadow-${sectionId})`}
                            style={{
                                animation: `move-forever-2 ${10 / waveAnimation.speed}s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite`,
                                animationDelay: '-3s'
                            }}
                        />
                        <use
                            xlinkHref={`#gentle-wave-${sectionId}`}
                            x="48"
                            y={20 + (waveAnimation.spacing || 0.1) * 1.0}
                            fill={gradientColors.color3}
                            filter={`url(#wave-shadow-${sectionId})`}
                            style={{
                                animation: `move-forever-3 ${13 / waveAnimation.speed}s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite`,
                                animationDelay: '-4s'
                            }}
                        />
                        <use
                            xlinkHref={`#gentle-wave-${sectionId}`}
                            x="48"
                            y={20 + (waveAnimation.spacing || 0.1) * 1.5}
                            fill="white"
                            style={{
                                animation: `move-forever-4 ${20 / waveAnimation.speed}s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite`,
                                animationDelay: '-5s'
                            }}
                        />
                    </g>
                </svg>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
                {isEditMode ? (
                    <div className="text-center max-w-4xl">
                        <Editable sectionId={sectionId} elementId={`${sectionId}-title-1`} as="h1" className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg" />
                        <Editable sectionId={sectionId} elementId={`${sectionId}-subtitle-1`} as="div" className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto drop-shadow-md" />
                        <Editable sectionId={sectionId} elementId={`${sectionId}-cta-1`} as="button" className="bg-white text-gray-900 font-bold py-4 px-8 rounded-full text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl" />
                    </div>
                ) : (
                    <div
                        className="text-center max-w-4xl"
                        dangerouslySetInnerHTML={{
                            __html: section?.elements?.[`${sectionId}-title-1`]?.content?.ro ||
                                '<h1 class="text-5xl md:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">Financial infrastructure to grow your revenue</h1><p class="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto drop-shadow-md">Join the millions of companies that use our platform to accept payments, embed financial services, and build a more profitable business.</p><button class="bg-white text-gray-900 font-bold py-4 px-8 rounded-full text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">Start now</button>'
                        }}
                    />
                )}
            </div>

            {/* CSS Animations */}
            <style jsx key={`animations-${gradientColors.color1}-${gradientColors.color2}-${gradientColors.color3}-${gradientColors.color4}-${waveAnimation.speed}-${waveAnimation.intensity}-${waveAnimation.spacing || 0.1}-${waveAnimation.diffusion || 50}`}>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    25% { background-position: 100% 0%; }
                    50% { background-position: 100% 100%; }
                    75% { background-position: 0% 100%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes move-forever-1 {
                    0% { transform: translate3d(-90px, 0, 0); }
                    100% { transform: translate3d(85px, 0, 0); }
                }

                @keyframes move-forever-2 {
                    0% { transform: translate3d(-90px, 0, 0); }
                    100% { transform: translate3d(85px, 0, 0); }
                }

                @keyframes move-forever-3 {
                    0% { transform: translate3d(-90px, 0, 0); }
                    100% { transform: translate3d(85px, 0, 0); }
                }

                @keyframes move-forever-4 {
                    0% { transform: translate3d(-90px, 0, 0); }
                    100% { transform: translate3d(85px, 0, 0); }
                }
            `}</style>
        </section>
    );
};