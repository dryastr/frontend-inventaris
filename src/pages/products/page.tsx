import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services';
import type { Product } from '../../types/Product';
import Toast from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import Search from '../../components/ui/Search';
import DataTable from '../../components/shared/DataTable';
import MainLayout from '../../layouts/MainLayout';

const ProductsIndex = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; productId: number | null }>({ isOpen: false, productId: null });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'created') {
      setToast({ message: 'Produk berhasil ditambahkan', type: 'success' });
      setSearchParams({});
    } else if (success === 'updated') {
      setToast({ message: 'Produk berhasil diperbarui', type: 'success' });
      setSearchParams({});
    }

    fetchProducts();
  }, [currentPage, searchQuery, searchParams, setSearchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts(currentPage, searchQuery);
      setProducts(response.data);
      setTotalPages(response.last_page);
    } catch (err) {
      setToast({ message: 'Gagal memuat produk', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (product: Product) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteModal({ isOpen: true, productId: id });
  };

  const handleConfirmDelete = async () => {
    const { productId } = deleteModal;
    if (!productId) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await deleteProduct(productId);
      setToast({ message: 'Produk berhasil dihapus', type: 'success' });
      fetchProducts();
    } catch (err) {
      setToast({ message: 'Gagal menghapus produk', type: 'error' });
    } finally {
      setDeleteModal({ isOpen: false, productId: null });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Produk</h1>
          <div className="flex space-x-4">
            {isAuthenticated && (
              <button
                onClick={() => navigate('/products/create')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Tambah Produk
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Daftar Produk</h2>
            <Search onSearch={handleSearch} />
          </div>

          <DataTable
            data={products}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            loading={loading}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null })}
        title="Konfirmasi Hapus"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteModal({ isOpen: false, productId: null })}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Hapus
            </button>
          </div>
        }
      >
        <p className="text-sm text-gray-500">
          Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </MainLayout>
  );
};

export default ProductsIndex;