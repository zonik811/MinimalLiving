
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const apiKey = 'standard_2219109f419ac031a6d69aca63956e3711376cc88980072f1d9f8f1d49a2569b4229a736c1dda9a3a5e4ab8dcedde84a2bbec377ece440d79622cfd2e46ce65d1db7ec05706e07d4a20def14b31742aad031b28081b02ef1038767e44943223f53817c4ba8acdf574d4f228aa5dd492d86617580e0b200990b64ce2a24b76eba'; // Same as create_admin.js

console.log('Adding API Key to .env.local...');

try {
    const content = fs.readFileSync(envPath, 'utf8');
    if (content.includes('APPWRITE_API_KEY=')) {
        console.log('Key already exists (even if empty, strictly appending might duplicate). Replacing or skipping...');
        // If it exists but is empty as found by check_env, better to replace. 
        // But check_env said "MISSING".
    } else {
        fs.appendFileSync(envPath, `\nAPPWRITE_API_KEY=${apiKey}\n`);
        console.log('✅ API Key appended successfully.');
    }

} catch (e) {
    console.error('Error writing .env.local:', e.message);
}
