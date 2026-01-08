import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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

// Delivery Pages
import DeliveryDashboard from './pages/delivery/Dashboard';
import DeliveryOrders from './pages/delivery/Orders';
import Notifications from './pages/common/Notifications';

function App() {
  return (
    <Router>
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
