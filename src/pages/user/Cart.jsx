import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!address.trim()) {
            toast.error('Please enter a delivery address');
            return;
        }

        if (cart.length === 0) return;

        setLoading(true);
        try {
            const restaurantId = cart[0].restaurant_id;
            const orderData = {
                restaurant_id: restaurantId,
                dishes: cart.map(item => ({
                    dish_id: item.id,
                    quantity: item.quantity
                })),
                delivery_address: address
            };

            await api.post('/orders', orderData);
            toast.success('Order placed successfully!');
            clearCart();
            navigate('/orders');
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/">
                    <Button>Start Browsing</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <Link to="/" className="text-gray-500 hover:text-primary-600 mr-4">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {item.image_url && (
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                        onError={(e) => { e.target.src = 'https://placehold.co/100?text=Food' }}
                                    />
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                    <p className="text-primary-600 font-bold">₹{item.price}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button
                                        className="p-1 hover:bg-gray-100"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-3 font-medium">{item.quantity}</span>
                                    <button
                                        className="p-1 hover:bg-gray-100"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery Fee</span>
                            <span>₹0.00</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Address</h3>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                            rows="3"
                            placeholder="Enter your full address here..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? 'Placing Order...' : 'Place Order (COD)'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
