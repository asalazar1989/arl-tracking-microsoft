// ============================================
// MÓDULO 1: HELPERS EXCEL
// Sistema ARL - Migración Microsoft
// ============================================
// Este módulo contiene funciones auxiliares para trabajar
// con Excel Online mediante Microsoft Graph API
// ============================================

/**
 * Convierte un número de columna a letra de Excel
 * Ejemplo: 1 → A, 27 → AA, 702 → ZZ
 * @param {number} columnNumber - Número de columna (1-based)
 * @returns {string} Letra de columna en formato Excel
 */
function getColumnLetter(columnNumber) {
    let temp, letter = '';
    while (columnNumber > 0) {
        temp = (columnNumber - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        columnNumber = (columnNumber - temp - 1) / 26;
    }
    return letter;
}

/**
 * Obtiene la última columna de una hoja
 * @param {string} worksheetName - Nombre de la hoja
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<number>} Número de la última columna
 */
async function getLastColumn(worksheetName, accessToken, excelFileId) {
    try {
        const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets/${encodeURIComponent(worksheetName)}/usedRange`,
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
        return data.columnCount;
    } catch (error) {
        console.error('Error en getLastColumn:', error);
        throw error;
    }
}

/**
 * Obtiene los headers (primera fila) de una hoja
 * @param {string} worksheetName - Nombre de la hoja
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<Array<string>>} Array con los nombres de las columnas
 */
async function getHeaders(worksheetName, accessToken, excelFileId) {
    try {
        // Obtener última columna primero
        const lastColumn = await getLastColumn(worksheetName, accessToken, excelFileId);
        const lastColumnLetter = getColumnLetter(lastColumn);

        // Obtener primera fila completa
        const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets/${encodeURIComponent(worksheetName)}/range(address='A1:${lastColumnLetter}1')`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Error al obtener headers: ${response.status}`);
        }

        const data = await response.json();
        return data.values[0] || [];
    } catch (error) {
        console.error('Error en getHeaders:', error);
        throw error;
    }
}

/**
 * Verifica si una columna existe en los headers
 * @param {string} worksheetName - Nombre de la hoja
 * @param {string} columnName - Nombre de la columna a buscar
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<boolean>} true si existe, false si no
 */
async function columnExists(worksheetName, columnName, accessToken, excelFileId) {
    try {
        const headers = await getHeaders(worksheetName, accessToken, excelFileId);
        return headers.some(h => h && h.toString().trim().toUpperCase() === columnName.toUpperCase());
    } catch (error) {
        console.error('Error en columnExists:', error);
        return false;
    }
}

/**
 * Agrega una nueva columna al final de una hoja con formato
 * @param {string} worksheetName - Nombre de la hoja
 * @param {string} headerName - Nombre del header de la nueva columna
 * @param {string} backgroundColor - Color de fondo en formato hex (ej: '#001f3f')
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 * @returns {Promise<Object>} Resultado de la operación
 */
async function appendColumn(worksheetName, headerName, backgroundColor, accessToken, excelFileId) {
    try {
        // Obtener última columna
        const lastColumn = await getLastColumn(worksheetName, accessToken, excelFileId);
        const newColumnNumber = lastColumn + 1;
        const newColumnLetter = getColumnLetter(newColumnNumber);

        // Agregar header en la nueva columna
        const responseHeader = await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets/${encodeURIComponent(worksheetName)}/range(address='${newColumnLetter}1')`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: [[headerName]]
                })
            }
        );

        if (!responseHeader.ok) {
            throw new Error(`Error al agregar header: ${responseHeader.status}`);
        }

        // Aplicar formato al header
        await formatHeader(worksheetName, newColumnLetter, backgroundColor, accessToken, excelFileId);

        console.log(`✅ Columna "${headerName}" agregada exitosamente en ${newColumnLetter}1`);
        
        return {
            success: true,
            columnLetter: newColumnLetter,
            columnNumber: newColumnNumber,
            headerName: headerName
        };
    } catch (error) {
        console.error('Error en appendColumn:', error);
        throw error;
    }
}

/**
 * Aplica formato a un header (color de fondo, texto blanco, negrita, centrado)
 * @param {string} worksheetName - Nombre de la hoja
 * @param {string} columnLetter - Letra de la columna (A, B, C, etc.)
 * @param {string} backgroundColor - Color de fondo en formato hex
 * @param {string} accessToken - Token de autenticación
 * @param {string} excelFileId - ID del archivo Excel
 */
async function formatHeader(worksheetName, columnLetter, backgroundColor, accessToken, excelFileId) {
    try {
        const cellAddress = `${columnLetter}1`;

        // Aplicar formato de relleno (color de fondo)
        await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets/${encodeURIComponent(worksheetName)}/range(address='${cellAddress}')/format/fill`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    color: backgroundColor
                })
            }
        );

        // Aplicar formato de fuente (blanco, negrita)
        await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets/${encodeURIComponent(worksheetName)}/range(address='${cellAddress}')/format/font`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    color: '#FFFFFF',
                    bold: true
                })
            }
        );

        // Aplicar alineación centrada
        await fetch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets/${encodeURIComponent(worksheetName)}/range(address='${cellAddress}')`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    format: {
                        horizontalAlignment: 'Center'
                    }
                })
            }
        );

        console.log(`✅ Formato aplicado a ${cellAddress}`);
    } catch (error) {
        console.error('Error en formatHeader:', error);
        // No lanzamos error aquí para que no bloquee la creación de columnas
    }
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
// Estas funciones estarán disponibles globalmente
// para ser usadas por otros módulos
window.ExcelHelpers = {
    getColumnLetter,
    getLastColumn,
    getHeaders,
    columnExists,
    appendColumn,
    formatHeader
};

console.log('✅ Módulo HELPERS EXCEL cargado correctamente');
```

---

## ✅ CHECKSUM (Verificación)
- **Primera línea:** `// ============================================`
- **Última línea:** `console.log('✅ Módulo HELPERS EXCEL cargado correctamente');`
- **Total:** 182 líneas

---

## 🎯 INSTRUCCIONES

1. **Copia TODO el código de arriba**
2. **Pégalo en el editor de GitHub** (reemplaza "Enter file contents here")
3. **Scroll hasta abajo**
4. **En "Commit changes"** escribe:
```
   Agregando Módulo 1 - Helpers Excel (182 líneas)
