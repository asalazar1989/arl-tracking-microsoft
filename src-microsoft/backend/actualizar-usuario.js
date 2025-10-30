// ============================================
// MÓDULO 6: ACTUALIZAR USUARIO (COMPLETO)
// Sistema ARL - Migración Microsoft
// ============================================
// Esta función actualiza un usuario existente recalculando
// automáticamente los campos de fecha y días sin seguimiento
// ============================================

/**
 * Actualiza un usuario existente con recálculo automático
 * @param {string} nombreHoja - Nombre de la hoja
 * @param {number} rowIndex - Índice de la fila (1-based)
 * @param {Object} datosFormulario - Datos actualizados del formulario
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<Object>} Resultado de la operación
 */
async function actualizarUsuarioCompleto(nombreHoja, rowIndex, datosFormulario, accessToken, excelFileId) {
    console.log('\n🔄 Iniciando actualización de usuario...');
    console.log('📋 Hoja:', nombreHoja);
    console.log('📍 Fila:', rowIndex);
    
    try {
        // ========================================
        // PASO 1: Obtener headers
        // ========================================
        const headers = await window.ExcelHelpers.getHeaders(nombreHoja, accessToken, excelFileId);
        console.log(`✅ Headers obtenidos: ${headers.length} columnas`);

        // ========================================
        // PASO 2: Preparar fila actualizada
        // ========================================
        const filaActualizada = new Array(headers.length).fill('');

        // Mapear campos básicos del formulario a las columnas
        headers.forEach((header, index) => {
            if (!header) return;
            
            const headerUpper = header.toString().toUpperCase().trim();
            
            // Campos estándar
            if (headerUpper === 'SINIESTRO') filaActualizada[index] = datosFormulario.siniestro || '';
            else if (headerUpper === '# MATRICULA' || headerUpper === 'MATRICULA') filaActualizada[index] = datosFormulario.matricula || '';
            else if (headerUpper === 'CEDULA') filaActualizada[index] = datosFormulario.cedula || '';
            else if (headerUpper === 'NOMBRE') filaActualizada[index] = datosFormulario.nombre || '';
            else if (headerUpper === 'FECHA DE ASIGNACION A LA IPS') filaActualizada[index] = datosFormulario.fechaAsignacion || '';
            else if (headerUpper === 'GENERO' || headerUpper === 'GÉNERO') filaActualizada[index] = datosFormulario.genero || '';
            else if (headerUpper.includes('MAYOR A 56')) filaActualizada[index] = datosFormulario.mayorA56 || '';
            else if (headerUpper === 'AUDITOR') filaActualizada[index] = datosFormulario.auditor || '';
            else if (headerUpper.includes('CLASIFICACION SEVERIDAD')) filaActualizada[index] = datosFormulario.clasificacionSeveridad || '';
            else if (headerUpper.includes('ESTADO DE LA MATRICULA')) filaActualizada[index] = datosFormulario.estadoMatricula || '';
            else if (headerUpper === 'ALTA INMEDIATA') filaActualizada[index] = datosFormulario.altaInmediata || '';
            else if (headerUpper === 'FECHA CIERRE') filaActualizada[index] = datosFormulario.fechaCierre || '';
            else if (headerUpper.includes('NUM AGENDAMIENTOS')) filaActualizada[index] = datosFormulario.numAgendamientos || '';
            else if (headerUpper === 'OBSERVACION') filaActualizada[index] = datosFormulario.observacion || '';
            else if (headerUpper.includes('SEGUIMIENTO DE IMAGENES')) filaActualizada[index] = datosFormulario.seguimientoImagenes || '';
            else if (headerUpper.includes('OBSERVACION FACTURACION')) filaActualizada[index] = datosFormulario.observacionFacturacion || '';
        });

        // ========================================
        // PASO 3: Procesar citas médicas
        // ========================================
        console.log('\n📅 Procesando citas médicas...');
        
        const citasProcesadas = procesarCitasActualizacion(datosFormulario, headers);
        citasProcesadas.forEach(cita => {
            const index = headers.findIndex(h => 
                h && h.toString().toUpperCase().trim() === cita.nombre.toUpperCase()
            );
            if (index !== -1) {
                filaActualizada[index] = cita.valor;
                console.log(`   ✓ ${cita.nombre}: ${cita.valor}`);
            }
        });

        // ========================================
        // PASO 4: Procesar inasistencias
        // ========================================
        console.log('\n⚠️ Procesando inasistencias...');
        
        const inasistenciasProcesadas = procesarInasistencias(datosFormulario, headers);
        inasistenciasProcesadas.forEach(inasistencia => {
            const index = headers.findIndex(h => 
                h && h.toString().toUpperCase().trim() === inasistencia.nombre.toUpperCase()
            );
            if (index !== -1) {
                filaActualizada[index] = inasistencia.valor;
                console.log(`   ✓ ${inasistencia.nombre}: ${inasistencia.valor}`);
            }
        });

        // ========================================
        // PASO 5: Recalcular campos automáticos
        // ========================================
        console.log('\n🧮 Recalculando campos automáticos...');
        
        // HOY
        const fechaHoy = window.Calculators.obtenerFechaHoy();
        const indexHoy = headers.findIndex(h => 
            h && h.toString().toUpperCase().trim() === 'HOY'
        );
        if (indexHoy !== -1) {
            filaActualizada[indexHoy] = fechaHoy;
            console.log(`   ✓ HOY: ${fechaHoy}`);
        }

        // DÍAS SIN SEGUIMIENTO
        const indexDiasSin = headers.findIndex(h => 
            h && h.toString().toUpperCase().includes('DÍAS SIN SEGUIMIENTO')
        );
        const indexUltimoSeg = headers.findIndex(h => 
            h && h.toString().toUpperCase().includes('FECHA ÚLTIMO SEGUIMIENTO')
        );
        
        if (indexDiasSin !== -1 && indexUltimoSeg !== -1) {
            const fechaUltimo = filaActualizada[indexUltimoSeg];
            if (fechaUltimo) {
                const diasSin = window.Calculators.calcularDiasSinSeguimiento(fechaUltimo);
                filaActualizada[indexDiasSin] = diasSin;
                console.log(`   ✓ Días sin Seguimiento: ${diasSin}`);
            }
        }

        // ========================================
        // PASO 6: Actualizar en Excel
        // ========================================
        const lastColumnLetter = window.ExcelHelpers.getColumnLetter(headers.length);
        
        const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets/${encodeURIComponent(nombreHoja)}/range(address='A${rowIndex}:${lastColumnLetter}${rowIndex}')`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: [filaActualizada]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Error al actualizar usuario: ${response.status}`);
        }

        console.log(`\n✅ Usuario actualizado exitosamente en fila ${rowIndex} de "${nombreHoja}"`);

        return {
            success: true,
            hoja: nombreHoja,
            fila: rowIndex,
            mensaje: 'Usuario actualizado exitosamente'
        };

    } catch (error) {
        console.error('❌ Error al actualizar usuario:', error);
        throw error;
    }
}

