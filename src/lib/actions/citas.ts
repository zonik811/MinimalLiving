"use server";

import { databases } from "@/lib/appwrite-admin";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { Query, ID } from "node-appwrite";
import {
    EstadoCita,
    TipoPropiedad,
    TipoCliente,
    FrecuenciaCliente,
} from "@/types";

import type {
    Cita,
    Cliente,
    CrearCitaInput,
    ActualizarCitaInput,
    FiltrosCitas,
    CreateResponse,
    UpdateResponse,
} from "@/types";
import { crearCliente, obtenerClientePorTelefono, actualizarCliente, obtenerClientePorEmail } from "@/lib/actions/clientes";
import { registrarPuntos } from "@/lib/actions/puntos";
import { crearDireccion } from "@/lib/actions/direcciones";

/**
 * Obtiene la lista de citas con filtros opcionales
 */
export async function obtenerCitas(filtros?: FiltrosCitas): Promise<Cita[]> {
    try {
        const queries: string[] = [];

        if (filtros?.estado) {
            queries.push(Query.equal("estado", filtros.estado));
        }

        if (filtros?.empleadoId) {
            queries.push(Query.contains("empleadosAsignados", filtros.empleadoId));
        }

        if (filtros?.fechaInicio) {
            queries.push(Query.greaterThanEqual("fechaCita", filtros.fechaInicio));
        }

        if (filtros?.fechaFin) {
            queries.push(Query.lessThanEqual("fechaCita", filtros.fechaFin));
        }

        if (filtros?.clienteId) {
            queries.push(Query.equal("clienteId", filtros.clienteId));
        }

        if (filtros?.pagadoPorCliente !== undefined) {
            queries.push(Query.equal("pagadoPorCliente", filtros.pagadoPorCliente));
        }

        // Ordenar por fecha de cita descendente
        queries.push(Query.orderDesc("fechaCita"));
        queries.push(Query.limit(100));

        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.CITAS,
            queries
        );

        return response.documents.map((doc) => ({
            id: doc.$id,
            ...doc,
        })) as unknown as Cita[];
    } catch (error: any) {
        console.error("Error obteniendo citas:", error);
        throw new Error(error.message || "Error al obtener citas");
    }
}

/**
 * Obtiene las citas de un cliente específico por su email
 */
export async function obtenerMisCitas(email: string): Promise<Cita[]> {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.CITAS,
            [
                Query.equal("clienteEmail", email),
                Query.orderDesc("fechaCita"), // Las más recientes primero
            ]
        );

        return response.documents.map((doc) => ({
            id: doc.$id,
            ...doc,
        })) as unknown as Cita[];
    } catch (error: any) {
        console.error("Error obteniendo mis citas:", error);
        return [];
    }
}

/**
 * Obtiene una cita por su ID
 */
export async function obtenerCita(id: string): Promise<Cita> {
    try {
        const cita = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.CITAS,
            id
        );

        return cita as unknown as Cita;
    } catch (error: any) {
        console.error("Error obteniendo cita:", error);
        throw new Error(error.message || "Error al obtener cita");
    }
}

/**
 * Crea una nueva cita
 */
