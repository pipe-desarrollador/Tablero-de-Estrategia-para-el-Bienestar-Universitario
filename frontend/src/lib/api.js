// Capa de acceso a datos (Data Subsystem) para conectar con el backend.
// Todos los endpoints están centralizados aquí para que luego conectes tu API real.
// Swagger sugerido: GET /api/docs (OpenAPI 3).

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function getResumen(){
  // Ejemplo de consumo. Reemplaza por fetch(`${BASE}/resumen`)
  // Simulamos con datos mock para el frontend.
  return {
    promedio: 3.5,
    variacion: 0.12,
    top: ['Problemas de sueño', 'Presión académica', 'Carrera futura']
  }
}

export async function getSerie(){
  return [
    { mes: 'Ene', actual: 2.1, anterior: 1.8 },
    { mes: 'Feb', actual: 2.7, anterior: 2.0 },
    { mes: 'Mar', actual: 3.0, anterior: 2.2 },
    { mes: 'Abr', actual: 3.2, anterior: 2.5 },
    { mes: 'May', actual: 3.4, anterior: 2.7 },
    { mes: 'Jun', actual: 3.9, anterior: 2.9 },
  ]
}

export async function getFactores(){
  return [
    { nombre: 'Sueño', impacto: 8.5, prevalencia: 7.2, poblacion: 650 },
    { nombre: 'Académico', impacto: 7.8, prevalencia: 6.4, poblacion: 540 },
    { nombre: 'Finanzas', impacto: 6.2, prevalencia: 5.1, poblacion: 420 },
    { nombre: 'Pares', impacto: 4.5, prevalencia: 4.0, poblacion: 210 },
    { nombre: 'Carrera', impacto: 8.0, prevalencia: 6.8, poblacion: 580 },
  ]
}

export async function postUploadCSV(rows){
  // Placeholder para guardar datos.
  // return fetch(`${BASE}/upload`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(rows) })
  return { ok: true, count: rows?.length || 0 }
}
