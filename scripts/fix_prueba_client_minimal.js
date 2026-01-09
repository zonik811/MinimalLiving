
const { Client, Databases, Users, ID, Query } = require('node-appwrite');

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '696048f60006dabb8ae3';
const API_KEY = 'standard_2219109f419ac031a6d69aca63956e3711376cc88980072f1d9f8f1d49a2569b4229a736c1dda9a3a5e4ab8dcedde84a2bbec377ece440d79622cfd2e46ce65d1db7ec05706e07d4a20def14b31742aad031b28081b02ef1038767e44943223f53817c4ba8acdf574d4f228aa5dd492d86617580e0b200990b64ce2a24b76eba';
const DATABASE_ID = '696049d9000983d28c16';
const COLLECTION_CLIENTES = 'clientes';

const clientData = {
    nombre: 'Usuario Prueba',
    email: 'prueba@prueba.com',
    telefono: '3001234567',
    // Removed other fields to test minimal creation
    // direccion: 'Calle Falsa 123',
    // ciudad: 'Bogota',
    // tipoCliente: 'residencial', 
    // frecuenciaPreferida: 'semanal',
    // activo: true
};

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function main() {
    try {
        console.log('🛠 Creating minimal client record...');
        const newDoc = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_CLIENTES,
            ID.unique(),
            clientData
        );
        console.log('✅ Success:', newDoc.$id);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();
