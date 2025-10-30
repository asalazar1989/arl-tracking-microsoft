// ============================================
// MÓDULO 10: BADGES DE CITAS E INASISTENCIAS
// Sistema ARL - Migración Microsoft
// ============================================
// Este módulo muestra badges clickeables para las 7 citas médicas
// y las 7 inasistencias, permitiendo filtrar la tabla por cada tipo
// ============================================

/**
 * Renderiza los badges de citas e inasistencias
 * @param {Array} rows - Array de filas con datos de pacientes
 * @param {Array} headers - Array de headers de la hoja
 */
function renderBadgesCitas(rows, headers) {
    console.log('🏥 Renderizando badges de citas e inasistencias...');
    
    try {
        // Calcular estadísticas
        const statsCitas = calcularEstadisticasCitas(rows, headers);
        const statsInasistencias = calcularEstadisticasInasistencias(rows, headers);
        
        // Crear contenedor si no existe
        let badgesContainer = document.getElementById('badgesCitasContainer');
        if (!badgesContainer) {
            badgesContainer = document.createElement('div');
            badgesContainer.id = 'badgesCitasContainer';
            badgesContainer.className = 'badges-citas-container';
            
            // Insertar después del semáforo
            const semaforoContainer = document.getElementById('semaforoContainer');
            const contentArea = document.querySelector('.content-area');
            if (contentArea && semaforoContainer) {
                semaforoContainer.insertAdjacentElement('afterend', badgesContainer);
            } else if (contentArea) {
                const tableContainer = document.getElementById('tableContainer');
                contentArea.insertBefore(badgesContainer, tableContainer);
            }
        }
        
        // Renderizar contenido
        badgesContainer.innerHTML = `
            <div class="badges-section">
                <div class="badges-header">
                    <h6><i class="bi bi-calendar-check"></i> Citas Pendientes</h6>
                    <button class="btn btn-sm btn-outline-secondary" onclick="window.BadgesCitas.limpiarFiltroCitas()">
                        <i class="bi bi-x-circle"></i> Limpiar
                    </button>
                </div>
                <div class="badges-grid">
                    ${renderBadgesCitasPendientes(statsCitas)}
                </div>
            </div>
            
            <div class="badges-section">
                <div class="badges-header">
                    <h6><i class="bi bi-exclamation-triangle"></i> Inasistencias Registradas</h6>
                    <button class="btn btn-sm btn-outline-secondary" onclick="window.BadgesCitas.limpiarFiltroInasistencias()">
                        <i class="bi bi-x-circle"></i> Limpiar
                    </button>
                </div>
                <div class="badges-grid">
                    ${renderBadgesInasistencias(statsInasistencias)}
                </div>
            </div>
        `;
        
        console.log('✅ Badges renderizados exitosamente');
    } catch (error) {
        console.error('❌ Error al renderizar badges:', error);
    }
}

/**
 * Calcula estadísticas de citas pendientes
 */
function calcularEstadisticasCitas(rows, headers) {
    const stats = {};
    
    // Lista de citas médicas
    const citas = [
        'CITA INICIAL',
        'JUNTA MEDICA',
        'FISIATRA',
        'VALORACION OCUPACIONAL',
        'MEDICINA LABORAL',
        'PSICOLOGIA',
        'TERAPIA OCUPACIONAL',
        'TERAPIA FISICA'
    ];
    
    // Inicializar contadores
    citas.forEach(cita => {
        stats[cita] = 0;
    });
    
    // Contar citas con fecha asignada (no vacías y no "Sin asignación")
    citas.forEach(cita => {
        const index = headers.findIndex(h => 
            h && h.toString().toUpperCase().trim() === cita.toUpperCase()
        );
        
        if (index !== -1) {
            rows.forEach(row => {
                const valor = row.data[index];
                if (valor && 
                    valor.toString().trim() !== '' && 
                    !valor.toString().toUpperCase().includes('SIN ASIGNACION')) {
                    stats[cita]++;
                }
            });
        }
    });
    
    return stats;
}

/**
 * Calcula estadísticas de inasistencias
 */
function calcularEstadisticasInasistencias(rows, headers) {
    const stats = {};
    
    // Lista de inasistencias
    const inasistencias = [
        'INASISTENCIA CITA INICIAL',
        'INASISTENCIA JUNTA MEDICA',
        'INASISTENCIA FISIATRA',
        'INASISTENCIA VALORACION OCUPACIONAL',
        'INASISTENCIA MEDICINA LABORAL',
        'INASISTENCIA PSICOLOGIA',
        'INASISTENCIA TERAPIA OCUPACIONAL',
        'INASISTENCIA TERAPIA FISICA'
    ];
    
    // Inicializar contadores
    inasistencias.forEach(inasistencia => {
        stats[inasistencia] = 0;
    });
    
    // Contar inasistencias marcadas como 'SI'
    inasistencias.forEach(inasistencia => {
        const index = headers.findIndex(h => 
            h && h.toString().toUpperCase().trim() === inasistencia.toUpperCase()
        );
        
        if (index !== -1) {
            rows.forEach(row => {
                const valor = row.data[index];
                if (valor && valor.toString().toUpperCase().trim() === 'SI') {
                    stats[inasistencia]++;
                }
            });
        }
    });
    
    return stats;
}

/**
 * Renderiza badges de citas pendientes
 */
