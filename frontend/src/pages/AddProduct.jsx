import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductForm from '../components/ProductForm';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await productAPI.create(data);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container narrow">
      <div className="page-header">
        <h1>Add New Product</h1>
        <p className="page-subtitle">Fill in the details to add a product to your catalog</p>
      </div>

      <div className="form-card">
        <ProductForm onSubmit={handleSubmit} loading={loading} submitLabel="Add Product" />
      </div>
    </div>
  );
};

export default AddProduct;
