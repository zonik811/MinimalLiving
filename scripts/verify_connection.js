const { Client, Databases, Storage } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('696048f60006dabb8ae3')
    .setKey('standard_2219109f419ac031a6d69aca63956e3711376cc88980072f1d9f8f1d49a2569b4229a736c1dda9a3a5e4ab8dcedde84a2bbec377ece440d79622cfd2e46ce65d1db7ec05706e07d4a20def14b31742aad031b28081b02ef1038767e44943223f53817c4ba8acdf574d4f228aa5dd492d86617580e0b200990b64ce2a24b76eba');

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = '696049d9000983d28c16';

async function verify() {
    console.log('🔍 Verifying Connection...');
    try {
        const collections = await databases.listCollections(DATABASE_ID);
        console.log(`✅ Connected to Database: ${DATABASE_ID}`);
        console.log(`📚 Found ${collections.total} collections:`);
        collections.collections.forEach(c => console.log(`   - ${c.name} (ID: ${c.$id})`));

        console.log('\n📦 Checking Storage Buckets...');
        const buckets = await storage.listBuckets();
        if (buckets.total > 0) {
            console.log(`✅ Found ${buckets.total} buckets:`);
            buckets.buckets.forEach(b => console.log(`   - ${b.name} (ID: ${b.$id})`));
        } else {
            console.log('⚠️ No buckets found. We verify if we need to create one.');
        }

    } catch (error) {
        console.error('❌ Error connecting:', error.message);
    }
}

verify();
