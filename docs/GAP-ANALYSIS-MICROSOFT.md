# 🔍 ANÁLISIS DE BRECHA: Google vs Microsoft Actual

**Fecha:** 30 de Octubre, 2025  
**Proyecto:** Migración Sistema ARL  
**Estado:** Microsoft tiene autenticación funcionando, pero falta ~80% del sistema

---

## 📊 RESUMEN EJECUTIVO

### ✅ LO QUE YA FUNCIONA EN MICROSOFT (20%)
1. ✅ Autenticación con Microsoft (MSAL)
2. ✅ Conexión a Excel Online mediante Graph API
3. ✅ Lectura de datos de Excel
4. ✅ Renderizado básico de tabla
5. ✅ Modal para editar usuario
6. ✅ Modal para agregar usuario
7. ✅ Función cerrar caso (básica)
8. ✅ Sidebar colapsable
9. ✅ Pantalla de login
10. ✅ Estilos base

### ❌ LO QUE FALTA EN MICROSOFT (80%)

#### 🔴 CRÍTICO - FUNCIONALIDADES FALTANTES:

1. **❌ DASHBOARD ESTADÍSTICO COMPLETO**
   - ❌ No hay tarjetas de resumen (Casos Activos, Población Activa, Siniestros)
   - ❌ No hay distribución por género
   - ❌ No hay tabla "Pacientes por Auditor"
   - ❌ No hay tabla "Clasificación de Severidad"

2. **❌ SISTEMA DE SEMÁFORO**
   - ❌ No hay indicadores de seguimiento (Verde 0-5, Naranja 6-12, Rojo 13+)
   - ❌ No hay filtro clickeable por semáforo
   - ❌ No hay cálculo de porcentajes

3. **❌ CONTROL DE CITAS MÉDICAS (LAS 7)**
   - ❌ No hay badges de "Citas Pendientes"
   - ❌ No hay badges de "Inasistencias Registradas"
   - ❌ No hay filtro clickeable por tipo de cita
   - ❌ No hay contador por tipo de cita

4. **❌ MODAL AGREGAR: SECCIÓN DE CITAS**
   - ❌ No tiene los campos de las 7 citas médicas con:
     - Checkbox "Sin asignación de cita"
     - Input de fecha (deshabilitado si checkbox marcado)
   - ❌ No tiene lógica de habilitación/deshabilitación

5. **❌ MODAL EDITAR: SECCIÓN DE CITAS + INASISTENCIAS**
   - ❌ No tiene los campos de las 7 citas médicas
   - ❌ No tiene los 7 checkboxes de inasistencias
   - ❌ No tiene lógica de "Sin asignación de cita"

6. **❌ FILTROS AVANZADOS**
   - ❌ No hay filtro por rango de fechas (Desde - Hasta)
   - ❌ No hay botón "Limpiar" filtros
   - ❌ No hay filtro por Auditor en acordeón

7. **❌ LÓGICA DE NEGOCIO GOOGLE**
   - ❌ No crea automáticamente las 7 columnas de CITAS si no existen
   - ❌ No crea automáticamente las 7 columnas de INASISTENCIAS si no existen
   - ❌ No maneja la lógica de "Positiva Evento" (crear hoja + 9 columnas especiales)
   - ❌ No calcula "Días sin seguimiento" automáticamente al agregar/editar
   - ❌ No actualiza "Hoy" automáticamente

8. **❌ HOJA CERRADOS**
   - ❌ No agrega las 3 columnas extra (TIPO DE CIERRE, HOJA ORIGEN, FECHA DE CIERRE DEL CASO)
   - ❌ No verifica si las columnas ya existen antes de agregarlas

9. **❌ VALIDACIONES**
   - ❌ No valida que "Tipo de Cierre" esté seleccionado antes de cerrar caso
   - ❌ No muestra mensajes de error claros

10. **❌ INTERFAZ VISUAL**
    - ❌ Colores diferentes a Google
    - ❌ Sidebar más ancho (280px vs 180px)
    - ❌ No tiene acordeón de filtros
    - ❌ No tiene botón "Agregar" visible en sidebar

---

## 📋 COMPARACIÓN DETALLADA

### 1. ESTRUCTURA DE EXCEL

**Google (CORRECTO):**
- Positiva: 36 columnas con las 7 citas + 7 inasistencias
- Positiva Evento: 42 columnas (incluye 9 especiales)
- CERRADOS: Columnas originales + 3 extra

