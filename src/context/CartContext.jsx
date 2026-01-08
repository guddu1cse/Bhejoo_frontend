import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (dish) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === dish.id);

            // Check for restaurant mismatch
            if (prevCart.length > 0 && prevCart[0].restaurant_id !== dish.restaurant_id) {
                const confirmClear = window.confirm(
                    "Your cart contains items from another restaurant. Do you want to clear your cart and add this item?"
                );
                if (!confirmClear) return prevCart;
                return [{ ...dish, quantity: 1 }];
            }

            if (existingItem) {
                toast.success(`Updated quantity for ${dish.name}`);
                return prevCart.map((item) =>
                    item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            toast.success(`Added ${dish.name} to cart`);
            return [...prevCart, { ...dish, quantity: 1 }];
        });
    };

    const removeFromCart = (dishId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== dishId));
        toast.success('Removed from cart');
    };

    const updateQuantity = (dishId, quantity) => {
        if (quantity < 1) {
            removeFromCart(dishId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === dishId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalAmount,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
