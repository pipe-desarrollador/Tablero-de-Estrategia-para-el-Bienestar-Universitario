// frontend/src/lib/api.js
const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
  'http://localhost:3000';

async function okJSON(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getSerie(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/api/compare/likert-ge4${qs ? `?${qs}` : ''}`);
  const json = await okJSON(res);
  // El backend responde { data: { series: [...] } }
  return Array.isArray(json?.data?.series) ? json.data.series : [];
}

// === Comparativos (línea) ===
export async function getFactoresComparativo() {
  // Devuelve las series para el gráfico de línea (UCaldas vs Otras)
  const res = await getJSON('/api/compare/likert-ge4');
  return Array.isArray(res?.series) ? res.series : [];
}

export async function getFactoresClave() {
  const res = await fetch(`${API_URL}/api/factores-clave`);
  const json = await okJSON(res);
  // Espera: { data: { resultados: [ { universidad, factores: [{factor,promedio,porcentaje_ge4}...] }, ... ] } }
  const rows = Array.isArray(json?.data?.resultados) ? json.data.resultados : [];

  // Normaliza a estructura para 2 gráficas de barras: “Promedios” y “%≥4”
  // categories en el mismo orden para ambas
  const categories = Object.keys(LIKERT_LABELS);

  const byUni = {};
  for (const g of rows) {
    const uni = g.universidad || 'Grupo';
    byUni[uni] = byUni[uni] || { promedio: [], pct: [] };

    // rellena en orden de categories
    const map = Object.fromEntries(g.factores.map(f => [f.factor, f]));
    for (const key of categories) {
      const f = map[key] || {};
      byUni[uni].promedio.push(Number(f.promedio) || 0);
      byUni[uni].pct.push(Number(f.porcentaje_ge4) || 0);
    }
  }

  // series para Apex/Recharts: [{name, data:[...]}, ...]
  const seriesProm = Object.entries(byUni).map(([name, vals]) => ({
    name,
    data: vals.promedio,
  }));

  const seriesPct = Object.entries(byUni).map(([name, vals]) => ({
    name,
    data: vals.pct,
  }));

  // devuelve todo lo necesario
  return {
    categories: categories.map(k => LIKERT_LABELS[k]),
    seriesProm,
    seriesPct,
    raw: rows,
  };
}

async function getJSON(path, opts) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: 'application/json' },
      ...opts,
    });
    return okJSON(res);
  } catch (e) {
    // mensaje más claro en consola si falla la conexión
    throw new Error(`Fetch ${API_URL}${path} -> ${e.message}`);
  }
}
export async function postWhatIf(
  { filters = {}, interventions = [], effectiveness = 0.5 } = {},
  { signal } = {}
) {


  const res = await fetch(`${API_URL}/api/what-if`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filters, interventions, effectiveness }),
    signal,
  });
  return okJSON(res);
}

// === Simulaciones Bayesianas ===
export async function postWhatIfBayesian(
  { interventions = {}, target = 'wellbeing_index', includeExplanation = true } = {},
  { signal } = {}
) {
  const res = await fetch(`${API_URL}/api/what-if-bayesian`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interventions, target, includeExplanation }),
    signal,
  });
  return okJSON(res);
}

export async function postWhatIfBayesianFull(
  { interventions = {} } = {},
  { signal } = {}
) {
  const res = await fetch(`${API_URL}/api/what-if-bayesian-full`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interventions }),
    signal,
  });
  return okJSON(res);
}

export async function getBayesianStats({ signal } = {}) {
  const res = await fetch(`${API_URL}/api/bayesian-stats`, {
    method: 'GET',
    signal,
  });
  const json = await okJSON(res);
  // El backend responde { data: { status: 'success', stats: {...} } }
  return json.data;
}



// Mapeo de claves Likert -> etiquetas
const LIKERT_LABELS = {
  sleep_problems: 'Sueño',
  headaches: 'Dolor cabeza',
  concentration_issues: 'Concentración',
  irritability: 'Irritabilidad',
  palpitations: 'Palpitaciones',
  sadness: 'Tristeza',
  anxiety: 'Ansiedad',
};

// === KPIs del Home ===
export async function getResumen(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
  ).toString();

  const response = await getJSON(`/api/stats${qs ? `?${qs}` : ''}`);

  const avgs = response?.data?.likert_avgs || {};
  const items = Object.entries(LIKERT_LABELS).map(([key, label]) => ({
    key,
    label,
    value: Number(avgs[key]) || 0,
  }));

  const valid = items.filter(i => Number.isFinite(i.value) && i.value > 0);
  const stressMean = valid.length
    ? +(valid.reduce((a, c) => a + c.value, 0) / valid.length).toFixed(2)
    : 0;

  const top3 = [...valid].sort((a, b) => b.value - a.value).slice(0, 3);

  return {
    promedio: stressMean,
    top: top3.map(i => `${i.label} (${i.value.toFixed(2)})`),
    raw: response,
  };
}



// === utilidades de Reportes ===
export async function uploadDataset(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_URL}/api/upload-dataset`, {
    method: 'POST',
    body: fd,
  });
  return okJSON(res);
}

export async function clearData() {
  const res = await fetch(`${API_URL}/api/clear-data`, { method: 'DELETE' });
  return okJSON(res);
}

export async function getTableStructure() {
  return getJSON('/api/table-structure');
}
