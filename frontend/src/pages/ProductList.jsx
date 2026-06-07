import { useState, useEffect, useCallback } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const defaultFilters = {
  search: '',
  sort: 'newest',
  maxPrice: '',
  minRating: '',
  featured: false,
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = { page, limit: 9, sort: filters.sort };
      if (filters.search) params.search = filters.search;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.featured) params.featured = 'true';

      const res = await productAPI.getAll(params);
      setProducts(res.data.data.products);
      setMeta(res.data.meta);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setDeleteId(id);
    try {
      await productAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      if (meta) setMeta({ ...meta, total: meta.total - 1 });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Product Catalog</h1>
          <p className="page-subtitle">
            Browse, filter, and manage your entire product inventory
          </p>
        </div>
        {meta && (
          <div className="stats-badge">
            <span className="stats-number">{meta.total}</span>
            <span className="stats-label">Total Products</span>
          </div>
        )}
      </div>

      <FilterBar filters={filters} onChange={handleFilterChange} onReset={handleReset} />

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <LoadingSpinner message="Loading products..." />
      ) : products.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h3>No products found</h3>
          <p>Try adjusting your filters or add a new product.</p>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleDelete}
                deleting={deleteId === product._id}
              />
            ))}
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default ProductList;
