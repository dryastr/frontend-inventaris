import { useState } from 'react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface Action {
  label: string;
  onClick: (item: any) => void;
  condition?: (item: any) => boolean;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  actions?: Action[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  loading?: boolean;
  showNumbers?: boolean;
}

const DataTable = ({ data, columns, actions = [], currentPage, totalPages, totalItems, onPageChange, onSort, loading = false, showNumbers = true }: DataTableProps) => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalItems);

  const handleSort = (column: string) => {
    const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortOrder(newOrder);
    onSort(column, newOrder);
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-700">
            Menampilkan {startEntry} sampai {endEntry} dari {data.length} entri
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {showNumbers && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                  >
                    {column.label} {column.sortable && sortBy === column.key && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                ))}
                {actions.length > 0 && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={(showNumbers ? 1 : 0) + columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-4 text-center text-gray-500">
                    Memuat...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={(showNumbers ? 1 : 0) + columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id || index}>
                    {showNumbers && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(currentPage - 1) * entriesPerPage + index + 1}</td>}
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {column.key === 'price' ? `Rp ${item[column.key]?.toLocaleString()}` : item[column.key]}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                        {actions.map((action, actionIndex) => (
                          (!action.condition || action.condition(item)) && (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(item)}
                              className={`hover:underline ${action.label.includes('Hapus') ? 'text-red-600 hover:text-red-900' : 'text-indigo-600 hover:text-indigo-900'}`}
                            >
                              {action.label}
                            </button>
                          )
                        ))}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sebelumnya
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, currentPage - 2) + i;
                if (page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 text-sm border rounded ${
                      page === currentPage
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;