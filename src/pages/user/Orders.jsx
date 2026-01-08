import { useState, useEffect } from 'react';
import api from '../../services/api';
import { RefreshCw, MapPin } from 'lucide-react';
import { Button } from '../../components/common/Button';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/user/orders');
            const data = response.data.data || response.data;
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        preparing: 'bg-indigo-100 text-indigo-800',
        packed: 'bg-purple-100 text-purple-800',
        assigned: 'bg-orange-100 text-orange-800',
        picked_up: 'bg-teal-100 text-teal-800',
        on_the_way: 'bg-cyan-100 text-cyan-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
                <Button onClick={fetchOrders} variant="secondary" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="space-y-6">
                {orders.length === 0 && !loading ? (
                    <p className="text-gray-500 text-center py-12">No orders found.</p>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(order.created_at || Date.now()).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary-600">₹{order.total_amount}</p>
                                </div>
                            </div>

                            <div className="border-t border-b border-gray-50 py-4 mb-4">
                                <ul className="space-y-2">
                                    {Array.isArray(order.dishes) && order.dishes.map((d, i) => (
                                        <li key={i} className="flex justify-between text-sm text-gray-700">
                                            <span>{d.quantity} x {d.dish_name}</span>
                                            <span className="font-medium">₹{d.price * d.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="text-sm text-gray-600">
                                <p className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                    {order.delivery_address}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserOrders;
