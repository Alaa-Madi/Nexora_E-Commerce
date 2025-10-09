const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  login: (credentials: { email: string; password: string }) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(res => res.json()),

  register: (userData: { name: string; email: string; password: string }) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(res => res.json()),

  // Product endpoints
  getProducts: () =>
    fetch(`${API_BASE_URL}/products`).then(res => res.json()),

  getProduct: (id: string) =>
    fetch(`${API_BASE_URL}/products/${id}`).then(res => res.json()),

  // Checkout endpoints
  createCheckoutSession: (data: { items: any[]; userId: number }) =>
    fetch(`${API_BASE_URL}/checkout/create-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  getUserOrders: async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/orders/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  createOrder: (data: { sessionId: string; userId: number; items: any[]; total: number }) =>
    fetch(`${API_BASE_URL}/checkout/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),
};

export default api;
