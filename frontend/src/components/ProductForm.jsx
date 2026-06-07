import { useState } from 'react';
import { validateProduct } from '../utils/validators';

const initialForm = {
  productId: '',
  name: '',
  price: '',
  featured: false,
  rating: '',
  company: '',
  createdAt: new Date().toISOString().split('T')[0],
};

const ProductForm = ({ onSubmit, loading, submitLabel = 'Add Product', initialData = null }) => {
  const [form, setForm] = useState(
    initialData
      ? {
          productId: initialData.productId || '',
          name: initialData.name || '',
          price: initialData.price ?? '',
          featured: initialData.featured || false,
          rating: initialData.rating ?? '',
          company: initialData.company || '',
          createdAt: initialData.createdAt
            ? new Date(initialData.createdAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        }
      : initialForm
  );
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateProduct(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = {
        productId: form.productId.trim().toUpperCase(),
        name: form.name.trim(),
        price: Number(form.price),
        featured: form.featured,
        company: form.company.trim(),
        createdAt: new Date(form.createdAt).toISOString(),
      };

      if (form.rating !== '') payload.rating = Number(form.rating);

      await onSubmit(payload);
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      setApiError(message);

      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      {apiError && <div className="alert alert-error">{apiError}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="productId">Product ID *</label>
          <input
            id="productId"
            name="productId"
            type="text"
            placeholder="e.g. PROD-001"
            value={form.productId}
            onChange={handleChange}
            className={errors.productId ? 'input-error' : ''}
          />
          {errors.productId && <span className="field-error">{errors.productId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Wireless Headphones"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($) *</label>
          <input
            id="price"
            name="price"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 149.99"
            value={form.price}
            onChange={handleChange}
            className={errors.price ? 'input-error' : ''}
          />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating (0-5)</label>
          <input
            id="rating"
            name="rating"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 4.5"
            value={form.rating}
            onChange={handleChange}
            className={errors.rating ? 'input-error' : ''}
          />
          {errors.rating && <span className="field-error">{errors.rating}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="company">Company *</label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="e.g. SoundTech"
            value={form.company}
            onChange={handleChange}
            className={errors.company ? 'input-error' : ''}
          />
          {errors.company && <span className="field-error">{errors.company}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="createdAt">Created Date *</label>
          <input
            id="createdAt"
            name="createdAt"
            type="date"
            value={form.createdAt}
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox-group full-width">
          <label className="checkbox-label">
            <input
              name="featured"
              type="checkbox"
              checked={form.featured}
              onChange={handleChange}
            />
            Mark as featured product
          </label>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default ProductForm;