function renderBadgesCitasPendientes(stats) {
    let badges = '';
    
    Object.entries(stats).forEach(([cita, cantidad]) => {
        const citaCorta = cita.replace('CITA ', '').replace('INICIAL', 'INIT.');
        badges += `
            <div class="badge-cita ${cantidad > 0 ? 'badge-cita-activo' : ''}" 
                 onclick="window.BadgesCitas.filtrarPorCita('${cita}')"
                 style="cursor: pointer;">
                <span class="badge-nombre">${citaCorta}</span>
                <span class="badge-numero">${cantidad}</span>
            </div>
        `;
    });
    
    return badges;
}

/**
 * Renderiza badges de inasistencias
 */
function renderBadgesInasistencias(stats) {
    let badges = '';
    
    Object.entries(stats).forEach(([inasistencia, cantidad]) => {
        const nombre = inasistencia.replace('INASISTENCIA ', '');
        const nombreCorto = nombre.replace('CITA ', '').replace('INICIAL', 'INIT.');
        badges += `
            <div class="badge-inasistencia ${cantidad > 0 ? 'badge-inasistencia-activo' : ''}" 
                 onclick="window.BadgesCitas.filtrarPorInasistencia('${inasistencia}')"
                 style="cursor: pointer;">
                <span class="badge-nombre">${nombreCorto}</span>
                <span class="badge-numero">${cantidad}</span>
            </div>
        `;
    });
    
    return badges;
}

/**
 * Filtra la tabla por tipo de cita
 */
function filtrarPorCita(tipoCita) {
    console.log(`🔍 Filtrando por cita: ${tipoCita}`);
    
    if (!window.STATE || !window.STATE.rows || !window.STATE.headers) {
        console.error('❌ Estado global no disponible');
        return;
    }
    
    const headers = window.STATE.headers;
    const index = headers.findIndex(h => 
        h && h.toString().toUpperCase().trim() === tipoCita.toUpperCase()
    );
    
    if (index === -1) {
        console.error(`❌ Columna "${tipoCita}" no encontrada`);
        return;
    }
    
    // Filtrar filas que tengan fecha asignada para esta cita
    const filasFiltradas = window.STATE.rows.filter(row => {
        const valor = row.data[index];
        return valor && 
               valor.toString().trim() !== '' && 
               !valor.toString().toUpperCase().includes('SIN ASIGNACION');
    });
    
    console.log(`✅ Filtro aplicado: ${filasFiltradas.length} pacientes con ${tipoCita}`);
    
    // Renderizar tabla filtrada
    if (window.renderTable) {
        window.STATE.filteredRows = filasFiltradas;
        window.renderTable();
    }
    
    // Resaltar badge activo
    resaltarBadgeActivo('.badge-cita', tipoCita);
}

/**
 * Filtra la tabla por tipo de inasistencia
 */
function filtrarPorInasistencia(tipoInasistencia) {
    console.log(`🔍 Filtrando por inasistencia: ${tipoInasistencia}`);
    
    if (!window.STATE || !window.STATE.rows || !window.STATE.headers) {
        console.error('❌ Estado global no disponible');
        return;
    }
    
    const headers = window.STATE.headers;
    const index = headers.findIndex(h => 
        h && h.toString().toUpperCase().trim() === tipoInasistencia.toUpperCase()
    );
    
    if (index === -1) {
        console.error(`❌ Columna "${tipoInasistencia}" no encontrada`);
        return;
    }
    
    // Filtrar filas que tengan inasistencia marcada como 'SI'
    const filasFiltradas = window.STATE.rows.filter(row => {
        const valor = row.data[index];
        return valor && valor.toString().toUpperCase().trim() === 'SI';
    });
    
    console.log(`✅ Filtro aplicado: ${filasFiltradas.length} pacientes con ${tipoInasistencia}`);
    
    // Renderizar tabla filtrada
    if (window.renderTable) {
        window.STATE.filteredRows = filasFiltradas;
        window.renderTable();
    }
    
    // Resaltar badge activo
    resaltarBadgeActivo('.badge-inasistencia', tipoInasistencia);
}

/**
 * Limpia el filtro de citas
 */
function limpiarFiltroCitas() {
    limpiarFiltroGeneral('.badge-cita');
}

/**
 * Limpia el filtro de inasistencias
 */
function limpiarFiltroInasistencias() {
    limpiarFiltroGeneral('.badge-inasistencia');
}

/**
 * Limpia filtro general
 */
function limpiarFiltroGeneral(selector) {
    console.log('🔄 Limpiando filtro...');
    
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
    
    // Quitar resaltado
    document.querySelectorAll(selector).forEach(badge => {
        badge.classList.remove('badge-filtro-activo');
    });
    
    console.log('✅ Filtro limpiado');
}

/**
 * Resalta el badge activo
 */
function resaltarBadgeActivo(selector, nombre) {
    // Quitar todas las marcas activas
    document.querySelectorAll(selector).forEach(badge => {
        badge.classList.remove('badge-filtro-activo');
    });
    
    // Marcar el badge correspondiente (esto es aproximado, se puede mejorar con data attributes)
    document.querySelectorAll(selector).forEach(badge => {
        if (badge.onclick && badge.onclick.toString().includes(nombre)) {
            badge.classList.add('badge-filtro-activo');
        }
    });
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
window.BadgesCitas = {
    renderBadgesCitas,
    filtrarPorCita,
    filtrarPorInasistencia,
    limpiarFiltroCitas,
    limpiarFiltroInasistencias
};

console.log('✅ Módulo BADGES CITAS cargado correctamente');
