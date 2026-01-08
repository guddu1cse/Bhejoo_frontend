import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { DishCard } from '../../components/user/DishCard';
import { DishSkeleton } from '../../components/user/DishSkeleton';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Search, Loader, Store, Plus, ArrowRight } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchDishes();
    }, []);

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300); // 300ms delay

        return () => clearTimeout(handler);
    }, [searchQuery]);

    const fetchDishes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/dishes');
            const data = response.data.data || response.data;
            setDishes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching dishes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDishes = dishes.filter((dish) => {
        const matchesSearch = dish.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            dish.description?.toLowerCase().includes(debouncedQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Group dishes by restaurant
    const groupedDishes = filteredDishes.reduce((acc, dish) => {
        const restaurantId = dish.restaurant_id;
        if (!acc[restaurantId]) {
            acc[restaurantId] = {
                name: dish.restaurant_name,
                location: dish.restaurant_location,
                dishes: []
            };
        }
        acc[restaurantId].dishes.push(dish);
        return acc;
    }, {});

    const categories = ['All', ...new Set(dishes.map((d) => d.category).filter(Boolean))];

    return (
        <div className="space-y-6">
            {user?.role?.toLowerCase() === 'admin' && !user?.mapped_restaurant && (
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 text-white shadow-xl shadow-primary-100 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <Store className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider opacity-90">Partner with Bhejoo</span>
                        </div>
                        <h2 className="text-3xl font-black mb-2">Grow your business with us!</h2>
                        <p className="text-primary-100 font-medium max-w-lg">
                            You haven't added your restaurant yet. Start reaching thousands of customers by setting up your store today.
                        </p>
                    </div>
                    <Link to="/admin/add-restaurant" className="relative z-10 whitespace-nowrap">
                        <Button className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-6 text-lg font-bold flex items-center gap-2 group shadow-lg">
                            Add Your Restaurant
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>

                    {/* Decorative elements */}
                    <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Store className="w-64 h-64" />
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Explore Dishes</h1>
                    <p className="text-gray-500">Find the best food from top restaurants</p>
                </div>
                <div className="w-full md:w-96 relative">
                    <Input
                        placeholder="Search for dishes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-12">
                    {[1, 2].map((group) => (
                        <div key={group} className="space-y-6">
                            <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {[1, 2, 3, 4].map((i) => (
                                    <DishSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-16">
                    {Object.keys(groupedDishes).length > 0 ? (
                        Object.entries(groupedDishes).map(([resId, group]) => (
                            <section key={resId} className="relative">
                                <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm py-4 mb-6 border-b border-gray-200">
                                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{group.name}</h2>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-semibold mr-2">Featured Restaurant</span>
                                        {group.location}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {group.dishes.map((dish) => (
                                        <DishCard key={dish.id} dish={dish} highlight={searchQuery} />
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-xl text-gray-500 font-medium">No dishes found matching your search.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All') }}
                                className="mt-4 text-primary-600 font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
