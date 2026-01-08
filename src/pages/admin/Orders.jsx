import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { RefreshCw, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/orders');
            const data = response.data.data || response.data;
            // Sort by latest
            const sorted = (Array.isArray(data) ? data : []).sort((a, b) => b.id - a.id);
            setOrders(sorted);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleAutoAssign = async (orderId) => {
        try {
            await api.post(`/orders/${orderId}/auto-assign-delivery`);
            toast.success('Delivery man assigned successfully');
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to assign delivery');
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

    const statusOptions = [
        'pending', 'confirmed', 'preparing', 'packed', 'cancelled'
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
                <Button onClick={fetchOrders} variant="secondary">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>{order.user_id}</div>
                                    {/* Ideally fetch user name, but backend might not send it. API Docs: GET /api/admin/orders usually returns user object or id? 
                      Docs don't specify deep structure. I will assume ID or basic details. */}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <ul className="list-disc pl-4">
                                        {/* Check if dishes is array */}
                                        {Array.isArray(order.dishes) && order.dishes.map((d, i) => (
                                            <li key={i}>{d.quantity}x {d.dish_name || 'Item'}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.total_amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {/* Status Dropdown */}
                                    <select
                                        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                        disabled={order.status === 'delivered' || order.status === 'cancelled'}
                                    >
                                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                        <option value="delivered" disabled>delivered</option>
                                    </select>

                                    {/* Auto Assign Delivery */}
                                    {order.status === 'packed' && !order.delivery_man_id && (
                                        <Button size="sm" onClick={() => handleAutoAssign(order.id)}>
                                            <Truck className="w-4 h-4 mr-1" />
                                            Assign
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
