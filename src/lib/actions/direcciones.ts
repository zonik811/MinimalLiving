"use server";

import { databases } from "@/lib/appwrite-admin";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import type { Direccion, CreateResponse, TipoPropiedad } from "@/types";

export interface CrearDireccionInput {
    clienteId: string;
    nombre: string;
    direccion: string;
    ciudad: string;
    barrio?: string;
    tipo: TipoPropiedad;
}

/**
 * Obtiene las direcciones de un cliente
 */
export async function obtenerDireccionesCliente(clienteId: string): Promise<Direccion[]> {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.DIRECCIONES,
            [
                Query.equal("clienteId", clienteId),
                Query.orderDesc("$createdAt")
            ]
        );
        return response.documents as unknown as Direccion[];
    } catch (error) {
        console.error("Error obteniendo direcciones:", error);
        return [];
    }
}

/**
 * Guarda una nueva dirección para un cliente
 */
export async function crearDireccion(data: CrearDireccionInput): Promise<CreateResponse<Direccion>> {
    try {
        const doc = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.DIRECCIONES,
            ID.unique(),
            {
                clienteId: data.clienteId,
                nombre: data.nombre,
                direccion: data.direccion,
                ciudad: data.ciudad,
                barrio: data.barrio,
                tipo: data.tipo
            }
        );
        return { success: true, data: doc as unknown as Direccion };
    } catch (error: any) {
        console.error("Error creando dirección:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Elimina una dirección
 */
export async function eliminarDireccion(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            COLLECTIONS.DIRECCIONES,
            id
        );
        return { success: true };
    } catch (error: any) {
        console.error("Error eliminando dirección:", error);
        return { success: false, error: error.message };
    }
}
