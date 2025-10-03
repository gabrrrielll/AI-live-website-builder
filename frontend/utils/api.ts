"use client";

import type { SiteConfig } from '@/types';
import { getCurrentSubdomain } from '@/constants.js';
// EmailJS now handled by backend service

// Funcție pentru obținerea nonce-ului WordPress (ETAPA 1)
async function getWordPressNonce(): Promise<string> {
  try {
    // Import constants pentru URL-uri
    const { API_CONFIG } = await import('@/constants.js');

    // Încearcă să obțină nonce-ul din WordPress REST API
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORDPRESS_NONCE}`, {
      credentials: 'include', // Include cookies pentru autentificare
    });

    if (response.ok) {
      // Dacă utilizatorul este logat, obține nonce-ul din header-ele
      const nonce = response.headers.get('X-WP-Nonce');
      if (nonce) {
        return nonce;
      }
    }

    // Fallback: generează nonce-ul din JavaScript (pentru testare)
    // În producție, acest nonce ar trebui să vină de la WordPress
    console.warn('Nu s-a putut obține nonce-ul din WordPress, folosind fallback');
    return 'fallback-nonce-' + Date.now();

  } catch (error) {
    console.error('Eroare la obținerea nonce-ului:', error);
    // Fallback pentru testare
    return 'fallback-nonce-' + Date.now();
  }
}

// Save site configuration locally to public folder
export const saveConfigLocally = async (config: SiteConfig): Promise<{ success: boolean }> => {
  try {
    // Save to localStorage first (this is what the app uses)
    localStorage.setItem('site-config', JSON.stringify(config));

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
    // Fallback: save to localStorage even if download fails
    localStorage.setItem('site-config', JSON.stringify(config));
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

    console.log('Încărcare configurație pe server:', url);

    // Adaugă informații despre subdomain și domain pentru identificare
    const currentSubdomain = getCurrentSubdomain();
    const baseDomain = API_CONFIG.BASE_URL.replace('https://', '');
    const domain = currentSubdomain ? `${currentSubdomain}.${baseDomain}` : baseDomain;

    const requestData = {
      config,
      domain,
      subdomain: currentSubdomain || 'my-site'
    };

    // Obține nonce-ul pentru securitate (ETAPA 1)
    const nonce = await getWordPressNonce();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce, // Nonce pentru protecție CSRF
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      console.log('Configurația a fost încărcată cu succes pe server');
      return { success: true };
    } else {
      const errorText = await response.text();
      console.error('Eroare la încărcarea pe server:', response.status, errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('Eroare la încărcarea configurației:', error);
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
