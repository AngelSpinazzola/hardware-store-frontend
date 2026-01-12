import { ProductSummary, ProductStatus } from '../../../types/product.types';
import StatsCard from '../Dashboard/StatsCard';
import {
    CubeIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface ProductsStatsProps {
    products: ProductSummary[];
}

export default function ProductsStats({ products }: ProductsStatsProps) {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === ProductStatus.Active).length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <StatsCard
                title="Total productos"
                value={totalProducts}
                icon={<CubeIcon className="w-full h-full" />}
            />
            <StatsCard
                title="Productos activos"
                value={activeProducts}
                icon={<CheckCircleIcon className="w-full h-full" />}
            />
            <StatsCard
                title="Stock bajo"
                value={lowStockProducts}
                icon={<ExclamationTriangleIcon className="w-full h-full" />}
            />
            <StatsCard
                title="Valor inventario"
                value={`$${totalValue.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`}
                icon={<CurrencyDollarIcon className="w-full h-full" />}
            />
        </div>
    );
}