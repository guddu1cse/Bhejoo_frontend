import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CartSummaryBar = () => {
    const { totalItems, totalAmount } = useCart();
    const { pathname } = useLocation();

    if (pathname === '/cart') return null;

    return (
        <AnimatePresence>
            {totalItems > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none"
                >
                    <Link
                        to="/cart"
                        className="pointer-events-auto bg-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between w-full max-w-2xl hover:bg-primary-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold opacity-90 leading-tight">
                                    {totalItems} {totalItems === 1 ? 'Item' : 'Items'} added
                                </p>
                                <p className="text-xl font-black">
                                    ₹{totalAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 font-bold text-sm tracking-wide uppercase">
                            View Cart
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
