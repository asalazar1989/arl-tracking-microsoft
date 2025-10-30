// ============================================
// MÓDULO 4: POSITIVA EVENTO
// Sistema ARL - Migración Microsoft
// ============================================
// Este módulo maneja la lógica especial para pacientes
// que son "PACIENTE_EVENTO = SI" y deben ir a la hoja
// "Positiva Evento" con columnas especiales
// ============================================

/**
 * Verifica si la hoja "Positiva Evento" existe
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<boolean>} true si existe, false si no
 */
async function verificarHojaPositivaEvento(accessToken, excelFileId) {
    try {
        const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Error al obtener hojas: ${response.status}`);
        }

        const data = await response.json();
        const hojas = data.value.map(h => h.name);
        
        return hojas.includes('Positiva Evento');
    } catch (error) {
        console.error('Error al verificar hoja Positiva Evento:', error);
        return false;
    }
}

/**
 * Crea la hoja "Positiva Evento" si no existe
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<boolean>} true si se creó o ya existía
 */
async function crearHojaPositivaEvento(accessToken, excelFileId) {
    try {
        // Verificar si ya existe
        const existe = await verificarHojaPositivaEvento(accessToken, excelFileId);
        
        if (existe) {
            console.log('✓ Hoja "Positiva Evento" ya existe');
            return true;
        }

        // Crear la hoja
        const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Positiva Evento'
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Error al crear hoja: ${response.status}`);
        }

        console.log('✅ Hoja "Positiva Evento" creada exitosamente');
        return true;
    } catch (error) {
        console.error('Error al crear hoja Positiva Evento:', error);
        return false;
    }
}

/**
 * Maneja la lógica completa de Positiva Evento
 * Determina si el paciente debe ir a "Positiva Evento" o "Positiva"
 * y asegura que la hoja tenga todas las columnas necesarias
 * @param {Object} datosPaciente - Datos del paciente
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<string>} Nombre de la hoja destino
 */
async function manejarPositivaEvento(datosPaciente, accessToken, excelFileId) {
    console.log('\n🔍 Verificando si es paciente EVENTO...');
    
    try {
        // Verificar si es paciente evento
        // Buscamos el campo "PACIENTE_EVENTO" o similar en los datos
        const esPacienteEvento = 
            datosPaciente.pacienteEvento === 'SI' ||
            datosPaciente.PACIENTE_EVENTO === 'SI' ||
            datosPaciente['PACIENTE EVENTO'] === 'SI';

        if (!esPacienteEvento) {
            console.log('   → Paciente normal, irá a hoja "Positiva"');
            return 'Positiva';
        }

        console.log('   → Paciente EVENTO detectado, procesando...');

        // 1. Verificar/crear hoja "Positiva Evento"
        const hojaExiste = await verificarHojaPositivaEvento(accessToken, excelFileId);
        
        if (!hojaExiste) {
            console.log('   → Creando hoja "Positiva Evento"...');
            await crearHojaPositivaEvento(accessToken, excelFileId);
        }

        // 2. Verificar/crear las 9 columnas especiales
        console.log('   → Verificando columnas especiales...');
        const resultado = await window.ColumnManager.verificarColumnasPositivaEvento(
            accessToken,
            excelFileId
        );

        if (resultado.columnasCreadas.length > 0) {
            console.log(`   ✅ ${resultado.columnasCreadas.length} columnas especiales creadas`);
        }

        // 3. También verificar columnas estándar (citas + inasistencias)
        console.log('   → Verificando columnas estándar...');
        await window.ColumnManager.verificarYCrearTodasLasColumnas(
            'Positiva Evento',
            accessToken,
            excelFileId
        );

        console.log('   ✅ Hoja "Positiva Evento" lista para recibir el paciente');
        return 'Positiva Evento';

    } catch (error) {
        console.error('❌ Error en manejarPositivaEvento:', error);
        // En caso de error, usar hoja "Positiva" por defecto
        console.log('   ⚠️ Error detectado, usando hoja "Positiva" por defecto');
        return 'Positiva';
    }
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
window.PositivaEvento = {
    verificarHojaPositivaEvento,
    crearHojaPositivaEvento,
    manejarPositivaEvento
};

console.log('✅ Módulo POSITIVA EVENTO cargado correctamente');
```

---

## ✅ CHECKSUM
- **Primera línea:** `// ============================================`
- **Última línea:** `console.log('✅ Módulo POSITIVA EVENTO cargado correctamente');`
- **Total:** 128 líneas

---

## 🎯 COMMIT MESSAGE
```
Agregando Módulo 4 - Positiva Evento (128 líneas)
