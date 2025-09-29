#!/usr/bin/env node

import https from 'https';

// Configurații cPanel
const CPANEL_CONFIG = {
    username: 'r48312maga',
    token: 'JACSKFOEX1D40JJL8UFY28ADKUXA3M9G',
    domain: 'ai-web.site',
    port: 2083
};

function makeApiRequest(endpoint) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${CPANEL_CONFIG.username}:${CPANEL_CONFIG.token}`).toString('base64');

        const options = {
            hostname: CPANEL_CONFIG.domain,
            port: CPANEL_CONFIG.port,
            path: endpoint,
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            rejectUnauthorized: false
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('Status Code:', res.statusCode);
                console.log('Response Headers:', res.headers);
                console.log('Response Data:', data.substring(0, 500));

                try {
                    const result = JSON.parse(data);
                    resolve(result);
                } catch (e) {
                    reject(new Error(`Parse error: ${data.substring(0, 200)}`));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

async function testApi() {
    try {
        console.log('🔍 Testing cPanel API...');
        console.log('Username:', CPANEL_CONFIG.username);
        console.log('Token:', CPANEL_CONFIG.token.substring(0, 10) + '...');
        console.log('Domain:', CPANEL_CONFIG.domain);
        console.log('');

        // Test 1: List home directory
        console.log('📁 Testing: List home directory');
        const result1 = await makeApiRequest('/execute/Fileman/list_files?dir=/home/r48312maga');
        console.log('Result 1:', result1);
        console.log('');

    } catch (error) {
        console.error('❌ API Test Failed:', error.message);
    }
}

testApi();
