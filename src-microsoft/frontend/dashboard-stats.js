// ============================================
// MÓDULO 8: DASHBOARD ESTADÍSTICO
// Sistema ARL - Migración Microsoft
// ============================================
// Este módulo renderiza el dashboard principal con
// estadísticas, tarjetas de resumen y tablas de análisis
// ============================================

/**
 * Renderiza el dashboard completo con estadísticas
 * @param {Array} rows - Array de filas con datos de pacientes
 * @param {Array} headers - Array de headers de la hoja
 */
function renderDashboard(rows, headers) {
    console.log('📊 Renderizando dashboard estadístico...');
    
    try {
        // Calcular estadísticas
        const stats = calcularEstadisticas(rows, headers);
        
        // Crear contenedor del dashboard si no existe
        let dashboardContainer = document.getElementById('dashboardContainer');
        if (!dashboardContainer) {
            dashboardContainer = document.createElement('div');
            dashboardContainer.id = 'dashboardContainer';
            dashboardContainer.className = 'dashboard-container';
            
            // Insertar antes de la tabla
            const contentArea = document.querySelector('.content-area');
            const tableContainer = document.getElementById('tableContainer');
            if (contentArea && tableContainer) {
                contentArea.insertBefore(dashboardContainer, tableContainer);
            }
        }
        
        // Renderizar contenido
        dashboardContainer.innerHTML = `
            <div class="dashboard-header">
                <h4><i class="bi bi-graph-up"></i> Dashboard Estadístico</h4>
                <button class="btn btn-sm btn-outline-secondary" onclick="toggleDashboard()">
                    <i class="bi bi-chevron-up"></i> Ocultar
                </button>
            </div>
            
            <!-- Tarjetas de Resumen -->
            <div class="stats-cards">
                ${renderTarjetasResumen(stats)}
            </div>
            
            <!-- Tablas de Análisis -->
            <div class="stats-tables">
                <div class="row">
                    <div class="col-md-6">
                        ${renderTablaPacientesPorAuditor(stats.pacientesPorAuditor)}
                    </div>
                    <div class="col-md-6">
                        ${renderTablaClasificacionSeveridad(stats.clasificacionSeveridad)}
                    </div>
                </div>
            </div>
        `;
        
        console.log('✅ Dashboard renderizado exitosamente');
    } catch (error) {
        console.error('❌ Error al renderizar dashboard:', error);
    }
}

/**
 * Calcula todas las estadísticas del dashboard
 * @param {Array} rows - Filas de datos
 * @param {Array} headers - Headers
 * @returns {Object} Objeto con todas las estadísticas
 */
function calcularEstadisticas(rows, headers) {
    const stats = {
        totalCasos: rows.length,
        poblacionActiva: 0,
        siniestros: 0,
        masculino: 0,
        femenino: 0,
        otro: 0,
        pacientesPorAuditor: {},
        clasificacionSeveridad: {}
    };
    
    // Encontrar índices de columnas importantes
    const indexGenero = headers.findIndex(h => h && h.toString().toUpperCase().includes('GENERO'));
    const indexSiniestro = headers.findIndex(h => h && h.toString().toUpperCase() === 'SINIESTRO');
    const indexAuditor = headers.findIndex(h => h && h.toString().toUpperCase() === 'AUDITOR');
    const indexSeveridad = headers.findIndex(h => h && h.toString().toUpperCase().includes('CLASIFICACION SEVERIDAD'));
    const indexNombre = headers.findIndex(h => h && h.toString().toUpperCase() === 'NOMBRE');
    
    // Procesar cada fila
    rows.forEach(row => {
        const data = row.data;
        
        // Población activa (que tenga nombre)
        if (indexNombre !== -1 && data[indexNombre] && data[indexNombre].toString().trim() !== '') {
            stats.poblacionActiva++;
        }
        
        // Siniestros únicos
        if (indexSiniestro !== -1 && data[indexSiniestro] && data[indexSiniestro].toString().trim() !== '') {
            stats.siniestros++;
        }
        
        // Distribución por género
        if (indexGenero !== -1 && data[indexGenero]) {
            const genero = data[indexGenero].toString().toUpperCase().trim();
            if (genero.includes('M') && !genero.includes('F')) {
                stats.masculino++;
            } else if (genero.includes('F')) {
                stats.femenino++;
            } else if (genero !== '') {
                stats.otro++;
            }
        }
        
        // Pacientes por auditor
        if (indexAuditor !== -1 && data[indexAuditor]) {
            const auditor = data[indexAuditor].toString().trim();
            if (auditor !== '') {
                stats.pacientesPorAuditor[auditor] = (stats.pacientesPorAuditor[auditor] || 0) + 1;
            }
        }
        
        // Clasificación de severidad
        if (indexSeveridad !== -1 && data[indexSeveridad]) {
            const severidad = data[indexSeveridad].toString().trim();
            if (severidad !== '') {
                stats.clasificacionSeveridad[severidad] = (stats.clasificacionSeveridad[severidad] || 0) + 1;
            }
        }
    });
    
    return stats;
}