export async function crearCita(
    data: CrearCitaInput
): Promise<CreateResponse<Cita>> {
    try {
        let clienteId = data.clienteId;
        const normalizedEmail = data.clienteEmail?.trim().toLowerCase();
        const normalizedPhone = data.clienteTelefono.trim();

        // Si no hay clienteId, buscar o crear cliente
        if (!clienteId) {
            // 1. Intentar buscar por Email (Prioridad para usuarios registrados)
            if (normalizedEmail) {
                const clientePorEmail = await obtenerClientePorEmail(normalizedEmail);
                if (clientePorEmail) {
                    clienteId = clientePorEmail.$id;
                }
            }

            // 2. Si no encontró por email, intentar por teléfono
            if (!clienteId && normalizedPhone) {
                const clientePorTelefono = await obtenerClientePorTelefono(normalizedPhone);
                if (clientePorTelefono) {
                    clienteId = clientePorTelefono.$id;
                }
            }

            // 3. Si AÚN no hay clienteId, crear nuevo cliente
            if (!clienteId) {
                const nuevoCliente = await crearCliente({
                    nombre: data.clienteNombre,
                    telefono: data.clienteTelefono,
                    email: data.clienteEmail,
                    direccion: data.direccion,
                    ciudad: data.ciudad,
                    tipoCliente: TipoCliente.RESIDENCIAL,
                    frecuenciaPreferida: FrecuenciaCliente.UNICA,
                });
                if (nuevoCliente.success && nuevoCliente.data) {
                    clienteId = nuevoCliente.data.$id;
                }
            }
        }

        // Guardar dirección SOLO si:
        // 1. Hay clienteId
        // 2. Hay dirección y ciudad válidas  
        // 3. El usuario NO seleccionó una dirección guardada (no viene direccionId)
        const isUsingExistingAddress = !!(data as any).direccionId;

        console.log("🔍 DEBUG - Address save decision:", {
            hasClienteId: !!clienteId,
            isUsingExistingAddress: isUsingExistingAddress,
            direccionId: (data as any).direccionId,
            willSaveAddress: clienteId && data.direccion && data.ciudad && !isUsingExistingAddress
        });

        if (clienteId && data.direccion && data.ciudad && !isUsingExistingAddress) {
            try {
                console.log("✅ Creating NEW address");

                const result = await crearDireccion({
                    clienteId: clienteId,
                    nombre: `${data.tipoPropiedad} - ${data.direccion}`,
                    direccion: data.direccion,
                    ciudad: data.ciudad,
                    barrio: (data as any).barrio,
                    tipo: data.tipoPropiedad
                });

                console.log("📍 Dirección saved result:", result);
            } catch (direccionError) {
                console.error("❌ Error guardando dirección (non-blocking):", direccionError);
            }
        } else if (isUsingExistingAddress) {
            console.log("ℹ️ Using existing saved address, skipping creation");
        } else {
            console.warn("⚠️ Skipping address save - missing required fields");
        }

        const citaData = {
            servicioId: data.servicioId || "limpieza-general",
            clienteId: clienteId || "",
            clienteNombre: data.clienteNombre,
            clienteTelefono: data.clienteTelefono,
            clienteEmail: data.clienteEmail,
            direccion: data.direccion,
            ciudad: data.ciudad,
            tipoPropiedad: data.tipoPropiedad,
            metrosCuadrados: data.metrosCuadrados,
            habitaciones: data.habitaciones,
            banos: data.banos,
            fechaCita: data.fechaCita,
            horaCita: data.horaCita,
            duracionEstimada: data.duracionEstimada,
            empleadosAsignados: data.empleadosAsignados || [],
            estado: EstadoCita.PENDIENTE,
            precioCliente: data.precioCliente,
            precioAcordado: data.precioAcordado || data.precioCliente,
            metodoPago: data.metodoPago,
            pagadoPorCliente: false,
            detallesAdicionales: data.detallesAdicionales,
            notasInternas: data.notasInternas,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const newCita = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.CITAS,
            ID.unique(),
            citaData
        );

        // Actualizar estadísticas del cliente
        if (clienteId) {
            await databases.getDocument(DATABASE_ID, COLLECTIONS.CLIENTES, clienteId)
                .then(async (cliente: any) => {
                    await actualizarCliente(clienteId!, {
                        totalServicios: cliente.totalServicios + 1,
                    });
                })
                .catch(() => { });
        }

        return {
            success: true,
            data: newCita as unknown as Cita,
        };
    } catch (error: any) {
        console.error("Error creando cita:", error);
        return {
            success: false,
            error: error.message || "Error al crear cita",
        };
    }
}

/**
 * Actualiza una cita existente
 */
