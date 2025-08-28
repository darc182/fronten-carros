// src/services/api.js
// Servicio para consumir el backend de Render

const API_URL = 'https://rentacarros.onrender.com';

export async function login(username, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function register(data) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getClientes(token) {
  const res = await fetch(`${API_URL}/api/clientes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function createCliente(data, token) {
  const res = await fetch(`${API_URL}/api/clientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getCarros(token) {
  const res = await fetch(`${API_URL}/api/carros`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function createCarro(data, token) {
  const res = await fetch(`${API_URL}/api/carros`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getRentas(token) {
  try {
    const res = await fetch(`${API_URL}/api/rentas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const result = await res.json();
    
    if (!res.ok) {
      throw new Error(result.message || `Error ${res.status}: ${res.statusText}`);
    }
    
    return result;
  } catch (error) {
    console.error('Error en getRentas:', error);
    throw error;
  }
}

export async function createRenta(data, token) {
  try {
    const res = await fetch(`${API_URL}/api/rentas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    const result = await res.json();
    
    if (!res.ok) {
      throw new Error(result.message || `Error ${res.status}: ${res.statusText}`);
    }
    
    return result;
  } catch (error) {
    console.error('Error en createRenta:', error);
    throw error;
  }
}
