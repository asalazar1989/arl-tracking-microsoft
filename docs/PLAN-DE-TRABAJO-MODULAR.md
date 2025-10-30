# 🎯 PLAN DE TRABAJO MODULAR - Sistema ARL Microsoft

**Fecha de creación:** 30 de Octubre, 2025  
**Desarrollador:** [Tu nombre]  
**Asistente:** Claude Sonnet 4.5

---

## 📋 ESTRATEGIA DE IMPLEMENTACIÓN

### Principios Fundamentales:
1. ✅ **UN módulo a la vez** - No avanzar hasta confirmar el actual
2. ✅ **Código 100% completo** - Sin omisiones ni "alucinaciones"
3. ✅ **Checksums** - Primera y última línea para verificar integridad
4. ✅ **Pruebas** - Cada módulo se prueba antes del siguiente
5. ✅ **GitHub** - Cada módulo se sube al repo inmediatamente

---

## 🗂️ MÓDULOS A IMPLEMENTAR (12 Total)

### 📦 MÓDULO 1: Funciones Helper de Backend
**Archivo:** `src-microsoft/backend/helpers-excel.js`  
**Líneas estimadas:** 150  
**Prioridad:** 🔴 CRÍTICA  
**Depende de:** Ninguno

**Funciones:**
- `getColumnLetter(columnNumber)` ✅ (ya existe)
- `getLastColumn(worksheet, accessToken, excelFileId)` - Obtener última columna de una hoja
- `getHeadersFromSheet(worksheet, accessToken, excelFileId)` - Obtener headers
- `appendColumn(worksheet, headerName, accessToken, excelFileId)` - Agregar columna
- `formatHeader(worksheet, columnIndex, color, accessToken, excelFileId)` - Formatear header

**¿Por qué primero?** Estas funciones son la base para TODO lo demás.

---

### 📦 MÓDULO 2: Verificación y Creación de Columnas
**Archivo:** `src-microsoft/backend/column-manager.js`  
**Líneas estimadas:** 200  
**Prioridad:** 🔴 CRÍTICA  
**Depende de:** Módulo 1

