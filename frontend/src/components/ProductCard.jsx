import { Link } from 'react-router-dom';

const ProductCard = ({ product, onDelete }) => {
  const rating = product.rating != null ? Number(product.rating).toFixed(1) : 'N/A';

  return (
    <article className={`product-card ${product.featured ? 'featured' : ''}`}>
      {product.featured && <span className="featured-badge">Featured</span>}

      <div className="product-card-header">
        <span className="product-id">{product.productId}</span>
        <div className="product-rating">
          <span className="star">★</span> {rating}
        </div>
      </div>

      <h3 className="product-name">{product.name}</h3>
      <p className="product-company">{product.company}</p>

      <div className="product-card-footer">
        <span className="product-price">${Number(product.price).toFixed(2)}</span>
        <div className="product-actions">
          <Link to={`/products/edit/${product._id}`} className="btn btn-ghost btn-sm">
            Edit
          </Link>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(product._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
