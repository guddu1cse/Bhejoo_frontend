import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import nprogress from 'nprogress';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import Home from './pages/user/Home';
import Cart from './pages/user/Cart';
import Orders from './pages/user/Orders';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminDishes from './pages/admin/Dishes';
import AdminOrders from './pages/admin/Orders';
import AdminNotifications from './pages/admin/Notifications';
import AddRestaurant from './pages/admin/AddRestaurant';

// Delivery Pages
import DeliveryDashboard from './pages/delivery/Dashboard';
import DeliveryOrders from './pages/delivery/Orders';
import Notifications from './pages/common/Notifications';

// Route Progress Component
const RouteProgress = () => {
  const location = useLocation();

  useEffect(() => {
    nprogress.start();
    const timer = setTimeout(() => {
      nprogress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      nprogress.done();
    };
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <RouteProgress />
      <AuthProvider>
        <SocketProvider>
          <CartProvider>
            <Toaster position="top-right" />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Routes */}
              <Route element={<Layout><ProtectedRoute allowedRoles={['user']} /></Layout>}>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<Layout><ProtectedRoute allowedRoles={['admin']} /></Layout>}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/dishes" element={<AdminDishes />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/add-restaurant" element={<AddRestaurant />} />
              </Route>

              {/* Shared Routes */}
              <Route element={<Layout><ProtectedRoute allowedRoles={['user', 'admin', 'Delivery Man']} /></Layout>}>
                <Route path="/notifications" element={<Notifications />} />
              </Route>

              {/* Delivery Routes */}
              <Route element={<Layout><ProtectedRoute allowedRoles={['Delivery Man']} /></Layout>}>
                <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
                <Route path="/delivery/orders" element={<DeliveryOrders />} />
              </Route>

              {/* Default redirect for unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
