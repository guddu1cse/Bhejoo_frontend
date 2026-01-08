import { useState, useEffect } from 'react';
import api from '../../services/api';
import { DishCard } from '../../components/user/DishCard';
import { Input } from '../../components/common/Input';
import { Search, Loader } from 'lucide-react';

const Home = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/dishes');
            // API documentation says /api/dishes returns "data" array directly or inside "data" key?
            // Based on docs: GET /api/dishes -> response structure wasn't explicitly shown for LIST, but usually it's standard.
            // Assuming response.data.data or response.data if it's an array.
            // Let's assume response.data.data based on other endpoints description.
            // Wait, looking at docs: GET /api/restaurants/:id/dishes -> returns dishes.
            // GET /api/dishes -> "Get All Available Dishes".
            // Docs for Register: response.data is the object user+token.
            // I will assume response.data.data first, if undef then response.data.

            const data = response.data.data || response.data;
            setDishes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching dishes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDishes = dishes.filter((dish) => {
        const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dish.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(dishes.map((d) => d.category).filter(Boolean))];

    return (
        <div className="space-y-6">
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
                    <Search className="absolute left-3 top-9 md:top-3 text-gray-400 w-5 h-5 translate-y-[2px]" />
                    {/* Note: Input has a label prop which adds a div wrapper. My logic for absolute positioning might be slightly off due to label wrapper. 
              Let's adjust Input usage or styling. For now standard Input usage. */}
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
                <div className="flex justify-center py-12">
                    <Loader className="w-8 h-8 text-primary-600 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDishes.length > 0 ? (
                        filteredDishes.map((dish) => (
                            <DishCard key={dish.id} dish={dish} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No dishes found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
