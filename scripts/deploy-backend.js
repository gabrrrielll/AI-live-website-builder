#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurații pentru repository-ul backend
const BACKEND_DEPLOY_CONFIG = {
    // Repository-ul public pentru backend
    publicRepoUrl: 'https://github.com/gabrrrielll/ai-web-site-backend.git',
    publicRepoPath: path.join(__dirname, '../ai-web-site-backend'),
    // Repository-ul privat pentru cod sursă
    privateRepoPath: path.join(__dirname, '..'),
    backendSourcePath: path.join(__dirname, '../backend')
};

// Culori pentru console
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, cwd = process.cwd()) {
    try {
        log(`Running: ${command}`, 'blue');
        const output = execSync(command, {
            cwd,
            stdio: 'pipe',
            encoding: 'utf8'
        });
        return output.trim();
    } catch (error) {
        throw new Error(`Command failed: ${command}\nError: ${error.message}`);
    }
}

function ensureBackendRepo() {
    // Verifică dacă repository-ul backend există
    if (!fs.existsSync(BACKEND_DEPLOY_CONFIG.publicRepoPath)) {
        log('📁 Cloning backend repository...', 'blue');
        runCommand(`git clone ${BACKEND_DEPLOY_CONFIG.publicRepoUrl} ${BACKEND_DEPLOY_CONFIG.publicRepoPath}`);
    }

    // Actualizează repository-ul backend
    log('🔄 Updating backend repository...', 'blue');
    runCommand('git pull origin main', BACKEND_DEPLOY_CONFIG.publicRepoPath);
}

function copyBackendFiles() {
    const backendSourcePath = BACKEND_DEPLOY_CONFIG.backendSourcePath;

    if (!fs.existsSync(backendSourcePath)) {
        throw new Error('backend folder not found!');
    }

    // Șterge conținutul vechi din repository-ul backend (păstrează .git și README)
    const backendRepoContents = fs.readdirSync(BACKEND_DEPLOY_CONFIG.publicRepoPath);
    for (const item of backendRepoContents) {
        const itemPath = path.join(BACKEND_DEPLOY_CONFIG.publicRepoPath, item);
        if (item !== '.git' && item !== 'README.md') {
            if (fs.statSync(itemPath).isDirectory()) {
                fs.rmSync(itemPath, { recursive: true, force: true });
            } else {
                fs.unlinkSync(itemPath);
            }
        }
    }

    // Copiază toate fișierele din backend/
    log('📋 Copying backend files...', 'blue');
    runCommand(`xcopy /E /I /Y "${backendSourcePath}\\*" "${BACKEND_DEPLOY_CONFIG.publicRepoPath}"`);

    log(`✅ Backend files copied to public repository`, 'green');
}

function commitAndPushBackend() {
    log('📝 Checking for changes...', 'blue');

    // Verifică dacă sunt modificări
    try {
        const status = runCommand('git status --porcelain', BACKEND_DEPLOY_CONFIG.publicRepoPath);
        if (!status.trim()) {
            log('ℹ️  No changes to commit', 'yellow');
            return;
        }
    } catch (error) {
        log('⚠️  Could not check git status, proceeding with commit...', 'yellow');
    }

    // Adaugă toate fișierele
    runCommand('git add .', BACKEND_DEPLOY_CONFIG.publicRepoPath);

    // Commit cu mesaj automat
    const timestamp = new Date().toISOString();
    const commitMessage = `feat: Update backend files - ${timestamp}`;
    runCommand(`git commit -m "${commitMessage}"`, BACKEND_DEPLOY_CONFIG.publicRepoPath);

    log('🚀 Pushing backend to GitHub...', 'blue');
    runCommand('git push origin main', BACKEND_DEPLOY_CONFIG.publicRepoPath);

    log('✅ Successfully pushed backend to public repository!', 'green');
}

async function deployBackend() {
    try {
        log('🚀 Starting backend deployment...', 'bold');

        // Pasul 1: Asigură-te că repository-ul backend există și este actualizat
        ensureBackendRepo();

        // Pasul 2: Copiază fișierele din backend în repository-ul public
        copyBackendFiles();

        // Pasul 3: Commit și push în repository-ul backend
        commitAndPushBackend();

        // Rezultat final
        log('\n🎉 Backend deployment completed successfully!', 'green');
        log('📊 Deployment Summary:', 'bold');
        log('✅ Backend files copied to public repository', 'green');
        log('✅ Changes committed and pushed to GitHub', 'green');
        log('\n🌐 Next steps for WordPress:', 'blue');
        log('1. Go to cPanel → Git Version Control', 'blue');
        log('2. Use this URL: https://github.com/gabrrrielll/ai-web-site-backend.git', 'blue');
        log('3. Set Repository Path to: ai-web.site (or your WordPress root)', 'blue');
        log('4. Click "Create" to deploy', 'blue');
        log('\n🔌 WordPress Plugin Installation:', 'blue');
        log('1. Activate the plugin in WordPress Admin', 'blue');
        log('2. Configure API keys in plugin settings', 'blue');
        log('3. Test subdomain creation functionality', 'blue');

    } catch (error) {
        log(`❌ Backend deployment failed: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Rulează deploy-ul
console.log('🚀 Starting backend deploy script...');
deployBackend();
