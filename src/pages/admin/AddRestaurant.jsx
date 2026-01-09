import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Store, MapPin, Phone, FileText } from 'lucide-react';
import { Loader } from '../../components/common/Loader';

const AddRestaurant = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        phone: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await api.post('/restaurants', formData);
            toast.success('Restaurant created successfully!');

            // Note: We need to update the local user object since mapped_restaurant changed
            const updatedUser = { ...user, mapped_restaurant: response.data.data.restaurantId };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // Force a reload or update context if possible, but redirecting to dashboard is safer
            navigate('/admin/dashboard');
            window.location.reload(); // Quick way to sync auth state
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create restaurant');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            {loading && <Loader fullPage />}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-primary-600 p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Store className="w-8 h-8" />
                        <h1 className="text-3xl font-black tracking-tight">Setup Your Restaurant</h1>
                    </div>
                    <p className="text-primary-100 font-medium">Get started by providing your restaurant details</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Store className="w-4 h-4 text-primary-500" />
                                Restaurant Name
                            </label>
                            <Input
                                required
                                placeholder="e.g. Delicious Delights"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary-500" />
                                Location
                            </label>
                            <Input
                                required
                                placeholder="e.g. 123 Food Street, Downtown"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-primary-500" />
                                    Phone Number
                                </label>
                                <Input
                                    required
                                    type="tel"
                                    placeholder="e.g. +91 9876543210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary-500" />
                                    Category / Status
                                </label>
                                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm font-medium">
                                    Active (Auto-set)
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary-500" />
                                Description
                            </label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none min-h-[100px]"
                                placeholder="Describe your restaurant..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full py-4 text-lg font-bold shadow-lg shadow-primary-200"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Restaurant'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRestaurant;
