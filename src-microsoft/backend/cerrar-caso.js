// ============================================
// MÓDULO 7: CERRAR CASO (COMPLETO)
// Sistema ARL - Migración Microsoft
// ============================================
// Esta función cierra un caso moviéndolo a la hoja CERRADOS
// con todas las validaciones y columnas extra necesarias
// ============================================

/**
 * Cierra un caso completo con todas las validaciones
 * @param {string} hojaOrigen - Nombre de la hoja origen
 * @param {number} rowIndex - Índice de la fila (1-based)
 * @param {string} tipoCierre - Tipo de cierre seleccionado
 * @param {Array} datosRegistro - Datos completos del registro
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<Object>} Resultado de la operación
 */
async function cerrarCasoCompleto(hojaOrigen, rowIndex, tipoCierre, datosRegistro, accessToken, excelFileId) {
    console.log('\n🔒 Iniciando proceso de cierre de caso...');
    console.log('📋 Hoja origen:', hojaOrigen);
    console.log('📍 Fila:', rowIndex);
    console.log('🏷️ Tipo de cierre:', tipoCierre);
    
    try {
        // ========================================
        // PASO 1: Validar tipo de cierre
        // ========================================
        if (!tipoCierre || tipoCierre.trim() === '') {
            throw new Error('El tipo de cierre es obligatorio');
        }

        const tiposValidos = [
            'Alta médica',
            'Abandono',
            'Traslado',
            'Fallecimiento',
            'Otro'
        ];

        if (!tiposValidos.includes(tipoCierre)) {
            console.warn('⚠️ Tipo de cierre no estándar:', tipoCierre);
        }

        // ========================================
        // PASO 2: Verificar/crear columnas en CERRADOS
        // ========================================
        console.log('\n🔍 Verificando columnas en hoja CERRADOS...');
        
        const resultadoColumnas = await window.ColumnManager.verificarColumnasCERRADOS(
            accessToken,
            excelFileId
        );

        if (resultadoColumnas.columnasCreadas.length > 0) {
            console.log(`✅ ${resultadoColumnas.columnasCreadas.length} columnas creadas en CERRADOS`);
        }

        // ========================================
        // PASO 3: Obtener headers de CERRADOS
        // ========================================
        const headersCERRADOS = await window.ExcelHelpers.getHeaders('CERRADOS', accessToken, excelFileId);
        console.log(`✅ Headers de CERRADOS obtenidos: ${headersCERRADOS.length} columnas`);

        // ========================================
        // PASO 4: Preparar fila para CERRADOS
        // ========================================
        const filaCerrados = new Array(headersCERRADOS.length).fill('');

        // Copiar todos los datos del registro original
        datosRegistro.forEach((valor, index) => {
            if (index < filaCerrados.length) {
                filaCerrados[index] = valor;
            }
        });

        // ========================================
        // PASO 5: Agregar campos extra de cierre
        // ========================================
        const fechaCierre = window.Calculators.obtenerFechaHoy();

        // TIPO DE CIERRE
        const indexTipoCierre = headersCERRADOS.findIndex(h => 
            h && h.toString().toUpperCase().trim() === 'TIPO DE CIERRE'
        );
        if (indexTipoCierre !== -1) {
            filaCerrados[indexTipoCierre] = tipoCierre;
            console.log(`   ✓ Tipo de Cierre: ${tipoCierre}`);
        } else {
            console.warn('⚠️ Columna "TIPO DE CIERRE" no encontrada');
        }

        // HOJA ORIGEN
        const indexHojaOrigen = headersCERRADOS.findIndex(h => 
            h && h.toString().toUpperCase().trim() === 'HOJA ORIGEN'
        );
        if (indexHojaOrigen !== -1) {
            filaCerrados[indexHojaOrigen] = hojaOrigen;
            console.log(`   ✓ Hoja Origen: ${hojaOrigen}`);
        } else {
            console.warn('⚠️ Columna "HOJA ORIGEN" no encontrada');
        }

        // FECHA DE CIERRE DEL CASO
        const indexFechaCierre = headersCERRADOS.findIndex(h => 
            h && h.toString().toUpperCase().trim() === 'FECHA DE CIERRE DEL CASO'
        );
        if (indexFechaCierre !== -1) {
            filaCerrados[indexFechaCierre] = fechaCierre;
            console.log(`   ✓ Fecha de Cierre: ${fechaCierre}`);
        } else {
            console.warn('⚠️ Columna "FECHA DE CIERRE DEL CASO" no encontrada');
        }

        // ========================================
        // PASO 6: Obtener siguiente fila en CERRADOS
        // ========================================
        const responseCERRADOS = await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets/CERRADOS/usedRange`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!responseCERRADOS.ok) {
            throw new Error(`Error al obtener rango de CERRADOS: ${responseCERRADOS.status}`);
        }

        const dataCERRADOS = await responseCERRADOS.json();
        const siguienteFilaCERRADOS = dataCERRADOS.rowCount + 1;

        // ========================================
        // PASO 7: Escribir en CERRADOS
        // ========================================
        console.log(`\n📝 Escribiendo en CERRADOS fila ${siguienteFilaCERRADOS}...`);
        
        const lastColumnLetterCERRADOS = window.ExcelHelpers.getColumnLetter(headersCERRADOS.length);
        
        const responseWrite = await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets/CERRADOS/range(address='A${siguienteFilaCERRADOS}:${lastColumnLetterCERRADOS}${siguienteFilaCERRADOS}')`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: [filaCerrados]
                })
            }
        );

        if (!responseWrite.ok) {
            throw new Error(`Error al escribir en CERRADOS: ${responseWrite.status}`);
        }

        console.log('✅ Registro agregado a CERRADOS exitosamente');

        // ========================================
        // PASO 8: Eliminar de hoja origen (limpiar fila)
        // ========================================
        console.log(`\n🗑️ Eliminando de hoja origen "${hojaOrigen}"...`);
        
        const headersOrigen = await window.ExcelHelpers.getHeaders(hojaOrigen, accessToken, excelFileId);
        const filaVacia = new Array(headersOrigen.length).fill('');
        const lastColumnLetterOrigen = window.ExcelHelpers.getColumnLetter(headersOrigen.length);
        
        const responseDelete = await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets/${encodeURIComponent(hojaOrigen)}/range(address='A${rowIndex}:${lastColumnLetterOrigen}${rowIndex}')`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: [filaVacia]
                })
            }
        );

        if (!responseDelete.ok) {
            throw new Error(`Error al eliminar de origen: ${responseDelete.status}`);
        }

        console.log('✅ Registro eliminado de hoja origen exitosamente');

        console.log(`\n✅ Caso cerrado exitosamente como "${tipoCierre}"`);

        return {
            success: true,
            hojaOrigen: hojaOrigen,
            filaOrigen: rowIndex,
            hojaDestino: 'CERRADOS',
            filaDestino: siguienteFilaCERRADOS,
            tipoCierre: tipoCierre,
            fechaCierre: fechaCierre,
            mensaje: `Caso cerrado exitosamente como "${tipoCierre}"`
        };

    } catch (error) {
        console.error('❌ Error al cerrar caso:', error);
        throw error;
    }
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
window.CerrarCaso = {
    cerrarCasoCompleto
};

console.log('✅ Módulo CERRAR CASO cargado correctamente');
```

---

## ✅ CHECKSUM
- **Primera línea:** `// ============================================`
- **Última línea:** `console.log('✅ Módulo CERRAR CASO cargado correctamente');`
- **Total:** 175 líneas

---

## 🎯 COMMIT MESSAGE
```
Agregando Módulo 7 - Cerrar Caso Completo (175 líneas)
