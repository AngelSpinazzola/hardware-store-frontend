interface LoadingSkeletonProps {
    count?: number;
}

const SkeletonCard = () => (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden animate-pulse">
        <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300"></div>
        <div className="p-6 space-y-4">
            <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            </div>
        </div>
    </div>
);

const LoadingSkeleton = ({ count = 8 }: LoadingSkeletonProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[...Array(count)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
};

export default LoadingSkeleton;