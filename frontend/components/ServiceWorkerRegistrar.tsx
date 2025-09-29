"use client";

import { useEffect } from 'react';

const ServiceWorkerRegistrar = () => {
    useEffect(() => {
        let registration: ServiceWorkerRegistration | null = null;

        const registerServiceWorker = async () => {
            if ('serviceWorker' in navigator) {
                try {
                    registration = await navigator.serviceWorker.register('/sw.js');
                } catch (error) {
                    // ServiceWorker registration failed
                }
            }
        };

        // Register on mount
        registerServiceWorker();

        // Cleanup on unmount
        return () => {
            if (registration) {
                registration.unregister().then(() => {
                    // ServiceWorker unregistered
                }).catch(error => {
                    // ServiceWorker unregistration failed
                });
            }
        };
    }, []);

    return null; // This component does not render anything
};

export default ServiceWorkerRegistrar;