export async function actualizarCita(
    id: string,
    data: ActualizarCitaInput
): Promise<UpdateResponse> {
    try {
        const updateData: any = {
            ...data,
            updatedAt: new Date().toISOString(),
        };

        // Get current appointment state BEFORE updating
        const currentCita = await databases.getDocument(DATABASE_ID, COLLECTIONS.CITAS, id);
        const wasAlreadyCompleted = currentCita.estado === EstadoCita.COMPLETADA;

        // Si se completa la cita (y NO estaba completada antes), agregar fecha de completado y calcular puntos
        if (data.estado === EstadoCita.COMPLETADA && !wasAlreadyCompleted) {
            updateData.completedAt = new Date().toISOString();

            // 2. Registrar puntos y actualizar cliente (Refactorizado para usar action centralizada)
            try {
                const descripcionServicio = data.servicioId || currentCita.servicioId || 'General';
                const precioServicio = currentCita.precioCliente || currentCita.precioAcordado || 0;

                if (currentCita.clienteId) {
                    console.log("✅ About to register points for client:", currentCita.clienteId);
                    const puntosResult = await registrarPuntos({
                        clienteId: currentCita.clienteId,
                        puntos: 1, // 1 punto por servicio
                        motivo: `Servicio Completado: ${descripcionServicio}`,
                        referenciaId: id,
                        precioServicio: precioServicio
                    });
                    console.log("📊 Points registration result:", puntosResult);
                }

                // 3. Actualizar contador de servicios de empleados asignados
                if (currentCita.empleadosAsignados && Array.isArray(currentCita.empleadosAsignados)) {
                    for (const empleadoId of currentCita.empleadosAsignados) {
                        try {
                            const empleado = await databases.getDocument(DATABASE_ID, COLLECTIONS.EMPLEADOS, empleadoId);
                            await databases.updateDocument(
                                DATABASE_ID,
                                COLLECTIONS.EMPLEADOS,
                                empleadoId,
                                {
                                    serviciosRealizados: (empleado.serviciosRealizados || 0) + 1
                                }
                            );
                            console.log(`✅ Updated employee ${empleadoId} service count`);
                        } catch (empError) {
                            console.warn(`Error updating employee ${empleadoId}:`, empError);
                        }
                    }
                } else {
                    console.warn("⚠️ No employees assigned to this appointment");
                }
            } catch (errorPuntos) {
                console.error("❌ ERROR registrando puntos en actualizarCita:", errorPuntos);
            }
        } else if (data.estado === EstadoCita.COMPLETADA && wasAlreadyCompleted) {
            console.log("ℹ️ Appointment was already completed, skipping points registration to avoid duplicates");
        }

        // Update the appointment
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.CITAS,
            id,
            updateData
        );

        // RECALCULAR ESTADÍSTICAS AUTOMÁTICAMENTE
        // Esto asegura que los contadores siempre reflejen la realidad de la BD

        // 1. Si cambiaron los empleados asignados, recalcular AMBOS sets (antiguos + nuevos)
        if (data.empleadosAsignados) {
            const oldEmpleados = currentCita.empleadosAsignados || [];
            const newEmpleados = data.empleadosAsignados || [];

            // Combinar ambos sets y eliminar duplicados
            const allAffectedEmpleados = [...new Set([...oldEmpleados, ...newEmpleados])];

            console.log(`🔄 Recalculando ${allAffectedEmpleados.length} empleados afectados por cambio de asignación`);

            // Recalcular cada empleado afectado
            for (const empleadoId of allAffectedEmpleados) {
                try {
                    const { recalcularServiciosEmpleado } = await import('./empleados');
                    await recalcularServiciosEmpleado(empleadoId);
                } catch (recalcError) {
                    console.warn(`⚠️ Error recalculando empleado ${empleadoId}:`, recalcError);
                }
            }
        }

        // 2. Si la cita cambió a completada, recalcular el cliente
        if (data.estado === EstadoCita.COMPLETADA && currentCita.clienteId) {
            try {
                const { recalcularServiciosCliente } = await import('./clientes');
                await recalcularServiciosCliente(currentCita.clienteId);
            } catch (recalcError) {
                console.warn(`⚠️ Error recalculando cliente:`, recalcError);
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error actualizando cita:", error);
        return {
            success: false,
            error: error.message || "Error al actualizar cita",
        };
    }
}

/**
 * Cambia el estado de una cita
 */
export async function cambiarEstadoCita(
    id: string,
    estado: EstadoCita
): Promise<UpdateResponse> {
    return actualizarCita(id, { estado });
}

/**
 * Asigna empleados a una cita
 */
export async function asignarEmpleados(
    citaId: string,
    empleadoIds: string[]
): Promise<UpdateResponse> {
    return actualizarCita(citaId, { empleadosAsignados: empleadoIds });
}

/**
 * Obtiene las citas del día actual
 */
export async function obtenerCitasHoy(): Promise<Cita[]> {
    const hoy = new Date();
    // Ajustar a zona horaria local si es necesario, pero por ahora usamos UTC date string simple
    // o simplemente la fecha actual. Appwrite guarda en UTC, pero filtramos por string YYYY-MM-DD
    const dateStr = hoy.toISOString().split("T")[0];

    return obtenerCitas({
        fechaInicio: dateStr,
        fechaFin: dateStr
    });
}

/**
 * Obtiene las citas de la semana actual
 */
export async function obtenerCitasSemana(): Promise<Cita[]> {
    const hoy = new Date();
    const firstDay = new Date(hoy.setDate(hoy.getDate() - hoy.getDay())); // Domingo
    const dateStr = firstDay.toISOString().split("T")[0];

    return obtenerCitas({
        fechaInicio: dateStr
    });
}
