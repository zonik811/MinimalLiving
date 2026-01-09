
const { Client, Databases } = require('node-appwrite');

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '696048f60006dabb8ae3';
const API_KEY = 'standard_2219109f419ac031a6d69aca63956e3711376cc88980072f1d9f8f1d49a2569b4229a736c1dda9a3a5e4ab8dcedde84a2bbec377ece440d79622cfd2e46ce65d1db7ec05706e07d4a20def14b31742aad031b28081b02ef1038767e44943223f53817c4ba8acdf574d4f228aa5dd492d86617580e0b200990b64ce2a24b76eba';
const DATABASE_ID = '696049d9000983d28c16';
const COLLECTION_CLIENTES = 'clientes';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function inspect() {
    try {
        console.log('Fetching attributes for collection:', COLLECTION_CLIENTES);
        const response = await databases.listAttributes(DATABASE_ID, COLLECTION_CLIENTES);

        response.attributes.forEach(attr => {
            if (attr.key.includes('frecuencia') || attr.key.includes('recuencia')) {
                console.log(`Key: ${attr.key}`);
                console.log(`Type: ${attr.type}`);
                console.log(`Format: ${attr.format}`);
                if (attr.format === 'enum') {
                    console.log(`Options: ${JSON.stringify(attr.elements)}`);
                }
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

inspect();
