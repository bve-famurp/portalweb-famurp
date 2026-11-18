# Portal Web - BVE FAMURP

> Biblioteca Virtual y Especializada de la Facultad de Medicina Humana "Manuel Velasco Suárez"  
> Universidad Ricardo Palma, Lima, Perú

---

## Descripción Institucional

**Portal Web - BVE FAMURP** es la plataforma institucional pública de la Biblioteca Virtual y Especializada de la Facultad de Medicina Humana de la Universidad Ricardo Palma. Centraliza el acceso al catálogo de recursos de bases de datos médicas, material curricular por asignaturas, inscripción y marcación de asistencia a conferencias y capacitaciones académicas, y el boletín informativo con novedades para pregrado, internado y residentado médico.

---

## Arquitectura Frontend

La aplicación está construida como una **Single Page Application (SPA)** moderna, de alto rendimiento y completamente accesible:

* **Núcleo:** React 19 + TypeScript 5.7 en modo estricto.
* **Empaquetado y Build:** Vite 6 con soporte de Hot Module Replacement (HMR) y compilación optimizada de activos.
* **Sistema de Diseño:** Tailwind CSS 3.4 con tokens institucionales, terna tipográfica médica y utilidades táctiles de estilo brutalista.
* **Micro-interacciones y Animaciones:** GSAP y CSS nativo con soporte estricto para `prefers-reduced-motion`.
* **Estructura Modular:** Organización basada en **Vertical Feature Slices** (`src/features/*`), asegurando aislamiento funcional, alta cohesión y bajo acoplamiento entre dominios.
* **Resiliencia del Cliente:** Sistema de caché en `localStorage` y catálogo estático integrado para garantizar navegación fluida e ininterrumpida ante problemas de conectividad de red.

---

## Organización del Proyecto

El código fuente del cliente web sigue una estructura modular orientada a las capacidades del portal público:

```text
MedLib-URP/
└── frontend/                                 # Aplicación Web SPA (React 19, TypeScript, Vite)
    ├── src/
    │   ├── assets/                           # Identidad visual institucional, escudos y logotipos
    │   ├── components/                       # Componentes de interfaz globales (Navbar, Footer, Pagination)
    │   ├── constants/                        # Enlaces institucionales oficiales (URP, Intranet, OPAC)
    │   ├── core/                             # Núcleo de infraestructura del cliente
    │   │   ├── apiConfig.ts                  # Resolución y normalización de URLs base de la API
    │   │   └── types/navigation.ts           # Definición canónica de vistas de navegación (AppView)
    │   ├── features/                         # Vertical Feature Slices
    │   │   ├── conferences/                  # Calendario académico, inscripciones y terminal de asistencia
    │   │   ├── guides/                       # Directorio de bases de datos médicas y vinculación curricular
    │   │   └── home/                         # Portada institucional, carrusel de novedades y Bento Grid
    │   ├── pages/                            # Vistas principales del portal público
    │   │   ├── HomePage.tsx                  # Portada institucional y Bento Grid
    │   │   ├── DirectoryPage.tsx             # Catálogo de 46 bases de datos y filtro por asignaturas
    │   │   ├── ConferencesPage.tsx           # Calendario de conferencias, registro y asistencia
    │   │   └── NotFoundPage.tsx              # Manejo amigable de rutas no encontradas (404)
    │   ├── utils/                            # Utilidades puras (formateo de fechas, sanitización, texto)
    │   ├── App.tsx                           # Enrutador declarativo de vistas SPA
    │   ├── main.tsx                          # Punto de entrada de la aplicación React
    │   └── index.css                         # Sistema de diseño, tokens CSS y terna tipográfica
    ├── package.json
    ├── tailwind.config.js                    # Configuración Tailwind con paleta URP y sombras brutales
    └── vite.config.ts                        # Configuración de compilación, plugins y alias de rutas
```

---

## Integración de Endpoints y Servicios

El portal público consume los siguientes servicios HTTP de forma parametrizada y desacoplada:

