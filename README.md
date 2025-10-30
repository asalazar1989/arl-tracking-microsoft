# 🏥 Sistema de Gestión ARL - Migración Google → Microsoft

## 📋 Descripción del Proyecto

Sistema completo de seguimiento y gestión de pacientes para Administradoras de Riesgos Laborales (ARL), inicialmente desarrollado en **Google Apps Script + Google Sheets** y migrado a **Microsoft (Azure + Excel Online/SharePoint)**.

### 🎯 Objetivo

Replicar al **100%** todas las funcionalidades del sistema Google en la plataforma Microsoft, sin omitir ninguna característica, manteniendo la misma interfaz visual y mejorando la experiencia de carga y filtros.

---

## 🚀 Características Principales

### Gestión de Pacientes
- ✅ Agregar nuevos pacientes
- ✅ Editar pacientes existentes
- ✅ Cerrar casos (mover a hoja CERRADOS)
- ✅ Visualización en tabla completa
- ✅ Búsqueda y filtrado avanzado

### Sistema de Citas Médicas (7 tipos)
1. **FISIATRA**
2. **JUNTA MEDICA**
3. **VALORACION OCUPACIONAL**
4. **MEDICINA LABORAL**
5. **PSICOLOGIA**
6. **TERAPIA OCUPACIONAL**
7. **TERAPIA FISICA**

Cada cita incluye:
- Fecha de asignación
- Control de inasistencias
- Badges de seguimiento

### Dashboard Estadístico
- 📊 Casos activos
- 📊 Población activa
- 📊 Siniestros totales
- 📊 Distribución por género
- 📊 Pacientes por auditor
- 📊 Clasificación de severidad

### Semáforo de Seguimiento
- 🟢 **Verde:** 0-5 días sin seguimiento
- 🟠 **Naranja:** 6-12 días sin seguimiento
- 🔴 **Rojo:** 13+ días sin seguimiento

### Gestión de ARLs
- Positiva
- Positiva por Evento (con columnas especiales)
- Colmena
- Colsanitas
- CERRADOS (casos finalizados)

---

## 🏗️ Arquitectura

### Versión Google (Origen)
```
Google Apps Script (Backend)
    ↓
Google Sheets (Base de datos)
    ↓
HTML/JavaScript (Frontend)
```

### Versión Microsoft (Destino)
```
Azure Functions / API (Backend)
    ↓
Microsoft Graph API
    ↓
Excel Online / SharePoint (Base de datos)
    ↓
HTML/JavaScript (Frontend)
```

---

## 📁 Estructura del Repositorio

```
arl-tracking-microsoft/
│
├── 📁 docs/                                # Documentación
│   ├── ANALISIS-COMPLETO.md               # Análisis detallado del sistema
│   ├── CHECKLIST-MIGRACION.md             # Lista de verificación completa
│   ├── GUIA-GITHUB.md                     # Guía de GitHub paso a paso
│   ├── capturas/                          # Capturas de referencia
│   │   ├── interfaz-google-1.png
│   │   └── interfaz-google-2.png
│   └── excel-samples/                     # Muestras de estructuras
│       ├── google-sheet-structure.xlsx
│       └── microsoft-excel-structure.xlsx
│
├── 📁 src-google-original/                # Código original (REFERENCIA)
│   ├── Code.gs                            # Backend Google
│   └── Index.html                         # Frontend Google
│
├── 📁 src-microsoft/                      # Código nuevo Microsoft
│   ├── 📁 backend/
│   │   ├── auth-microsoft.js              # Autenticación Microsoft
│   │   ├── api-excel.js                   # API Excel Online
│   │   ├── business-logic.js              # Lógica de negocio
│   │   ├── data-helpers.js                # Helpers y utilidades
│   │   └── constants.js                   # Configuración y constantes
│   │
│   ├── 📁 frontend/
│   │   ├── dashboard.js                   # Dashboard estadístico
│   │   ├── table.js                       # Tabla principal
│   │   ├── modals.js                      # Modales (agregar/editar)
│   │   ├── citas.js                       # Control de citas médicas
│   │   └── index.html                     # HTML principal
│   │
│   └── 📁 config/
│       └── settings.json                  # Configuración del sistema
│
├── README.md                              # Este archivo
├── .gitignore                             # Archivos ignorados por Git
└── IMPLEMENTATION-LOG.md                  # Registro de implementación
```

