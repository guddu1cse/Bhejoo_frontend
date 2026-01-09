import { Loader2 } from 'lucide-react';

export const Loader = ({ size = 'md', fullPage = false, className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const loader = (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-primary-600`} />
            {fullPage && (
                <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
            )}
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
                {loader}
            </div>
        );
    }

    return loader;
};

export default Loader;
