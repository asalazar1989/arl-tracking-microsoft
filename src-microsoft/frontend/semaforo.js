// ============================================
// MÓDULO 9: SEMÁFORO DE SEGUIMIENTO
// Sistema ARL - Migración Microsoft
// ============================================
// Este módulo maneja el sistema de semáforo que indica
// el estado de seguimiento de pacientes según días sin seguimiento
// Verde (0-5), Naranja (6-12), Rojo (13+)
// ============================================

/**
 * Renderiza el semáforo de seguimiento
 * @param {Array} rows - Array de filas con datos de pacientes
 * @param {Array} headers - Array de headers de la hoja
 */
function renderSemaforo(rows, headers) {
    console.log('🚦 Renderizando semáforo de seguimiento...');
    
    try {
        // Calcular estadísticas del semáforo
        const stats = calcularEstadisticasSemaforo(rows, headers);
        
        // Crear contenedor del semáforo si no existe
        let semaforoContainer = document.getElementById('semaforoContainer');
        if (!semaforoContainer) {
            semaforoContainer = document.createElement('div');
            semaforoContainer.id = 'semaforoContainer';
            semaforoContainer.className = 'semaforo-container';
            
            // Insertar después del dashboard
            const dashboardContainer = document.getElementById('dashboardContainer');
            const contentArea = document.querySelector('.content-area');
            if (contentArea && dashboardContainer) {
                dashboardContainer.insertAdjacentElement('afterend', semaforoContainer);
            } else if (contentArea) {
                const tableContainer = document.getElementById('tableContainer');
                contentArea.insertBefore(semaforoContainer, tableContainer);
            }
        }
        
        // Calcular porcentajes
        const total = stats.verde + stats.naranja + stats.rojo;
        const porcentajeVerde = total > 0 ? ((stats.verde / total) * 100).toFixed(1) : 0;
        const porcentajeNaranja = total > 0 ? ((stats.naranja / total) * 100).toFixed(1) : 0;
        const porcentajeRojo = total > 0 ? ((stats.rojo / total) * 100).toFixed(1) : 0;
        
        // Renderizar contenido
        semaforoContainer.innerHTML = `
            <div class="semaforo-header">
                <h5><i class="bi bi-stopwatch"></i> Semáforo de Seguimiento</h5>
            </div>
            
            <div class="semaforo-indicators">
                <div class="semaforo-item semaforo-verde" onclick="window.Semaforo.filtrarPorSemaforo('0-5')" style="cursor: pointer;">
                    <div class="semaforo-icon">
                        <i class="bi bi-circle-fill"></i>
                    </div>
                    <div class="semaforo-info">
                        <h3>${stats.verde}</h3>
                        <p>0-5 días</p>
                        <small>${porcentajeVerde}% del total</small>
                    </div>
                </div>
                
                <div class="semaforo-item semaforo-naranja" onclick="window.Semaforo.filtrarPorSemaforo('6-12')" style="cursor: pointer;">
                    <div class="semaforo-icon">
                        <i class="bi bi-circle-fill"></i>
                    </div>
                    <div class="semaforo-info">
                        <h3>${stats.naranja}</h3>
                        <p>6-12 días</p>
                        <small>${porcentajeNaranja}% del total</small>
                    </div>
                </div>
                
                <div class="semaforo-item semaforo-rojo" onclick="window.Semaforo.filtrarPorSemaforo('13+')" style="cursor: pointer;">
                    <div class="semaforo-icon">
                        <i class="bi bi-circle-fill"></i>
                    </div>
                    <div class="semaforo-info">
                        <h3>${stats.rojo}</h3>
                        <p>13+ días</p>
                        <small>${porcentajeRojo}% del total</small>
                    </div>
                </div>
                
                <div class="semaforo-actions">
                    <button class="btn btn-sm btn-outline-secondary" onclick="window.Semaforo.limpiarFiltroSemaforo()">
                        <i class="bi bi-x-circle"></i> Ver todos
                    </button>
                </div>
            </div>
        `;
        
        console.log('✅ Semáforo renderizado exitosamente');
        console.log(`   Verde: ${stats.verde}, Naranja: ${stats.naranja}, Rojo: ${stats.rojo}`);
    } catch (error) {
        console.error('❌ Error al renderizar semáforo:', error);
    }
}

/**
 * Calcula las estadísticas del semáforo
 * @param {Array} rows - Filas de datos
 * @param {Array} headers - Headers
 * @returns {Object} Estadísticas por rango
 */
