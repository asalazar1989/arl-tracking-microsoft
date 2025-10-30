// ============================================
// MÓDULO 11: MODALES - SECCIÓN DE CITAS
// Sistema ARL - Migración Microsoft
// ============================================
// Este módulo agrega la funcionalidad completa de citas
// e inasistencias en los modales de Agregar y Editar Usuario
// ============================================

/**
 * Inicializa la sección de citas en el modal de Agregar
 */
function inicializarSeccionCitasAgregar() {
    console.log('📝 Inicializando sección de citas en modal Agregar...');
    
    // Buscar el modal de agregar
    const modalAgregar = document.getElementById('modalAgregarUsuario');
    if (!modalAgregar) {
        console.error('❌ Modal de agregar no encontrado');
        return;
    }
    
    // Buscar el cuerpo del modal
    const modalBody = modalAgregar.querySelector('.modal-body');
    if (!modalBody) {
        console.error('❌ Modal body no encontrado');
        return;
    }
    
    // Verificar si ya existe la sección
    if (document.getElementById('seccionCitasAgregar')) {
        console.log('✓ Sección de citas ya existe');
        return;
    }
    
    // Crear la sección de citas
    const seccionCitas = document.createElement('div');
    seccionCitas.id = 'seccionCitasAgregar';
    seccionCitas.className = 'seccion-citas-modal';
    seccionCitas.innerHTML = generarHTMLCitasAgregar();
    
    // Insertar al final del modal body
    modalBody.appendChild(seccionCitas);
    
    // Agregar event listeners
    agregarEventListenersCitasAgregar();
    
    console.log('✅ Sección de citas agregada al modal Agregar');
}

/**
 * Genera el HTML de la sección de citas para Agregar
 */
function generarHTMLCitasAgregar() {
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
    
    let html = `
        <hr style="margin: 20px 0; border-top: 2px solid #001f3f;">
        <h5 style="color: #001f3f; margin-bottom: 15px;">
            <i class="bi bi-calendar-check"></i> Citas Médicas
        </h5>
    `;
    
    citas.forEach(cita => {
        const id = cita.toLowerCase().replace(/ /g, '');
        html += `
            <div class="mb-3 cita-block">
                <label class="form-label fw-bold">${cita}</label>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input sincita-checkbox" type="checkbox" 
                                   id="sincita${id}" data-cita="${id}">
                            <label class="form-check-label" for="sincita${id}">
                                Sin asignación de cita
                            </label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="date" class="form-control fecha-cita-input" 
                               id="fecha${id}" data-cita="${id}">
                    </div>
                </div>
            </div>
        `;
    });
    
    return html;
}

/**
 * Agrega event listeners para las citas en modal Agregar
 */
function agregarEventListenersCitasAgregar() {
    // Event listeners para checkboxes "Sin asignación"
    document.querySelectorAll('.sincita-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const citaId = this.dataset.cita;
            const inputFecha = document.getElementById(`fecha${citaId}`);
            
            if (this.checked) {
                inputFecha.disabled = true;
                inputFecha.value = '';
            } else {
                inputFecha.disabled = false;
            }
        });
    });
}

/**
 * Inicializa la sección de citas en el modal de Editar
 */
function inicializarSeccionCitasEditar() {
    console.log('✏️ Inicializando sección de citas en modal Editar...');
    
    // Buscar el modal de editar
    const modalEditar = document.getElementById('modalEditarUsuario');
    if (!modalEditar) {
        console.error('❌ Modal de editar no encontrado');
        return;
    }
    
    // Buscar el cuerpo del modal
    const modalBody = modalEditar.querySelector('.modal-body');
    if (!modalBody) {
        console.error('❌ Modal body no encontrado');
        return;
    }
    
    // Verificar si ya existe la sección
    if (document.getElementById('seccionCitasEditar')) {
        console.log('✓ Sección de citas ya existe');
        return;
    }
    
    // Crear la sección de citas
    const seccionCitas = document.createElement('div');
    seccionCitas.id = 'seccionCitasEditar';
    seccionCitas.className = 'seccion-citas-modal';
    seccionCitas.innerHTML = generarHTMLCitasEditar();
    
    // Insertar al final del modal body
    modalBody.appendChild(seccionCitas);
    
    // Agregar event listeners
    agregarEventListenersCitasEditar();
    
    console.log('✅ Sección de citas agregada al modal Editar');
}

/**
 * Genera el HTML de la sección de citas para Editar
 */