| Dominio | Método | Endpoint Relativo | Descripción |
| :--- | :---: | :--- | :--- |
| **Recursos Médicos** | `GET` | `/api/resources` | Catálogo de bases de datos médicas y metadatos |
| **Malla Curricular** | `GET` | `/api/resources/cursos` | Lista oficial de asignaturas curriculares de Medicina Humana |
| **Activos Estáticos** | `GET` | `/api/static/logos_bd/{archivo}.webp` | Logotipos en formato WebP de alta fidelidad |
| **Conferencias** | `GET` | `/api/v1/Conferences` | Listado de eventos académicos filtrados por periodo |
| **Conferencias** | `GET` | `/api/v1/Conferences/{id}` | Información detallada del evento y estado de registro |
| **Inscripciones** | `POST` | `/api/v1/Conferences/{id}/register` | Pre-inscripción académica con validación de documento de identidad |
| **Asistencia** | `POST` | `/api/v1/Conferences/{id}/attendances/mark` | Marcación de asistencia presencial/virtual en tiempo real |
| **Boletín y Noticias**| `GET` | `/api/boletinslides` | Diapositivas dinámicas del carrusel informativo y avisos |

---

## Sistema de Diseño e Identidad Visual (Estética Institucional)

La interfaz gráfica sigue una estética médica sobria, formal y adaptada a la identidad de la **Facultad de Medicina Humana (URP)**.

### Terna Tipográfica Oficial (Estrictamente 3 Fuentes)
1. **Hero Título (`font-lora`):** `Lora` (Serif editorial para titulares destacados y remate itálico caligráfico en palabras clave).
2. **Encabezados y Métricas (`font-display`):** `Plus Jakarta Sans` (Títulos `h1`-`h6`, modales, tarjetas y métricas).
3. **Cuerpo y UI (`font-sans`):** `Inter` (Botones, formularios, inputs, tablas, navegación y texto general).

### Paleta Cromática Oficial (Estrictamente 6 Colores Maestros)
* **Verde Institucional URP:** `#008744` (Primario oficial: hover de botones, enlaces, acentos de foco).
* **Esmeralda:** `#00A859` (Estado base de botones, gradientes).
* **Menta Acento:** `#8CF9A9` (Resaltes itálicos en titulares y detalles visuales).
* **Slate Noche:** `#0F172A` (Malla de fondo en hero y sección superior del footer).
* **Slate 950:** `#020617` (Barra inferior de copyright en footer).
* **Blanco Único:** `#FFFFFF` (Fondo general, tarjetas, inputs y contrastes).

---

## Instrucciones de Ejecución Local

### Prerrequisitos

* **Node.js 20 LTS o superior**
* **pnpm** (recomendado mediante `corepack enable` o `npm install -g pnpm`)

### 1. Instalación de Dependencias

Desde la raíz del repositorio:

```bash
pnpm install
```

### 2. Configuración de Variables de Entorno

Crear el archivo `.env` dentro de `frontend/` definiendo la URL base de la API backend mediante cualquiera de las dos variables admitidas (el cliente utiliza una u otra, priorizando `VITE_VPS_API_URL`):

```env
VITE_VPS_API_URL=
```

*(Alternativa de compatibilidad: `VITE_API_URL=`)*

### 3. Servidor de Desarrollo

Inicia el entorno de desarrollo con Hot Module Replacement (HMR):

```bash
pnpm dev
```

La aplicación estará disponible de forma predeterminada en `http://localhost:5173`.

### 4. Pruebas y Verificación de Tipos

```bash
# Ejecución de la suite completa de pruebas unitarias (Vitest - 80 pruebas)
pnpm test

# Verificación estricta de tipos TypeScript sin emitir artefactos
pnpm typecheck

# Compilación completa para producción (Tests + TypeScript + Vite Build)
pnpm build
```

---

## Despliegue en Producción

El frontend se compila como un conjunto estático de alta eficiencia optimizado para entrega en CDN:
* **Compilación:** Generación de bundle estático optimizado en `frontend/dist/`.
* **Enrutamiento SPA:** Resolución de rutas cliente mediante reescritura hacia `index.html`.

---

## Políticas y Estándares de Calidad

* **SUNEDU e IAC-CINDA:** Estructuración de recursos orientada al cumplimiento de estándares de licenciamiento y acreditación universitaria en ciencias de la salud.
* **Ley N° 29733 (Protección de Datos Personales):** Minimización de datos en formularios públicos, ausencia de persistencia innecesaria en el cliente y validación estricta de documentos de identidad académica.

---

## Créditos y Contacto

* **Desarrollo:** Joshue Sebastian Correa Giron (@Cjoshue18)
* **Institución:** Facultad de Medicina Humana "Manuel Velasco Suárez", Universidad Ricardo Palma
