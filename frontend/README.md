# Tablero de Estrategia para el Bienestar Universitario — Frontend

**Stack:** React + Vite + TailwindCSS + Recharts + React Router + PapaParse

## Estructura de subsistemas (en frontend)
- **UI Subsystem:** `/src/pages`, `/src/components`, estilos Tailwind.
- **Data Subsystem:** `/src/lib/api.js` (capa para conectar la API real; hoy devuelve mocks).
- **Model Subsystem:** lógica de simulaciones en `/src/pages/Simulaciones.jsx` (modelo simple What‑If con coeficientes).

## Scripts
```bash
npm install
npm run dev
npm run build
npm run preview
```

> Configura la URL del backend con `VITE_API_URL` en un archivo `.env` si lo deseas.

## Endpoints reales (Swagger en `/api-docs`)
- `GET /api/stats` → métricas y promedios Likert; usado por Home.
- `GET /api/compare/likert-ge4` → series para análisis comparativo (línea).
- `GET /api/factores-clave` → categorías y series para factores clave (barras).
- `POST /api/what-if` → simulación con filtros e intervenciones.
- `POST /api/upload-dataset` → carga masiva CSV.
- `GET /api/table-structure` → estructura de tabla.
- `DELETE /api/clear-data` → limpiar base.

## Carga de archivos
En **Reportes** puedes cargar un `.csv`. Se envía al backend con `uploadDataset(file)` y el servidor confirma tipo y registros procesados.

## Manual de Usuario (básico)
- **Requisitos previos**: navegador actualizado; archivo CSV con cabeceras compatibles.
- **Pantalla principal**: módulos de Cargar CSV (Reportes), Análisis Comparativo, Factores Clave y Simulación What‑If.
- **Uso**:
  - Cargar CSV: selecciona archivo y pulsa “Subir”; verás confirmación.
  - Análisis Comparativos: accede a “Análisis Comparativo” para ver gráficas dinámicas.
  - Factores Clave: visualiza principales factores y métricas.
  - What‑If: ajusta sliders y observa el recálculo del índice %≥4.
- **Soporte**: API en `/api-docs` (Swagger). Contacto: ver GitHub del proyecto.

## Estándares y usabilidad
- Paleta accesible, alto contraste, tipografía legible, componentes con sombras suaves.
- Navegación clara con estados activos.
- Diseño responsive (grid) y tarjetas con información clave.

## Nota
Este proyecto es 100% frontend, listo para conectarse con tu API cuando esté disponible.
