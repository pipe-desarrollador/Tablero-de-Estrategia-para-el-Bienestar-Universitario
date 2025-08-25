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

## Endpoints esperados (sugerencia para tu backend con Swagger)
- `GET /resumen` → { promedio, variacion, top[] }
- `GET /serie` → [{ mes, actual, anterior }]
- `GET /factores` → [{ nombre, impacto, prevalencia, poblacion }]
- `POST /upload` → guarda datos de carga masiva
- `GET /docs` → Swagger (OpenAPI)

## Carga de archivos
En **Reportes** puedes cargar un `.csv`. Se muestra de inmediato y puedes llamar al backend desde `postUploadCSV`.

## Estándares y usabilidad
- Paleta accesible, alto contraste, tipografía legible, componentes con sombras suaves.
- Navegación clara con estados activos.
- Diseño responsive (grid) y tarjetas con información clave.

## Nota
Este proyecto es 100% frontend, listo para conectarse con tu API cuando esté disponible.
