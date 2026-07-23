# Deploy pipeline (CI → public repos)

On push to `master` / `main`, GitHub Actions publishes:

| Path changed | Target repo |
|--------------|-------------|
| `frontend/**` | [ai-web-site-dist](https://github.com/gabrrrielll/ai-web-site-dist) |
| `ai-web-site-plugin/**` | [ai-web-site-plugin](https://github.com/gabrrrielll/ai-web-site-plugin) |

Workflow: `.github/workflows/deploy.yml`

## One-time setup (required)

1. Create a GitHub **Personal Access Token** (classic: `repo` scope, or fine-grained with Contents: Read/Write on both public repos).
2. In **AI-live-website-builder** → Settings → Secrets and variables → Actions:
   - Name: `DEPLOY_PAT`
   - Value: the token
3. Push to `master` — Actions tab should show **Deploy public repos**.

## Local equivalent

```bash
npm run ci:deploy:plugin     # commit+push submodule plugin
npm run ci:deploy:frontend   # build + commit+push dist
npm run ci:deploy            # both
```

Then update parent monorepo submodule pointers and push.
