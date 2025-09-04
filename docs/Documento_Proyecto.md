# Tablero de Estrategia para el Bienestar Universitario — Documentación del Proyecto

## Índice
- 1. Planificación del Proyecto
  - 1.1 Sprint y metodología ágil aplicada
  - 1.2 Herramienta de gestión (Trello)
  - 1.3 Roles del equipo
- 2. Definición de Objetivos y Alcance
  - 2.1 Objetivo general
  - 2.2 Alcance del sistema
  - 2.3 Exclusiones
- 3. Metodología y Herramientas
  - 3.1 Metodología (Scrum)
  - 3.2 Herramientas utilizadas
- 4. Análisis y Diseño
  - 4.1 Casos de uso iniciales
  - 4.2 Diseño de interfaz (usabilidad y ergonomía)
- 5. Requerimientos y Casos de Uso
  - 5.1 Requerimientos funcionales
  - 5.2 Requerimientos no funcionales
  - 5.3 Caso de uso ejemplo (Cargar archivo CSV)
  - 5.4 Casos de uso detallados
- 6. Documentación de API (Swagger)
- 7. Arquitectura DSS
  - 7.1 Subsistema de Datos
  - 7.2 Subsistema de Modelos
  - 7.3 Subsistema de Interfaz de Usuario
- 8. Estructura de Desglose del Trabajo (EDT)
- 9. Cronograma con Diagrama de Gantt
- 10. Riesgos y Plan de Mitigación
- 11. Métricas de Seguimiento (Burndown, SPI)
- 12. Reuniones diarias (Daily Scrum)
- 13. KPI por rol con justificación
- 14. Estándares de Codificación
- 15. Manual de Usuario

---

## 1. Planificación del Proyecto
- Sprint único de 15 días usando Scrum: planificación (día 1), revisiones (días 6 y 11), retrospectiva (día 15).
- Gestión en Trello con tarjetas, checklists y responsables.
- Roles:
  - Analista (Michel): documentación, pruebas, metodología.
  - Backend (Felipe): BD, endpoints, lógica de análisis.
  - Frontend (Santiago): UI, componentes, gráficos.

Definición of Done (DoD) sugerida:
- Historia implementada, testeada manualmente y revisada por otro rol.
- Sin errores críticos, lints en verde, documentación mínima actualizada.

## 2. Definición de Objetivos y Alcance
### 2.1 Objetivo general
Desarrollar un DSS que permita decisiones informadas sobre bienestar estudiantil a partir de datos de encuestas.

### 2.2 Alcance del sistema
- Carga y validación de archivos CSV.
- Procesamiento y almacenamiento en PostgreSQL.
- Análisis comparativo de niveles de estrés.
- Exploración de factores clave.
- Simulaciones What‑If.
- Visualizaciones interactivas.
- Documentación de API con Swagger.

### 2.3 Exclusiones
- Autenticación/roles de usuario.
- Integraciones externas fuera de alcance.

## 3. Metodología y Herramientas
### 3.1 Metodología
Scrum aplicado al sprint de 15 días con ceremonias definidas.

### 3.2 Herramientas utilizadas
- Backend: Node.js, Express.js, PostgreSQL, Swagger, Multer, csv-parser.
- Frontend: React 18, React Router, Recharts (Home/Comparativo) y ApexCharts (Factores), PapaParse, clsx.
- Estilos: TailwindCSS, PostCSS, Autoprefixer.
- Build: Vite, @vitejs/plugin-react.
- Gestión/versionamiento: GitHub, Gantt (documento adjunto en docs/), Trello.

## 4. Análisis y Diseño
### 4.1 Casos de uso iniciales
- Cargar CSV de encuestas.
- Visualizar análisis comparativo.
- Explorar factores clave.
- Ejecutar simulaciones What‑If.

### 4.2 Usabilidad y ergonomía
- Navegación clara por secciones.
- Manual interactivo, ayuda contextual y botón de ayuda persistente.
- Feedback de estado (loaders, errores legibles).

## 5. Requerimientos y Casos de Uso
### 5.1 Requerimientos funcionales
- Cargar archivos CSV (validación de extensión y columnas).
- Procesar y almacenar en PostgreSQL (evitar duplicados, consistencia).
- Generar análisis comparativos (series por grupo).
- Identificar factores predominantes.
- Ejecutar simulaciones What‑If (sliders con recalculo y delta).

### 5.2 Requerimientos no funcionales
- UI clara y consistente (TailwindCSS, patrones comunes).
- Heurísticas de Nielsen aplicadas (visibilidad del estado, consistencia, prevención de errores, etc.).
- Estándares de código (ESLint/convenciones).
- Tiempos de respuesta deseables: p99 ≤ 500ms para endpoints principales en dataset típico.