**Microsoft Actual (ARCHIVO 2 - MÁS RECIENTE):**
- ✅ Positiva: 36 columnas (CORRECTO)
- ⚠️ Positiva Evento: 36 columnas (FALTAN las 9 columnas especiales)
- ⚠️ CERRADOS: 36 columnas (FALTAN las 3 columnas extra: TIPO DE CIERRE, HOJA ORIGEN, FECHA DE CIERRE DEL CASO)

**ARCHIVO 1 (MÁS ANTIGUO):**
- ✅ Positiva Evento: 42 columnas (CORRECTO)
- ✅ CERRADOS: 28 columnas visibles + las 3 extra (CORRECTO)

**⚠️ CONCLUSIÓN:** El Archivo 2 (Microsoft) necesita actualizarse para incluir:
1. Las 9 columnas especiales en "Positiva Evento"
2. Las 3 columnas extra en "CERRADOS"

---

### 2. CÓDIGO BACKEND

#### Google Apps Script (Code.gs)

**Funciones principales:**
```javascript
1. doGet() ✅
2. listarAseguradores() ✅
3. obtenerDatos(hojaNombre) ✅
4. agregarUsuario(hojaNombre, datos) ✅
5. actualizarUsuario(hojaNombre, rowIndex, datos) ✅
6. cerrarCaso(hojaOrigen, rowIndex, tipoCierre) ✅
```

**Lógica especial de Google:**
- ✅ Crea automáticamente las 7 columnas de CITAS
- ✅ Crea automáticamente las 7 columnas de INASISTENCIAS
- ✅ Aplica formato a headers (colores, negrita)
- ✅ Calcula "Hoy" y "Días sin seguimiento" automáticamente
- ✅ Maneja "Positiva Evento" con 9 columnas especiales
- ✅ Valida "Tipo de Cierre" antes de cerrar caso
- ✅ Agrega 3 columnas extra a CERRADOS

#### Microsoft Actual (ultimo_ARL_funionando_la_conexion.txt)

**Funciones implementadas:**
```javascript
1. loginMicrosoft() ✅
2. procesarToken() ✅
3. cargarHoja(nombreHoja) ✅ (básico)
4. renderTable() ✅ (básico)
5. abrirModalAgregar() ⚠️ (incompleto)
6. abrirModalEditar() ⚠️ (incompleto)
7. guardarUsuario() ⚠️ (incompleto)
8. actualizarUsuario() ⚠️ (incompleto)
9. cerrarCaso() ⚠️ (incompleto)
```

**Lógica faltante:**
- ❌ NO crea automáticamente columnas de citas/inasistencias
- ❌ NO calcula "Días sin seguimiento" al agregar usuario
- ❌ NO maneja "Positiva Evento" especial
- ❌ NO valida "Tipo de Cierre"
- ❌ NO agrega columnas extra a CERRADOS

---

### 3. CÓDIGO FRONTEND

#### Google (Index.html)

**Secciones clave:**
1. ✅ Dashboard con tarjetas estadísticas
2. ✅ Semáforo de seguimiento (0-5, 6-12, 13+)
3. ✅ Badges de citas pendientes (los 7)
4. ✅ Badges de inasistencias (los 7)
5. ✅ Modal agregar con sección de citas
6. ✅ Modal editar con sección de citas + inasistencias
7. ✅ Filtro por auditor en acordeón
8. ✅ Filtro por rango de fechas
9. ✅ Tabla dinámica completa

**Líneas de código:** ~2,700 líneas

#### Microsoft Actual

**Secciones implementadas:**
1. ✅ Login screen
2. ✅ Sidebar básico
3. ⚠️ Top bar (incompleto)
4. ❌ Dashboard estadístico (FALTA)
5. ❌ Semáforo (FALTA)
6. ❌ Badges de citas (FALTA)
7. ⚠️ Modal agregar (sin sección de citas)
8. ⚠️ Modal editar (sin sección de citas + inasistencias)
9. ⚠️ Tabla básica (sin filtros avanzados)

**Líneas de código:** ~1,950 líneas (falta ~750 líneas)

---

## 🔧 DIFERENCIAS TÉCNICAS CLAVE

### API de Acceso a Excel

**Google Apps Script:**
```javascript
const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
const sheet = ss.getSheetByName(hojaNombre);
const values = sheet.getDataRange().getValues();
sheet.appendRow(nuevaFila);
sheet.getRange(1, numCols + 1).setValue(columna)
  .setBackground('#001f3f')
  .setFontColor('#ffffff');
```

