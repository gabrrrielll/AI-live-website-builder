"use client";

import type { SiteConfig } from '@/types';
import { getCurrentSubdomain } from '@/constants.js';
import { localStorageService } from '@/services/localStorageService';
// EmailJS now handled by backend service

// Funcție pentru obținerea nonce-ului WordPress (ETAPA 1)
async function getWordPressNonce(): Promise<string> {
  try {
    const { API_CONFIG } = await import('@/constants.js');

    const response = await fetch(`${API_CONFIG.BASE_URL}/wp-json/ai-web-site/v1/wp-nonce`, {
      credentials: 'include',
      method: 'GET'
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.nonce) {
        return data.nonce;
      }
      throw new Error('Invalid nonce response from custom endpoint');
    }

    throw new Error(`Custom nonce endpoint failed: ${response.status}`);
  } catch (error) {
    console.error('Eroare la obținerea nonce-ului:', error);
    throw error;
  }
}

// Save site configuration locally to public folder
export const saveConfigLocally = async (config: SiteConfig): Promise<{ success: boolean }> => {
  try {
    // Salvează în localStorage prin noul serviciu cu restricții de domeniu
    localStorageService.saveSiteConfig(config);

    // Create a downloadable file with the site configuration
    const configJson = JSON.stringify(config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'site-config.json';

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('Configurația a fost salvată în localStorage și descărcată ca fișier');
    return { success: true };
  } catch (error) {
    console.error('Eroare la salvarea locală:', error);
    // Fallback: salvează în localStorage prin noul serviciu cu restricții de domeniu
    localStorageService.saveSiteConfig(config);
    console.log('Configurația a fost salvată în localStorage ca fallback');
    return { success: true };
  }
};

// API to upload the site configuration to the server
export const uploadConfig = async (config: SiteConfig): Promise<{ success: boolean }> => {
  try {
    // Folosește noul WordPress REST API endpoint
    const { API_CONFIG } = await import('@/constants.js');
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORDPRESS_REST}`;

    console.log('🚀 === FRONTEND: uploadConfig() CALLED ===');
    console.log('🌐 URL complet:', url);
    console.log('📝 API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
    console.log('📝 API_CONFIG.ENDPOINTS.WORDPRESS_REST:', API_CONFIG.ENDPOINTS.WORDPRESS_REST);

    // Adaugă informații despre subdomain și domain pentru identificare
    const currentSubdomain = getCurrentSubdomain();
    const baseDomain = API_CONFIG.BASE_URL.replace('https://', '');

    // HACK pentru localhost: folosește editor.ai-web.site
    let domain: string;
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

    if (isLocalhost) {
      // În localhost, folosește configurația editorului
      const editorDomain = 'editor.ai-web.site';
      domain = editorDomain;
      console.log('🏠 LOCALHOST detectat - folosesc domeniul editorului');
    } else {
      // În production, folosește domeniul curent
      domain = currentSubdomain ? `${currentSubdomain}.${baseDomain}` : baseDomain;
    }

    console.log('🔍 Current subdomain:', currentSubdomain);
    console.log('🔍 Base domain:', baseDomain);
    console.log('🔍 Full domain:', domain);
    console.log('🔍 Is localhost:', isLocalhost);

    const requestData = {
      config,
      domain,
      subdomain: currentSubdomain || 'my-site'
    };

    console.log('📦 Request data keys:', Object.keys(requestData));

    // Obține nonce-ul pentru securitate (ETAPA 1)
    const nonce = await getWordPressNonce();
    console.log('🔐 Nonce obținut:', nonce);

    console.log('📤 Trimit POST request către:', url);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-WP-Nonce': nonce,
    };

    const isLocalDev = isLocalhost && import.meta.env.DEV;
    if (isLocalDev) {
      const localApiKey = import.meta.env.VITE_LOCAL_API_KEY;
      if (localApiKey) {
        headers['X-Local-API-Key'] = localApiKey;
      } else {
        console.warn('🏠 LOCALHOST: Cheia locală nu este definită în .env.local');
      }
    }

    console.log('📤 Headers:', headers);

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors', // Explicit CORS mode
      credentials: 'include', // ✅ Trimite cookies pentru autentificare WordPress
      headers: headers,
      body: JSON.stringify(requestData),
    });

    console.log('📥 Răspuns primit - Status:', response.status);
    console.log('📥 Răspuns primit - OK:', response.ok);
    console.log('📥 Răspuns primit - Headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      console.log('✅ Status 200 - Încep să citesc body...');
      try {
        // Citește body-ul ca text mai întâi
        const bodyText = await response.text();
        console.log('✅ Body text primit (lungime):', bodyText.length);
        console.log('✅ Body text (primele 500 caractere):', bodyText.substring(0, 500));

        // Încearcă să parseze JSON-ul
        const responseData = JSON.parse(bodyText);
        console.log('✅ JSON parsat cu succes');
        console.log('✅ Response data:', responseData);
        console.log('✅ Configurația a fost încărcată cu succes pe server');
        return { success: true };
      } catch (jsonError) {
        console.error('❌ Eroare la parsarea JSON:', jsonError);
        throw new Error(`JSON parse error: ${jsonError}`);
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Eroare la încărcarea pe server:', response.status, errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('💥 Eroare la încărcarea configurației:', error);
    throw error;
  }
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormConfig {
  recipientEmail: string;
}

// Send contact form via backend service
export const sendContactForm = async (formData: FormData, config: FormConfig): Promise<{ success: boolean }> => {
  try {
    // Get API base URL from constants
    const { API_CONFIG } = await import('@/constants.js');
    const url = `${API_CONFIG.BASE_URL}/ai-service.php`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'send_email',
        template_data: {
          from_name: formData.name,
          reply_to: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
        recipient_email: config.recipientEmail
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to send email');
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send contact form:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while sending the message.');
  }
};
