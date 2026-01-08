import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import environment from '../environment';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (user) {
            // Initialize socket connection
            // Extract base URL without /api suffix
            const socketUrl = environment.apiBaseUrl.replace('/api', '');
            const newSocket = io(socketUrl, {
                transports: ['websocket'],
                autoConnect: true
            });

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                newSocket.emit('join', user.id);
            });

            newSocket.on('new_notification', (notification) => {
                console.log('New real-time notification:', notification);

                // Custom toast for 5 seconds as requested
                toast.success(
                    (t) => (
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">{notification.title}</span>
                            <span className="text-xs text-gray-600">{notification.description}</span>
                        </div>
                    ),
                    {
                        duration: 5000,
                        position: 'top-right',
                    }
                );

                // Dispatch an event so other components can refresh their lists if needed
                window.dispatchEvent(new CustomEvent('notification_received', { detail: notification }));
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        } else if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
