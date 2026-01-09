
const { Client, Databases } = require('node-appwrite');

// Hardcoded for standalone execution
const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '696048f60006dabb8ae3';
const API_KEY = 'standard_2219109f419ac031a6d69aca63956e3711376cc88980072f1d9f8f1d49a2569b4229a736c1dda9a3a5e4ab8dcedde84a2bbec377ece440d79622cfd2e46ce65d1db7ec05706e07d4a20def14b31742aad031b28081b02ef1038767e44943223f53817c4ba8acdf574d4f228aa5dd492d86617580e0b200990b64ce2a24b76eba';
const DATABASE_ID = '696049d9000983d28c16';
const COLLECTION_CITAS = 'citas';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function checkPermissions() {
    try {
        console.log(`🔍 Checking permissions for collection: ${COLLECTION_CITAS}`);
        const collection = await databases.getCollection(DATABASE_ID, COLLECTION_CITAS);

        console.log('--- Permissions ---');
        console.log(JSON.stringify(collection.$permissions, null, 2));

        // Also check attributes just in case
        // console.log('--- Attributes ---');
        // console.log(collection.attributes.map(a => a.key));

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkPermissions();
