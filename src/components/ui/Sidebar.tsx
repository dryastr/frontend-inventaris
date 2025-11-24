import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Package, LogOut, LogIn } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/products', label: 'Produk', icon: Package },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 fixed left-0 top-0 h-screen flex flex-col">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="absolute bottom-8 left-0 right-0 px-4">
        {token ? (
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Keluar
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"
          >
            <LogIn className="mr-3 h-5 w-5" />
            Masuk
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;