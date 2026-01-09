
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');

console.log('Checking .env.local manually...');

try {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    let hasKey = false;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('APPWRITE_API_KEY=')) {
            hasKey = true;
            const value = trimmed.split('=')[1];
            if (value) {
                console.log('✅ APPWRITE_API_KEY found.');
                console.log('Key length:', value.length);
                console.log('Key start:', value.substring(0, 5));
            } else {
                console.log('⚠️ APPWRITE_API_KEY exists but is empty.');
            }
        }
    });

    if (!hasKey) {
        console.log('❌ APPWRITE_API_KEY is MISSING from .env.local');
    }

} catch (e) {
    console.error('Error reading .env.local:', e.message);
}