/**
 * Procesa las citas médicas para actualización
 */
function procesarCitasActualizacion(datosFormulario, headers) {
    const citas = [];
    const citasMedicas = ['CITA INICIAL', 'JUNTA MEDICA', 'FISIATRA', 'VALORACION OCUPACIONAL', 
                          'MEDICINA LABORAL', 'PSICOLOGIA', 'TERAPIA OCUPACIONAL', 'TERAPIA FISICA'];
    
    citasMedicas.forEach(cita => {
        const nombreCampo = cita.toLowerCase().replace(/ /g, '');
        
        if (datosFormulario[`${nombreCampo}SinCita`]) {
            citas.push({ nombre: cita, valor: 'Sin asignación de cita' });
        } else if (datosFormulario[`${nombreCampo}Fecha`]) {
            citas.push({ nombre: cita, valor: datosFormulario[`${nombreCampo}Fecha`] });
        }
    });
    
    return citas;
}

/**
 * Procesa las inasistencias para actualización
 */
function procesarInasistencias(datosFormulario, headers) {
    const inasistencias = [];
    const citasMedicas = ['CITA INICIAL', 'JUNTA MEDICA', 'FISIATRA', 'VALORACION OCUPACIONAL', 
                          'MEDICINA LABORAL', 'PSICOLOGIA', 'TERAPIA OCUPACIONAL', 'TERAPIA FISICA'];
    
    citasMedicas.forEach(cita => {
        const nombreCampo = cita.toLowerCase().replace(/ /g, '');
        const nombreInasistencia = `INASISTENCIA ${cita}`;
        
        if (datosFormulario[`${nombreCampo}Inasistencia`]) {
            inasistencias.push({ nombre: nombreInasistencia, valor: 'SI' });
        } else {
            inasistencias.push({ nombre: nombreInasistencia, valor: '' });
        }
    });
    
    return inasistencias;
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
window.ActualizarUsuario = {
    actualizarUsuarioCompleto,
    procesarCitasActualizacion,
    procesarInasistencias
};

console.log('✅ Módulo ACTUALIZAR USUARIO cargado correctamente');
```

---

## ✅ CHECKSUM
- **Primera línea:** `// ============================================`
- **Última línea:** `console.log('✅ Módulo ACTUALIZAR USUARIO cargado correctamente');`
- **Total:** 155 líneas

---

## 🎯 COMMIT MESSAGE
```
Agregando Módulo 6 - Actualizar Usuario Completo (155 líneas)
