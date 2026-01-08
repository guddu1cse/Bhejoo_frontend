import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Bell, Check } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        fetchNotifications();

        // Listen for real-time updates
        const handleNewNotification = (event) => {
            setNotifications(prev => [event.detail, ...prev]);
        };

        window.addEventListener('notification_received', handleNewNotification);
        return () => window.removeEventListener('notification_received', handleNewNotification);
    }, []);

    const fetchNotifications = async () => {
        try {
            // Endpoint depends on role? 
            // Admin uses /admin/notifications. 
            // User/Delivery uses /notifications (if exists)?
            // Check routes. I suspect I need to check API endpoints.
            // Defaulting to /api/notifications which usually maps to generic get user notifications
            const endpoint = user.role === 'admin' ? '/admin/notifications' : '/notifications';
            const response = await api.get(endpoint);
            const data = response.data.data || response.data;
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching notifications', error);
            // Fallback or empty
            setNotifications([]);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id || n._id === id ? { ...n, read: true } : n));
        } catch (e) {
            console.error('Failed to mark read', e);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Bell className="w-6 h-6 mr-2" />
                Your Notifications
            </h1>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                        No notifications
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif._id || notif.id} className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${notif.read ? 'border-gray-300' : 'border-primary-500'} transition-all`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{notif.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{notif.message || notif.description}</p>
                                    <span className="text-xs text-gray-400 mt-2 block">{new Date(notif.createdAt).toLocaleString()}</span>
                                </div>
                                {!notif.read && (
                                    <Button size="sm" variant="ghost" onClick={() => markAsRead(notif._id || notif.id)} title="Mark as read">
                                        <Check className="w-4 h-4 text-green-600" />
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

export default Notifications;
