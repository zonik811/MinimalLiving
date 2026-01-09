
const { Client, Databases, Users, ID, Query } = require('node-appwrite');

// Hardcoded credentials
const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '696048f60006dabb8ae3';
const API_KEY = 'standard_2219109f419ac031a6d69aca63956e3711376cc88980072f1d9f8f1d49a2569b4229a736c1dda9a3a5e4ab8dcedde84a2bbec377ece440d79622cfd2e46ce65d1db7ec05706e07d4a20def14b31742aad031b28081b02ef1038767e44943223f53817c4ba8acdf574d4f228aa5dd492d86617580e0b200990b64ce2a24b76eba';
const DATABASE_ID = '696049d9000983d28c16';
const COLLECTION_CLIENTES = 'clientes';

// Data for prueba@prueba.com with ALL attributes now available
const clientData = {
    nombre: 'Usuario Prueba',
    email: 'prueba@prueba.com',
    telefono: '3001234567',
    direccion: 'Calle Falsa 123',
    ciudad: 'Bogotá',
    tipoCliente: 'residencial',
    frecuenciaPreferida: 'unica', // Should exist as enum now
    activo: true,
    totalServicios: 0,
    totalGastado: 0,
    calificacionPromedio: 0
};

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function main() {
    console.log('🚀 Checking for existing client record...');

    try {
        const existing = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_CLIENTES,
            [Query.equal('email', clientData.email)]
        );

        if (existing.documents.length > 0) {
            console.log('⚠️ Client record already exists:', existing.documents[0].$id);
        } else {
            console.log('🛠 Creating missing client record...');
            const newDoc = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_CLIENTES,
                ID.unique(),
                clientData
            );
            console.log('✅ Client record created successfully:', newDoc.$id);
        }
    } catch (error) {
        console.error('❌ Error Message:', error.message);
        if (error.response && error.response.message) {
            console.error('❌ Server Response Message:', error.response.message);
        } else if (error.response) {
            console.error('❌ Full Error (JSON):', JSON.stringify(error.response).substring(0, 500));
        }
    }
}

main();
