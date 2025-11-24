import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct, getProduct } from '../../../services';
import type { Product } from '../../../types/Product';
import Toast from '../../../components/ui/Toast';
import MainLayout from '../../../layouts/MainLayout';

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({ name: '', sku: '', quantity: '', price: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; sku?: string; quantity?: string; price?: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (id) {
      fetchProduct(parseInt(id), token);
    }
  }, [id, navigate]);

  const fetchProduct = async (productId: number, token: string) => {
    try {
      const product = await getProduct(productId);
      setFormData({
        name: product.name,
        sku: product.sku,
        quantity: product.quantity.toString(),
        price: product.price.toString(),
      });
    } catch (err) {
      navigate('/products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token || !id) return;

    setLoading(true);
    try {
      const productData = {
        ...formData,
        quantity: parseInt(formData.quantity) || 0,
        price: parseFloat(formData.price) || 0,
      };

      await updateProduct(parseInt(id), productData);
      navigate('/products?success=updated');
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; sku?: string; quantity?: string; price?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama tidak boleh kosong';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU tidak boleh kosong';
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Jumlah tidak boleh kosong';
    } else if (parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Jumlah harus lebih dari atau sama dengan 0';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Harga tidak boleh kosong';
    } else if (parseFloat(formData.price) < 0) {
      newErrors.price = 'Harga harus lebih dari atau sama dengan 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Edit Produk</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
                  <input
                    type="text"
                    id="name"
                    required
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU (Kode Unit Stok)</label>
                  <input
                    type="text"
                    id="sku"
                    required
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base ${
                      errors.sku ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                  {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Jumlah</label>
                  <input
                    type="number"
                    id="quantity"
                    required
                    min="0"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base ${
                      errors.quantity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="0"
                  />
                  {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Harga</label>
                  <input
                    type="number"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Memperbarui...' : 'Perbarui Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductEdit;