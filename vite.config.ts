import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'AI-Powered Live Website Editor',
                short_name: 'AI Website Editor',
                description: 'An interactive website builder that allows for real-time, in-browser editing of text and images.',
                theme_color: '#c29a47',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/bibic\.ro\/api\//,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 // 24 hours
                            }
                        }
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React
                    'react-vendor': ['react', 'react-dom'],

                    // Routing
                    'router': ['react-router-dom'],

                    // UI Libraries - split by size
                    'radix-ui': [
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-popover',
                        '@radix-ui/react-select',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-switch',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-toast',
                        '@radix-ui/react-tooltip'
                    ],

                    // Large UI components
                    'ui-components': [
                        'react-beautiful-dnd',
                        'react-quill',
                        'react-image-crop',
                        'lucide-react'
                    ],

                    // Utilities and helpers
                    'utils': [
                        'clsx',
                        'class-variance-authority',
                        'tailwind-merge',
                        'tailwindcss-animate',
                        'debounce',
                        'dompurify',
                        'sonner'
                    ],

                    // Validation
                    'validation': ['zod', 'zod-validation-error'],

                    // SEO and meta
                    'seo': ['react-helmet-async']
                }
            }
        }
    },
    server: {
        port: 3000,
        open: {
            app: {
                name: 'firefox',
                arguments: ['--private-window', 'http://localhost:3000']
            }
        }
    },
    define: {
        // Suppress source map warnings in development
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    },
    preview: {
        port: 4173,
        open: true
    },
    envPrefix: 'VITE_'
})
