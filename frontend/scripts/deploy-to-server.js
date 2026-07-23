#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurații pentru repository-urile separate
const DEPLOY_CONFIG = {
    // Repository-ul public pentru build files
    publicRepoUrl: 'https://github.com/gabrrrielll/ai-web-site-dist.git',
    publicRepoPath: path.join(__dirname, '../../ai-web-site-dist'),
    // Repository-ul privat pentru cod sursă
    privateRepoPath: path.join(__dirname, '../..')
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

function ensurePublicRepo() {
    // Verifică dacă repository-ul public există
    if (!fs.existsSync(DEPLOY_CONFIG.publicRepoPath)) {
        log('📁 Cloning public repository...', 'blue');
        runCommand(`git clone ${DEPLOY_CONFIG.publicRepoUrl} ${DEPLOY_CONFIG.publicRepoPath}`);
    }

    // Actualizează repository-ul public
    log('🔄 Updating public repository...', 'blue');
    runCommand('git pull origin main', DEPLOY_CONFIG.publicRepoPath);
}

function copyBuildFiles() {
    const distPath = path.join(__dirname, '..', 'dist');

    if (!fs.existsSync(distPath)) {
        throw new Error('dist folder not found! Run "npm run build" first.');
    }

    // Șterge conținutul vechi din repository-ul public
    const publicRepoContents = fs.readdirSync(DEPLOY_CONFIG.publicRepoPath);
    for (const item of publicRepoContents) {
        const itemPath = path.join(DEPLOY_CONFIG.publicRepoPath, item);
        if (item !== '.git' && item !== 'README.md') {
            if (fs.statSync(itemPath).isDirectory()) {
                fs.rmSync(itemPath, { recursive: true, force: true });
            } else {
                fs.unlinkSync(itemPath);
            }
        }
    }

    // Copiază toate fișierele din dist/ (cross-platform)
    log('📋 Copying build files...', 'blue');
    fs.cpSync(distPath, DEPLOY_CONFIG.publicRepoPath, {
        recursive: true,
        filter: (src) => {
            const base = path.basename(src);
            return base !== '.git';
        },
    });

    log(`✅ Build files copied to public repository`, 'green');
}

function commitAndPush() {
    log('📝 Committing changes...', 'blue');

    // Verifică dacă sunt modificări
    try {
        const status = runCommand('git status --porcelain', DEPLOY_CONFIG.publicRepoPath);
        if (!status.trim()) {
            log('ℹ️  No changes to commit', 'yellow');
            return;
        }
    } catch (error) {
        log('⚠️  Could not check git status, proceeding with commit...', 'yellow');
    }

    // Adaugă toate fișierele
    runCommand('git add .', DEPLOY_CONFIG.publicRepoPath);

    // Commit cu mesaj automat
    const timestamp = new Date().toISOString();
    const commitMessage = `feat: Update build files - ${timestamp}`;
    runCommand(`git commit -m "${commitMessage}"`, DEPLOY_CONFIG.publicRepoPath);

    log('🚀 Pushing to GitHub...', 'blue');
    runCommand('git push origin main', DEPLOY_CONFIG.publicRepoPath);

    log('✅ Successfully pushed to public repository!', 'green');
}

async function deploy() {
    try {
        log('🚀 Starting deployment to public repository...', 'bold');

        // Pasul 1: Asigură-te că repository-ul public există și este actualizat
        ensurePublicRepo();

        // Pasul 2: Copiază fișierele din build în repository-ul public
        copyBuildFiles();

        // Pasul 3: Commit și push în repository-ul public
        commitAndPush();

        // Rezultat final
        log('\n🎉 Deployment completed successfully!', 'green');
        log('📊 Deployment Summary:', 'bold');
        log('✅ Build generated successfully', 'green');
        log('✅ Files copied to public repository', 'green');
        log('✅ Changes committed and pushed to GitHub', 'green');
        log('\n🌐 Next steps:', 'blue');
        log('1. Go to cPanel → Git Version Control', 'blue');
        log('2. Use this URL: https://github.com/gabrrrielll/ai-web-site-dist.git', 'blue');
        log('3. Set Repository Path to: editor.ai-web.site', 'blue');
        log('4. Click "Create" to deploy', 'blue');
        log('\n🚀 Your site will be available at: https://editor.ai-web.site', 'green');

    } catch (error) {
        log(`❌ Deployment failed: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Rulează deploy-ul
console.log('🚀 Starting deploy script...');
deploy();

export { deploy };
