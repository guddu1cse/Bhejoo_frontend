import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Utensils, ShoppingBag, Bell, Store, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const hasRestaurant = !!user?.mapped_restaurant;

    const cards = [
        {
            name: 'Manage Dishes',
            icon: Utensils,
            href: '/admin/dishes',
            color: 'bg-blue-500',
            disabled: !hasRestaurant
        },
        {
            name: 'Manage Orders',
            icon: ShoppingBag,
            href: '/admin/orders',
            color: 'bg-purple-500',
            disabled: !hasRestaurant
        },
        {
            name: 'Notifications',
            icon: Bell,
            href: '/admin/notifications',
            color: 'bg-yellow-500'
        },
    ];

    if (!hasRestaurant) {
        cards.unshift({
            name: 'Setup Restaurant',
            icon: Store,
            href: '/admin/add-restaurant',
            color: 'bg-green-600',
            urgent: true
        });
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Dashboard</h1>
            {user?.role === 'admin' && !hasRestaurant && (
                <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-amber-100 p-2 rounded-lg">
                        <Store className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-amber-800">No Restaurant Assigned</h2>
                        <p className="text-amber-700">
                            You haven't setup your restaurant yet. Please click <span className="font-bold underline cursor-pointer" onClick={() => navigate('/admin/add-restaurant')}>Setup Restaurant</span> to start managing your kitchen.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <Link
                        key={card.name}
                        to={card.disabled ? '#' : card.href}
                        className={`bg-white overflow-hidden shadow-sm rounded-lg transition-all duration-300 ${card.disabled
                            ? 'opacity-50 cursor-not-allowed grayscale'
                            : 'hover:shadow-md hover:-translate-y-1'
                            } ${card.urgent ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
                    >
                        <div className="p-6 flex items-center">
                            <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                                <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">{card.name}</h3>
                                {card.disabled ? (
                                    <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                                        <Plus className="w-3 h-3 rotate-45" /> Profile Setup Required
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-500">View and manage {card.name.toLowerCase()}</p>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
