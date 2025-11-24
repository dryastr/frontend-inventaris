import type { Product } from '../types/Product';
import { authenticatedFetch, API_BASE } from './httpClient';

export const getProducts = async (page: number = 1, search: string = ''): Promise<any> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (search) params.append('search', search);

  const res = await authenticatedFetch(`${API_BASE}/products?${params.toString()}`);
  return res.json();
};

export const getProduct = async (id: number): Promise<Product> => {
  const res = await authenticatedFetch(`${API_BASE}/products/${id}`);
  return res.json();
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const res = await authenticatedFetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  return res.json();
};

export const updateProduct = async (id: number, product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const res = await authenticatedFetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  return res.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
  await authenticatedFetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });
};