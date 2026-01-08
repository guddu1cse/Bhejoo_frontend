import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/delivery/orders');
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-64">
            <p>Redirecting to orders...</p>
        </div>
    );
};

export default DeliveryDashboard;