**Microsoft Graph API:**
```javascript
const response = await fetch(
  `https://graph.microsoft.com/v1.0/me/drive/items/${excelFileId}/workbook/worksheets/${nombreHoja}/range(address='A1:Z100')`,
  {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  }
);
```

**⚠️ DIFERENCIA CRÍTICA:** 
- Google crea columnas dinámicamente con formato
- Microsoft necesita código extra para:
  1. Detectar última columna
  2. Insertar nueva columna
  3. Aplicar formato mediante Graph API

---

## 📝 PLAN DE ACCIÓN: LO QUE NECESITAMOS IMPLEMENTAR

### FASE 1: BACKEND - LÓGICA DE NEGOCIO (Prioridad: CRÍTICA)

1. **Función: verificarYCrearColumnas(hojaNombre)**
   - Verifica si existen las 7 columnas de CITAS
   - Verifica si existen las 7 columnas de INASISTENCIAS
   - Las crea si no existen
   - Aplica formato correcto

2. **Función: manejarPositivaEvento(datos)**
   - Detecta si PACIENTE_EVENTO = "SI"
   - Crea hoja "Positiva Evento" si no existe
   - Agrega las 9 columnas especiales
   - Retorna nombre de hoja destino

3. **Función: calcularDiasSinSeguimiento(fechaUltimoSeguimiento)**
   - Calcula diferencia de días
   - Retorna número entero

4. **Función: verificarColumnasC ERRADOS()**
   - Verifica si existen las 3 columnas extra
   - Las crea si no existen

5. **Modificar: agregarUsuario()**
   - Agregar cálculo de "Hoy"
   - Agregar cálculo de "Días sin seguimiento"
   - Llamar a manejarPositivaEvento() si aplica

6. **Modificar: actualizarUsuario()**
   - Recalcular "Hoy"
   - Recalcular "Días sin seguimiento"

7. **Modificar: cerrarCaso()**
   - Validar que "Tipo de Cierre" no esté vacío
   - Agregar las 3 columnas: tipoCierre, hojaOrigen, fechaCierre
   - Llamar a verificarColumnasCERRADOS()

### FASE 2: FRONTEND - DASHBOARD Y ESTADÍSTICAS (Prioridad: ALTA)

1. **Dashboard estadístico**
   - Tarjetas: Casos Activos, Población Activa, Siniestros
   - Tarjetas de género: Masculino, Femenino, Otro
   - Tabla: Pacientes por Auditor
   - Tabla: Clasificación de Severidad

2. **Semáforo de seguimiento**
   - Indicador Verde (0-5 días)
   - Indicador Naranja (6-12 días)
   - Indicador Rojo (13+ días)
   - Función de filtrado clickeable

### FASE 3: FRONTEND - CONTROL DE CITAS (Prioridad: CRÍTICA)

1. **Badges de Citas Pendientes**
   - Los 7 tipos de citas
   - Contador por tipo
   - Filtro clickeable

2. **Badges de Inasistencias**
   - Los 7 tipos de inasistencias
   - Contador por tipo
   - Filtro clickeable

3. **Modal Agregar: Sección de Citas**
   - 7 bloques de citas con:
     - Checkbox "Sin asignación de cita"
     - Input de fecha
     - Lógica de habilitación/deshabilitación

4. **Modal Editar: Sección de Citas + Inasistencias**
   - 7 bloques de citas con:
     - Checkbox "Sin asignación de cita"
     - Input de fecha
     - Checkbox de inasistencia
     - Lógica de habilitación/deshabilitación

### FASE 4: FRONTEND - FILTROS Y NAVEGACIÓN (Prioridad: MEDIA)

1. **Acordeón de Filtros en Sidebar**
   - Dropdown de Auditor
   - Cambio automático al seleccionar

2. **Filtro por Rango de Fechas**
   - Input "Desde"
   - Input "Hasta"
   - Botón "Buscar"
   - Botón "Limpiar"

3. **Botón "Agregar" en Sidebar**
   - Visible y funcional

### FASE 5: AJUSTES DE INTERFAZ (Prioridad: BAJA)

1. **Colores**
   - Cambiar a #001f3f (azul oscuro)
   - Aplicar colores exactos de Google

2. **Sidebar**
   - Reducir ancho de 280px a 180px
   - Ajustar padding y márgenes

3. **Detalles visuales**
   - Iconos correctos
   - Espaciado idéntico
   - Fuentes y tamaños

---

## 📊 MATRIZ DE PRIORIDADES

| # | Funcionalidad | Prioridad | Impacto | Esfuerzo | Estado |
|---|---------------|-----------|---------|----------|--------|
| 1 | Las 7 citas + 7 inasistencias en modales | 🔴 CRÍTICA | ALTO | ALTO | ⏳ Pendiente |
| 2 | Cálculo automático "Días sin seguimiento" | 🔴 CRÍTICA | ALTO | MEDIO | ⏳ Pendiente |
| 3 | Lógica "Positiva Evento" | 🔴 CRÍTICA | ALTO | MEDIO | ⏳ Pendiente |
| 4 | Columnas extra en CERRADOS | 🔴 CRÍTICA | ALTO | BAJO | ⏳ Pendiente |
| 5 | Validación "Tipo de Cierre" | 🔴 CRÍTICA | MEDIO | BAJO | ⏳ Pendiente |
| 6 | Dashboard estadístico | 🟠 ALTA | ALTO | ALTO | ⏳ Pendiente |
| 7 | Semáforo de seguimiento | 🟠 ALTA | ALTO | MEDIO | ⏳ Pendiente |
| 8 | Badges de citas pendientes | 🟠 ALTA | ALTO | MEDIO | ⏳ Pendiente |
| 9 | Badges de inasistencias | 🟠 ALTA | ALTO | MEDIO | ⏳ Pendiente |
| 10 | Filtro por auditor | 🟡 MEDIA | MEDIO | BAJO | ⏳ Pendiente |
| 11 | Filtro por fechas | 🟡 MEDIA | MEDIO | BAJO | ⏳ Pendiente |
| 12 | Ajustes de colores | 🟢 BAJA | BAJO | BAJO | ⏳ Pendiente |
| 13 | Ajustes de sidebar | 🟢 BAJA | BAJO | BAJO | ⏳ Pendiente |

---

## 🎯 ESTIMACIÓN DE TIEMPO

| Fase | Tareas | Líneas de Código | Tiempo Estimado |
|------|--------|------------------|-----------------|
| 1. Backend - Lógica de Negocio | 7 funciones | ~400 líneas | 4-6 horas |
| 2. Frontend - Dashboard | 4 componentes | ~300 líneas | 3-4 horas |
| 3. Frontend - Citas | 4 componentes | ~500 líneas | 5-7 horas |
| 4. Frontend - Filtros | 3 componentes | ~200 líneas | 2-3 horas |
| 5. Ajustes de Interfaz | Múltiples | ~100 líneas | 1-2 horas |
| **TOTAL** | **21 tareas** | **~1,500 líneas** | **15-22 horas** |

---

## ✅ CHECKLIST DE MIGRACIÓN

### Backend
- [ ] Función verificarYCrearColumnas()
- [ ] Función manejarPositivaEvento()
- [ ] Función calcularDiasSinSeguimiento()
- [ ] Función verificarColumnasCERRADOS()
- [ ] Modificar agregarUsuario()
- [ ] Modificar actualizarUsuario()
- [ ] Modificar cerrarCaso()

### Frontend - Dashboard
- [ ] Tarjetas de resumen (6 tarjetas)
- [ ] Tabla Pacientes por Auditor
- [ ] Tabla Clasificación de Severidad
- [ ] Semáforo de seguimiento

### Frontend - Citas
- [ ] Badges de citas pendientes (7)
- [ ] Badges de inasistencias (7)
- [ ] Modal Agregar: Sección de citas
- [ ] Modal Editar: Sección de citas + inasistencias

### Frontend - Filtros
- [ ] Acordeón de filtros
- [ ] Filtro por auditor
- [ ] Filtro por fechas
- [ ] Botón Limpiar

### Interfaz
- [ ] Colores correctos
- [ ] Sidebar 180px
- [ ] Botón Agregar visible

---

## 🚀 PRÓXIMO PASO INMEDIATO

**Comenzar con:** FASE 1 - BACKEND - LÓGICA DE NEGOCIO

**Primera función a implementar:** 
```javascript
async function verificarYCrearColumnas(nombreHoja, accessToken, excelFileId)
```

Esta función es la base para TODO el sistema, ya que garantiza que las columnas de citas e inasistencias existan antes de cualquier operación.

---

**DOCUMENTO CREADO:** 30 de octubre de 2025  
**ANALISTA:** Claude Sonnet 4.5  
**ESTADO:** Análisis de brecha completo ✅  
**SIGUIENTE ACCIÓN:** Implementar backend módulo por módulo
