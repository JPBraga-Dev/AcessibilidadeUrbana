const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  });

  if (!res.ok) {
    const erro = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(erro.error ?? 'Erro na requisição.');
  }

  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }),
};

export const mapaApi = {
  // filtro: 'todos' | 'rampas' | 'calcadas' | '4estrelas'
  listar: (filtro = 'todos') => api.get(`/places/map?filter=${filtro}`),
};
