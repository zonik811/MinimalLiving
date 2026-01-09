const { Client, Storage, ID, Permission, Role } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('696048f60006dabb8ae3')
    .setKey('standard_2219109f419ac031a6d69aca63956e3711376cc88980072f1d9f8f1d49a2569b4229a736c1dda9a3a5e4ab8dcedde84a2bbec377ece440d79622cfd2e46ce65d1db7ec05706e07d4a20def14b31742aad031b28081b02ef1038767e44943223f53817c4ba8acdf574d4f228aa5dd492d86617580e0b200990b64ce2a24b76eba');

const storage = new Storage(client);

async function fixStorage() {
    try {
        console.log('📦 Listing buckets...');
        const buckets = await storage.listBuckets();

        let bucketId;
        if (buckets.total > 0) {
            console.log(`✅ Found existing bucket: ${buckets.buckets[0].name} (${buckets.buckets[0].$id})`);
            bucketId = buckets.buckets[0].$id;
        } else {
            console.log('⚠️ No buckets found. Creating "minimal_storage"...');
            const newBucket = await storage.createBucket(
                ID.unique(),
                'minimal_storage',
                [Permission.read(Role.any())], // Public read
                false, // fileSecurity
                true // enabled
            );
            bucketId = newBucket.$id;
            console.log(`✅ Created Bucket: ${bucketId}`);
        }

        console.log(`OUTPUT_BUCKET_ID::${bucketId}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

fixStorage();
