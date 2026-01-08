import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';
import { Plus, Minus } from 'lucide-react';

export const DishCard = ({ dish }) => {
    const { cart, addToCart, updateQuantity } = useCart();

    // Check if item is in cart
    const cartItem = cart.find(item => item.id === dish.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 bg-gray-200 w-full object-cover relative">
                {/* Placeholder for image, or use actual image if available */}
                {dish.image_url ? (
                    <img
                        src={dish.image_url}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image' }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
                {dish.availability === 'unavailable' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Unavailable</span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{dish.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{dish.category || 'General'}</p>
                    </div>
                    <span className="text-lg font-bold text-primary-600">₹{dish.price}</span>
                </div>

                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{dish.description}</p>

                <div className="mt-4">
                    {dish.availability === 'available' ? (
                        quantity > 0 ? (
                            <div className="flex items-center justify-center gap-4 bg-primary-50 rounded-lg p-1 border border-primary-100 w-full">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-primary-600 hover:bg-primary-100"
                                    onClick={() => updateQuantity(dish.id, quantity - 1)}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="font-bold text-primary-700 min-w-[20px] text-center">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-primary-600 hover:bg-primary-100"
                                    onClick={() => updateQuantity(dish.id, quantity + 1)}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className="w-full flex items-center justify-center transition-all duration-300 transform active:scale-95"
                                onClick={() => addToCart(dish)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add to Cart
                            </Button>
                        )
                    ) : (
                        <Button className="w-full" disabled>
                            Out of Stock
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
