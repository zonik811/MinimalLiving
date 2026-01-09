
const sdk = require('node-appwrite');

const client = new sdk.Client();

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('696048f60006dabb8ae3')
    .setKey('standard_2219109f419ac031a6d69aca63956e3711376cc88980072f1d9f8f1d49a2569b4229a736c1dda9a3a5e4ab8dcedde84a2bbec377ece440d79622cfd2e46ce65d1db7ec05706e07d4a20def14b31742aad031b28081b02ef1038767e44943223f53817c4ba8acdf574d4f228aa5dd492d86617580e0b200990b64ce2a24b76eba');

const databases = new sdk.Databases(client);
const DATABASE_ID = '696049d9000983d28c16';
const COLLECTION_GASTOS = 'gastos';

async function inspectSchema() {
    try {
        console.log(`🔍 Inspecting schema for collection: ${COLLECTION_GASTOS}`);
        const response = await databases.listAttributes(DATABASE_ID, COLLECTION_GASTOS);

        console.log("---------------------------------------------------");
        response.attributes.forEach(attr => {
            let details = `[${attr.key}]: Type=${attr.type}, Required=${attr.required}`;
            if (attr.format === 'enum') {
                details += `, Options=[${attr.elements.join(', ')}]`;
            }
            console.log(details);
        });
        console.log("---------------------------------------------------");

    } catch (error) {
        console.error('❌ Error inspecting schema:', error);
    }
}

inspectSchema();
