import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import api from '../services/api';
import './Auth.scss';

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      // The backend will set the auth cookie. 
      // We also need to fetch the user or trust the login success.
      // Let's fetch the user right after login to set the state.
      const userRes = await api.get('/api/auth/get-user');
      setUser(userRes.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2 className="text-center auth-title">Welcome Back</h2>
        {error && <div className="error-message text-center">{error}</div>}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
