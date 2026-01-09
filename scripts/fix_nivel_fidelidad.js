
const sdk = require('node-appwrite');

const client = new sdk.Client();

// Init SDK
client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('696048f60006dabb8ae3')
    .setKey('standard_2219109f419ac031a6d69aca63956e3711376cc88980072f1d9f8f1d49a2569b4229a736c1dda9a3a5e4ab8dcedde84a2bbec377ece440d79622cfd2e46ce65d1db7ec05706e07d4a20def14b31742aad031b28081b02ef1038767e44943223f53817c4ba8acdf574d4f228aa5dd492d86617580e0b200990b64ce2a24b76eba');

const databases = new sdk.Databases(client);
const DATABASE_ID = '696049d9000983d28c16';
const COLLECTION_CLIENTES = 'clientes';

async function fixNivelFidelidad() {
    try {
        console.log("🛠️ Checking 'nivelFidelidad' attribute...");

        try {
            // Check if it exists
            const attrs = await databases.listAttributes(DATABASE_ID, COLLECTION_CLIENTES);
            const exists = attrs.attributes.find(a => a.key === 'nivelFidelidad');

            if (exists) {
                console.log("✅ Attribute 'nivelFidelidad' already exists.");
                return;
            }

            console.log("👉 Attribute missing. Creating 'nivelFidelidad' (string, default='BRONCE')...");
            // Create as String since we want to be flexible, or Enum. The code uses strings like "BRONCE", "ORO". 
            // Enum is safer but string is more flexible for quick fixes. 
            // Given previous issues, let's stick to simple String first, but Enum is better for data integrity.
            // Let's use Enum to be professional if possible, or String if we want to avoid Enum mismatch issues.
            // Looking at the code: it assigns "BRONCE", "PLATA", "ORO". 
            // Let's create it as a STRING to be safe against future enum changes, as requested in typical quick fixes.
            await databases.createStringAttribute(DATABASE_ID, COLLECTION_CLIENTES, 'nivelFidelidad', 20, false, "BRONCE");
            console.log("✅ Created 'nivelFidelidad' attribute.");

        } catch (e) {
            console.error("❌ Error creating attribute:", e.message);
        }

    } catch (error) {
        console.error('❌ Fatal Error:', error);
    }
}

fixNivelFidelidad();
