# AI-Powered Live Website Editor (Next.js Version)

An interactive website builder that allows for real-time, in-browser editing of text, images, and backgrounds. All changes are saved locally, with AI-powered content generation features to assist in creation. This version is built with Next.js for improved performance, security, and scalability.

---

## ✨ Features

-   **Live WYSIWYG Editing**: Double-click on any element to edit it directly in the browser.
-   **AI Content Generation**: Powered by the Google Gemini API, running securely on the server-side.
    -   Generate compelling text for any section.
    -   Create unique, high-quality images from a simple prompt.
-   **Server-Side Security**: All API keys (Gemini, Unsplash, EmailJS) are kept on the server and are never exposed to the client's browser.
-   **Improved Performance**: Benefits from Next.js features like Server-Side Rendering (SSR) and automatic code splitting for faster page loads.
-   **Persistent State**: All changes are automatically saved to your browser's Local Storage.
-   **Undo/Redo**: A complete history stack allows you to undo and redo actions.
-   **Import/Export**: Save your entire site configuration as a JSON file for backup or migration.
-   **PWA Ready**: Includes a service worker for offline capabilities.

---

## 🚀 Tech Stack

-   **Framework**: Next.js (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **AI**: Google Gemini API (`@google/genai`)
-   **Rich Text**: React Quill
-   **Icons**: Lucide React
-   **Notifications**: Sonner

---

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

-   Node.js (v18 or later recommended)
-   A package manager like `npm` or `yarn`

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/ai-website-builder-next.git
    cd ai-website-builder-next
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    This project uses environment variables to securely store API keys.
    
    a. Create a new file named `.env.local` in the root of your project.
    
    b. Copy the contents from `.env.local.example` into your new `.env.local` file.
    
    c. Replace the placeholder values with your actual API keys.
    ```env
    # .env.local

    # Google Gemini API Key
    # https://ai.google.dev/
    GEMINI_API_KEY="AIza..."

    # Unsplash API for stock photos
    # https://unsplash.com/developers
    UNSPLASH_API_KEY="..."

    # EmailJS credentials for the contact form
    # https://www.emailjs.com/
    EMAILJS_SERVICE_ID="..."
    EMAILJS_TEMPLATE_ID="..."
    EMAILJS_PUBLIC_KEY="..."
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ⚙️ How It Works

-   **Next.js App Router**: The application uses the `app/` directory for file-system based routing. `app/page.tsx` is the main entry point, and `app/layout.tsx` is the root layout for the entire site.
-   **Server and Client Components**: Components that need browser-specific APIs (like `localStorage`) or React hooks (`useState`, `useEffect`) are marked with the `"use client";` directive. Logic that uses secret API keys runs in server-side API Routes (`app/api/...`).
-   **API Routes**: These act as a secure proxy between the client and third-party services like Gemini, Unsplash, and EmailJS.
-   **`SiteContext`**: A React Context that acts as the central state manager on the client side. It holds the current site configuration, edit mode status, history for undo/redo, and all core logic for updating elements.
-   **Local Storage**: The application state is automatically and persistently saved to the browser's local storage, so your work is never lost.

---

## 📦 Deployment

You can deploy this Next.js application to any hosting provider that supports Node.js, such as Vercel, Netlify, or AWS Amplify.

1.  **Build the project**: 
    ```bash
    npm run build
    ```
2.  **Start the production server**:
    ```bash
    npm run start
    ```

When deploying, ensure you configure the same environment variables from your `.env.local` file in your hosting provider's dashboard. **Do not commit your `.env.local` file to version control.**
