import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select'; // Assuming I have this or use native
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDishes = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDish, setEditingDish] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        availability: 'available'
    });

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/dishes');
            const data = response.data.data || response.data;
            setDishes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching dishes:', error);
            toast.error('Failed to load dishes');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDish) {
                await api.put(`/admin/dishes/${editingDish.id}`, formData);
                toast.success('Dish updated successfully');
            } else {
                await api.post('/admin/dishes', formData);
                toast.success('Dish created successfully');
            }
            setShowModal(false);
            fetchDishes();
            resetForm();
        } catch (error) {
            console.error('Error saving dish:', error);
            toast.error(error.response?.data?.message || 'Failed to save dish');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this dish?')) return;
        try {
            await api.delete(`/admin/dishes/${id}`);
            toast.success('Dish deleted successfully');
            fetchDishes();
        } catch (error) {
            toast.error('Failed to delete dish');
        }
    };

    const handleToggleAvailability = async (dish) => {
        try {
            const newStatus = dish.availability === 'available' ? 'unavailable' : 'available';
            await api.patch(`/admin/dishes/${dish.id}/availability`, { availability: newStatus });
            toast.success(`Dish marked as ${newStatus}`);
            fetchDishes();
        } catch (error) {
            toast.error('Failed to update availability');
        }
    };

    const openEditModal = (dish) => {
        setEditingDish(dish);
        setFormData({
            name: dish.name,
            description: dish.description,
            price: dish.price,
            category: dish.category,
            image_url: dish.image_url,
            availability: dish.availability
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingDish(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            image_url: '',
            availability: 'available'
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Dishes</h1>
                <Button onClick={() => { resetForm(); setShowModal(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Dish
                </Button>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dish</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {dishes.map((dish) => (
                            <tr key={dish.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {dish.image_url && (
                                            <img className="h-10 w-10 rounded-full object-cover mr-3" src={dish.image_url} alt="" />
                                        )}
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{dish.name}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{dish.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dish.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{dish.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleToggleAvailability(dish)}
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dish.availability === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {dish.availability === 'available' ? 'Available' : 'Unavailable'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openEditModal(dish)} className="text-primary-600 hover:text-primary-900 mr-4">
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(dish.id)} className="text-red-600 hover:text-red-900">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        {editingDish ? 'Edit Dish' : 'Add New Dish'}
                                    </h3>
                                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form id="dish-form" onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        label="Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                    <Input
                                        label="Price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    />
                                    <Input
                                        label="Image URL"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                                        <select
                                            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            value={formData.availability}
                                            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                        >
                                            <option value="available">Available</option>
                                            <option value="unavailable">Unavailable</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <Button type="submit" form="dish-form" className="w-full sm:ml-3 sm:w-auto">
                                    Save
                                </Button>
                                <Button variant="secondary" onClick={() => setShowModal(false)} className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDishes;
