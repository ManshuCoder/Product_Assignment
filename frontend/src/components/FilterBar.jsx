const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Rating: High to Low' },
  { value: 'rating_asc', label: 'Rating: Low to High' },
  { value: 'name_asc', label: 'Name: A-Z' },
];

const FilterBar = ({ filters, onChange, onReset }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({ ...filters, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group search-group">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Search by product name..."
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="sort">Sort By</label>
        <select id="sort" name="sort" value={filters.sort} onChange={handleChange}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="maxPrice">Max Price ($)</label>
        <input
          id="maxPrice"
          name="maxPrice"
          type="number"
          min="0"
          placeholder="e.g. 500"
          value={filters.maxPrice}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="minRating">Min Rating</label>
        <input
          id="minRating"
          name="minRating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          placeholder="e.g. 4"
          value={filters.minRating}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group checkbox-group">
        <label className="checkbox-label">
          <input
            name="featured"
            type="checkbox"
            checked={filters.featured}
            onChange={handleChange}
          />
          Featured only
        </label>
      </div>

      <button type="button" className="btn btn-ghost" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  );
};

export default FilterBar;
