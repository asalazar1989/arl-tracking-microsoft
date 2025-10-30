# 📊 ANÁLISIS COMPLETO - SISTEMA ARL RANGEL

## 🎯 RESUMEN EJECUTIVO

**Sistema:** Gestión de seguimiento de pacientes ARL (Administradora de Riesgos Laborales)  
**Origen:** Google Apps Script + Google Sheets  
**Destino:** Microsoft (Azure Functions/Power Automate + Excel Online/SharePoint)  
**Líneas de código totales:** ~3,000 líneas (700 backend + 2,300 frontend)  
**Complejidad:** ALTA - Sistema completo de gestión con múltiples funcionalidades

---

## 📁 INVENTARIO DE ARCHIVOS ANALIZADOS

### ✅ RECIBIDOS Y ANALIZADOS:
1. **Code.gs** (700 líneas) - Backend completo
2. **Index.html** (2,700 líneas) - Frontend completo
3. **Capturas de pantalla** (2 imágenes) - Referencia visual de la interfaz

### ⏳ PENDIENTES DE RECIBIR:
4. **Excel de Google** - Estructura de datos actual
5. **Excel de Microsoft** - Estructura de datos destino
6. **Index Microsoft** - Autenticación ya funcionando

---

## 🔧 FUNCIONALIDADES DEL SISTEMA (TODAS DEBEN REPLICARSE)

### 1. GESTIÓN DE ASEGURADORES (ARLs)
- ✅ Positiva
- ✅ Colmena
- ✅ Colsanitas
- ✅ Positiva Evento (hoja especial con columnas adicionales)
- ✅ CERRADOS (hoja automática para casos finalizados)

### 2. GESTIÓN DE PACIENTES
- ✅ Agregar nuevo paciente (con validación de campos)
- ✅ Editar paciente existente
- ✅ Cerrar caso (mover a hoja CERRADOS con tipo de cierre)
- ✅ Visualizar tabla completa de pacientes
- ✅ Búsqueda y filtrado avanzado

### 3. SISTEMA DE CITAS MÉDICAS (7 TIPOS)
1. **FISIATRA** (con columna de inasistencia)
2. **JUNTA MEDICA** (con columna de inasistencia)
3. **VALORACION OCUPACIONAL** (con columna de inasistencia)
4. **MEDICINA LABORAL** (con columna de inasistencia)
5. **PSICOLOGIA** (con columna de inasistencia)
6. **TERAPIA OCUPACIONAL** (con columna de inasistencia)
7. **TERAPIA FISICA** (con columna de inasistencia)

