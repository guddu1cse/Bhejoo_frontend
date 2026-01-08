export const DishSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200 w-full" />
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-12" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
                <div className="mt-4 pt-2">
                    <div className="h-10 bg-gray-200 rounded-lg w-full" />
                </div>
            </div>
        </div>
    );
};
