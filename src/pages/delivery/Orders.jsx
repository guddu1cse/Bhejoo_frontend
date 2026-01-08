import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { RefreshCw, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const DeliveryOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // api points to /api already
            const res = await api.get('/delivery/orders');
            const data = res.data.data || res.data;
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(`Failed to load orders: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.put(`/delivery/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const statusColors = {
        assigned: 'bg-orange-100 text-orange-800',
        picked_up: 'bg-teal-100 text-teal-800',
        on_the_way: 'bg-cyan-100 text-cyan-800',
        delivered: 'bg-green-100 text-green-800',
    };

    const activeStatuses = ['pending', 'confirmed', 'preparing', 'packed', 'assigned', 'picked_up', 'on_the_way'];
    const historyStatuses = ['delivered', 'cancelled'];

    const filteredOrders = orders.filter(o =>
        activeTab === 'active' ? activeStatuses.includes(o.status) : historyStatuses.includes(o.status)
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Deliveries</h1>
                <Button onClick={fetchOrders} variant="secondary">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'active'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    onClick={() => setActiveTab('active')}
                >
                    Active Orders
                </button>
                <button
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'history'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    onClick={() => setActiveTab('history')}
                >
                    History
                </button>
            </div>

            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No {activeTab} orders found.</p>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-lg font-bold text-gray-900">₹{order.total_amount}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Delivery Address</p>
                                    <p className="text-sm text-gray-900 flex items-start mt-1">
                                        <MapPin className="w-4 h-4 mr-1 text-gray-400 mt-0.5 flex-shrink-0" />
                                        {order.delivery_address}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Restaurant</p>
                                    <p className="text-sm text-gray-900 mt-1">
                                        {/* Restaurant Name if available in order object, otherwise just ID */}
                                        {order.restaurant_name || `Restaurant #${order.restaurant_id}`}
                                    </p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Items</p>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    {Array.isArray(order.dishes) && order.dishes.map((d, i) => (
                                        <li key={i} className="flex justify-between">
                                            <span>{d.quantity}x {d.dish_name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Actions */}
                            {activeTab === 'active' && (
                                <div className="flex space-x-3 pt-4 border-t border-gray-100">
                                    {(order.status === 'assigned' || order.status === 'packed') && (
                                        <Button className="w-full" onClick={() => handleStatusUpdate(order.id, 'picked_up')}>
                                            Pick Up Order
                                        </Button>
                                    )}
                                    {order.status === 'picked_up' && (
                                        <Button className="w-full" onClick={() => handleStatusUpdate(order.id, 'on_the_way')}>
                                            Start Delivery
                                        </Button>
                                    )}
                                    {order.status === 'on_the_way' && (
                                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(order.id, 'delivered')}>
                                            Complete Delivery
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DeliveryOrders;
