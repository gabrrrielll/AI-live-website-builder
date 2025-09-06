"use client";

import type { SiteConfig } from '@/types';
import emailjs from '@emailjs/browser';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from '@/env';

// Mock API to simulate uploading the site configuration to a server.
export const uploadConfig = (config: SiteConfig): Promise<{ success: boolean }> => {
  console.log("Attempting to sync configuration:", config);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a 70% success rate
      if (Math.random() > 0.3) {
        console.log("Sync successful!");
        resolve({ success: true });
      } else {
        console.error("Sync failed!");
        reject(new Error("Failed to connect to the server."));
      }
    }, 1500); // 1.5 second delay
  });
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

// Actual API to send a contact form submission via EmailJS directly in browser.
export const sendContactForm = async (formData: FormData, config: FormConfig): Promise<{ success: boolean }> => {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: config.recipientEmail,
        from_name: formData.name,
        reply_to: formData.email,
        phone: formData.phone,
        message: formData.message,
      },
      EMAILJS_PUBLIC_KEY
    );

    return { success: true };
  } catch (error) {
    console.error('Failed to send contact form:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while sending the message.');
  }
};
