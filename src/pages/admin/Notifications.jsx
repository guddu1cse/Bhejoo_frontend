import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Bell, Check } from 'lucide-react';
import { Button } from '../../components/common/Button';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/admin/notifications');
            const data = response.data.data || response.data;
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching notifications');
        }
    };

    const markAsRead = async (id) => {
        // Implement if API supports simple ID read
        // Docs: PATCH /api/notifications/:id/read
        try {
            await api.patch(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (e) { }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Bell className="w-6 h-6 mr-2" />
                Notifications
            </h1>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                        No notifications
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif._id || notif.id} className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${notif.read ? 'border-gray-300' : 'border-primary-500'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{notif.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{notif.message || notif.description}</p>
                                    <span className="text-xs text-gray-400 mt-2 block">{new Date(notif.createdAt).toLocaleString()}</span>
                                </div>
                                {!notif.read && (
                                    <Button size="sm" variant="ghost" onClick={() => markAsRead(notif._id)}>
                                        <Check className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;
