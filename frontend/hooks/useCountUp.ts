"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export const useCountUp = (endValue: number, duration = 2000): [number, React.RefObject<HTMLDivElement>] => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    const animate = useCallback((startTime: number) => {
        const animateFrame = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeOutExpo(progress);
            
            const newCount = Math.floor(easedProgress * endValue);
            setCount(newCount);
            
            if (progress < 1) {
                requestAnimationFrame(animateFrame);
            } else {
                setCount(endValue); // Ensure it ends on the exact value
            }
        };
        requestAnimationFrame(animateFrame);
    }, [endValue, duration]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const startTime = performance.now();
                        animate(startTime);
                        observer.unobserve(element); // Animate only once
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        observer.observe(element);
        
        return () => {
            observer.disconnect();
        };
    }, [animate, endValue]);
    
    return [count, ref];
};
