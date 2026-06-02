const BASE_URL = 'http://localhost:5000/api';

/**
 * Cliente HTTP nativo para o Front-end consumir a API do Back-end.
 * Injeta automaticamente o header x-user-id simulando um usuário logado.
 */
export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'demo-user-123'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro na requisição');
    return data;
  },

  post: async (endpoint, body) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'demo-user-123'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro na requisição');
    return data;
  },

  put: async (endpoint, body) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'demo-user-123'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro na requisição');
    return data;
  },

  delete: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'demo-user-123'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro na requisição');
    return data;
  }
};
