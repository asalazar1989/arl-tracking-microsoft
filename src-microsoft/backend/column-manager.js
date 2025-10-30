// ============================================
// MÓDULO 2: COLUMN MANAGER
// Sistema ARL - Migración Microsoft
// ============================================
// Este módulo verifica y crea automáticamente las columnas
// necesarias en las hojas de Excel (Citas, Inasistencias, etc.)
// ============================================

/**
 * Las 7 citas médicas principales del sistema
 */
const CITAS_MEDICAS = [
    'CITA INICIAL',
    'JUNTA MEDICA',
    'FISIATRA',
    'VALORACION OCUPACIONAL',
    'MEDICINA LABORAL',
    'PSICOLOGIA',
    'TERAPIA OCUPACIONAL',
    'TERAPIA FISICA'
];

/**
 * Las 9 columnas especiales para la hoja "Positiva Evento"
 */
const COLUMNAS_POSITIVA_EVENTO = [
    'ELECTRODIAGNOSTICO',
    'TERAPIA FISICA',
    'CARTA DE RECOMENDACIONES',
    'PRUEBA DE TRABAJO',
    'TERAPIA OCUPACIONAL',
    'PSICOLOGIA',
    'MEDICO DOLOR',
    'BLOQUEO',
    'NUTRICION'
];

/**
 * Verifica y crea las 7 columnas de citas si no existen
 * @param {string} worksheetName - Nombre de la hoja
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<Object>} Resultado con columnas creadas
 */
async function verificarYCrearColumnasCitas(worksheetName, accessToken, excelFileId) {
    console.log(`🔍 Verificando columnas de CITAS en hoja: ${worksheetName}`);
    
    const resultados = {
        hojaVerificada: worksheetName,
        columnasExistentes: [],
        columnasCreadas: [],
        errores: []
    };

    try {
        // Obtener headers actuales
        const headers = await window.ExcelHelpers.getHeaders(worksheetName, accessToken, excelFileId);
        
        // Verificar cada cita
        for (const cita of CITAS_MEDICAS) {
            const existe = headers.some(h => 
                h && h.toString().trim().toUpperCase() === cita.toUpperCase()
            );

            if (existe) {
                resultados.columnasExistentes.push(cita);
                console.log(`   ✓ ${cita} ya existe`);
            } else {
                try {
                    // Crear la columna con color azul oscuro
                    const resultado = await window.ExcelHelpers.appendColumn(
                        worksheetName,
                        cita,
                        '#001f3f', // Azul oscuro
                        accessToken,
                        excelFileId
                    );
                    
                    resultados.columnasCreadas.push({
                        nombre: cita,
                        columna: resultado.columnLetter
                    });
                    
                    console.log(`   ✅ ${cita} creada en columna ${resultado.columnLetter}`);
                } catch (error) {
                    resultados.errores.push({
                        columna: cita,
                        error: error.message
                    });
                    console.error(`   ❌ Error al crear ${cita}:`, error);
                }
            }
        }

        console.log(`✅ Verificación de citas completada: ${resultados.columnasCreadas.length} creadas, ${resultados.columnasExistentes.length} existentes`);
        
        return resultados;
    } catch (error) {
        console.error('❌ Error en verificarYCrearColumnasCitas:', error);
        throw error;
    }
}

/**
 * Verifica y crea las 7 columnas de inasistencias si no existen
 * @param {string} worksheetName - Nombre de la hoja
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<Object>} Resultado con columnas creadas
 */