Nota: “Exportar en 3 formatos” no está implementado actualmente. Se considera trabajo futuro.

### 5.3 Caso de uso: Cargar archivo CSV
Actor: Administrador
Flujo:
1. Selecciona archivo CSV.
2. Validación (estructura/separador/cabeceras).
3. Normalización automática de escala Likert (a 1..5 cuando aplique).
4. Inserción en BD con origen `source`.
5. Confirmación con resumen y detalles de normalización.

### 5.4 Casos de uso detallados
- Gestión de datos: cargar, procesar, consultar estructura, limpiar datos.
- Análisis y reportes: comparativos, factores, métricas.
- Soporte/documentación: Swagger `/api-docs`, manual integrado.
- Administración: dashboard de reportes y resultados de cargas.

## 6. Documentación de API (Swagger)
- Ruta: `http://localhost:3000/api-docs`.
- Endpoints principales expuestos y probados:
  - POST `/api/upload-dataset`
  - GET `/api/stats`
  - GET `/api/table-structure`
  - DELETE `/api/clear-data`
  - GET `/api/compare/likert-ge4`
  - POST `/api/what-if`

## 7. Arquitectura DSS
### 7.1 Subsistema de Datos
- BD: PostgreSQL, tabla `survey_responses`.
- Script: `backend/db/schema.sql`.
- Normalización de Likert a 1..5 (cuando el origen lo requiere). La respuesta de carga incluye `normalization` con detalle de columnas afectadas.

### 7.2 Subsistema de Modelos
- Consultas SQL y agregaciones para comparativos y factores.
- Cálculos simples de escenarios What‑If en backend.

### 7.3 Subsistema de Interfaz de Usuario
- React + Vite.
- Gráficos: Recharts (tendencias/comparativos), ApexCharts (factores).
- Ayuda: manual interactivo, tooltips contextuales, botón flotante, modal de bienvenida.

## 8. EDT
- Nivel 1: Proyecto DSS Bienestar
- Nivel 2: Planificación → D1‑D5
- Nivel 2: Desarrollo → D6‑D12
- Nivel 2: Documentación → D13
- Nivel 2: Cierre → D14‑D15

## 9. Cronograma (Gantt)
- Ver `docs/gantt/cronograma.png` (añadir artefacto).

## 10. Riesgos y Mitigación
- Backend retrasado → revisiones y pruebas parciales.
- BD con problemas → respaldo en GitHub, validación local.
- Descoordinación FE/BE → sincronizaciones D6 y D11.
- Fallas CSV (formato/encoding) → validadores + detección de separador/cabeceras.
- Retraso documentación → checklist y avance diario.

## 11. Métricas de seguimiento
- Burndown (adjuntar gráfico en docs/metrics/burndown.png).
- SPI = Valor Ganado / Valor Planeado.

## 12. Reuniones diarias
Plantilla: Ayer / Hoy / Bloqueos. Registro mínimo en Trello o docs/dailies.

## 13. KPI por rol
- Analista (Michel): avance documentación (≥95%), calidad (≤5% errores), Scrum (≥90%), claridad (≥80%), puntualidad (100%).
- Backend (Felipe): endpoints implementados (≥95%), errores críticos (≤2%), tiempo respuesta (≤500ms), calidad de código (≥90%), mantenibilidad (≥4/5).
- Frontend (Santiago): pantallas entregadas (≥90%), estándares de diseño (100%), avance sprint (≥90%), errores UI (≤5%), integraciones sin corrección (≥90%).

## 14. Estándares de codificación
- Git: ramas `main`, `develop`, `feature/*`; commits descriptivos (Conventional Commits recomendado).
- Backend: camelCase para funciones/variables, PascalCase para clases, ESLint, respuestas JSON consistentes, Swagger.
- Frontend: Componentes en PascalCase (`MyComponent.jsx`), hooks/utilidades en camelCase, separación lógica/visual, checklist de estilos.
- BD: snake_case plural (p. ej., `survey_responses`), claves primarias con sufijo `_id`, MER documentado.
- Comentarios: cabecera breve por archivo, JSDoc cuando la lógica no sea evidente.

## 15. Manual de Usuario
- Integrado en UI: botón de ayuda flotante, manual interactivo con tour, tooltips contextuales, modal de bienvenida.
- Manual adicional: `MANUAL_USUARIO.md` en la raíz del proyecto.

---

Notas de alineación con el repo:
- Factores se renderiza con React ApexCharts; tendencias/comparativos con Recharts.
- Exportación de gráficos “en 3 formatos” no está implementada; marcado como futuro.
- MER y Gantt deben añadirse a `docs/` para completar evidencias.