**Funciones:**
- `verificarYCrearColumnasCitas(nombreHoja, accessToken, excelFileId)`
  - Verifica las 7 columnas de citas
  - Las crea si no existen
  - Aplica formato azul oscuro (#001f3f)
  
- `verificarYCrearColumnasInasistencias(nombreHoja, accessToken, excelFileId)`
  - Verifica las 7 columnas de inasistencias
  - Las crea si no existen
  - Aplica formato rojo (#d9534f)

- `verificarColumnasPositivaEvento(accessToken, excelFileId)`
  - Verifica las 9 columnas especiales
  - Las crea si no existen

- `verificarColumnasCERRADOS(accessToken, excelFileId)`
  - Verifica las 3 columnas extra
  - Las crea si no existen

**¿Por qué segundo?** Garantiza que la estructura de Excel sea correcta antes de cualquier operación.

---

### 📦 MÓDULO 3: Cálculos Automáticos
**Archivo:** `src-microsoft/backend/calculators.js`  
**Líneas estimadas:** 100  
**Prioridad:** 🔴 CRÍTICA  
**Depende de:** Ninguno

**Funciones:**
- `calcularDiasSinSeguimiento(fechaUltimoSeguimiento)`
  - Recibe fecha en formato 'YYYY-MM-DD'
  - Retorna número de días desde esa fecha hasta hoy
  
- `obtenerFechaHoy()`
  - Retorna fecha actual en formato 'YYYY-MM-DD'

- `formatearFecha(fecha)`
  - Convierte entre formatos dd/MM/yyyy ↔ yyyy-MM-dd

**¿Por qué tercero?** Necesario para las funciones de agregar y actualizar usuario.

---

### 📦 MÓDULO 4: Lógica Positiva Evento
**Archivo:** `src-microsoft/backend/positiva-evento.js`  
**Líneas estimadas:** 150  
**Prioridad:** 🔴 CRÍTICA  
**Depende de:** Módulo 1, 2

**Funciones:**
- `manejarPositivaEvento(datos, accessToken, excelFileId)`
  - Detecta si PACIENTE_EVENTO = "SI"
  - Retorna 'Positiva Evento' si aplica, 'Positiva' si no
  - Crea hoja si no existe
  - Llama a verificarColumnasPositivaEvento()

**¿Por qué cuarto?** Lógica específica que debe integrarse en agregarUsuario().

---

### 📦 MÓDULO 5: Agregar Usuario (Completo)
**Archivo:** Modificar el código actual en `ultimo_ARL_funionando_la_conexion.txt`  
**Líneas a modificar:** ~100  
**Prioridad:** 🔴 CRÍTICA  
**Depende de:** Módulo 1, 2, 3, 4

**Modificaciones:**
1. Llamar a `verificarYCrearColumnasCitas()`
2. Llamar a `verificarYCrearColumnasInasistencias()`
3. Llamar a `manejarPositivaEvento()` si aplica
4. Agregar cálculo de "Hoy" usando `obtenerFechaHoy()`
5. Agregar cálculo de "Días sin seguimiento" usando `calcularDiasSinSeguimiento()`
6. Asignar valores correctos a esas columnas

**¿Por qué quinto?** Integración de todos los módulos de backend previos.

---

### 📦 MÓDULO 6: Actualizar Usuario (Completo)
**Archivo:** Modificar el código actual  
**Líneas a modificar:** ~50  
**Prioridad:** 🔴 CRÍTICA  
**Depende de:** Módulo 3

**Modificaciones:**
1. Recalcular "Hoy" usando `obtenerFechaHoy()`
2. Recalcular "Días sin seguimiento" usando `calcularDiasSinSeguimiento()`

**¿Por qué sexto?** Complementa el módulo 5.

---

### 📦 MÓDULO 7: Cerrar Caso (Completo)
**Archivo:** Modificar el código actual  
**Líneas a modificar:** ~80  
**Prioridad:** 🔴 CRÍTICA  
**Depende de:** Módulo 2

**Modificaciones:**
1. Validar que tipoCierre no esté vacío
2. Mostrar error claro si falta
3. Llamar a `verificarColumnasCERRADOS()`
4. Agregar las 3 columnas: tipoCierre, hojaOrigen, fechaCierre

**¿Por qué séptimo?** Completa la funcionalidad de backend crítica.

---

### 📦 MÓDULO 8: Dashboard Estadístico
**Archivo:** `src-microsoft/frontend/dashboard-stats.js`  
**Líneas estimadas:** 300  
**Prioridad:** 🟠 ALTA  
**Depende de:** Ninguno (trabaja con datos ya cargados)

**Funciones:**
- `renderDashboard(rows)`
  - Tarjetas de resumen (6)
  - Tabla Pacientes por Auditor
  - Tabla Clasificación de Severidad

**HTML a agregar:**
```html
<div class="stats-container">
  <!-- Tarjetas -->
  <div class="stats-cards">...</div>
  
  <!-- Tablas de análisis -->
  <div class="stats-tables">...</div>
</div>
```

**¿Por qué octavo?** Primera funcionalidad visual importante después de backend.

---

### 📦 MÓDULO 9: Semáforo de Seguimiento
**Archivo:** `src-microsoft/frontend/semaforo.js`  
**Líneas estimadas:** 150  
**Prioridad:** 🟠 ALTA  
**Depende de:** Ninguno

**Funciones:**
- `renderSemaforo(rows)`
  - Calcula pacientes en cada rango (0-5, 6-12, 13+)
  - Muestra indicadores con porcentajes
  - Agrega event listeners para filtrar

**HTML a agregar:**
```html
<div class="semaforo">
  <div class="indicador verde" onclick="filtrarPorSemaforo('0-5')">...</div>
  <div class="indicador naranja" onclick="filtrarPorSemaforo('6-12')">...</div>
  <div class="indicador rojo" onclick="filtrarPorSemaforo('13+')">...</div>
  <button onclick="limpiarFiltroSemaforo()">Ver todos</button>
</div>
```

**¿Por qué noveno?** Complementa el dashboard.

---

### 📦 MÓDULO 10: Badges de Citas e Inasistencias
**Archivo:** `src-microsoft/frontend/badges-citas.js`  
**Líneas estimadas:** 200  
**Prioridad:** 🟠 ALTA  
**Depende de:** Ninguno

**Funciones:**
- `renderBadgesCitas(rows)`
  - Cuenta citas pendientes por tipo (los 7)
  - Muestra badges clickeables
  
- `renderBadgesInasistencias(rows)`
  - Cuenta inasistencias por tipo (los 7)
  - Muestra badges rojos clickeables

**HTML a agregar:**
```html
<div class="control-citas">
  <h6>Citas Pendientes</h6>
  <div class="badges-citas">...</div>
  
  <h6>Inasistencias Registradas</h6>
  <div class="badges-inasistencias">...</div>
</div>
```

**¿Por qué décimo?** Visual importante para control de citas.

---

### 📦 MÓDULO 11: Modales - Sección de Citas
**Archivo:** Modificar HTML en `ultimo_ARL_funionando_la_conexion.txt`  
**Líneas a agregar:** ~400  
**Prioridad:** 🔴 CRÍTICA  
**Depende de:** Ninguno

**Para Modal Agregar:**
```html
<div id="seccionCitas" style="margin-top:20px; border-top:2px solid #001f3f; padding-top:15px;">
  <h5>Citas Médicas</h5>
  <!-- 7 bloques de citas -->
  <div class="cita-block">
    <label>FISIATRA</label>
    <input type="checkbox" id="citaFisiatraSinCita"> Sin asignación
    <input type="date" id="citaFisiatraFecha">
  </div>
  <!-- ... repetir para las otras 6 citas ... -->
</div>
```

**Para Modal Editar:**
```html
<div id="seccionCitasEditar">
  <!-- 7 bloques de citas CON checkbox de inasistencia -->
  <div class="cita-block-edit">
    <label>FISIATRA</label>
    <input type="checkbox" class="sinCita"> Sin asignación
    <input type="date" class="fechaCita">
    <input type="checkbox" class="inasistencia"> Inasistió
  </div>
  <!-- ... repetir para las otras 6 citas ... -->
</div>
```

**JavaScript a agregar:**
- Lógica de habilitación/deshabilitación
- Recolección de datos de citas
- Validaciones

**¿Por qué once?** Funcionalidad crítica de citas en modales.

---

### 📦 MÓDULO 12: Filtros Avanzados
**Archivo:** `src-microsoft/frontend/filtros.js`  
**Líneas estimadas:** 150  
**Prioridad:** 🟡 MEDIA  
**Depende de:** Ninguno

**Funciones:**
- `filtrarPorAuditor(auditor)`
- `filtrarPorRangoFechas(desde, hasta)`
- `limpiarFiltros()`

**HTML a agregar:**
```html
<div class="accordion" id="accordionFiltros">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseFiltros">
        Filtros
      </button>
    </h2>
    <div id="collapseFiltros" class="accordion-collapse collapse">
      <div class="accordion-body">
        <select id="filtroAuditor">...</select>
        <input type="date" id="filtroDesde">
        <input type="date" id="filtroHasta">
        <button onclick="aplicarFiltros()">Buscar</button>
        <button onclick="limpiarFiltros()">Limpiar</button>
      </div>
    </div>
  </div>
</div>
```

**¿Por qué doce?** Funcionalidad útil pero no crítica.

---

## 📅 CRONOGRAMA ESTIMADO

| Módulo | Nombre | Tiempo | Acumulado |
|--------|--------|--------|-----------|
| 1 | Helpers Excel | 2h | 2h |
| 2 | Column Manager | 3h | 5h |
| 3 | Calculators | 1h | 6h |
| 4 | Positiva Evento | 2h | 8h |
| 5 | Agregar Usuario | 2h | 10h |
| 6 | Actualizar Usuario | 1h | 11h |
| 7 | Cerrar Caso | 1.5h | 12.5h |
| 8 | Dashboard | 4h | 16.5h |
| 9 | Semáforo | 2h | 18.5h |
| 10 | Badges | 3h | 21.5h |
| 11 | Modales Citas | 5h | 26.5h |
| 12 | Filtros | 2h | 28.5h |
| **TOTAL** | | **28.5h** | |

**Distribución en sesiones de trabajo:**
- Sesión 1 (4h): Módulos 1, 2, 3
- Sesión 2 (4h): Módulos 4, 5, 6
- Sesión 3 (4h): Módulos 7, 8
- Sesión 4 (5h): Módulo 9, 10
- Sesión 5 (6h): Módulo 11
- Sesión 6 (2h): Módulo 12
- Sesión 7 (3h): Pruebas finales y ajustes

**Total:** 7 sesiones de trabajo

---

## 🚀 METODOLOGÍA DE TRABAJO

### Para cada módulo:

1. **YO TE DOY:** Código completo del módulo en un archivo
2. **TÚ VERIFICAS:** Primera y última línea (checksum)
3. **TÚ SUBES:** El archivo a GitHub
4. **TÚ ME CONFIRMAS:** "Subido módulo X"
5. **YO VERIFICO:** Vemos el archivo en GitHub juntos
6. **TÚ PRUEBAS:** Si es posible, pruebas la funcionalidad
7. **AVANZAMOS:** Al siguiente módulo

### Formato de entrega:

```
==================================================
MÓDULO X: [Nombre del módulo]
==================================================

📁 ARCHIVO: src-microsoft/backend/nombre-archivo.js
📏 LÍNEAS: 150
🔢 CHECKSUM: 
   - Primera línea: // ============ MÓDULO X...
   - Última línea: }

==================================================
CÓDIGO COMPLETO:
==================================================

[CÓDIGO AQUÍ - 100% COMPLETO]

==================================================
INSTRUCCIONES DE USO:
==================================================

1. Crea el archivo en GitHub en la ruta indicada
2. Copia y pega TODO el código
3. Guarda con commit: "Agregando módulo X - [Nombre]"
4. Confirma que el archivo tiene exactamente [X] líneas

==================================================
PRUEBA BÁSICA:
==================================================

[Cómo probar que funciona]

==================================================
```

---

## ✅ CHECKLIST DE AVANCE

### Backend - Funcionalidades Core
- [ ] Módulo 1: Helpers Excel
- [ ] Módulo 2: Column Manager
- [ ] Módulo 3: Calculators
- [ ] Módulo 4: Positiva Evento
- [ ] Módulo 5: Agregar Usuario (completo)
- [ ] Módulo 6: Actualizar Usuario (completo)
- [ ] Módulo 7: Cerrar Caso (completo)

### Frontend - Dashboard y Visualización
- [ ] Módulo 8: Dashboard Estadístico
- [ ] Módulo 9: Semáforo
- [ ] Módulo 10: Badges Citas

### Frontend - Modales y Formularios
- [ ] Módulo 11: Sección de Citas en Modales

### Frontend - Filtros
- [ ] Módulo 12: Filtros Avanzados

---

## 📊 INDICADORES DE PROGRESO

**Backend:** 0/7 módulos (0%)  
**Frontend:** 0/5 módulos (0%)  
**TOTAL:** 0/12 módulos (0%)

**Líneas de código agregadas:** 0 / ~1,650 líneas

---

## 🎯 PRÓXIMO PASO INMEDIATO

**AHORA MISMO:**
1. Confirma que entiendes el plan
2. Dime qué método de GitHub vas a usar (Web, Desktop, o CLI)
3. Crea el repositorio en GitHub (si aún no lo has hecho)
4. Comparte la URL del repositorio

**DESPUÉS:**
Te entregaré el **MÓDULO 1: Helpers Excel** completo para que lo subas.

---

**¿Estás listo para empezar? 🚀**

Confirma:
- [ ] Entiendo el plan modular
- [ ] Tengo cuenta en GitHub
- [ ] Sé qué método voy a usar (Web/Desktop/CLI)
- [ ] Estoy listo para recibir el Módulo 1

**Dime "LISTO" cuando puedas continuar** 😊
