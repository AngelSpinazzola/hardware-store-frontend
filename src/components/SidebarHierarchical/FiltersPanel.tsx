import SortFilter from '../SortFilter';
import CategoryBrandFilter from '../CategoryBrandFilter';
import PriceRangeFilter from '../PriceRangeFilter';
import { ProductSummary } from '@/types/product.types';
import { SortOption } from './types';

interface FiltersPanelProps {
    allProducts: ProductSummary[];
    selectedCategory: string | null;
    selectedSubcategory: string | null;
    selectedBrand: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    sortBy: SortOption;
    onBrandChange: (brand: string | null) => void;
    onPriceChange: (min: number | null, max: number | null) => void;
    onSortChange: (sortBy: SortOption) => void;
}

const FiltersPanel = ({
    allProducts,
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    minPrice,
    maxPrice,
    sortBy,
    onBrandChange,
    onPriceChange,
    onSortChange
}: FiltersPanelProps) => {
    return (
        <div className="space-y-1">
            <SortFilter sortBy={sortBy} onSortChange={onSortChange} />
            <CategoryBrandFilter
                allProducts={allProducts}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                selectedBrand={selectedBrand}
                onBrandChange={onBrandChange}
            />
            <PriceRangeFilter
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={onPriceChange}
                allProducts={allProducts}
                selectedCategory={selectedCategory}
            />
        </div>
    );
};

export default FiltersPanel;
