const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

function getToken() {
  return localStorage.getItem('aerocode_token')
}

async function request(method, path, body = null, userCount = 1) {
  const headers = {
    'Content-Type': 'application/json',
    'X-User-Count': String(userCount),
  }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const config = { method, headers }
  if (body) config.body = JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${path}`, config)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Erro ${res.status}`)
  }
  return data
}

const api = {
  get:    (path, uc) => request('GET', path, null, uc),
  post:   (path, body, uc) => request('POST', path, body, uc),
  put:    (path, body, uc) => request('PUT', path, body, uc),
  delete: (path, uc) => request('DELETE', path, null, uc),
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (usuario, senha) => api.post('/auth/login', { usuario, senha }),
  me: () => api.get('/auth/me'),
}

// ── Funcionários ──────────────────────────────────────────────────────────────
export const funcionariosAPI = {
  listar:    () => api.get('/funcionarios'),
  buscar:    (id) => api.get(`/funcionarios/${id}`),
  criar:     (data) => api.post('/funcionarios', data),
  atualizar: (id, data) => api.put(`/funcionarios/${id}`, data),
  deletar:   (id) => api.delete(`/funcionarios/${id}`),
}

// ── Aeronaves ─────────────────────────────────────────────────────────────────
export const aeronavesAPI = {
  listar:    () => api.get('/aeronaves'),
  buscar:    (id) => api.get(`/aeronaves/${id}`),
  criar:     (data) => api.post('/aeronaves', data),
  atualizar: (id, data) => api.put(`/aeronaves/${id}`, data),
  deletar:   (id) => api.delete(`/aeronaves/${id}`),
}

// ── Peças ─────────────────────────────────────────────────────────────────────
export const pecasAPI = {
  listar:    (aeronaveId) => api.get(`/aeronaves/${aeronaveId}/pecas`),
  criar:     (aeronaveId, data) => api.post(`/aeronaves/${aeronaveId}/pecas`, data),
  atualizar: (aeronaveId, pecaId, data) => api.put(`/aeronaves/${aeronaveId}/pecas/${pecaId}`, data),
  deletar:   (aeronaveId, pecaId) => api.delete(`/aeronaves/${aeronaveId}/pecas/${pecaId}`),
}

// ── Testes ────────────────────────────────────────────────────────────────────
export const testesAPI = {
  listar:    (aeronaveId) => api.get(`/aeronaves/${aeronaveId}/testes`),
  criar:     (aeronaveId, data) => api.post(`/aeronaves/${aeronaveId}/testes`, data),
  atualizar: (aeronaveId, testeId, data) => api.put(`/aeronaves/${aeronaveId}/testes/${testeId}`, data),
  deletar:   (aeronaveId, testeId) => api.delete(`/aeronaves/${aeronaveId}/testes/${testeId}`),
}

// ── Etapas ────────────────────────────────────────────────────────────────────
export const etapasAPI = {
  listar:    (aeronaveId) => api.get(`/aeronaves/${aeronaveId}/etapas`),
  criar:     (aeronaveId, data) => api.post(`/aeronaves/${aeronaveId}/etapas`, data),
  atualizar: (aeronaveId, etapaId, data) => api.put(`/aeronaves/${aeronaveId}/etapas/${etapaId}`, data),
  deletar:   (aeronaveId, etapaId) => api.delete(`/aeronaves/${aeronaveId}/etapas/${etapaId}`),
  associarFuncionario:    (aeronaveId, etapaId, funcionarioId) =>
    api.post(`/aeronaves/${aeronaveId}/etapas/${etapaId}/funcionarios`, { funcionarioId }),
  desassociarFuncionario: (aeronaveId, etapaId, funcionarioId) =>
    api.delete(`/aeronaves/${aeronaveId}/etapas/${etapaId}/funcionarios/${funcionarioId}`),
}

// ── Métricas ──────────────────────────────────────────────────────────────────
export const metricsAPI = {
  buscar:  () => api.get('/metrics'),
  simular: (userCount, requests) => api.post('/metrics/simulate', { userCount, requests }),
  resetar: () => api.delete('/metrics'),
}
