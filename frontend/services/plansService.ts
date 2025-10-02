"use client";

// plansConfig va fi încărcat din API
let plansConfig: any = null;

// Funcție pentru a încărca plansConfig din API
const loadPlansConfig = async (): Promise<any> => {
    if (plansConfig) {
        return plansConfig;
    }

    try {
        // Import siteConfigService pentru a folosi API-ul
        const { siteConfigService } = await import('./siteConfigService');
        const siteConfig = await siteConfigService.loadSiteConfig();
        
        if (siteConfig && siteConfig['plans-config']) {
            plansConfig = siteConfig['plans-config'];
            console.log('Plans config încărcat din API:', plansConfig);
            return plansConfig;
        }
    } catch (error) {
        console.warn('Nu s-a putut încărca plans-config din API:', error);
    }

    return null;
};

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
export const canUseService = async (serviceName: string): Promise<boolean> => {
    const config = await loadPlansConfig();
    if (!config || !config.services) {
        return false;
    }

    const service = config.services[serviceName];
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
export const useService = async (serviceName: string): Promise<void> => {
    const config = await loadPlansConfig();
    if (!config || !config.services) return;

    const service = config.services[serviceName];
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
    if (!plansConfig || !plansConfig.services) return 0;

    const service = plansConfig.services[serviceName];
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
    if (!plansConfig || !plansConfig.services) return null;
    return plansConfig.services[serviceName] || null;
};

// Obține toate serviciile disponibile
export const getAllServices = (): Record<string, ServiceConfig> => {
    return plansConfig?.services || {};
};

// Verifică dacă un serviciu este activat
export const isServiceEnabled = (serviceName: string): boolean => {
    if (!plansConfig || !plansConfig.services) return false;
    const service = plansConfig.services[serviceName];
    return service ? service.enabled : false;
};

// Obține provider-ul pentru un serviciu
export const getServiceProvider = (serviceName: string): string | null => {
    if (!plansConfig || !plansConfig.services) return null;
    const service = plansConfig.services[serviceName];
    return service ? service.provider : null;
};

// Obține fallback provider-ul pentru un serviciu
export const getServiceFallbackProvider = (serviceName: string): string | null => {
    if (!plansConfig || !plansConfig.services) return null;
    const service = plansConfig.services[serviceName];
    return service ? service.fallback_provider || null : null;
};

// Resetează contoarele de utilizare (pentru testare)
export const resetServiceUsage = (serviceName?: string): void => {
    if (serviceName) {
        const usageKey = `service_${serviceName}_usage`;
        localStorage.removeItem(usageKey);
    } else {
        // Resetează toate serviciile
        if (plansConfig && plansConfig.services) {
            Object.keys(plansConfig.services).forEach(service => {
                const usageKey = `service_${service}_usage`;
                localStorage.removeItem(usageKey);
            });
        }
    }
};

// Obține statistici de utilizare pentru toate serviciile
export const getUsageStats = (): Record<string, { used: number; left: number; limit: ServiceLimit }> => {
    const stats: Record<string, { used: number; left: number; limit: ServiceLimit }> = {};

    if (plansConfig && plansConfig.services) {
        Object.keys(plansConfig.services).forEach(serviceName => {
            const service = plansConfig.services[serviceName];
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
    }

    return stats;
};

// Verifică dacă site-ul poate fi editat
export const isSiteEditable = (): boolean => {
    // Pe localhost, implicit este editabil (pentru development)
    const domainType = getDomainType();
    if (domainType === 'localhost') {
        return true;
    }

    // Pentru alte domenii, verifică configurația
    return plansConfig?.isEditable || false;
};

// Verifică dacă butoanele de import/export configurație trebuie afișate
export const showImportExportConfig = (): boolean => {
    return plansConfig?.show_import_export_config || false;
};

// Verifică dacă butonul de salvare (sync) trebuie afișat
export const showSaveButton = (): boolean => {
    return plansConfig?.show_save_button || false;
};

// Verifică dacă trebuie să salvez configurația local (în public) sau pe server
export const useLocalSiteConfig = (): boolean => {
    return plansConfig?.['useLocal_site-config'] === true;
};

// Funcție pentru a inițializa plansConfig (trebuie apelată la începutul aplicației)
export const initializePlansConfig = async (): Promise<void> => {
    await loadPlansConfig();
};
