"use client";

import plansConfig from '../plans-config.json';

export interface ServiceLimit {
    type: 'unlimited' | 'daily_limit' | 'monthly_limit' | 'total_limit';
    value: number | null;
    description: string;
}

export interface ServiceConfig {
    name: string;
    description: string;
    limits: {
        localhost: ServiceLimit;
        test_domain: ServiceLimit;
        public_domain: ServiceLimit;
    };
    enabled: boolean;
    provider: string;
    fallback_provider?: string;
}

export interface PlansConfig {
    isEditable: boolean;
    show_import_export_config: boolean;
    services: Record<string, ServiceConfig>;
    domain_types: Record<string, { pattern: string; description: string }>;
    billing: Record<string, any>;
    version: string;
    last_updated: string;
}

// Helper pentru localStorage
const getUsage = (key: string): number => {
    if (typeof window === 'undefined') return 0;
    try {
        const item = localStorage.getItem(key);
        return item ? parseInt(item, 10) : 0;
    } catch {
        return 0;
    }
};

const setUsage = (key: string, count: number) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, count.toString());
    } catch (error) {
        console.error("Could not save usage to localStorage", error);
    }
};

// Determină tipul de domeniu
export const getDomainType = (): 'localhost' | 'test_domain' | 'public_domain' => {
    if (typeof window === 'undefined') return 'public_domain';

    const hostname = window.location.hostname.toLowerCase();

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'localhost';
    }

    if (hostname.includes('test')) {
        return 'test_domain';
    }

    return 'public_domain';
};

// Verifică dacă un serviciu poate fi folosit
export const canUseService = (serviceName: string): boolean => {
    const service = (plansConfig.services as any)[serviceName];
    if (!service || !service.enabled) {
        return false;
    }

    const domainType = getDomainType();
    const limit = service.limits[domainType];

    if (limit.type === 'unlimited') {
        return true;
    }

    const usageKey = `service_${serviceName}_usage`;
    const currentUsage = getUsage(usageKey);

    return currentUsage < (limit.value || 0);
};

// Incrementează contorul pentru un serviciu
export const useService = (serviceName: string): void => {
    const service = (plansConfig.services as any)[serviceName];
    if (!service) return;

    const domainType = getDomainType();
    const limit = service.limits[domainType];

    if (limit.type !== 'unlimited') {
        const usageKey = `service_${serviceName}_usage`;
        const currentUsage = getUsage(usageKey);
        setUsage(usageKey, currentUsage + 1);
    }
};

// Obține numărul de utilizări rămase pentru un serviciu
export const getServiceUsageLeft = (serviceName: string): number => {
    const service = (plansConfig.services as any)[serviceName];
    if (!service) return 0;

    const domainType = getDomainType();
    const limit = service.limits[domainType];

    if (limit.type === 'unlimited') {
        return Infinity;
    }

    const usageKey = `service_${serviceName}_usage`;
    const currentUsage = getUsage(usageKey);

    return Math.max(0, (limit.value || 0) - currentUsage);
};

// Obține informații despre un serviciu
export const getServiceInfo = (serviceName: string): ServiceConfig | null => {
    return (plansConfig.services as any)[serviceName] || null;
};

// Obține toate serviciile disponibile
export const getAllServices = (): Record<string, ServiceConfig> => {
    return plansConfig.services as any;
};

// Verifică dacă un serviciu este activat
export const isServiceEnabled = (serviceName: string): boolean => {
    const service = (plansConfig.services as any)[serviceName];
    return service ? service.enabled : false;
};

// Obține provider-ul pentru un serviciu
export const getServiceProvider = (serviceName: string): string | null => {
    const service = (plansConfig.services as any)[serviceName];
    return service ? service.provider : null;
};

// Obține fallback provider-ul pentru un serviciu
export const getServiceFallbackProvider = (serviceName: string): string | null => {
    const service = (plansConfig.services as any)[serviceName];
    return service ? service.fallback_provider || null : null;
};

// Resetează contoarele de utilizare (pentru testare)
export const resetServiceUsage = (serviceName?: string): void => {
    if (serviceName) {
        const usageKey = `service_${serviceName}_usage`;
        localStorage.removeItem(usageKey);
    } else {
        // Resetează toate serviciile
        Object.keys(plansConfig.services).forEach(service => {
            const usageKey = `service_${service}_usage`;
            localStorage.removeItem(usageKey);
        });
    }
};

// Obține statistici de utilizare pentru toate serviciile
export const getUsageStats = (): Record<string, { used: number; left: number; limit: ServiceLimit }> => {
    const stats: Record<string, { used: number; left: number; limit: ServiceLimit }> = {};

    Object.keys(plansConfig.services).forEach(serviceName => {
        const service = (plansConfig.services as any)[serviceName];
        const domainType = getDomainType();
        const limit = service.limits[domainType];
        const usageKey = `service_${serviceName}_usage`;
        const used = getUsage(usageKey);
        const left = getServiceUsageLeft(serviceName);

        stats[serviceName] = {
            used,
            left: left === Infinity ? -1 : left,
            limit
        };
    });

    return stats;
};

// Verifică dacă site-ul poate fi editat
export const isSiteEditable = (): boolean => {
    return plansConfig.isEditable;
};

// Verifică dacă butoanele de import/export configurație trebuie afișate
export const showImportExportConfig = (): boolean => {
    return plansConfig.show_import_export_config;
};