async function verificarYCrearColumnasInasistencias(worksheetName, accessToken, excelFileId) {
    console.log(`🔍 Verificando columnas de INASISTENCIAS en hoja: ${worksheetName}`);
    
    const resultados = {
        hojaVerificada: worksheetName,
        columnasExistentes: [],
        columnasCreadas: [],
        errores: []
    };

    try {
        // Obtener headers actuales
        const headers = await window.ExcelHelpers.getHeaders(worksheetName, accessToken, excelFileId);
        
        // Verificar cada inasistencia
        for (const cita of CITAS_MEDICAS) {
            const nombreInasistencia = `INASISTENCIA ${cita}`;
            
            const existe = headers.some(h => 
                h && h.toString().trim().toUpperCase() === nombreInasistencia.toUpperCase()
            );

            if (existe) {
                resultados.columnasExistentes.push(nombreInasistencia);
                console.log(`   ✓ ${nombreInasistencia} ya existe`);
            } else {
                try {
                    // Crear la columna con color rojo
                    const resultado = await window.ExcelHelpers.appendColumn(
                        worksheetName,
                        nombreInasistencia,
                        '#d9534f', // Rojo
                        accessToken,
                        excelFileId
                    );
                    
                    resultados.columnasCreadas.push({
                        nombre: nombreInasistencia,
                        columna: resultado.columnLetter
                    });
                    
                    console.log(`   ✅ ${nombreInasistencia} creada en columna ${resultado.columnLetter}`);
                } catch (error) {
                    resultados.errores.push({
                        columna: nombreInasistencia,
                        error: error.message
                    });
                    console.error(`   ❌ Error al crear ${nombreInasistencia}:`, error);
                }
            }
        }

        console.log(`✅ Verificación de inasistencias completada: ${resultados.columnasCreadas.length} creadas, ${resultados.columnasExistentes.length} existentes`);
        
        return resultados;
    } catch (error) {
        console.error('❌ Error en verificarYCrearColumnasInasistencias:', error);
        throw error;
    }
}

/**
 * Verifica y crea las 9 columnas especiales para "Positiva Evento"
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<Object>} Resultado con columnas creadas
 */
async function verificarColumnasPositivaEvento(accessToken, excelFileId) {
    const worksheetName = 'Positiva Evento';
    console.log(`🔍 Verificando columnas especiales en hoja: ${worksheetName}`);
    
    const resultados = {
        hojaVerificada: worksheetName,
        columnasExistentes: [],
        columnasCreadas: [],
        errores: []
    };

    try {
        // Verificar si la hoja existe
        const headers = await window.ExcelHelpers.getHeaders(worksheetName, accessToken, excelFileId);
        
        // Verificar cada columna especial
        for (const columna of COLUMNAS_POSITIVA_EVENTO) {
            const existe = headers.some(h => 
                h && h.toString().trim().toUpperCase() === columna.toUpperCase()
            );

            if (existe) {
                resultados.columnasExistentes.push(columna);
                console.log(`   ✓ ${columna} ya existe`);
            } else {
                try {
                    // Crear la columna con color verde oscuro
                    const resultado = await window.ExcelHelpers.appendColumn(
                        worksheetName,
                        columna,
                        '#28a745', // Verde oscuro
                        accessToken,
                        excelFileId
                    );
                    
                    resultados.columnasCreadas.push({
                        nombre: columna,
                        columna: resultado.columnLetter
                    });
                    
                    console.log(`   ✅ ${columna} creada en columna ${resultado.columnLetter}`);
                } catch (error) {
                    resultados.errores.push({
                        columna: columna,
                        error: error.message
                    });
                    console.error(`   ❌ Error al crear ${columna}:`, error);
                }
            }
        }

        console.log(`✅ Verificación de Positiva Evento completada: ${resultados.columnasCreadas.length} creadas, ${resultados.columnasExistentes.length} existentes`);
        
        return resultados;
    } catch (error) {
        console.error('❌ Error en verificarColumnasPositivaEvento:', error);
        throw error;
    }
}

/**
 * Verifica y crea las 3 columnas extra para la hoja CERRADOS
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<Object>} Resultado con columnas creadas
 */
