import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchProducts, fetchCategories } from '../features/productSlice';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { products, pagination, categories, loading } = useAppSelector(
    (state) => state.products
  );

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'createdAt',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    dispatch(fetchProducts(params));
  }, [dispatch, filters]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: 'createdAt',
    });
    setSearchParams({});
  };

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {filters.category
                ? categories.find((c) => c.slug === filters.category)?.name || 'Products'
                : 'All Products'}
            </h1>
            <p className="text-gray-400 mt-1">{pagination.total} products found</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2 bg-dark-200 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-dark-200 border border-dark-100 rounded-lg hover:border-gold-500 md:hidden"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${
              showFilters ? 'block' : 'hidden'
            } md:block w-full md:w-64 flex-shrink-0`}
          >
            <div className="bg-dark-200 rounded-lg p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-gold-500">
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category.slug}
                        onChange={() => handleFilterChange('category', category.slug)}
                        className="accent-gold-500"
                      />
                      <span className="text-sm text-gray-300">
                        {category.name}
                        <span className="text-gray-500 ml-1">
                          ({category._count?.products || 0})
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-1/2 px-3 py-2 bg-dark-300 border border-dark-100 rounded text-sm focus:outline-none focus:border-gold-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-1/2 px-3 py-2 bg-dark-300 border border-dark-100 rounded text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Active Filters */}
              {Object.values(filters).some((v) => v) && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.category && (
                      <span className="px-3 py-1 bg-gold-500/20 text-gold-500 text-xs rounded-full flex items-center gap-1">
                        {filters.category}
                        <button onClick={() => handleFilterChange('category', '')}>
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {filters.minPrice && (
                      <span className="px-3 py-1 bg-gold-500/20 text-gold-500 text-xs rounded-full flex items-center gap-1">
                        Min: ${filters.minPrice}
                        <button onClick={() => handleFilterChange('minPrice', '')}>
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {filters.maxPrice && (
                      <span className="px-3 py-1 bg-gold-500/20 text-gold-500 text-xs rounded-full flex items-center gap-1">
                        Max: ${filters.maxPrice}
                        <button onClick={() => handleFilterChange('maxPrice', '')}>
                          <X size={12} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-dark-200 rounded-lg" />
                    <div className="mt-4 space-y-2">
                      <div className="h-4 bg-dark-200 rounded w-1/3" />
                      <div className="h-4 bg-dark-200 rounded w-2/3" />
                      <div className="h-4 bg-dark-200 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No products found</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-gold-500 hover:text-gold-600"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', String(i + 1));
                      setSearchParams(params);
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      pagination.page === i + 1
                        ? 'bg-gold-500 text-dark-300'
                        : 'bg-dark-200 hover:bg-dark-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
