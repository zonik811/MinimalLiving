
const sdk = require('node-appwrite');

const client = new sdk.Client();

// Init SDK
client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('696048f60006dabb8ae3') // Your project ID
    .setKey('standard_2219109f419ac031a6d69aca63956e3711376cc88980072f1d9f8f1d49a2569b4229a736c1dda9a3a5e4ab8dcedde84a2bbec377ece440d79622cfd2e46ce65d1db7ec05706e07d4a20def14b31742aad031b28081b02ef1038767e44943223f53817c4ba8acdf574d4f228aa5dd492d86617580e0b200990b64ce2a24b76eba'); // Your secret API key

const databases = new sdk.Databases(client);
const DATABASE_ID = '696049d9000983d28c16';
const COLLECTION_EMPLEADOS = 'empleados'; // Assuming this is the ID or we need to find it

async function inspectSchema() {
    try {
        console.log(`Fetching attributes for collection: ${COLLECTION_EMPLEADOS}`);
        const response = await databases.listAttributes(DATABASE_ID, COLLECTION_EMPLEADOS);

        const attributes = response.attributes;
        console.log(`Total attributes: ${attributes.length}`);

        const serviciosAttr = attributes.find(a => a.key === 'serviciosRealizados' || a.key === 'totalServicios');

        if (serviciosAttr) {
            console.log(`Found attribute: ${serviciosAttr.key}`);
            console.log(`Type: ${serviciosAttr.type}`);
        } else {
            console.log("Attributes 'serviciosRealizados' or 'totalServicios' NOT found.");
        }

        console.log("\nAll Attributes:");
        attributes.forEach(attr => {
            console.log(`- ${attr.key} (${attr.type})`);
        });

    } catch (error) {
        console.error('Error inspecting schema:', error);
    }
}

inspectSchema();