**Características de cada cita:**
- Checkbox "Sin asignación de cita"
- Campo de fecha cuando hay cita asignada
- Checkbox de inasistencia
- Colores: Azul oscuro (#001f3f) para citas, Rojo (#d9534f) para inasistencias

### 4. COLUMNAS ESPECIALES POSITIVA EVENTO
- ELECTRODIAGNOSTICO
- TERAPIA FISICA
- CARTA DE RECOMENDACIONES
- PRUEBA DE TRABAJO
- TERAPIA OCUPACIONAL
- PSICOLOGIA
- MEDICO DOLOR
- BLOQUEO
- NUTRICION

### 5. CÁLCULOS AUTOMÁTICOS
- ✅ **"Hoy"**: Fecha actual automática
- ✅ **"Días sin seguimiento"**: Calcula días desde "Fecha Último Seguimiento" hasta hoy
- ✅ Actualización automática al guardar/editar

### 6. DASHBOARD ESTADÍSTICO
- **Tarjetas de resumen:**
  - CASOS ACTIVOS (total de pacientes)
  - POBLACIÓN ACTIVA (total menos siniestros)
  - SINIESTROS TOTALES
  - Segmentación por género (Masculino, Femenino, Otro)

- **Tablas de análisis:**
  - Pacientes por Auditor (con porcentajes)
  - Clasificación de Severidad (con porcentajes)

### 7. SEMÁFORO DE SEGUIMIENTO
- 🟢 Verde: 0-5 días sin seguimiento
- 🟠 Naranja: 6-12 días sin seguimiento
- 🔴 Rojo: 13+ días sin seguimiento
- Clickeable para filtrar

### 8. CONTROL DE CITAS PENDIENTES (BADGES)
- Muestra cantidad de citas pendientes por tipo
- Clickeable para filtrar
- Color de fondo según tipo de cita

### 9. CONTROL DE INASISTENCIAS
- Badges con cantidad de inasistencias registradas
- Filtro clickeable
- Color rojo (#d9534f)

### 10. FILTROS AVANZADOS
- Por Auditor (dropdown con lista de auditores)
- Por rango de fechas (Desde - Hasta)
- Por botón "Búsqueda" manual
- Botón "Limpiar" para resetear filtros

### 11. INTERFAZ DE USUARIO
- **Sidebar colapsable:**
  - Botón toggle visible/oculto
  - Lista de Aseguradores
  - Acordeón de Filtros
  - Botón "Agregar" paciente

- **Colores del sistema:**
  - Azul oscuro: #001f3f (primario, headers)
  - Gris claro: #c0c0c0 (secundario, hover)
  - Rojo: #ff2400 (acordeón activo)
  - Rojo oscuro: #d9534f (inasistencias)
  - Azul: #007bff (botones editar)
  - Verde: éxitos
  - Naranja: alertas

### 12. MODALES
- **Modal Agregar Usuario:**
  - Formulario completo con todos los campos
  - Validaciones
  - Botón "Guardar Usuario"

- **Modal Editar Usuario:**
  - Pre-relleno con datos existentes
  - Sección de citas médicas especial
  - Dropdown "Tipo de Cierre"
  - Botón "Actualizar"
  - Botón "Cerrar Caso" (mueve a CERRADOS)

### 13. TABLA PRINCIPAL
- Headers sticky (fijos al scroll)
- Filas alternadas (zebra striping)
- Hover effect
- Botón "Editar" en cada fila
- Scroll horizontal y vertical
- Responsive

### 14. CAMPOS DEL SISTEMA (Columnas de Excel)
- ACCIONES
- SINIESTRO
- # MATRICULA
- CEDULA
- NOMBRE
- FECHA DE ASIGNACION A LA IPS
- GENERO
- MAYOR A 56 AÑOS SI O NO
- AUDITOR
- CLASIFICACION SEVERIDAD
- CITA INICIAL
- JUNTA MEDICA
- INASISTENCIA JUNTA MEDICA
- VALORACION OCUPACIONAL
- INASISTENCIA VALORACION OCUPACIONAL
- FISIATRA
- INASISTENCIA FISIATRA
- MEDICINA LABORAL
- INASISTENCIA MEDICINA LABORAL
- PSICOLOGIA
- INASISTENCIA PSICOLOGIA
- TERAPIA OCUPACIONAL
- INASISTENCIA TERAPIA OCUPACIONAL
- TERAPIA FISICA
- INASISTENCIA TERAPIA FISICA
- Hoy
- DÃ­as sin seguimiento
- Fecha Último Seguimiento

### 15. DROPDOWNS Y OPCIONES
**CLASIFICACION SEVERIDAD:**
- AT Caso Muy Leve
- AT Caso Leve
- AT Caso Moderado
- AT Caso Grave
- AT Caso Muy Grave
- AT Caso Severo
- Enfermedad Laboral

**AUDITOR:**
- FABIAN MACIAS
- YANETH OBREGON
- MELISA SANCHEZ
- ANGELA LOPEZ
- ADRIANA VILLOTA
- YULAINE VERGARA

**TIPO DE CIERRE:**
- ALTA MÉDICA
- CALIFICACIÓN PCL
- MUERTE
- CAMBIO DE IPS
- TRASLADO EPS
- CULMINA PROCESO

**GENERO:**
- Masculino
- Femenino
- Otro

**MAYOR A 56 AÑOS SI O NO:**
- SI
- NO

### 16. LÓGICA DE NEGOCIO CRÍTICA
- Si un paciente tiene "PACIENTE_EVENTO = SI" y es de Positiva → va a "Positiva Evento"
- Las columnas de citas e inasistencias se crean automáticamente si no existen
- Al cerrar un caso, se agregan 3 columnas extra: TIPO DE CIERRE, HOJA ORIGEN, FECHA DE CIERRE DEL CASO
- Las fechas se convierten automáticamente entre formato dd/MM/yyyy y yyyy-MM-dd

### 17. DEPENDENCIAS EXTERNAS
- Bootstrap 5.3.2 (CSS + JS)
- Bootstrap Icons 1.11.1
- Google Apps Script API (necesita equivalente en Microsoft)

---

## 🏗️ ARQUITECTURA TÉCNICA

### GOOGLE (ACTUAL):
```
┌─────────────────────────────────────┐
│   Index.html (Frontend)              │
│   - Bootstrap 5                      │
│   - JavaScript vanilla               │
│   - 2,700 líneas                     │
└──────────────┬──────────────────────┘
               │ google.script.run
               ▼
┌─────────────────────────────────────┐
│   Code.gs (Backend)                  │
│   - Google Apps Script               │
│   - 700 líneas                       │
└──────────────┬──────────────────────┘
               │ SpreadsheetApp API
               ▼
┌─────────────────────────────────────┐
│   Google Sheets                      │
│   - Hojas múltiples                  │
│   - SPREADSHEET_ID                   │
└─────────────────────────────────────┘
```

### MICROSOFT (OBJETIVO):
```
┌─────────────────────────────────────┐
│   Index.html (Frontend)              │
│   - Bootstrap 5 (igual)              │
│   - JavaScript vanilla (igual)       │
│   - Autenticación Microsoft          │
└──────────────┬──────────────────────┘
               │ Microsoft Graph API
               │ o Azure Functions
               ▼
┌─────────────────────────────────────┐
│   Backend (Node.js/Azure Functions)  │
│   - Lógica de negocio                │
│   - 700 líneas equivalentes          │
└──────────────┬──────────────────────┘
               │ Microsoft Graph API
               ▼
┌─────────────────────────────────────┐
│   Excel Online / SharePoint          │
│   - Workbook con hojas múltiples     │
│   - Misma estructura que Google      │
└─────────────────────────────────────┘
```

---

## 📦 ESTRATEGIA DE MIGRACIÓN

### FASE 1: PREPARACIÓN (ANTES DE PROGRAMAR)
1. ✅ Recibir archivos faltantes (Excel Google, Excel Microsoft, Index auth Microsoft)
2. ✅ Crear repositorio GitHub
3. ✅ Crear documento de mapeo completo
4. ✅ Crear checklist de verificación
5. ✅ Definir arquitectura Microsoft

### FASE 2: DESARROLLO MODULAR (10 MÓDULOS)
**Cada módulo es un archivo completo e independiente:**

1. **auth-microsoft.js** (150 líneas)
   - Autenticación con Microsoft Graph
   - Gestión de tokens
   - Conexión a Excel Online

2. **api-excel.js** (200 líneas)
   - Funciones para leer/escribir Excel
   - Equivalente a SpreadsheetApp
   - CRUD completo

3. **business-logic.js** (300 líneas)
   - Lógica de agregar usuario
   - Lógica de actualizar usuario
   - Lógica de cerrar caso
   - Cálculos automáticos

4. **data-helpers.js** (150 líneas)
   - Formateo de fechas
   - Validaciones
   - Conversiones de datos

5. **constants.js** (100 líneas)
   - Configuración del sistema
   - Listas de dropdowns
   - Colores del sistema

6. **frontend-dashboard.js** (400 líneas)
   - Renderizado de tarjetas estadísticas
   - Tablas de análisis
   - Semáforo de seguimiento

7. **frontend-table.js** (400 líneas)
   - Renderizado de tabla principal
   - Filtros
   - Paginación

8. **frontend-modals.js** (500 líneas)
   - Modal agregar usuario
   - Modal editar usuario
   - Manejo de formularios

9. **frontend-citas.js** (300 líneas)
   - Lógica de las 7 citas médicas
   - Badges
   - Control de inasistencias

10. **index.html** (600 líneas)
    - HTML base
    - Estructura de modales
    - Integración de módulos

**TOTAL: ~3,000 líneas distribuidas en 10 módulos**

### FASE 3: INTEGRACIÓN Y PRUEBAS
1. Integrar todos los módulos
2. Pruebas de cada funcionalidad
3. Ajustes de UI
4. Verificación con checklist

---

## 🚨 PUNTOS CRÍTICOS A NO OMITIR

1. **Las 7 citas médicas con sus 7 inasistencias** (14 columnas total)
2. **Cálculo automático de "Días sin seguimiento"**
3. **Lógica especial de "Positiva Evento"**
4. **Hoja CERRADOS con 3 columnas extra**
5. **Creación automática de columnas si no existen**
6. **Conversión de fechas entre formatos**
7. **Dropdown de "Tipo de Cierre" en modal editar**
8. **Semáforo de seguimiento (0-5, 6-12, 13+)**
9. **Badges de citas pendientes clickeables**
10. **Sidebar colapsable**
11. **Todos los auditores en el dropdown**
12. **Todas las clasificaciones de severidad**
13. **Filtro por rango de fechas**
14. **Actualización automática de tabla después de guardar/editar**
15. **Confirmación antes de cerrar caso**

---

## 📊 MÉTRICAS DEL PROYECTO

| Métrica | Valor |
|---------|-------|
| **Líneas totales** | ~3,000 |
| **Módulos** | 10 |
| **Funciones backend** | 5 principales |
| **Modales** | 2 |
| **Hojas Excel** | 5 (Positiva, Colmena, Colsanitas, Positiva Evento, CERRADOS) |
| **Tipos de citas** | 7 |
| **Campos de formulario** | 30+ |
| **Dropdowns** | 5 |
| **Filtros** | 3 tipos |
| **Colores del sistema** | 8 |
| **Dependencias externas** | 2 (Bootstrap, Icons) |

---

## ✅ PRÓXIMOS PASOS

1. **TÚ:** Comparte los 3 archivos faltantes:
   - Excel de Google (estructura)
   - Excel de Microsoft (estructura)
   - Index de Microsoft con autenticación

2. **YO:** Creo el repositorio GitHub completo con:
   - Estructura de carpetas
   - README detallado
   - Archivos originales de Google (para referencia)
   - Checklist de migración
   - Documentación técnica

3. **JUNTOS:** Comenzamos desarrollo modular:
   - Te entrego módulo por módulo
   - Tú subes cada módulo completo a GitHub
   - Verificamos que esté completo antes del siguiente
   - Sin omisiones, sin "alucinaciones"

---

## 📝 NOTAS IMPORTANTES

- **CERO tolerancia a código incompleto**
- **Cada módulo será 100% completo y funcional**
- **Usaremos checksums (primera/última línea) para verificar**
- **No avanzamos al siguiente módulo hasta confirmar el actual**
- **Te guiaré en GitHub como si nunca lo hubieras usado**

---

**DOCUMENTO CREADO:** 30 de octubre de 2025  
**ANALISTA:** Claude Sonnet 4.5  
**PROYECTO:** Migración ARL Google → Microsoft  
**ESTADO:** FASE 1 - ANÁLISIS COMPLETO ✅
