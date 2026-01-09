
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
const COLLECTION_CITAS = 'citas';

async function inspectSchemas() {
    try {
        console.log(`\n--- Inspecting ${COLLECTION_CLIENTES} ---`);
        const clientesAttrs = await databases.listAttributes(DATABASE_ID, COLLECTION_CLIENTES);

        ['puntosAcumulados', 'serviciosCompletados'].forEach(key => {
            const attr = clientesAttrs.attributes.find(a => a.key === key);
            if (attr) {
                console.log(`[${key}]: Type=${attr.type}, Array=${attr.array}, Required=${attr.required}`);
            } else {
                console.log(`[${key}]: NOT FOUND`);
            }
        });

        console.log(`\n--- Inspecting ${COLLECTION_CITAS} ---`);
        const citasAttrs = await databases.listAttributes(DATABASE_ID, COLLECTION_CITAS);

        const estadoAttr = citasAttrs.attributes.find(a => a.key === 'estado');
        if (estadoAttr) {
            console.log(`[estado]: Type=${estadoAttr.type}, Format=${estadoAttr.format}`);
            if (estadoAttr.elements) console.log(`Options: ${JSON.stringify(estadoAttr.elements)}`);
        } else {
            console.log(`[estado]: NOT FOUND`);
        }

    } catch (error) {
        console.error('Error inspecting schemas:', error);
    }
}

inspectSchemas();
