import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductForm from '../components/ProductForm';
import LoadingSpinner from '../components/LoadingSpinner';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    productAPI
      .getById(id)
      .then((res) => setProduct(res.data.data.product))
      .catch((err) => setError(err.response?.data?.message || 'Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await productAPI.update(id, data);
      navigate('/products');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading product..." />;
  if (error) return <div className="alert alert-error page-container">{error}</div>;

  return (
    <div className="page-container narrow">
      <div className="page-header">
        <h1>Edit Product</h1>
        <p className="page-subtitle">Update product details for {product.name}</p>
      </div>

      <div className="form-card">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditProduct;
