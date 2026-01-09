
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

async function repairSchema() {
    try {
        console.log("🛠️ Starting Schema Repair for 'clientes'...");

        // 1. Create 'puntosAcumulados' (Integer) if missing
        try {
            console.log("👉 Creating attribute 'puntosAcumulados' (integer)...");
            await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_CLIENTES, 'puntosAcumulados', false, 0, 2000000000, 0);
            console.log("✅ Created 'puntosAcumulados'.");
        } catch (e) {
            console.log("ℹ️ 'puntosAcumulados' creation note: " + e.message);
        }

        // 2. Fix 'serviciosCompletados' (Convert from array to integer)
        try {
            console.log("👉 Inspecting 'serviciosCompletados'...");
            const attrs = await databases.listAttributes(DATABASE_ID, COLLECTION_CLIENTES);
            const currentAttr = attrs.attributes.find(a => a.key === 'serviciosCompletados');

            if (currentAttr) {
                if (currentAttr.array === true || currentAttr.type !== 'integer') {
                    console.log(`⚠️ 'serviciosCompletados' is Type=${currentAttr.type}, Array=${currentAttr.array}. Deleting...`);
                    await databases.deleteAttribute(DATABASE_ID, COLLECTION_CLIENTES, 'serviciosCompletados');
                    console.log("🗑️ Deleted 'serviciosCompletados'. Waiting 5s...");
                    await new Promise(r => setTimeout(r, 5000));

                    console.log("👉 Recreating 'serviciosCompletados' as Integer...");
                    await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_CLIENTES, 'serviciosCompletados', false, 0, 2000000000, 0);
                    console.log("✅ Recreated 'serviciosCompletados' as Integer.");
                } else {
                    console.log("✅ 'serviciosCompletados' is already Integer and not array.");
                }
            } else {
                console.log("👉 'serviciosCompletados' not found. Creating...");
                await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_CLIENTES, 'serviciosCompletados', false, 0, 2000000000, 0);
                console.log("✅ Created 'serviciosCompletados'.");
            }

        } catch (e) {
            console.error("❌ Error fixing 'serviciosCompletados':", e.message);
        }

        console.log("🏁 Schema repair complete.");

    } catch (error) {
        console.error('❌ Fatal Error:', error);
    }
}

repairSchema();
