import React, { ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollAnimationProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
    distance?: number;
    once?: boolean;
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
    children,
    className = '',
    delay = 0,
    duration = 0.6,
    direction = 'up',
    distance = 50,
    once = true
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once,
        margin: "-100px 0px -100px 0px"
    });

    const getInitialAnimation = () => {
        switch (direction) {
            case 'up':
                return { y: distance, opacity: 0 };
            case 'down':
                return { y: -distance, opacity: 0 };
            case 'left':
                return { x: distance, opacity: 0 };
            case 'right':
                return { x: -distance, opacity: 0 };
            case 'fade':
                return { opacity: 0 };
            case 'scale':
                return { scale: 0.8, opacity: 0 };
            default:
                return { y: distance, opacity: 0 };
        }
    };

    const getAnimateAnimation = () => {
        switch (direction) {
            case 'up':
            case 'down':
                return { y: 0, opacity: 1 };
            case 'left':
            case 'right':
                return { x: 0, opacity: 1 };
            case 'fade':
                return { opacity: 1 };
            case 'scale':
                return { scale: 1, opacity: 1 };
            default:
                return { y: 0, opacity: 1 };
        }
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={getInitialAnimation()}
            animate={isInView ? getAnimateAnimation() : getInitialAnimation()}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1], // Custom easing pentru efectul "din apă"
            }}
        >
            {children}
        </motion.div>
    );
};

// Component pentru animații cu stagger (întârziere între elemente)
interface StaggerAnimationProps {
    children: ReactNode[];
    className?: string;
    staggerDelay?: number;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
    distance?: number;
}

export const StaggerAnimation: React.FC<StaggerAnimationProps> = ({
    children,
    className = '',
    staggerDelay = 0.1,
    delay = 0,
    direction = 'up',
    distance = 50,
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "-100px 0px -100px 0px"
    });

    const getInitialAnimation = () => {
        switch (direction) {
            case 'up':
                return { y: distance, opacity: 0 };
            case 'down':
                return { y: -distance, opacity: 0 };
            case 'left':
                return { x: distance, opacity: 0 };
            case 'right':
                return { x: -distance, opacity: 0 };
            case 'fade':
                return { opacity: 0 };
            case 'scale':
                return { scale: 0.8, opacity: 0 };
            default:
                return { y: distance, opacity: 0 };
        }
    };

    const getAnimateAnimation = () => {
        switch (direction) {
            case 'up':
            case 'down':
                return { y: 0, opacity: 1 };
            case 'left':
            case 'right':
                return { x: 0, opacity: 1 };
            case 'fade':
                return { opacity: 1 };
            case 'scale':
                return { scale: 1, opacity: 1 };
            default:
                return { y: 0, opacity: 1 };
        }
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: delay,
                    },
                },
            }}
        >
            {children.map((child, index) => (
                <motion.div
                    key={index}
                    className="w-full" // Ensure each child takes full width of its container
                    variants={{
                        hidden: getInitialAnimation(),
                        visible: {
                            ...getAnimateAnimation(),
                            transition: {
                                duration: 0.6,
                                ease: [0.25, 0.1, 0.25, 1],
                            },
                        },
                    }}
                >
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
};

// Component pentru efectul "din apă" - combină scale, fade și slide up
export const WaterRiseAnimation: React.FC<{
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
}> = ({ children, className = '', delay = 0, duration = 0.8 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "-50px 0px -50px 0px"
    });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{
                y: 60,
                opacity: 0,
                scale: 0.9,
                filter: "blur(4px)"
            }}
            animate={isInView ? {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)"
            } : {
                y: 60,
                opacity: 0,
                scale: 0.9,
                filter: "blur(4px)"
            }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
        >
            {children}
        </motion.div>
    );
};

// Component pentru efectul de paralaxă ușoară
export const ParallaxAnimation: React.FC<{
    children: ReactNode;
    className?: string;
    speed?: number;
}> = ({ children, className = '', speed = 0.5 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: false,
        margin: "-200px 0px -200px 0px"
    });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ y: 100 * speed }}
            animate={isInView ? { y: -100 * speed } : { y: 100 * speed }}
            transition={{
                duration: 1,
                ease: "easeOut",
            }}
        >
            {children}
        </motion.div>
    );
};
