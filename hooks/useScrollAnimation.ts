import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const useScrollAnimation = (options?: {
    once?: boolean;
    margin?: string;
    threshold?: number;
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: options?.once ?? true,
        margin: options?.margin ?? "-100px 0px -100px 0px",
        amount: options?.threshold ?? 0.2,
    });

    return { ref, isInView };
};

// Hook pentru animații cu delay progresiv
export const useStaggeredAnimation = (itemCount: number, baseDelay: number = 0.1) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "-100px 0px -100px 0px"
    });

    const getStaggerDelay = (index: number) => baseDelay * index;

    return { ref, isInView, getStaggerDelay };
};
