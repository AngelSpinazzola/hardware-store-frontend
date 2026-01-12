import { PRODUCTS_CONFIG } from '../../config/productsConfig';

const LoadingState = () => (
    <div className={PRODUCTS_CONFIG.GRID_CLASSES.BASE + ' ' + PRODUCTS_CONFIG.GRID_CLASSES.RESPONSIVE}>
        {[...Array(PRODUCTS_CONFIG.SKELETON_ITEMS.DESKTOP)].map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
        ))}
    </div>
);

export default LoadingState;