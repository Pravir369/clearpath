const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export const api = {
  getClients: () => request('/clients'),
  getClient: (id) => request(`/clients/${id}`),
  createClient: (data) => request('/clients', { method: 'POST', body: JSON.stringify(data) }),
  analyzeClient: (id) => request(`/analyze/${id}`, { method: 'POST' }),
  completeAction: (clientId, data) => request(`/analyze/${clientId}/complete-action`, { method: 'POST', body: JSON.stringify(data) }),
  getCompletions: (clientId) => request(`/analyze/${clientId}/completions`),
  regenerateAnalysis: (clientId) => request(`/analyze/${clientId}/regenerate`, { method: 'POST' }),
  health: () => fetch(`${BASE_URL.replace('/api', '')}/health`).then((r) => r.json()),
}
