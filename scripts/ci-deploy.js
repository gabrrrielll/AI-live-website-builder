#!/usr/bin/env node
/**
 * Local / CI helper: publish frontend build to ai-web-site-dist
 * and/or plugin sources to ai-web-site-plugin.
 *
 * Usage:
 *   node scripts/ci-deploy.js --frontend
 *   node scripts/ci-deploy.js --plugin
 *   node scripts/ci-deploy.js --all
 *
 * Auth: uses existing git remotes in the submodule folders, or
 * DEPLOY_PAT / GH_TOKEN for HTTPS push if remotes need rewriting.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const args = new Set(process.argv.slice(2));
const doFrontend = args.has('--frontend') || args.has('--all');
const doPlugin = args.has('--plugin') || args.has('--all');

if (!doFrontend && !doPlugin) {
  console.error('Usage: node scripts/ci-deploy.js --frontend | --plugin | --all');
  process.exit(1);
}

function run(cmd, cwd = root) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { cwd, stdio: 'inherit', env: process.env });
}

function runCapture(cmd, cwd = root) {
  return execSync(cmd, { cwd, encoding: 'utf8', env: process.env }).trim();
}

function ensureCleanPush(repoPath, message) {
  const status = runCapture('git status --porcelain', repoPath);
  if (!status) {
    console.log(`No changes in ${repoPath}`);
    return false;
  }
  run('git add -A', repoPath);
  // Avoid failing when nothing staged after add
  const staged = runCapture('git diff --cached --name-only', repoPath);
  if (!staged) {
    console.log(`Nothing staged in ${repoPath}`);
    return false;
  }
  run(`git commit -m ${JSON.stringify(message)}`, repoPath);
  run('git push origin HEAD:main', repoPath);
  return true;
}

function copyDist(src, dest) {
  const entries = fs.readdirSync(dest);
  for (const name of entries) {
    if (name === '.git' || name === 'README.md') continue;
    fs.rmSync(path.join(dest, name), { recursive: true, force: true });
  }
  fs.cpSync(src, dest, {
    recursive: true,
    filter: (from) => {
      const base = path.basename(from);
      // Skip accidental OS/editor duplicates like "file (1).json"
      if (/\s\(\d+\)\./.test(base)) return false;
      return true;
    },
  });
}

if (doFrontend) {
  console.log('\n=== Frontend → ai-web-site-dist ===\n');
  run('npm run build', path.join(root, 'frontend'));
  const distBuild = path.join(root, 'frontend', 'dist');
  const distRepo = path.join(root, 'ai-web-site-dist');
  if (!fs.existsSync(distBuild)) {
    throw new Error('frontend/dist missing after build');
  }
  if (!fs.existsSync(path.join(distRepo, '.git'))) {
    throw new Error('ai-web-site-dist submodule/.git missing');
  }
  run('git pull --ff-only origin main', distRepo);
  copyDist(distBuild, distRepo);
  ensureCleanPush(
    distRepo,
    `ci: deploy frontend build ${new Date().toISOString()}`
  );
}

if (doPlugin) {
  console.log('\n=== Plugin → ai-web-site-plugin ===\n');
  const pluginRepo = path.join(root, 'ai-web-site-plugin');
  if (!fs.existsSync(path.join(pluginRepo, '.git'))) {
    throw new Error('ai-web-site-plugin submodule/.git missing');
  }
  run('git pull --ff-only origin main', pluginRepo);
  ensureCleanPush(
    pluginRepo,
    `ci: deploy plugin ${new Date().toISOString()}`
  );
}

console.log('\nDone.');
