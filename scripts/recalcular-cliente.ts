/**
 * Script para recalcular puntos de cliente basado en historial
 * 
 * USO: En Appwrite Console, ve a Functions o ejecuta esto como script
 */

import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTIONS = {
    CLIENTES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CLIENTES!,
    HISTORIAL_PUNTOS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_HISTORIAL_PUNTOS!,
};

async function recalcularPuntosCliente(clienteId: string) {
    console.log(`\n🔄 Recalculando puntos para cliente: ${clienteId}`);

    // 1. Obtener TODOS los registros del historial
    const historial = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.HISTORIAL_PUNTOS,
        [Query.equal('clienteId', clienteId)]
    );

    console.log(`📊 Registros en historial: ${historial.total}`);

    // 2. Calcular totales
    const totalPuntos = historial.documents.reduce((sum: number, record: any) => sum + (record.puntos || 0), 0);

    // 3. Calcular nivel
    let nivel = "BRONCE";
    if (totalPuntos >= 20) nivel = "ORO";
    else if (totalPuntos >= 10) nivel = "PLATA";

    console.log(`✅ Total puntos calculados: ${totalPuntos}`);
    console.log(`✅ Nivel calculado: ${nivel}`);

    // 4. Actualizar cliente
    await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CLIENTES,
        clienteId,
        {
            puntosAcumulados: totalPuntos,
            nivelFidelidad: nivel
        }
    );

    console.log(`✅ Cliente actualizado correctamente`);
}

// ID del cliente "pruebas" - REEMPLAZA ESTO
const CLIENTE_ID = "695ef5e500163a2d373c";

recalcularPuntosCliente(CLIENTE_ID)
    .then(() => console.log('\n✅ Script completado'))
    .catch(err => console.error('\n❌ Error:', err));
