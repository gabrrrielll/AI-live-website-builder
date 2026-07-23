/**
 * Central feature flags for the editor SPA.
 * Server-side plan entitlements remain authoritative for AI quotas.
 */
import { APP_CONFIG, getAppMode, showImportExport, useLocalStorage } from '@/constants.js';

export const FeatureFlags = {
  get appMode() {
    return getAppMode();
  },
  get useLocalSiteConfig() {
    return Boolean(APP_CONFIG.SITE_CONFIG_LOADING?.useLocal_site_config);
  },
  get allowLocalStorage() {
    return useLocalStorage();
  },
  get showImportExport() {
    return showImportExport();
  },
  get isEditor() {
    return getAppMode() === 'EDITOR';
  },
  get isViewer() {
    return getAppMode() === 'VIEWER';
  },
  /** Prefer Media/CDN URLs — large data:image embeds are rejected server-side (>100KB). */
  preferRemoteImageUrls: true,
} as const;