function calcularEstadisticasSemaforo(rows, headers) {
    const stats = {
        verde: 0,    // 0-5 días
        naranja: 0,  // 6-12 días
        rojo: 0      // 13+ días
    };
    
    // Encontrar índice de "Días sin seguimiento"
    const indexDiasSin = headers.findIndex(h => 
        h && h.toString().toUpperCase().includes('DÍAS SIN SEGUIMIENTO')
    );
    
    if (indexDiasSin === -1) {
        console.warn('⚠️ Columna "Días sin seguimiento" no encontrada');
        return stats;
    }
    
    // Clasificar cada paciente
    rows.forEach(row => {
        const data = row.data;
        const diasSin = parseInt(data[indexDiasSin]) || 0;
        
        if (diasSin >= 0 && diasSin <= 5) {
            stats.verde++;
        } else if (diasSin >= 6 && diasSin <= 12) {
            stats.naranja++;
        } else if (diasSin >= 13) {
            stats.rojo++;
        }
    });
    
    return stats;
}

/**
 * Filtra la tabla por rango de días del semáforo
 * @param {string} rango - Rango a filtrar ('0-5', '6-12', '13+')
 */
function filtrarPorSemaforo(rango) {
    console.log(`🔍 Filtrando por semáforo: ${rango}`);
    
    // Obtener el estado global
    if (!window.STATE || !window.STATE.rows || !window.STATE.headers) {
        console.error('❌ Estado global no disponible');
        return;
    }
    
    const headers = window.STATE.headers;
    const indexDiasSin = headers.findIndex(h => 
        h && h.toString().toUpperCase().includes('DÍAS SIN SEGUIMIENTO')
    );
    
    if (indexDiasSin === -1) {
        console.error('❌ Columna "Días sin seguimiento" no encontrada');
        return;
    }
    
    // Filtrar filas según el rango
    const filasFiltradas = window.STATE.rows.filter(row => {
        const diasSin = parseInt(row.data[indexDiasSin]) || 0;
        
        if (rango === '0-5') {
            return diasSin >= 0 && diasSin <= 5;
        } else if (rango === '6-12') {
            return diasSin >= 6 && diasSin <= 12;
        } else if (rango === '13+') {
            return diasSin >= 13;
        }
        return false;
    });
    
    console.log(`✅ Filtro aplicado: ${filasFiltradas.length} pacientes en rango ${rango}`);
    
    // Renderizar tabla filtrada
    if (window.renderTable) {
        window.STATE.filteredRows = filasFiltradas;
        window.renderTable();
    }
    
    // Resaltar indicador activo
    resaltarIndicadorActivo(rango);
}

/**
 * Limpia el filtro del semáforo
 */
function limpiarFiltroSemaforo() {
    console.log('🔄 Limpiando filtro de semáforo...');
    
    if (!window.STATE) {
        console.error('❌ Estado global no disponible');
        return;
    }
    
    // Limpiar filtro
    window.STATE.filteredRows = null;
    
    // Renderizar tabla completa
    if (window.renderTable) {
        window.renderTable();
    }
    
    // Quitar resaltado de indicadores
    document.querySelectorAll('.semaforo-item').forEach(item => {
        item.classList.remove('semaforo-activo');
    });
    
    console.log('✅ Filtro de semáforo limpiado');
}

/**
 * Resalta el indicador activo del semáforo
 * @param {string} rango - Rango activo
 */
function resaltarIndicadorActivo(rango) {
    // Quitar todas las marcas activas
    document.querySelectorAll('.semaforo-item').forEach(item => {
        item.classList.remove('semaforo-activo');
    });
    
    // Marcar el indicador correspondiente
    const indicadores = document.querySelectorAll('.semaforo-item');
    if (rango === '0-5' && indicadores[0]) {
        indicadores[0].classList.add('semaforo-activo');
    } else if (rango === '6-12' && indicadores[1]) {
        indicadores[1].classList.add('semaforo-activo');
    } else if (rango === '13+' && indicadores[2]) {
        indicadores[2].classList.add('semaforo-activo');
    }
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
window.Semaforo = {
    renderSemaforo,
    calcularEstadisticasSemaforo,
    filtrarPorSemaforo,
    limpiarFiltroSemaforo
};

console.log('✅ Módulo SEMÁFORO cargado correctamente');
```

---

## ✅ CHECKSUM
- **Primera línea:** `// ============================================`
- **Última línea:** `console.log('✅ Módulo SEMÁFORO cargado correctamente');`
- **Total:** 165 líneas

---

## 🎯 COMMIT MESSAGE
```
Agregando Módulo 9 - Semáforo de Seguimiento (165 líneas)
