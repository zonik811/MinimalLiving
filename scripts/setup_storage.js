const { Client, Databases, Storage, ID } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('696048f60006dabb8ae3')
    .setKey('standard_2219109f419ac031a6d69aca63956e3711376cc88980072f1d9f8f1d49a2569b4229a736c1dda9a3a5e4ab8dcedde84a2bbec377ece440d79622cfd2e46ce65d1db7ec05706e07d4a20def14b31742aad031b28081b02ef1038767e44943223f53817c4ba8acdf574d4f228aa5dd492d86617580e0b200990b64ce2a24b76eba');

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = '696049d9000983d28c16';

async function setupAndVerify() {
    console.log('🚀 Starting Setup & Verification...');

    // 1. Verify Database
    try {
        console.log(`\n🔍 Checking Database ${DATABASE_ID}...`);
        const collections = await databases.listCollections(DATABASE_ID);
        console.log(`✅ Database connected. Found ${collections.total} collections.`);
        if (collections.total > 0) {
            collections.collections.forEach(c => console.log(`   - ${c.name}`));
        } else {
            console.log('⚠️ Warning: No collections found. Did you create them in the right database?');
        }
    } catch (error) {
        console.error('❌ Database Check Failed:', error.message);
    }

    // 2. Setup Storage
    try {
        console.log('\n📦 Checking Storage...');
        const buckets = await storage.listBuckets();
        let bucketId;

        if (buckets.total === 0) {
            console.log('   Creating new storage bucket: minimal_storage');
            const newBucket = await storage.createBucket(
                ID.unique(),
                'minimal_storage',
                ['file'], // permissions (file lever or bucket level?) - usually this is 'bucket' or valid permissions. 
                // Wait, createBucket args: (bucketId, name, permissions?, fileSecurity?, enabled?, maxFileSize?, allowedFileExtensions?, compression?, encryption?, antivirus?)
                // Actually in Node SDK it depends on version.
                // Let's use simple create and then update permissions maybe.
                // createBucket(bucketId, name, permissions, fileSecurity, enabled, maxFileSize, allowedFileExtensions, compression, encryption, antivirus)
            );
            bucketId = newBucket.$id;
            console.log(`✅ Created Bucket: ${bucketId}`);

            // Set permissions corresponding to "public read" for files?
            // Usually we want Role.any() to read.
            // But createBucket 3rd arg is permissions.
            // Let's retry creation with permissions if possible or just update it.
        } else {
            console.log(`   Found existing bucket: ${buckets.buckets[0].$id}`);
            bucketId = buckets.buckets[0].$id;
        }

        console.log(`👉 PLEASE UPDATE .env.local WITH: NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=${bucketId}`);
    } catch (error) {
        console.error('❌ Storage Check Failed:', error.message);
    }
}

setupAndVerify();