---

## 🔧 Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos personalizados
- **JavaScript (Vanilla)** - Lógica de interfaz
- **Bootstrap 5.3.2** - Framework de UI
- **Bootstrap Icons 1.11.1** - Iconos

### Backend
- **Node.js** - Runtime de JavaScript
- **Azure Functions** (o alternativa) - Funciones serverless
- **Microsoft Graph API** - Conexión a Excel Online
- **Microsoft Authentication Library (MSAL)** - Autenticación

### Base de Datos
- **Excel Online** (Microsoft 365)
- **SharePoint** (opcional)

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Líneas de código (total)** | ~3,000 |
| **Módulos backend** | 5 |
| **Módulos frontend** | 4 |
| **Funciones principales** | 5 |
| **Tipos de citas médicas** | 7 |
| **Campos de formulario** | 30+ |
| **Hojas de Excel** | 5 |
| **Filtros disponibles** | 3 tipos |

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- Cuenta Microsoft 365 con Excel Online
- Azure Account (para autenticación)
- Node.js 16+ instalado (si usas backend local)
- Navegador moderno (Chrome, Edge, Firefox)

### Pasos de Instalación

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/TU-USUARIO/arl-tracking-microsoft.git
cd arl-tracking-microsoft
```

#### 2. Configurar Azure App Registration
1. Ve a [Azure Portal](https://portal.azure.com)
2. Navega a "Azure Active Directory" → "App registrations"
3. Crea nueva app: "ARL Tracking System"
4. Configura permisos de Microsoft Graph:
   - `Files.ReadWrite.All`
   - `Sites.ReadWrite.All`
5. Copia el **Client ID** y **Client Secret**

#### 3. Configurar Excel Online
1. Crea un nuevo Workbook en Excel Online
2. Crea las hojas necesarias:
   - Positiva
   - Colmena
   - Colsanitas
   - Positiva Evento
   - CERRADOS
3. Copia el **Workbook ID** de la URL

#### 4. Configurar Variables de Entorno
Crea un archivo `src-microsoft/config/settings.json`:
```json
{
  "clientId": "TU-CLIENT-ID",
  "clientSecret": "TU-CLIENT-SECRET",
  "tenantId": "TU-TENANT-ID",
  "workbookId": "TU-WORKBOOK-ID",
  "driveId": "TU-DRIVE-ID"
}
```

⚠️ **IMPORTANTE:** Nunca subas este archivo a GitHub. Está en `.gitignore`.

#### 5. Instalar Dependencias (si usas backend local)
```bash
cd src-microsoft/backend
npm install
```

#### 6. Ejecutar el Sistema
- **Frontend:** Abre `src-microsoft/frontend/index.html` en tu navegador
- **Backend:** `npm start` (si usas Node.js local)
- **Azure:** Despliega las funciones a Azure Functions

---

## 📖 Guía de Uso

### Para Usuarios

#### Agregar un Paciente
1. Haz clic en el botón "Agregar" en el sidebar
2. Completa todos los campos requeridos
3. Selecciona las citas médicas necesarias
4. Haz clic en "Guardar Usuario"

#### Editar un Paciente
1. Haz clic en el botón "Editar" de la fila del paciente
2. Modifica los campos necesarios
3. Actualiza citas médicas o marca inasistencias
4. Haz clic en "Actualizar"

#### Cerrar un Caso
1. Haz clic en "Editar" del paciente
2. Selecciona el "Tipo de Cierre" del dropdown
3. Haz clic en "Cerrar Caso"
4. Confirma la acción
5. El caso se moverá a la hoja CERRADOS

#### Usar Filtros
- **Por Auditor:** Selecciona del dropdown en el acordeón de filtros
- **Por Semáforo:** Haz clic en los círculos de colores (Verde, Naranja, Rojo)
- **Por Fechas:** Ingresa rango y haz clic en "Buscar"
- **Por Citas:** Haz clic en los badges de citas pendientes
- **Limpiar:** Haz clic en "Limpiar" o "Ver todos"

### Para Desarrolladores

Consulta:
- [`docs/ANALISIS-COMPLETO.md`](docs/ANALISIS-COMPLETO.md) - Análisis técnico completo
- [`docs/CHECKLIST-MIGRACION.md`](docs/CHECKLIST-MIGRACION.md) - Checklist de verificación
- [`IMPLEMENTATION-LOG.md`](IMPLEMENTATION-LOG.md) - Registro detallado de implementación

---

## 🔒 Seguridad

- ✅ Autenticación mediante Microsoft Azure AD
- ✅ Tokens manejados de forma segura
- ✅ No se almacenan credenciales en el código
- ✅ Variables sensibles en archivo ignorado por Git
- ✅ Permisos de Microsoft Graph configurados correctamente

---

## 🧪 Testing

### Checklist de Pruebas
Antes de considerar el sistema completo, verifica:

- [ ] Autenticación Microsoft funciona
- [ ] Lectura de datos de Excel Online funciona
- [ ] Escritura de datos en Excel Online funciona
- [ ] Agregar paciente funciona
- [ ] Editar paciente funciona
- [ ] Cerrar caso funciona
- [ ] Las 7 citas médicas funcionan
- [ ] Las 7 inasistencias funcionan
- [ ] Dashboard estadístico muestra datos correctos
- [ ] Semáforo de seguimiento funciona
- [ ] Todos los filtros funcionan
- [ ] Interfaz se ve idéntica a Google

Ver checklist completo en: [`docs/CHECKLIST-MIGRACION.md`](docs/CHECKLIST-MIGRACION.md)

---

## 🐛 Problemas Conocidos

_(Se actualizará durante el desarrollo)_

---

## 📝 Registro de Cambios

### Versión 1.0.0 - En Desarrollo
- ✅ Análisis completo del sistema Google
- ✅ Documentación técnica creada
- ✅ Checklist de migración creado
- ✅ Guía de GitHub creada
- ⏳ Implementación de autenticación Microsoft
- ⏳ Implementación de API Excel
- ⏳ Implementación de lógica de negocio
- ⏳ Implementación de frontend

---

## 👥 Autores

- **Desarrollo Original (Google):** [Nombre del desarrollador original]
- **Migración a Microsoft:** [Tu nombre]
- **Análisis y Documentación:** Claude Sonnet 4.5 (Anthropic)

---

## 📄 Licencia

[Especifica la licencia del proyecto]

---

## 📞 Soporte

Para preguntas, problemas o sugerencias:
- **Email:** [tu-email@ejemplo.com]
- **Issues:** [https://github.com/TU-USUARIO/arl-tracking-microsoft/issues]

---

## 🙏 Agradecimientos

- Rangel RHB por el sistema original
- Equipo de desarrollo
- Usuarios del sistema

---

## 📚 Recursos Adicionales

### Documentación Microsoft
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/)
- [Excel API Reference](https://docs.microsoft.com/en-us/graph/api/resources/excel)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)

### Documentación del Proyecto
- [Análisis Completo](docs/ANALISIS-COMPLETO.md)
- [Checklist de Migración](docs/CHECKLIST-MIGRACION.md)
- [Guía de GitHub](docs/GUIA-GITHUB.md)

---

**Última actualización:** 30 de octubre de 2025  
**Estado del proyecto:** 🚧 En Desarrollo  
**Progreso:** FASE 1 - Análisis y Documentación Completa ✅
