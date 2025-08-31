// /src/lib/api.js
const API_BASE =
  (import.meta?.env?.VITE_API_BASE && import.meta.env.VITE_API_BASE.trim()) ||
  'http://localhost:3000';

async function getJSON(path) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const r = await fetch(url);
  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    throw new Error(`${r.status} ${r.statusText} – ${txt}`);
  }
  return r.json();
}

// ===========================
// Endpoints de LECTURA
// ===========================

// Serie para AnalisisComparativo
export async function getSerie() {
  const data = await getJSON('/api/compare/likert-ge4');
  return data.series ?? [];
}

// Resumen general desde /api/stats (usa filtros opcionales)
export async function getResumen(filters = {}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && `${v}`.trim() !== '') qs.set(k, v);
  }
  const q = qs.toString();
  return getJSON(`/api/stats${q ? `?${q}` : ''}`);
}

// Factores clave (ranking de promedios Likert)
export async function getFactores(filters = {}) {
  const stats = await getResumen(filters);
  const labels = {
    sleep_problems: 'Sueño',
    headaches: 'Dolor cabeza',
    concentration_issues: 'Concentración',
    irritability: 'Irritabilidad',
    palpitations: 'Palpitaciones',
    sadness: 'Tristeza',
    anxiety: 'Ansiedad',
  };
  const avgs = stats?.likert_avgs || {};
  return Object.entries(labels)
    .map(([key, label]) => {
      const v = Number(avgs[key]);
      return { key, label, avg: Number.isFinite(v) ? v : 0 };
    })
    .filter(r => r.avg > 0)
    .sort((a, b) => b.avg - a.avg);
}

// (opcional) Lista paginada desde /api/data
export async function getData(params = {}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && `${v}`.trim() !== '') qs.set(k, v);
  }
  if (!qs.has('columns')) qs.set('columns', 'id,gender,age,stress_type');
  return getJSON(`/api/data?${qs.toString()}`);
}

// ===========================
// Endpoints de ESCRITURA
// ===========================

// ⬆️ Subir CSV al backend (lo que te falta)
export async function postUploadCSV(file) {
  const fd = new FormData();
  fd.append('file', file, file?.name || 'dataset.csv');
  const r = await fetch(`${API_BASE}/api/upload-dataset`, {
    method: 'POST',
    body: fd, // no pongas Content-Type; fetch agrega el boundary
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    throw new Error(`${r.status} ${r.statusText} – ${txt}`);
  }
  return r.json(); // { message, fileType, recordsProcessed }
}

export async function getFactoresComparativo() {
  const json = await getJSON('/api/factores-clave');
  const resultados = json?.resultados || [];

  // orden y etiquetas como en el backend
  const items = [
    'sleep_problems','headaches','concentration_issues',
    'irritability','palpitations','sadness','anxiety'
  ];
  const labelMap = {
    sleep_problems: 'Sueño',
    headaches: 'Dolor cabeza',
    concentration_issues: 'Concentración',
    irritability: 'Irritabilidad',
    palpitations: 'Palpitaciones',
    sadness: 'Tristeza',
    anxiety: 'Ansiedad'
  };
  const labels = items.map(k => labelMap[k]);

  const findGroup = (name) =>
    resultados.find(g => g.universidad === name) || { factores: [] };

  const dataBy = (group, field) =>
    items.map(k => {
      const f = group.factores.find(x => x.factor === k);
      return Number(f?.[field]) || 0;
    });

  const ucaldas = findGroup('Universidad de Caldas');
  const otras   = findGroup('Otras universidades');

  return {
    labels,
    promedio: [
      { name: 'Universidad de Caldas', data: dataBy(ucaldas, 'promedio') },
      { name: 'Otras universidades',   data: dataBy(otras,   'promedio') }
    ],
    porcentaje_ge4: [
      { name: 'Universidad de Caldas', data: dataBy(ucaldas, 'porcentaje_ge4') },
      { name: 'Otras universidades',   data: dataBy(otras,   'porcentaje_ge4') }
    ]
  };
}
async function postJSON(path, body, opts = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
    signal: opts.signal,
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    throw new Error(`${r.status} ${r.statusText} – ${txt}`);
  }
  return r.json();
}
// ===== NUEVO: para Simulaciones.jsx =====
export async function postWhatIf(payload) {
  // payload esperado por tu backend:
  // {
  //   filters: { university_group?: 'ucaldas'|'otras', gender?, age_min?, age_max? },
  //   interventions: [{type:'tutoria_academica'|'salud_mental'|'apoyo_financiero', pct:number}, ...],
  //   effectiveness: number (0..1)
  // }
  return postJSON('/api/what-if', payload);
}

// (opcionales, por si los usas en Reportes)
export async function clearDatabase() {
  const r = await fetch(`${API_BASE}/api/clear-data`, { method: 'DELETE' });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}
export async function getTableStructure() {
  return getJSON('/api/table-structure');
}
