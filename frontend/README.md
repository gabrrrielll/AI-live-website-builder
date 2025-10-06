# AI Website Builder - Frontend

## 🚀 Deployment

### Automatic Deployment

The frontend is automatically deployed to the public repository when you run:

```bash
npm run deploy:frontend
```

This script:
1. Builds the frontend application (`npm run build`)
2. Deploys to [ai-web-site-dist](https://github.com/gabrrrielll/ai-web-site-dist) repository
3. Updates the public build files for server deployment

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to server:
   ```bash
   npm run deploy
   ```

## 🔧 Development

### Local Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

- `src/` - Source code
- `dist/` - Built files (generated)
- `public/` - Static assets
- `scripts/` - Build and deployment scripts

## 🔄 Auto-Update

The frontend automatically includes:
- Latest security features
- localStorage restrictions (EDITOR mode only)
- Import/Export functionality (localhost only)
- Hostname-based feature toggling

---

**Last Updated**: $(date)
