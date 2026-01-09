
const sdk = require('node-appwrite');

const client = new sdk.Client();

// Init SDK
client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('696048f60006dabb8ae3')
    .setKey('standard_2219109f419ac031a6d69aca63956e3711376cc88980072f1d9f8f1d49a2569b4229a736c1dda9a3a5e4ab8dcedde84a2bbec377ece440d79622cfd2e46ce65d1db7ec05706e07d4a20def14b31742aad031b28081b02ef1038767e44943223f53817c4ba8acdf574d4f228aa5dd492d86617580e0b200990b64ce2a24b76eba');

const databases = new sdk.Databases(client);
const DATABASE_ID = '696049d9000983d28c16';
const COLLECTION_EMPLEADOS = 'empleados';
const COLLECTION_CITAS = 'citas';

async function fixSchemaAndBackfill() {
    try {
        console.log("1. Adding 'serviciosRealizados' attribute...");
        try {
            await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_EMPLEADOS, 'serviciosRealizados', false, 0, 2000000000, 0);
            console.log("✅ Attribute 'serviciosRealizados' created.");
            // Wait for attribute to be available
            console.log("Waiting 5s for attribute propagation...");
            await new Promise(r => setTimeout(r, 5000));
        } catch (error) {
            console.log("ℹ️ Attribute might already exist or error:", error.message);
        }

        console.log("2. Adding 'totalServicios' attribute (backup)...");
        try {
            await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_EMPLEADOS, 'totalServicios', false, 0, 2000000000, 0);
            console.log("✅ Attribute 'totalServicios' created.");
            // Wait for attribute to be available
            console.log("Waiting 5s for attribute propagation...");
            await new Promise(r => setTimeout(r, 5000));
        } catch (error) {
            console.log("ℹ️ Attribute might already exist or error:", error.message);
        }

        console.log("\n3. Backfilling data...");

        // Get all employees
        const empleados = await databases.listDocuments(DATABASE_ID, COLLECTION_EMPLEADOS);
        console.log(`Found ${empleados.total} employees.`);

        for (const emp of empleados.documents) {
            console.log(`Processing ${emp.nombre} ${emp.apellido} (${emp.$id})...`);

            // Count completed citations for this employee
            const citasList = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_CITAS,
                [
                    sdk.Query.equal('estado', 'completada'),
                    sdk.Query.contains('empleadosAsignados', emp.$id)
                ]
            );

            const count = citasList.total;
            console.log(`> Found ${count} completed services.`);

            // Update employee
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_EMPLEADOS,
                emp.$id,
                {
                    serviciosRealizados: count,
                    totalServicios: count
                }
            );
            console.log(`> Updated successfully.`);
        }

        console.log("\n🎉 Done! All employees updated.");

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

fixSchemaAndBackfill();
