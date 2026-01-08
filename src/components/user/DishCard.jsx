import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const DishCard = ({ dish }) => {
    const { addToCart } = useCart();

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
                        <Button
                            className="w-full flex items-center justify-center"
                            onClick={() => addToCart(dish)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Cart
                        </Button>
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
