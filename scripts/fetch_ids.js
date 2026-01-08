const fs = require('fs');
const path = require('path');
const { Client, Databases } = require('node-appwrite');

async function main() {
    try {
        // 1. Parse env
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error('.env.local not found');
            return;
        }
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const env = {};
        envContent.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            const [key, ...rest] = trimmed.split('=');
            if (key && rest) {
                env[key.trim()] = rest.join('=').trim().replace(/"/g, '');
            }
        });

        const endpoint = env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
        const project = env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        const key = env.APPWRITE_API_KEY;
        const dbId = env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

        if (!endpoint || !project || !key || !dbId) {
            console.error('Missing env vars. Found:', Object.keys(env));
            return;
        }

        console.log('Connecting to:', endpoint, 'Project:', project);

        // 2. Init Appwrite
        const client = new Client()
            .setEndpoint(endpoint)
            .setProject(project)
            .setKey(key);

        const databases = new Databases(client);

        // 3. List Collections
        console.log('Listing collections for DB:', dbId);
        const collections = await databases.listCollections(dbId);

        console.log('--- Collections Found ---');
        collections.collections.forEach(col => {
            console.log(`NAME: ${col.name} | ID: ${col.$id}`);
        });

    } catch (e) {
        console.error('Error:', e);
    }
}

main();
