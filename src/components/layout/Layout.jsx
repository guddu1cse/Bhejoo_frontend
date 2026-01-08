import { Fragment, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';
import {
    ShoppingBag,
    Menu,
    X,
    User,
    LogOut,
    LayoutDashboard,
    Utensils,
    Bell,
    Bike,
    ShoppingCart
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const userLinks = [
        { name: 'Home', href: '/' },
        { name: 'Orders', href: '/orders' },
    ];

    const adminLinks = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Dishes', href: '/admin/dishes', icon: Utensils },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    ];

    const deliveryLinks = [
        { name: 'Dashboard', href: '/delivery/dashboard', icon: LayoutDashboard },
        { name: 'My Deliveries', href: '/delivery/orders', icon: Bike },
    ];

    let links = [];
    if (user?.role === 'admin') links = adminLinks;
    else if (user?.role === 'Delivery Man') links = deliveryLinks;
    else links = userLinks;

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-primary-600">Bhejoo</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={cn(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                                        location.pathname === link.href
                                            ? 'border-primary-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    )}
                                >
                                    {link.icon && <link.icon className="w-4 h-4 mr-2" />}
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user && user.role === 'user' && (
                            <Link to="/cart" className="p-2 text-gray-400 hover:text-gray-500 relative mr-4">
                                <ShoppingCart className="w-6 h-6" />
                                {totalItems > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-600 rounded-full">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/notifications" className="text-gray-500 hover:text-gray-700">
                                    <Bell className="w-5 h-5" />
                                </Link>
                                <span className="text-sm text-gray-700 font-medium">Hello, {user.name}</span>
                                <Button variant="ghost" size="sm" onClick={logout}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button>Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        {/* Cart Icon for Mobile */}
                        {user && user.role === 'user' && (
                            <Link to="/cart" className="p-2 text-gray-400 hover:text-gray-500 relative mr-2">
                                <ShoppingCart className="w-6 h-6" />
                                {totalItems > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-600 rounded-full">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        )}

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden bg-white border-b border-gray-200">
                    <div className="pt-2 pb-3 space-y-1">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={cn(
                                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                                    location.pathname === link.href
                                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div className="flex items-center">
                                    {link.icon && <link.icon className="w-5 h-5 mr-3" />}
                                    {link.name}
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200">
                        {user ? (
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <User className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-500" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                    <Button variant="ghost" className="mt-2 w-full justify-start px-0" onClick={logout}>
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1 px-4">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full">Login</Button>
                                </Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full">Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
