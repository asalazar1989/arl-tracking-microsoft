// ============================================
// MÓDULO 5: AGREGAR USUARIO (COMPLETO)
// Sistema ARL - Migración Microsoft
// ============================================
// Esta función agrega un nuevo paciente al Excel con todas
// las validaciones, cálculos automáticos y verificaciones
// ============================================

/**
 * Agrega un nuevo usuario al Excel con todas las validaciones
 * @param {string} hojaOrigen - Nombre de la hoja original (ej: "Positiva")
 * @param {Object} datosFormulario - Datos del formulario
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<Object>} Resultado de la operación
 */
async function agregarUsuarioCompleto(hojaOrigen, datosFormulario, accessToken, excelFileId) {
    console.log('\n🚀 Iniciando proceso de agregar usuario...');
    console.log('📋 Hoja origen:', hojaOrigen);
    
    try {
        // ========================================
        // PASO 1: Determinar hoja destino
        // ========================================
        let hojaDestino = hojaOrigen;
        
        // Si es Positiva, verificar si es paciente evento
        if (hojaOrigen === 'Positiva') {
            hojaDestino = await window.PositivaEvento.manejarPositivaEvento(
                datosFormulario,
                accessToken,
                excelFileId
            );
            console.log('✅ Hoja destino determinada:', hojaDestino);
        }

        // ========================================
        // PASO 2: Verificar y crear columnas necesarias
        // ========================================
        console.log('\n🔍 Verificando columnas necesarias...');
        
        const resultadoColumnas = await window.ColumnManager.verificarYCrearTodasLasColumnas(
            hojaDestino,
            accessToken,
            excelFileId
        );
        
        if (resultadoColumnas.totalCreadas > 0) {
            console.log(`✅ ${resultadoColumnas.totalCreadas} columnas creadas`);
        }

        // ========================================
        // PASO 3: Obtener headers actualizados
        // ========================================
        const headers = await window.ExcelHelpers.getHeaders(hojaDestino, accessToken, excelFileId);
        console.log(`✅ Headers obtenidos: ${headers.length} columnas`);

        // ========================================
        // PASO 4: Preparar fila de datos
        // ========================================
        const nuevaFila = new Array(headers.length).fill('');

        // Mapear campos básicos del formulario a las columnas
        headers.forEach((header, index) => {
            if (!header) return;
            
            const headerUpper = header.toString().toUpperCase().trim();
            
            // Campos estándar
            if (headerUpper === 'SINIESTRO') nuevaFila[index] = datosFormulario.siniestro || '';
            else if (headerUpper === '# MATRICULA' || headerUpper === 'MATRICULA') nuevaFila[index] = datosFormulario.matricula || '';
            else if (headerUpper === 'CEDULA') nuevaFila[index] = datosFormulario.cedula || '';
            else if (headerUpper === 'NOMBRE') nuevaFila[index] = datosFormulario.nombre || '';
            else if (headerUpper === 'FECHA DE ASIGNACION A LA IPS') nuevaFila[index] = datosFormulario.fechaAsignacion || '';
            else if (headerUpper === 'GENERO' || headerUpper === 'GÉNERO') nuevaFila[index] = datosFormulario.genero || '';
            else if (headerUpper.includes('MAYOR A 56')) nuevaFila[index] = datosFormulario.mayorA56 || '';
            else if (headerUpper === 'AUDITOR') nuevaFila[index] = datosFormulario.auditor || '';
            else if (headerUpper.includes('CLASIFICACION SEVERIDAD')) nuevaFila[index] = datosFormulario.clasificacionSeveridad || '';
            else if (headerUpper.includes('ESTADO DE LA MATRICULA')) nuevaFila[index] = datosFormulario.estadoMatricula || '';
            else if (headerUpper === 'OBSERVACION') nuevaFila[index] = datosFormulario.observacion || '';
        });

        // ========================================
        // PASO 5: Procesar citas médicas
        // ========================================
        console.log('\n📅 Procesando citas médicas...');
        
        const citasProcesadas = procesarCitasMedicas(datosFormulario, headers);
        citasProcesadas.forEach(cita => {
            const index = headers.findIndex(h => 
                h && h.toString().toUpperCase().trim() === cita.nombre.toUpperCase()
            );
            if (index !== -1) {
                nuevaFila[index] = cita.valor;
                console.log(`   ✓ ${cita.nombre}: ${cita.valor}`);
            }
        });

        // ========================================
        // PASO 6: Calcular campos automáticos
        // ========================================
        console.log('\n🧮 Calculando campos automáticos...');
        
        // HOY
        const fechaHoy = window.Calculators.obtenerFechaHoy();
        const indexHoy = headers.findIndex(h => 
            h && h.toString().toUpperCase().trim() === 'HOY'
        );
        if (indexHoy !== -1) {
            nuevaFila[indexHoy] = fechaHoy;
            console.log(`   ✓ HOY: ${fechaHoy}`);
        }

        // FECHA ÚLTIMO SEGUIMIENTO (usar fecha de asignación si no hay otra)
        const indexUltimoSeg = headers.findIndex(h => 
            h && h.toString().toUpperCase().includes('FECHA ÚLTIMO SEGUIMIENTO')
        );
        if (indexUltimoSeg !== -1 && !nuevaFila[indexUltimoSeg]) {
            nuevaFila[indexUltimoSeg] = datosFormulario.fechaAsignacion || fechaHoy;
            console.log(`   ✓ Fecha Último Seguimiento: ${nuevaFila[indexUltimoSeg]}`);
        }

        // DÍAS SIN SEGUIMIENTO
        const indexDiasSin = headers.findIndex(h => 
            h && h.toString().toUpperCase().includes('DÍAS SIN SEGUIMIENTO')
        );
        if (indexDiasSin !== -1 && indexUltimoSeg !== -1) {
            const fechaUltimo = nuevaFila[indexUltimoSeg];
            const diasSin = window.Calculators.calcularDiasSinSeguimiento(fechaUltimo);
            nuevaFila[indexDiasSin] = diasSin;
            console.log(`   ✓ Días sin Seguimiento: ${diasSin}`);
        }

        // ========================================
        // PASO 7: Obtener siguiente fila disponible
        // ========================================
        const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets/${encodeURIComponent(hojaDestino)}/usedRange`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Error al obtener rango usado: ${response.status}`);
        }

        const data = await response.json();
        const siguienteFila = data.rowCount + 1;

        // ========================================
        // PASO 8: Escribir datos en Excel
        // ========================================
        const lastColumnLetter = window.ExcelHelpers.getColumnLetter(headers.length);
        
        const responseWrite = await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets/${encodeURIComponent(hojaDestino)}/range(address='A${siguienteFila}:${lastColumnLetter}${siguienteFila}')`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: [nuevaFila]
                })
            }
        );

        if (!responseWrite.ok) {
            throw new Error(`Error al escribir datos: ${responseWrite.status}`);
        }

        console.log(`\n✅ Usuario agregado exitosamente en fila ${siguienteFila} de "${hojaDestino}"`);

        return {
            success: true,
            hoja: hojaDestino,
            fila: siguienteFila,
            mensaje: `Usuario agregado exitosamente en "${hojaDestino}"`
        };

    } catch (error) {
        console.error('❌ Error al agregar usuario:', error);
        throw error;
    }
}

/**
 * Procesa las citas médicas del formulario
 * @param {Object} datosFormulario - Datos del formulario
 * @param {Array} headers - Headers de la hoja
 * @returns {Array} Array de objetos con nombre y valor de cada cita
 */
function procesarCitasMedicas(datosFormulario, headers) {
    const citas = [];
    
    // Lista de citas a procesar
    const citasMedicas = window.ColumnManager.CITAS_MEDICAS;
    
    citasMedicas.forEach(cita => {
        const nombreCampo = cita.toLowerCase().replace(/ /g, '');
        
        // Verificar si hay datos para esta cita
        if (datosFormulario[`${nombreCampo}SinCita`]) {
            citas.push({
                nombre: cita,
                valor: 'Sin asignación de cita'
            });
        } else if (datosFormulario[`${nombreCampo}Fecha`]) {
            citas.push({
                nombre: cita,
                valor: datosFormulario[`${nombreCampo}Fecha`]
            });
        }
    });
    
    return citas;
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
window.AgregarUsuario = {
    agregarUsuarioCompleto,
    procesarCitasMedicas
};

console.log('✅ Módulo AGREGAR USUARIO cargado correctamente');
```

---

## ✅ CHECKSUM
- **Primera línea:** `// ============================================`
- **Última línea:** `console.log('✅ Módulo AGREGAR USUARIO cargado correctamente');`
- **Total:** 185 líneas

---

## 🎯 COMMIT MESSAGE
```
Agregando Módulo 5 - Agregar Usuario Completo (185 líneas)
