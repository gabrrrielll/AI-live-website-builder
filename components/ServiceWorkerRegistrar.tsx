"use client";

import { useEffect } from 'react';

const ServiceWorkerRegistrar = () => {
    useEffect(() => {
        let registration: ServiceWorkerRegistration | null = null;

        const registerServiceWorker = async () => {
            if ('serviceWorker' in navigator) {
                try {
                    registration = await navigator.serviceWorker.register('/sw.js');
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                } catch (error) {
                    console.log('ServiceWorker registration failed: ', error);
                }
            }
        };

        // Register on mount
        registerServiceWorker();

        // Cleanup on unmount
        return () => {
            if (registration) {
                registration.unregister().then(() => {
                    console.log('ServiceWorker unregistered');
                }).catch(error => {
                    console.log('ServiceWorker unregistration failed: ', error);
                });
            }
        };
    }, []);

    return null; // This component does not render anything
};

export default ServiceWorkerRegistrar;
