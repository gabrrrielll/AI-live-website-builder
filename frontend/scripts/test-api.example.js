/**
 * Example cPanel API smoke test.
 * Copy to test-api.local.js (gitignored) and fill credentials from env — never commit secrets.
 *
 * Usage:
 *   CPANEL_USER=... CPANEL_TOKEN=... CPANEL_HOST=... node test-api.local.js
 */

import https from 'https';

const CPANEL_CONFIG = {
    username: process.env.CPANEL_USER || '',
    token: process.env.CPANEL_TOKEN || '',
    domain: process.env.CPANEL_HOST || '',
};

if (!CPANEL_CONFIG.username || !CPANEL_CONFIG.token || !CPANEL_CONFIG.domain) {
    console.error('Set CPANEL_USER, CPANEL_TOKEN, and CPANEL_HOST environment variables.');
    process.exit(1);
}

const auth = Buffer.from(`${CPANEL_CONFIG.username}:${CPANEL_CONFIG.token}`).toString('base64');

const req = https.request(
    {
        hostname: CPANEL_CONFIG.domain,
        port: 2083,
        path: '/execute/SubDomain/listsubdomains',
        method: 'GET',
        headers: {
            Authorization: `Basic ${auth}`,
        },
        rejectUnauthorized: true,
    },
    (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log('Status:', res.statusCode);
            console.log(data.slice(0, 500));
        });
    }
);

req.on('error', (err) => {
    console.error(err);
    process.exit(1);
});

req.end();
