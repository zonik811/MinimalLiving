/**
 * Script para actualizar manualmente clientes y empleados
 * Ejecutar en la terminal del sistema (PowerShell):
 * 
 * node --loader ts-node/esm scripts/fix-stats.mjs
 */

// Este script debe ejecutarse manualmente en Appwrite Console
// porque requiere las variables de entorno

console.log(`
====================================
 MANUAL FIX - Cliente "pruebas"
====================================

Ve a Appwrite Console:

1. DATABASE → clientes → busca el documento del cliente "pruebas"
   Edita y CAMBIA estos valores:
   - puntosAcumulados: 5
   - totalGastado: 525000  (5 servicios × $105,000)
   - serviciosCompletados: 5
   - nivelFidelidad: "BRONCE"

2. DATABASE → empleados → busca "oscar cubillos"
   Edita y CAMBIA:
   - serviciosRealizados: 5

3. Guarda ambos cambios

====================================

PARA EL FUTURO:
Cada vez que cambies una cita a "Completada" desde el admin,
estos valores se actualizarán automáticamente.

¿Por qué no funcionó antes?
- Las 5 citas ya estaban completadas ANTES de que agregara
  el código de actualización.
- El código solo se ejecuta cuando se MARCA como completada,
  no cuando ya lo está.

====================================
`);
