import { Link } from 'react-router-dom';
import { LayoutDashboard, Utensils, ShoppingBag, Bell } from 'lucide-react';

const AdminDashboard = () => {
    const cards = [
        { name: 'Manage Dishes', icon: Utensils, href: '/admin/dishes', color: 'bg-blue-500' },
        { name: 'Manage Orders', icon: ShoppingBag, href: '/admin/orders', color: 'bg-purple-500' },
        { name: 'Notifications', icon: Bell, href: '/admin/notifications', color: 'bg-yellow-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <Link
                        key={card.name}
                        to={card.href}
                        className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="p-6 flex items-center">
                            <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                                <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">{card.name}</h3>
                                <p className="text-sm text-gray-500">View and manage {card.name.toLowerCase()}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
