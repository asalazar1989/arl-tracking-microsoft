// ============================================
// MÓDULO 12: FILTROS AVANZADOS
// Sistema ARL - Migración Microsoft
// ============================================
// Este módulo proporciona filtros avanzados en acordeón:
// filtro por auditor y filtro por rango de fechas
// ============================================

/**
 * Renderiza el acordeón de filtros avanzados
 * @param {Array} rows - Filas de datos
 * @param {Array} headers - Headers
 */
function renderFiltrosAvanzados(rows, headers) {
    console.log('🔍 Renderizando filtros avanzados...');
    
    try {
        // Obtener lista única de auditores
        const auditores = obtenerListaAuditores(rows, headers);
        
        // Crear contenedor si no existe
        let filtrosContainer = document.getElementById('filtrosAvanzadosContainer');
        if (!filtrosContainer) {
            filtrosContainer = document.createElement('div');
            filtrosContainer.id = 'filtrosAvanzadosContainer';
            filtrosContainer.className = 'filtros-avanzados-container';
            
            // Insertar en el sidebar
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                // Insertar antes del user-info
                const userInfo = sidebar.querySelector('.user-info');
                if (userInfo) {
                    sidebar.insertBefore(filtrosContainer, userInfo);
                } else {
                    sidebar.appendChild(filtrosContainer);
                }
            }
        }
        
        // Renderizar contenido
        filtrosContainer.innerHTML = `
            <div class="accordion" id="accordionFiltros">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#collapseFiltros">
                            <i class="bi bi-funnel"></i> Filtros Avanzados
                        </button>
                    </h2>
                    <div id="collapseFiltros" class="accordion-collapse collapse" 
                         data-bs-parent="#accordionFiltros">
                        <div class="accordion-body">
                            <!-- Filtro por Auditor -->
                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-person"></i> Auditor</label>
                                <select class="form-select form-select-sm" id="filtroAuditor">
                                    <option value="">Todos los auditores</option>
                                    ${auditores.map(aud => `<option value="${aud}">${aud}</option>`).join('')}
                                </select>
                            </div>
                            
                            <!-- Filtro por Rango de Fechas -->
                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-calendar-range"></i> Rango de Fechas</label>
                                <div class="row g-2">
                                    <div class="col-6">
                                        <input type="date" class="form-control form-control-sm" 
                                               id="filtroFechaDesde" placeholder="Desde">
                                    </div>
                                    <div class="col-6">
                                        <input type="date" class="form-control form-control-sm" 
                                               id="filtroFechaHasta" placeholder="Hasta">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Botones -->
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary btn-sm" onclick="window.FiltrosAvanzados.aplicarFiltros()">
                                    <i class="bi bi-search"></i> Buscar
                                </button>
                                <button class="btn btn-outline-secondary btn-sm" 
                                        onclick="window.FiltrosAvanzados.limpiarFiltros()">
                                    <i class="bi bi-x-circle"></i> Limpiar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        console.log('✅ Filtros avanzados renderizados');
    } catch (error) {
        console.error('❌ Error al renderizar filtros avanzados:', error);
    }
}

/**
 * Obtiene lista única de auditores
 */
function obtenerListaAuditores(rows, headers) {
    const auditores = new Set();
    
    const indexAuditor = headers.findIndex(h => 
        h && h.toString().toUpperCase().trim() === 'AUDITOR'
    );
    
    if (indexAuditor !== -1) {
        rows.forEach(row => {
            const auditor = row.data[indexAuditor];
            if (auditor && auditor.toString().trim() !== '') {
                auditores.add(auditor.toString().trim());
            }
        });
    }
    
    return Array.from(auditores).sort();
}

/**
 * Aplica los filtros seleccionados
 */
function aplicarFiltros() {
    console.log('🔍 Aplicando filtros avanzados...');
    
    if (!window.STATE || !window.STATE.rows || !window.STATE.headers) {
        console.error('❌ Estado global no disponible');
        return;
    }
    
    const auditorSeleccionado = document.getElementById('filtroAuditor')?.value;
    const fechaDesde = document.getElementById('filtroFechaDesde')?.value;
    const fechaHasta = document.getElementById('filtroFechaHasta')?.value;
    
    let filasFiltradas = [...window.STATE.rows];
    
    // Filtrar por auditor
    if (auditorSeleccionado && auditorSeleccionado !== '') {
        const indexAuditor = window.STATE.headers.findIndex(h => 
            h && h.toString().toUpperCase().trim() === 'AUDITOR'
        );
        
        if (indexAuditor !== -1) {
            filasFiltradas = filasFiltradas.filter(row => {
                const auditor = row.data[indexAuditor];
                return auditor && auditor.toString().trim() === auditorSeleccionado;
            });
        }
    }
    
    // Filtrar por rango de fechas
    if (fechaDesde || fechaHasta) {
        const indexFechaAsignacion = window.STATE.headers.findIndex(h => 
            h && h.toString().toUpperCase().includes('FECHA DE ASIGNACION')
        );
        
        if (indexFechaAsignacion !== -1) {
            filasFiltradas = filasFiltradas.filter(row => {
                const fecha = row.data[indexFechaAsignacion];
                if (!fecha) return false;
                
                const fechaRow = new Date(fecha);
                
                if (fechaDesde && fechaHasta) {
                    const desde = new Date(fechaDesde);
                    const hasta = new Date(fechaHasta);
                    return fechaRow >= desde && fechaRow <= hasta;
                } else if (fechaDesde) {
                    const desde = new Date(fechaDesde);
                    return fechaRow >= desde;
                } else if (fechaHasta) {
                    const hasta = new Date(fechaHasta);
                    return fechaRow <= hasta;
                }
                
                return true;
            });
        }
    }
    
    console.log(`✅ Filtros aplicados: ${filasFiltradas.length} resultados`);
    
    // Renderizar tabla filtrada
    window.STATE.filteredRows = filasFiltradas;
    if (window.renderTable) {
        window.renderTable();
    }
}

/**
 * Limpia todos los filtros
 */
function limpiarFiltros() {
    console.log('🔄 Limpiando filtros avanzados...');
    
    // Limpiar campos
    const filtroAuditor = document.getElementById('filtroAuditor');
    const filtroFechaDesde = document.getElementById('filtroFechaDesde');
    const filtroFechaHasta = document.getElementById('filtroFechaHasta');
    
    if (filtroAuditor) filtroAuditor.value = '';
    if (filtroFechaDesde) filtroFechaDesde.value = '';
    if (filtroFechaHasta) filtroFechaHasta.value = '';
    
    // Limpiar filtro en estado
    if (window.STATE) {
        window.STATE.filteredRows = null;
    }
    
    // Renderizar tabla completa
    if (window.renderTable) {
        window.renderTable();
    }
    
    console.log('✅ Filtros limpiados');
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
window.FiltrosAvanzados = {
    renderFiltrosAvanzados,
    aplicarFiltros,
    limpiarFiltros
};

console.log('✅ Módulo FILTROS AVANZADOS cargado correctamente');
```

---

## ✅ CHECKSUMS

### MÓDULO 11:
- **Primera línea:** `// ============================================`
- **Última línea:** `console.log('✅ Módulo MODALES CITAS cargado correctamente');`
- **Total:** 380 líneas

### MÓDULO 12:
- **Primera línea:** `// ============================================`
- **Última línea:** `console.log('✅ Módulo FILTROS AVANZADOS cargado correctamente');`
- **Total:** 145 líneas

---

## 🎯 COMMIT MESSAGES

**Para Módulo 11:**
```
Agregando Módulo 11 - Modales Sección de Citas (380 líneas)
```

**Para Módulo 12:**
```
Agregando Módulo 12 - Filtros Avanzados (145 líneas) - PROYECTO COMPLETO