/**
 * Renderiza las tarjetas de resumen
 */
function renderTarjetasResumen(stats) {
    return `
        <div class="stat-card stat-card-primary">
            <div class="stat-icon"><i class="bi bi-file-earmark-text"></i></div>
            <div class="stat-info">
                <h3>${stats.totalCasos}</h3>
                <p>Casos Activos</p>
            </div>
        </div>
        
        <div class="stat-card stat-card-success">
            <div class="stat-icon"><i class="bi bi-people"></i></div>
            <div class="stat-info">
                <h3>${stats.poblacionActiva}</h3>
                <p>Población Activa</p>
            </div>
        </div>
        
        <div class="stat-card stat-card-warning">
            <div class="stat-icon"><i class="bi bi-exclamation-triangle"></i></div>
            <div class="stat-info">
                <h3>${stats.siniestros}</h3>
                <p>Siniestros</p>
            </div>
        </div>
        
        <div class="stat-card stat-card-info">
            <div class="stat-icon"><i class="bi bi-gender-male"></i></div>
            <div class="stat-info">
                <h3>${stats.masculino}</h3>
                <p>Masculino</p>
            </div>
        </div>
        
        <div class="stat-card stat-card-danger">
            <div class="stat-icon"><i class="bi bi-gender-female"></i></div>
            <div class="stat-info">
                <h3>${stats.femenino}</h3>
                <p>Femenino</p>
            </div>
        </div>
        
        <div class="stat-card stat-card-secondary">
            <div class="stat-icon"><i class="bi bi-gender-ambiguous"></i></div>
            <div class="stat-info">
                <h3>${stats.otro}</h3>
                <p>Otro</p>
            </div>
        </div>
    `;
}

/**
 * Renderiza tabla de pacientes por auditor
 */
function renderTablaPacientesPorAuditor(pacientesPorAuditor) {
    const auditores = Object.entries(pacientesPorAuditor)
        .sort((a, b) => b[1] - a[1]) // Ordenar por cantidad descendente
        .slice(0, 10); // Top 10
    
    let rows = '';
    auditores.forEach(([auditor, cantidad]) => {
        rows += `
            <tr>
                <td>${auditor}</td>
                <td><span class="badge bg-primary">${cantidad}</span></td>
            </tr>
        `;
    });
    
    return `
        <div class="stats-table-card">
            <h6><i class="bi bi-person-badge"></i> Pacientes por Auditor</h6>
            <div class="table-responsive">
                <table class="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Auditor</th>
                            <th>Pacientes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || '<tr><td colspan="2" class="text-center text-muted">Sin datos</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * Renderiza tabla de clasificación de severidad
 */
function renderTablaClasificacionSeveridad(clasificacionSeveridad) {
    const clasificaciones = Object.entries(clasificacionSeveridad)
        .sort((a, b) => b[1] - a[1]); // Ordenar por cantidad descendente
    
    let rows = '';
    clasificaciones.forEach(([severidad, cantidad]) => {
        const porcentaje = ((cantidad / Object.values(clasificacionSeveridad).reduce((a, b) => a + b, 0)) * 100).toFixed(1);
        rows += `
            <tr>
                <td>${severidad}</td>
                <td>
                    <span class="badge bg-warning">${cantidad}</span>
                </td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar" role="progressbar" style="width: ${porcentaje}%">
                            ${porcentaje}%
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });
    
    return `
        <div class="stats-table-card">
            <h6><i class="bi bi-bar-chart"></i> Clasificación de Severidad</h6>
            <div class="table-responsive">
                <table class="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Clasificación</th>
                            <th>Cantidad</th>
                            <th>Porcentaje</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || '<tr><td colspan="3" class="text-center text-muted">Sin datos</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * Alterna la visibilidad del dashboard
 */
function toggleDashboard() {
    const dashboard = document.getElementById('dashboardContainer');
    if (dashboard) {
        dashboard.classList.toggle('collapsed');
        const btn = dashboard.querySelector('.dashboard-header button');
        if (btn) {
            const icon = btn.querySelector('i');
            if (dashboard.classList.contains('collapsed')) {
                icon.className = 'bi bi-chevron-down';
                btn.innerHTML = '<i class="bi bi-chevron-down"></i> Mostrar';
            } else {
                icon.className = 'bi bi-chevron-up';
                btn.innerHTML = '<i class="bi bi-chevron-up"></i> Ocultar';
            }
        }
    }
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
window.DashboardStats = {
    renderDashboard,
    calcularEstadisticas,
    toggleDashboard
};

console.log('✅ Módulo DASHBOARD STATS cargado correctamente');
```

---

## ✅ CHECKSUM
- **Primera línea:** `// ============================================`
- **Última línea:** `console.log('✅ Módulo DASHBOARD STATS cargado correctamente');`
- **Total:** 285 líneas

---

## 🎯 COMMIT MESSAGE
```
Agregando Módulo 8 - Dashboard Estadístico (285 líneas)