async function verificarColumnasCERRADOS(accessToken, excelFileId) {
    const worksheetName = 'CERRADOS';
    console.log(`🔍 Verificando columnas extra en hoja: ${worksheetName}`);
    
    const columnasExtra = [
        'TIPO DE CIERRE',
        'HOJA ORIGEN',
        'FECHA DE CIERRE DEL CASO'
    ];
    
    const resultados = {
        hojaVerificada: worksheetName,
        columnasExistentes: [],
        columnasCreadas: [],
        errores: []
    };

    try {
        // Obtener headers actuales
        const headers = await window.ExcelHelpers.getHeaders(worksheetName, accessToken, excelFileId);
        
        // Verificar cada columna extra
        for (const columna of columnasExtra) {
            const existe = headers.some(h => 
                h && h.toString().trim().toUpperCase() === columna.toUpperCase()
            );

            if (existe) {
                resultados.columnasExistentes.push(columna);
                console.log(`   ✓ ${columna} ya existe`);
            } else {
                try {
                    // Crear la columna con color naranja
                    const resultado = await window.ExcelHelpers.appendColumn(
                        worksheetName,
                        columna,
                        '#ff8c00', // Naranja
                        accessToken,
                        excelFileId
                    );
                    
                    resultados.columnasCreadas.push({
                        nombre: columna,
                        columna: resultado.columnLetter
                    });
                    
                    console.log(`   ✅ ${columna} creada en columna ${resultado.columnLetter}`);
                } catch (error) {
                    resultados.errores.push({
                        columna: columna,
                        error: error.message
                    });
                    console.error(`   ❌ Error al crear ${columna}:`, error);
                }
            }
        }

        console.log(`✅ Verificación de CERRADOS completada: ${resultados.columnasCreadas.length} creadas, ${resultados.columnasExistentes.length} existentes`);
        
        return resultados;
    } catch (error) {
        console.error('❌ Error en verificarColumnasCERRADOS:', error);
        throw error;
    }
}

/**
 * Verifica y crea TODAS las columnas necesarias en una hoja
 * (Citas + Inasistencias)
 * @param {string} worksheetName - Nombre de la hoja
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<Object>} Resultado consolidado
 */
async function verificarYCrearTodasLasColumnas(worksheetName, accessToken, excelFileId) {
    console.log(`\n🚀 Iniciando verificación completa de columnas en: ${worksheetName}`);
    
    const resultado = {
        hoja: worksheetName,
        citas: null,
        inasistencias: null,
        totalCreadas: 0,
        totalExistentes: 0,
        errores: []
    };

    try {
        // 1. Verificar y crear columnas de citas
        resultado.citas = await verificarYCrearColumnasCitas(worksheetName, accessToken, excelFileId);
        
        // 2. Verificar y crear columnas de inasistencias
        resultado.inasistencias = await verificarYCrearColumnasInasistencias(worksheetName, accessToken, excelFileId);
        
        // Consolidar resultados
        resultado.totalCreadas = 
            resultado.citas.columnasCreadas.length + 
            resultado.inasistencias.columnasCreadas.length;
        
        resultado.totalExistentes = 
            resultado.citas.columnasExistentes.length + 
            resultado.inasistencias.columnasExistentes.length;
        
        resultado.errores = [
            ...resultado.citas.errores,
            ...resultado.inasistencias.errores
        ];

        console.log(`\n✅ Verificación completa finalizada:`);
        console.log(`   📊 Total creadas: ${resultado.totalCreadas}`);
        console.log(`   ✓ Total existentes: ${resultado.totalExistentes}`);
        console.log(`   ❌ Total errores: ${resultado.errores.length}`);
        
        return resultado;
    } catch (error) {
        console.error('❌ Error en verificarYCrearTodasLasColumnas:', error);
        throw error;
    }
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
window.ColumnManager = {
    verificarYCrearColumnasCitas,
    verificarYCrearColumnasInasistencias,
    verificarColumnasPositivaEvento,
    verificarColumnasCERRADOS,
    verificarYCrearTodasLasColumnas,
    // Exportar constantes también
    CITAS_MEDICAS,
    COLUMNAS_POSITIVA_EVENTO
};

console.log('✅ Módulo COLUMN MANAGER cargado correctamente');
```

---

## ✅ CHECKSUM (Verificación)
- **Primera línea:** `// ============================================`
- **Última línea:** `console.log('✅ Módulo COLUMN MANAGER cargado correctamente');`
- **Total:** 315 líneas

---

## 🎯 INSTRUCCIONES

1. **Copia TODO el código de arriba**
2. **Pégalo en el editor de GitHub**
3. **Scroll hasta abajo**
4. **En "Commit changes"** escribe:
```
   Agregando Módulo 2 - Column Manager (315 líneas)
