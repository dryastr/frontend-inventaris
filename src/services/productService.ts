import type { Product } from '../types/Product';
import { authenticatedFetch } from './httpClient';

export const getProducts = async (page: number = 1, search: string = ''): Promise<any> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (search) params.append('search', search);

  const res = await authenticatedFetch(`http://localhost:8000/api/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const getProduct = async (id: number): Promise<Product> => {
  const res = await authenticatedFetch(`http://localhost:8000/api/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const res = await authenticatedFetch(`http://localhost:8000/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
};

export const updateProduct = async (id: number, product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const res = await authenticatedFetch(`http://localhost:8000/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
  const res = await authenticatedFetch(`http://localhost:8000/api/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product');
};