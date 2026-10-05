import { Link } from 'react-router';
import './LandingPage.scss';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="container hero-section">
        <h1 className="hero-title">Unlock Your Career Potential with AI</h1>
        <p className="hero-subtitle">
          Upload your resume and get an AI-powered interview report in seconds.
          We analyze your skills, experience, and formatting to give you actionable feedback.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-primary hero-btn">Analyze My Resume</Link>
          <Link to="/login" className="btn-secondary hero-btn">Login to Account</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
