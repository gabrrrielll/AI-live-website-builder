#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { generateSitemapDuringBuild } from '../utils/buildSitemap.js';
import { generateRobotsTxtDuringBuild } from '../utils/buildRobots.js';

async function buildSEO() {
    console.log('🔍 Building SEO files...');

    try {
        // Generate sitemap
        console.log('📄 Generating sitemap.xml...');
        await generateSitemapDuringBuild();
        console.log('✅ Sitemap generated successfully');

        // Generate robots.txt
        console.log('🤖 Generating robots.txt...');
        await generateRobotsTxtDuringBuild();
        console.log('✅ Robots.txt generated successfully');

        console.log('🎉 SEO files built successfully!');
    } catch (error) {
        console.error('❌ Error building SEO files:', error);
        process.exit(1);
    }
}

buildSEO();

