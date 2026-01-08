import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';
import { Plus, Minus } from 'lucide-react';

export const DishCard = ({ dish, highlight = '' }) => {
    const { cart, addToCart, updateQuantity } = useCart();

    // Check if item is in cart
    const cartItem = cart.find(item => item.id === dish.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const isNonVeg = dish.category?.toLowerCase().includes('non-veg') ||
        dish.category?.toLowerCase() === 'nonveg' ||
        dish.category?.toLowerCase() === 'egg';

    const highlightText = (text) => {
        if (!highlight || !text) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase()
                ? <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">{part}</mark>
                : part
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 group">
            <div className="h-48 bg-gray-100 w-full overflow-hidden relative">
                {/* Veg/Non-Veg Indicator */}
                <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm p-1 rounded border border-gray-200 shadow-sm">
                    <div className={`w-3 h-3 rounded-full border-2 ${isNonVeg ? 'border-red-600 bg-red-600' : 'border-green-600 bg-green-600'}`}>
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>

                {dish.image_url ? (
                    <img
                        src={dish.image_url}
                        alt={dish.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Delicious+Food' }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                        No Image
                    </div>
                )}
                {dish.availability === 'unavailable' && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-white text-gray-900 px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">Sold Out</span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">{highlightText(dish.name)}</h3>
                        <p className="text-sm text-gray-400 mt-0.5 font-medium">{dish.category || 'General'}</p>
                    </div>
                    <span className="text-xl font-black text-primary-600 tracking-tight">₹{dish.price}</span>
                </div>

                <p className="mt-3 text-sm text-gray-500 line-clamp-2 leading-relaxed h-10">{highlightText(dish.description)}</p>

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
