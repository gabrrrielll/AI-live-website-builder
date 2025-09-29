# Changelog

All notable changes to this project will be documented in this file.

## [2024-09-29] - Major Restructure

### 🏗️ Architecture Changes
- **BREAKING**: Restructured project from monolithic to backend/frontend separation
- **NEW**: Backend now uses WordPress + PHP APIs instead of direct file management
- **NEW**: Frontend is now a separate React.js application with Vite

### 📁 Project Structure
```
AI-live-website-builder/
├── backend/                    # WordPress + API-uri PHP
│   ├── api/                   # AI services and site config APIs
│   ├── config/                # Backend configuration
│   └── wordpress/             # WordPress with custom plugin
├── frontend/                  # React.js with Vite
│   ├── src/, components/, hooks/ # React application
│   ├── services/, utils/      # Frontend services
│   └── dist/                  # Static build output
└── docs/                      # Updated documentation
```

### ✨ New Features
- **WordPress Plugin**: Custom plugin for subdomain management
- **cPanel API Integration**: Automatic subdomain creation via cPanel API
- **Subdomain Architecture**: Single React build serves multiple subdomains
- **Database Integration**: WordPress MySQL database for site configurations

### 🔧 Technical Changes
- **Backend**: PHP APIs for AI services (Gemini, Unsplash)
- **Frontend**: React.js with TypeScript, Tailwind CSS, Radix UI
- **Build System**: Vite for fast development and optimized builds
- **Subdomain Routing**: All subdomains point to single React build with different configs

### 📚 Documentation
- **NEW**: `docs/README.md` - Complete project overview
- **NEW**: `docs/ARCHITECTURE.md` - Detailed architecture documentation
- **NEW**: `docs/BACKEND_SETUP.md` - WordPress and cPanel setup guide
- **UPDATED**: `docs/README-REACT.md` - Frontend documentation

### 🗑️ Removed
- **REMOVED**: Old dual-mode approach documentation
- **REMOVED**: Static build only approach
- **REMOVED**: Local file-based configuration
- **REMOVED**: Test API documentation for old architecture
- **REMOVED**: URL modification flows for old system

### 🐛 Bug Fixes
- **FIXED**: Import paths for constants.js after restructuring
- **FIXED**: Missing framer-motion dependency
- **FIXED**: File organization and cleanup

### 🔄 Migration Notes
- **From**: Single React app with local storage
- **To**: WordPress backend + React frontend
- **Subdomains**: Now managed through WordPress plugin
- **Config**: Stored in WordPress database instead of local files

### 📋 Next Steps
- [ ] WordPress installation and setup
- [ ] cPanel API configuration
- [ ] Plugin activation and testing
- [ ] Subdomain creation testing
- [ ] Frontend deployment to editor.ai-web.site

---

## Previous Versions

### [2024-09-25] - React Migration
- Migrated from Next.js to React.js with Vite
- Implemented static build capability
- Added PWA support

### [2024-09-15] - Initial Release
- AI-powered website builder
- Real-time editing capabilities
- AI content generation (Gemini, Unsplash)
- Multi-language support
- Blog system with CRUD operations
