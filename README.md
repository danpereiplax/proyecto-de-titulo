# GAET - Gestión, Administración, Ejecución y Tareas

Bienvenido al repositorio oficial de **GAET**, una plataforma web para la gestión centralizada de tareas técnicas en terreno, diseñada para mejorar la trazabilidad operativa y la eficiencia en la facturación de servicios técnicos.

## Descripción del proyecto

GAET (Gestión, Administración, Ejecución y Tareas) es una aplicación web responsiva que permite a supervisores crear y asignar tareas técnicas, y a técnicos registrar y completar actividades en terreno. El sistema garantiza la trazabilidad de cada intervención, consolidando datos como fechas, horarios, ubicaciones, contactos y evidencias fotográficas.

## Tecnologías utilizadas

- **Frontend:** Vue.js 3, Vite, Tailwind CSS, Vue Router, Axios, LocalForage, PWA plugin.
- **Backend:** Node.js v18.x LTS, Express.js, Multer, jsonwebtoken, pg (PostgreSQL), PDFKit, Nodemailer, dotenv, cors.
- **Base de datos:** PostgreSQL 15, normalizada hasta 3FN.
- **Servidor:** Ubuntu Server 22.04 LTS, Nginx, PM2, Certbot SSL.

## Características principales

✅ Registro y asignación de tareas por supervisor.  
✅ Visualización de tareas pendientes y ejecución por técnico.  
✅ Carga de fotos y evidencias.  
✅ Generación de informes PDF.  
✅ Autenticación JWT y roles diferenciados (Supervisor/Técnico).  
✅ Panel de métricas para supervisión y facturación.  
✅ Diseño web responsivo y PWA para acceso móvil.  

## Estructura del repositorio

```plaintext
/GAET
 ├── frontend/    # Código fuente Vue.js (SPA)
 ├── backend/     # API Node.js + Express
 ├── database/    # Scripts SQL, diagramas DER y documentación de BD
 ├── docs/        # Documentación técnica, diagramas, manual de uso (en construccion)
 └── README.md    # Este archivos
