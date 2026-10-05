import { Link, useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';
import api from '../services/api';
import './Navbar.scss';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get('/api/auth/logout');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          SkillLens.io
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="btn-secondary nav-btn" style={{display: 'flex', alignItems: 'center'}}>
                <LogOut size={16} style={{marginRight: '0.5rem'}} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary nav-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
