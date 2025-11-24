import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/dashboard';
import ProductsIndex from './pages/products/page';
import ProductNew from './pages/products/new';
import ProductEdit from './pages/products/[id]/edit';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;

    if (!token && !['/login', '/register'].includes(currentPath)) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductsIndex />} />
        <Route path="/products/create" element={<ProductNew />} />
        <Route path="/products/:id/edit" element={<ProductEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
