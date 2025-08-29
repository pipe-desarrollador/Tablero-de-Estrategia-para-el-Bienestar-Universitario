const API_URL = import.meta.env.VITE_API_URL;

// Ejemplo: obtener estadísticas
export async function getStats() {
  const res = await fetch(`${API_URL}/api/stats`);
  if (!res.ok) throw new Error('Error al obtener estadísticas');
  return res.json();
}

// Ejemplo: obtener estructura de tabla
export async function getTableStructure() {
  const res = await fetch(`${API_URL}/api/table-structure`);
  if (!res.ok) throw new Error('Error al obtener estructura de tabla');
  return res.json();
}

// Ejemplo: subir dataset
export async function uploadDataset(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/api/upload-dataset`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Error al subir dataset');
  return res.json();
}

// Ejemplo: limpiar datos
export async function clearData() {
  const res = await fetch(`${API_URL}/api/clear-data`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al limpiar datos');
  return res.json();
}