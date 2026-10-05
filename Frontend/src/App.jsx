import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import api from './services/api';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InterviewReportPage from './pages/InterviewReportPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in on app load
    const checkUser = async () => {
      try {
        const response = await api.get('/api/auth/get-user');
        setUser(response.data.user);
      } catch (err) {
        console.log('No active user session');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <main>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user ? <DashboardPage user={user} /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/report" 
            element={user ? <InterviewReportPage /> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
