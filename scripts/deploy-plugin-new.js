#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLUGIN_REPO_NAME = 'ai-web-site-plugin';
const PLUGIN_REPO_URL = `https://github.com/gabrrrielll/${PLUGIN_REPO_NAME}.git`;
const BACKEND_DIR = path.join(__dirname, '..', 'backend');
const TEMP_DIR = path.join(__dirname, '..', PLUGIN_REPO_NAME);

console.log('🚀 Starting new plugin deployment...\n');

try {
    // Step 1: Remove old temp directory if exists
    console.log('🧹 Cleaning up old temp directory...');
    try {
        execSync(`rmdir /s /q "${TEMP_DIR}"`, { stdio: 'ignore' });
    } catch (e) {
        // Directory doesn't exist, that's fine
    }

    // Step 2: Clone the new repository
    console.log('📥 Cloning new plugin repository...');
    execSync(`git clone ${PLUGIN_REPO_URL} "${TEMP_DIR}"`, { stdio: 'inherit' });

    // Step 3: Copy backend files
    console.log('📋 Copying plugin files...');
    execSync(`xcopy /E /I /Y "${BACKEND_DIR}\\*" "${TEMP_DIR}"`, { stdio: 'inherit' });

    // Step 4: Navigate to temp directory
    process.chdir(TEMP_DIR);

    // Step 5: Add all files
    console.log('📝 Adding files to git...');
    execSync('git add .', { stdio: 'inherit' });

    // Step 6: Commit changes
    const timestamp = new Date().toISOString();
    const commitMessage = `feat: Update plugin files - ${timestamp}`;
    console.log('💾 Committing changes...');
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

    // Step 7: Push to repository
    console.log('🚀 Pushing to GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });

    console.log('\n✅ Plugin deployment completed successfully!');
    console.log('\n📊 Deployment Summary:');
    console.log('✅ Plugin files copied to new repository');
    console.log('✅ Changes committed and pushed to GitHub');
    console.log('\n🌐 Next steps for WordPress:');
    console.log('1. Delete old repository: ai-web-site-backend');
    console.log('2. Go to cPanel → Git Version Control');
    console.log(`3. Use this URL: ${PLUGIN_REPO_URL}`);
    console.log('4. Set Repository Path to: ai-web-site-plugin');
    console.log('5. Click "Create" to deploy');

} catch (error) {
    console.error('\n❌ Plugin deployment failed:');
    console.error(error.message);
    process.exit(1);
}
