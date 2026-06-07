import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">◆</span>
        ProductHub
      </Link>

      {isAuthenticated && (
        <div className="navbar-links">
          <Link to="/products">Products</Link>
          <Link to="/products/add" className="btn btn-primary btn-sm">
            + Add Product
          </Link>
          <div className="navbar-user">
            <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
            <span className="user-name">{user?.name}</span>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
