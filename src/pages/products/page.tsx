import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services';
import type { Product } from '../../types/Product';
import Toast from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import Search from '../../components/ui/Search';
import DataTable from '../../components/ui/DataTable';
import MainLayout from '../../layouts/MainLayout';

const columns = [
  { key: 'name', label: 'Nama', sortable: true },
  { key: 'sku', label: 'SKU', sortable: true },
  { key: 'quantity', label: 'Jumlah', sortable: true },
  { key: 'price', label: 'Harga', sortable: true },
];

const getActions = (handleEdit: (product: Product) => void, handleDelete: (id: number) => void) => [
  {
    label: 'Ubah',
    onClick: handleEdit,
    condition: () => !!localStorage.getItem('token'),
  },
  {
    label: 'Hapus',
    onClick: (product: Product) => handleDelete(product.id),
    condition: () => !!localStorage.getItem('token'),
  },
];

const ProductsIndex = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; productId: number | null }>({ isOpen: false, productId: null });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const sortByParam = searchParams.get('sort_by');
  const sortOrderParam = searchParams.get('sort_order') as 'asc' | 'desc';

  const [currentPage, setCurrentPage] = useState(parseInt(pageParam || '1'));
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [sortBy, setSortBy] = useState(sortByParam || '');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(sortOrderParam || 'desc');

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'created') {
      setToast({ message: 'Produk berhasil ditambahkan', type: 'success' });
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('success');
      setSearchParams(newParams);
    } else if (success === 'updated') {
      setToast({ message: 'Produk berhasil diperbarui', type: 'success' });
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('success');
      setSearchParams(newParams);
    }

    fetchProducts();
  }, [currentPage, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    document.title = 'Manajemen Produk - Interview App';
  }, []);

  useEffect(() => {
    if (pageParam) setCurrentPage(parseInt(pageParam));
    if (searchParam !== null) setSearchQuery(searchParam);
    if (sortByParam) setSortBy(sortByParam);
    if (sortOrderParam) setSortOrder(sortOrderParam);
  }, [pageParam, searchParam, sortByParam, sortOrderParam]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts(currentPage, searchQuery, sortBy, sortOrder);
      setProducts(response.data);
      setTotalPages(response.last_page);
      setTotalItems(response.total);
    } catch (err) {
      setToast({ message: 'Gagal memuat produk', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateUrlParams = (params: { page?: number; search?: string; sort_by?: string; sort_order?: 'asc' | 'desc' }) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    updateUrlParams({ search: query, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams({ page });
  };

  const handleSort = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
    updateUrlParams({ sort_by: newSortBy, sort_order: newSortOrder, page: 1 });
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manajemen Produk</h1>
          <div className="flex justify-end">
            {isAuthenticated && (
              <button
                onClick={() => navigate('/products/create')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 w-full sm:w-auto"
              >
                Tambah Produk
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Daftar Produk</h2>
            <div className="w-full sm:w-auto">
              <Search onSearch={handleSearch} />
            </div>
          </div>

          <DataTable
            data={products}
            columns={columns}
            actions={getActions(handleEdit, handleDeleteClick)}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onSort={handleSort}
            loading={loading}
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