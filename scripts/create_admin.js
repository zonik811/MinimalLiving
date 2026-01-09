const { Client, Databases, Users, ID } = require('node-appwrite');

// Hardcoded credentials
const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '696048f60006dabb8ae3';
const API_KEY = 'standard_2219109f419ac031a6d69aca63956e3711376cc88980072f1d9f8f1d49a2569b4229a736c1dda9a3a5e4ab8dcedde84a2bbec377ece440d79622cfd2e46ce65d1db7ec05706e07d4a20def14b31742aad031b28081b02ef1038767e44943223f53817c4ba8acdf574d4f228aa5dd492d86617580e0b200990b64ce2a24b76eba';
const DATABASE_ID = '696049d9000983d28c16';
const EMPLEADOS_COLLECTION_ID = 'empleados';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);
const users = new Users(client);

async function createAdmin() {
    try {
        console.log('🚀 Fetching Admin User from Auth...');
        const userList = await users.list([
            // Search by email not directly supported in list queries easily without query syntax, 
            // but 'search' param exists in some versions or Query.equal('email', ...)
        ]);

        // Find manually
        const adminUser = userList.users.find(u => u.email === 'admin@admin.com');

        let userId = null;
        if (adminUser) {
            console.log(`✅ Found Admin Auth User: ${adminUser.$id}`);
            userId = adminUser.$id;
        } else {
            console.warn("⚠️ Admin user 'admin@admin.com' not found in Auth. Creating a record without userId (might fail if required).");
            // Optional: Create the auth user if missing? No, user implied it exists.
        }

        console.log('Checking if Employee Record exists...');
        const existing = await databases.listDocuments(
            DATABASE_ID,
            EMPLEADOS_COLLECTION_ID
        ).catch(e => ({ documents: [] }));

        const exists = existing.documents && existing.documents.find(d => d.email === 'admin@admin.com');

        if (exists) {
            console.log("✅ Admin already exists in Employee collection. ID:", exists.$id);
            return;
        }

        const adminData = {
            userId: userId,
            nombre: 'Admin',
            apellido: 'Sistema',
            documento: 'admin123',
            telefono: '3000000000',
            email: 'admin@admin.com',
            // direccion: 'Sede Principal', // Not in schema
            // fechaNacimiento: '1990-01-01', // Not in schema
            // fechaContratacion: new Date().toISOString(), // Not in schema
            cargo: 'organizador',
            especialidades: ['gestion'],
            tarifaPorHora: 0,
            // modalidadPago: 'fijo_mensual', // Not in schema
            activo: true,
            // totalServicios: 0, // Not in schema
            calificacionPromedio: 5.0,
            // createdAt will be auto-handled or we can pass it if we want custom, but usually not needed for createDocument unless we want to override, actually Appwrite handles $createdAt. 
            // We can just omit valid fields that are not in the schema.
        };

        const result = await databases.createDocument(
            DATABASE_ID,
            EMPLEADOS_COLLECTION_ID,
            ID.unique(),
            adminData
        );

        console.log('✅ Admin creado exitosamente con ID:', result.$id);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        if (error.response) {
            console.error('Full Error:', JSON.stringify(error.response, null, 2));
        } else {
            console.error(error);
        }
    }
}

createAdmin();
