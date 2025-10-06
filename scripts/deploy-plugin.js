#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurații pentru repository-ul plugin
const PLUGIN_DEPLOY_CONFIG = {
    // Repository-ul public pentru plugin
    publicRepoUrl: 'https://github.com/gabrrrielll/ai-web-site-plugin.git',
    publicRepoPath: path.join(__dirname, '../ai-web-site-plugin'),
    // Repository-ul privat pentru cod sursă
    privateRepoPath: path.join(__dirname, '..'),
    pluginSourcePath: path.join(__dirname, '../ai-web-site-plugin')
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

function ensurePluginRepo() {
    // Verifică dacă repository-ul plugin există
    if (!fs.existsSync(PLUGIN_DEPLOY_CONFIG.publicRepoPath)) {
        log('📁 Cloning plugin repository...', 'blue');
        runCommand(`git clone ${PLUGIN_DEPLOY_CONFIG.publicRepoUrl} ${PLUGIN_DEPLOY_CONFIG.publicRepoPath}`);
    }

    // Actualizează repository-ul plugin
    log('🔄 Updating plugin repository...', 'blue');
    runCommand('git pull origin main', PLUGIN_DEPLOY_CONFIG.publicRepoPath);
}

function commitAndPushPlugin() {
    log('📝 Checking for changes...', 'blue');

    // Verifică dacă sunt modificări
    try {
        const status = runCommand('git status --porcelain', PLUGIN_DEPLOY_CONFIG.publicRepoPath);
        if (!status.trim()) {
            log('ℹ️  No changes to commit', 'yellow');
            return;
        }
    } catch (error) {
        log('⚠️  Could not check git status, proceeding with commit...', 'yellow');
    }

    // Adaugă toate fișierele
    runCommand('git add .', PLUGIN_DEPLOY_CONFIG.publicRepoPath);

    // Commit cu mesaj automat
    const timestamp = new Date().toISOString();
    const commitMessage = `feat: Update plugin files - ${timestamp}`;
    runCommand(`git commit -m "${commitMessage}"`, PLUGIN_DEPLOY_CONFIG.publicRepoPath);

    log('🚀 Pushing plugin to GitHub...', 'blue');
    runCommand('git push origin main', PLUGIN_DEPLOY_CONFIG.publicRepoPath);

    log('✅ Successfully pushed plugin to public repository!', 'green');
}

async function deployPlugin() {
    try {
        log('🚀 Starting plugin deployment...', 'bold');

        // Pasul 1: Asigură-te că repository-ul plugin există și este actualizat
        ensurePluginRepo();

        // Pasul 2: Commit și push în repository-ul plugin (fișierele sunt deja acolo)
        commitAndPushPlugin();

        // Rezultat final
        log('\n🎉 Plugin deployment completed successfully!', 'green');
        log('📊 Deployment Summary:', 'bold');
        log('✅ Plugin files pushed to public repository', 'green');
        log('✅ Changes committed and pushed to GitHub', 'green');
        log('\n🌐 Next steps for WordPress:', 'blue');
        log('1. Go to cPanel → Git Version Control', 'blue');
        log('2. Use this URL: https://github.com/gabrrrielll/ai-web-site-plugin.git', 'blue');
        log('3. Set Repository Path to: ai-web.site (or your WordPress root)', 'blue');
        log('4. Click "Create" to deploy', 'blue');
        log('\n🔌 WordPress Plugin Installation:', 'blue');
        log('1. Activate the plugin in WordPress Admin', 'blue');
        log('2. Configure API keys in plugin settings', 'blue');
        log('3. Test functionality', 'blue');

    } catch (error) {
        log(`❌ Plugin deployment failed: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Rulează deploy-ul
console.log('🚀 Starting plugin deploy script...');
deployPlugin();
