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
    
    if (!section || !items || totalSlides === 0) {
        return null; // Or a fallback component
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
                                    <Editable sectionId={sectionId} elementId={`hero-title-${item.id}`} as="h1" className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-shadow" />
                                    <Editable sectionId={sectionId} elementId={`hero-subtitle-${item.id}`} as="div" className="text-lg md:text-xl text-gray-200 mb-8" />
                                    <Editable sectionId={sectionId} as="button" elementId={`hero-cta-${item.id}`} className="bg-[#c29a47] hover:bg-[#b58b3c] text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105" />
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