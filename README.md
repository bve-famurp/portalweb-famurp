# BVE FAMURP

> Biblioteca Virtual y Especializada de la Facultad de Medicina Humana "Manuel Velasco Suárez"  
> Universidad Ricardo Palma, Lima, Perú

---

## Descripción Institucional

**BVE FAMURP** es la plataforma web institucional de la Biblioteca Virtual y Especializada de la Facultad de Medicina Humana de la Universidad Ricardo Palma. Centraliza el acceso al catálogo de recursos de bases de datos, material curricular por asignaturas, gestión de conferencias y capacitaciones académicas, y el boletín informativo para pregrado, internado y residentado médico.

---

## Arquitectura y Organización del Proyecto

La aplicación cliente está construida como una **Single Page Application (SPA)** moderna con React 19, TypeScript, Tailwind CSS y Vite. Sigue un patrón de diseño arquitectónico basado en **Vertical Feature Slices** para mantener un desacoplamiento estricto entre dominios funcionales:

```text
MedLib-URP/
└── frontend/                                 # Aplicación Web SPA (React 19, TypeScript, Vite)
    ├── src/
    │   ├── assets/                           # Identidad visual institucional, escudos y logotipos
    │   ├── components/                       # Componentes de interfaz globales (Header, Footer, Navbar, Pagination)
    │   ├── constants/                        # Constantes compartidas y enlaces institucionales (URP, Intranet, OPAC)
    │   ├── core/                             # Núcleo de infraestructura del cliente
    │   │   ├── apiConfig.ts                  # Resolución y normalización de URLs base de la API
    │   │   └── types/navigation.ts           # Definición canónica de vistas de navegación (AppView)
    │   ├── features/                         # Vertical Feature Slices
    │   │   ├── admin/                        # Panel de administración, navegación interna y encabezados de gestión
    │   │   ├── attendance/                   # Marcación de asistencia y exportación determinística a Excel
    │   │   ├── auth/                         # Autenticación administrativa (Login, Tokens JWT, Control de Sesión)
    │   │   ├── conferences/                  # Calendario interactivo, detalle de conferencias e inscripciones
    │   │   ├── faq/                          # Módulo de preguntas frecuentes y soporte institucional
    │   │   ├── guides/                       # Catálogo de bases de datos médicas y vinculación curricular
    │   │   └── home/                         # Portada institucional, red molecular y Bento Grid de accesos directos
    │   ├── pages/                            # Vistas principales orquestadoras de página
    │   │   ├── HomePage.tsx                  # Portada institucional
    │   │   ├── DirectoryPage.tsx             # Directorio de bases de datos médicas
    │   │   ├── ConferencesPage.tsx           # Calendario de conferencias e inscripciones
    │   │   ├── FaqPage.tsx                   # Preguntas frecuentes
    │   │   ├── AdminPage.tsx                 # Panel de administración general
    │   │   └── NotFoundPage.tsx              # Manejo amigable de rutas no encontradas (404)
    │   ├── utils/                            # Utilidades puras compartidas (formateo de fechas, sanitización, CSV)
    │   ├── App.tsx                           # Enrutador declarativo de vistas
    │   ├── main.tsx                          # Punto de entrada de la aplicación React
    │   └── index.css                         # Sistema de diseño, tokens CSS y terna tipográfica
    ├── package.json
    └── vite.config.ts                        # Configuración de compilación, plugins y proxy de desarrollo
```

---

## Sistema de Diseño e Identidad Visual (Estética Institucional)

La interfaz gráfica sigue un diseño sobrio, formal y adaptado a la identidad de la **Facultad de Medicina Humana (URP)**.

### Terna Tipográfica Oficial (Estrictamente 3 Fuentes)
1. **Hero Título (`font-lora`):** `Lora` (Serif editorial para titulares destacados y remates itálicos).
2. **Encabezados y Métricas (`font-display`):** `Plus Jakarta Sans` (Títulos `h1`-`h6`, modales, tarjetas y métricas).
3. **Cuerpo y UI (`font-sans`):** `Inter` (Botones, formularios, inputs, tablas, navegación y texto general).

### Paleta Cromática Oficial
* **Verde Institucional URP:** `#008744`
* **Esmeralda:** `#00A859`
* **Menta Acento:** `#8CF9A9`
* **Slate Noche:** `#0F172A`
* **Slate 950:** `#020617`
* **Blanco Único:** `#FFFFFF`

---

## Instrucciones de Ejecución Local

### Prerrequisitos

* **Node.js 20 LTS o superior**
* **pnpm** (recomendado mediante `corepack enable` o `npm install -g pnpm`)

### 1. Instalación de Dependencias

Desde la raíz del repositorio (o dentro de `frontend/`):

```bash
pnpm install
```

### 2. Configuración de Variables de Entorno

Crear el archivo `.env` dentro de `frontend/` tomando como referencia `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Servidor de Desarrollo

Inicia el entorno de desarrollo con Hot Module Replacement (HMR):

```bash
pnpm dev
```

La aplicación estará disponible de forma predeterminada en `http://localhost:5173`.

### 4. Pruebas y Verificación de Tipos

```bash
# Ejecución de pruebas unitarias (Vitest)
pnpm test

# Verificación estricta de tipos TypeScript
pnpm typecheck

# Compilación completa para producción (Tests + TypeScript + Vite Build)
pnpm build
```

---

## Despliegue en Producción

El frontend se compila como un conjunto estático de alta eficiencia optimizado para entrega en CDN:
* **Entorno de Producción:** Desplegado de forma continua en **Vercel** (`medlib-urp.vercel.app`).
* **Enrutamiento SPA:** Configurado para resolución de rutas cliente mediante reescritura hacia `index.html`.

---

## Políticas y Estándares de Calidad

* **SUNEDU e IAC-CINDA:** Estructuración de recursos orientada al cumplimiento de estándares de licenciamiento y acreditación universitaria en ciencias de la salud.
* **Ley N° 29733 (Protección de Datos Personales):** Minimización de datos en formularios públicos, ausencia de persistencia innecesaria en el cliente y validación estricta de documentos de identidad académica.

---

## Créditos y Contacto

* **Desarrollo:** Joshue Sebastian Correa Giron (@Cjoshue18)
* **Institución:** Facultad de Medicina Humana "Manuel Velasco Suárez", Universidad Ricardo Palma
