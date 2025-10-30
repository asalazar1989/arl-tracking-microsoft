// ============================================
// MÓDULO 3: CALCULATORS
// Sistema ARL - Migración Microsoft
// ============================================
// Este módulo contiene funciones de cálculo de fechas
// y días para el seguimiento de pacientes
// ============================================

/**
 * Obtiene la fecha actual en formato yyyy-MM-dd
 * @returns {string} Fecha actual en formato 'yyyy-MM-dd'
 */
function obtenerFechaHoy() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

/**
 * Calcula los días transcurridos desde una fecha hasta hoy
 * @param {string} fechaInicio - Fecha en formato 'yyyy-MM-dd' o 'dd/MM/yyyy'
 * @returns {number} Número de días transcurridos
 */
function calcularDiasSinSeguimiento(fechaInicio) {
    if (!fechaInicio || fechaInicio === '' || fechaInicio === 'Sin asignación de cita') {
        return 0;
    }

    try {
        // Convertir la fecha a formato yyyy-MM-dd si viene en otro formato
        let fechaFormateada = fechaInicio;
        
        // Si viene en formato dd/MM/yyyy, convertir a yyyy-MM-dd
        if (fechaInicio.includes('/')) {
            const partes = fechaInicio.split('/');
            if (partes.length === 3) {
                fechaFormateada = `${partes[2]}-${partes[1]}-${partes[0]}`;
            }
        }

        const fechaUltimo = new Date(fechaFormateada);
        const hoy = new Date();

        // Resetear horas para comparar solo fechas
        fechaUltimo.setHours(0, 0, 0, 0);
        hoy.setHours(0, 0, 0, 0);

        // Calcular diferencia en milisegundos
        const diffTime = Math.abs(hoy - fechaUltimo);
        
        // Convertir a días
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    } catch (error) {
        console.error('Error al calcular días sin seguimiento:', error);
        return 0;
    }
}

/**
 * Formatea una fecha entre diferentes formatos
 * @param {string} fecha - Fecha a formatear
 * @param {string} formatoOrigen - Formato original ('yyyy-MM-dd' o 'dd/MM/yyyy')
 * @param {string} formatoDestino - Formato destino ('yyyy-MM-dd' o 'dd/MM/yyyy')
 * @returns {string} Fecha formateada
 */
function formatearFecha(fecha, formatoOrigen = 'yyyy-MM-dd', formatoDestino = 'dd/MM/yyyy') {
    if (!fecha || fecha === '' || fecha === 'Sin asignación de cita') {
        return fecha;
    }

    try {
        let año, mes, dia;

        // Parsear según formato origen
        if (formatoOrigen === 'yyyy-MM-dd') {
            const partes = fecha.split('-');
            año = partes[0];
            mes = partes[1];
            dia = partes[2];
        } else if (formatoOrigen === 'dd/MM/yyyy') {
            const partes = fecha.split('/');
            dia = partes[0];
            mes = partes[1];
            año = partes[2];
        }

        // Formatear según formato destino
        if (formatoDestino === 'yyyy-MM-dd') {
            return `${año}-${mes}-${dia}`;
        } else if (formatoDestino === 'dd/MM/yyyy') {
            return `${dia}/${mes}/${año}`;
        }

        return fecha;
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return fecha;
    }
}

/**
 * Valida si una fecha tiene un formato correcto
 * @param {string} fecha - Fecha a validar
 * @param {string} formato - Formato esperado ('yyyy-MM-dd' o 'dd/MM/yyyy')
 * @returns {boolean} true si es válida, false si no
 */
function validarFecha(fecha, formato = 'yyyy-MM-dd') {
    if (!fecha || fecha === '' || fecha === 'Sin asignación de cita') {
        return true; // Valores especiales son válidos
    }

    try {
        if (formato === 'yyyy-MM-dd') {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            if (!regex.test(fecha)) return false;

            const partes = fecha.split('-');
            const año = parseInt(partes[0]);
            const mes = parseInt(partes[1]);
            const dia = parseInt(partes[2]);

            const fechaObj = new Date(año, mes - 1, dia);
            return fechaObj.getFullYear() === año &&
                   fechaObj.getMonth() === mes - 1 &&
                   fechaObj.getDate() === dia;
        } else if (formato === 'dd/MM/yyyy') {
            const regex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!regex.test(fecha)) return false;

            const partes = fecha.split('/');
            const dia = parseInt(partes[0]);
            const mes = parseInt(partes[1]);
            const año = parseInt(partes[2]);

            const fechaObj = new Date(año, mes - 1, dia);
            return fechaObj.getFullYear() === año &&
                   fechaObj.getMonth() === mes - 1 &&
                   fechaObj.getDate() === dia;
        }

        return false;
    } catch (error) {
        console.error('Error al validar fecha:', error);
        return false;
    }
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
window.Calculators = {
    obtenerFechaHoy,
    calcularDiasSinSeguimiento,
    formatearFecha,
    validarFecha
};

console.log('✅ Módulo CALCULATORS cargado correctamente');
```

---

## ✅ CHECKSUM (Verificación)
- **Primera línea:** `// ============================================`
- **Última línea:** `console.log('✅ Módulo CALCULATORS cargado correctamente');`
- **Total:** 95 líneas

---

## 🎯 INSTRUCCIONES

1. **Asegúrate de estar en la pantalla "Create new file"**
2. **El nombre del archivo debe ser:** `src-microsoft/backend/calculators.js`
3. **Copia TODO el código de arriba**
4. **Pégalo en el editor**
5. **Scroll hasta abajo**
6. **En "Commit changes"** escribe:
```
   Agregando Módulo 3 - Calculators (95 líneas)