function generarHTMLCitasEditar() {
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
    
    let html = `
        <hr style="margin: 20px 0; border-top: 2px solid #001f3f;">
        <h5 style="color: #001f3f; margin-bottom: 15px;">
            <i class="bi bi-calendar-check"></i> Citas Médicas e Inasistencias
        </h5>
    `;
    
    citas.forEach(cita => {
        const id = cita.toLowerCase().replace(/ /g, '');
        html += `
            <div class="mb-3 cita-block-editar">
                <label class="form-label fw-bold">${cita}</label>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-check">
                            <input class="form-check-input sincita-checkbox-editar" type="checkbox" 
                                   id="sincitaEdit${id}" data-cita="${id}">
                            <label class="form-check-label" for="sincitaEdit${id}">
                                Sin asignación
                            </label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <input type="date" class="form-control fecha-cita-input-editar" 
                               id="fechaEdit${id}" data-cita="${id}">
                    </div>
                    <div class="col-md-4">
                        <div class="form-check">
                            <input class="form-check-input inasistencia-checkbox" type="checkbox" 
                                   id="inasistenciaEdit${id}" data-cita="${id}">
                            <label class="form-check-label text-danger" for="inasistenciaEdit${id}">
                                <i class="bi bi-exclamation-triangle"></i> Inasistió
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    return html;
}

/**
 * Agrega event listeners para las citas en modal Editar
 */
function agregarEventListenersCitasEditar() {
    // Event listeners para checkboxes "Sin asignación"
    document.querySelectorAll('.sincita-checkbox-editar').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const citaId = this.dataset.cita;
            const inputFecha = document.getElementById(`fechaEdit${citaId}`);
            
            if (this.checked) {
                inputFecha.disabled = true;
                inputFecha.value = '';
            } else {
                inputFecha.disabled = false;
            }
        });
    });
}

/**
 * Carga los datos de las citas en el modal de Editar
 * @param {Object} registro - Registro completo del paciente
 * @param {Array} headers - Headers de la hoja
 */
function cargarDatosCitasEditar(registro, headers) {
    console.log('📋 Cargando datos de citas en modal Editar...');
    
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
    
    citas.forEach(cita => {
        const id = cita.toLowerCase().replace(/ /g, '');
        
        // Buscar índice de la columna de cita
        const indexCita = headers.findIndex(h => 
            h && h.toString().toUpperCase().trim() === cita.toUpperCase()
        );
        
        // Buscar índice de la columna de inasistencia
        const indexInasistencia = headers.findIndex(h => 
            h && h.toString().toUpperCase().trim() === `INASISTENCIA ${cita}`.toUpperCase()
        );
        
        // Checkbox "Sin asignación"
        const checkboxSinCita = document.getElementById(`sincitaEdit${id}`);
        // Input de fecha
        const inputFecha = document.getElementById(`fechaEdit${id}`);
        // Checkbox de inasistencia
        const checkboxInasistencia = document.getElementById(`inasistenciaEdit${id}`);
        
        if (indexCita !== -1) {
            const valorCita = registro.data[indexCita];
            
            if (valorCita && valorCita.toString().toUpperCase().includes('SIN ASIGNACION')) {
                // Sin asignación de cita
                if (checkboxSinCita) checkboxSinCita.checked = true;
                if (inputFecha) {
                    inputFecha.disabled = true;
                    inputFecha.value = '';
                }
            } else if (valorCita && valorCita.toString().trim() !== '') {
                // Tiene fecha
                if (checkboxSinCita) checkboxSinCita.checked = false;
                if (inputFecha) {
                    inputFecha.disabled = false;
                    inputFecha.value = valorCita;
                }
            } else {
                // Vacío
                if (checkboxSinCita) checkboxSinCita.checked = false;
                if (inputFecha) {
                    inputFecha.disabled = false;
                    inputFecha.value = '';
                }
            }
        }
        
        // Cargar inasistencia
        if (indexInasistencia !== -1 && checkboxInasistencia) {
            const valorInasistencia = registro.data[indexInasistencia];
            checkboxInasistencia.checked = (valorInasistencia && valorInasistencia.toString().toUpperCase().trim() === 'SI');
        }
    });
    
    console.log('✅ Datos de citas cargados');
}

/**
 * Recopila los datos de citas del modal de Agregar
 * @returns {Object} Objeto con los datos de las citas
 */
function recopilarDatosCitasAgregar() {
    const datos = {};
    
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
    
    citas.forEach(cita => {
        const id = cita.toLowerCase().replace(/ /g, '');
        
        const checkboxSinCita = document.getElementById(`sincita${id}`);
        const inputFecha = document.getElementById(`fecha${id}`);
        
        datos[`${id}SinCita`] = checkboxSinCita ? checkboxSinCita.checked : false;
        datos[`${id}Fecha`] = inputFecha ? inputFecha.value : '';
    });
    
    return datos;
}

/**
 * Recopila los datos de citas e inasistencias del modal de Editar
 * @returns {Object} Objeto con los datos de las citas e inasistencias
 */
function recopilarDatosCitasEditar() {
    const datos = {};
    
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
    
    citas.forEach(cita => {
        const id = cita.toLowerCase().replace(/ /g, '');
        
        const checkboxSinCita = document.getElementById(`sincitaEdit${id}`);
        const inputFecha = document.getElementById(`fechaEdit${id}`);
        const checkboxInasistencia = document.getElementById(`inasistenciaEdit${id}`);
        
        datos[`${id}SinCita`] = checkboxSinCita ? checkboxSinCita.checked : false;
        datos[`${id}Fecha`] = inputFecha ? inputFecha.value : '';
        datos[`${id}Inasistencia`] = checkboxInasistencia ? checkboxInasistencia.checked : false;
    });
    
    return datos;
}

/**
 * Limpia todos los campos de citas en modal Agregar
 */
function limpiarCamposCitasAgregar() {
    document.querySelectorAll('.sincita-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.querySelectorAll('.fecha-cita-input').forEach(input => {
        input.disabled = false;
        input.value = '';
    });
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
window.ModalesCitas = {
    inicializarSeccionCitasAgregar,
    inicializarSeccionCitasEditar,
    cargarDatosCitasEditar,
    recopilarDatosCitasAgregar,
    recopilarDatosCitasEditar,
    limpiarCamposCitasAgregar
};

console.log('✅ Módulo MODALES CITAS cargado correctamente');
