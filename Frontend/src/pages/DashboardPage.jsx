import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FileText, UploadCloud, Briefcase, User, Sparkles, History, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import './Dashboard.scss';

const DashboardPage = ({ user }) => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [isFetchingPrevious, setIsFetchingPrevious] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [toastError, setToastError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a resume file first.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide the job description.');
      return;
    }
    if (!selfDescription.trim()) {
      setError('Please provide your self description.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);
    formData.append('selfDescription', selfDescription);


    try {
      const response = await api.post('/api/interview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/report', { state: { report: response.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrevious = async () => {
    setIsFetchingPrevious(true);
    setToastError('');
    setShowEmptyState(false);
    
    try {
      const response = await api.get('/api/interview/get-report');
      if (response.data && response.data.report) {
        setShowSuccessAnimation(true);
        setTimeout(() => {
          navigate('/report', { state: { report: { interviewReport: response.data.report } } });
        }, 500);
      } else {
        setShowEmptyState(true);
        setIsFetchingPrevious(false);
      }
    } catch (err) {
      setToastError('Unable to retrieve your previous analysis. Please try again.');
      setTimeout(() => setToastError(''), 3000);
      setIsFetchingPrevious(false);
    }
  };

  return (
    <div className="dashboard-page container">
      <div className="dashboard-header text-center">
        <h1>Welcome, {user?.email || 'User'}!</h1>
        <p className="text-secondary">Ready to land your dream job? Provide your details below.</p>
      </div>

      {error && <div className="error-message text-center" style={{marginBottom: '1rem'}}>{error}</div>}

      {showEmptyState ? (
        <div className="card empty-state-card">
          <div className="empty-state-content">
            <div className="empty-state-icon-wrapper">
              <FileText size={48} className="empty-state-icon" />
            </div>
            <h2>No Previous Analysis Found</h2>
            <p>You haven't analyzed a resume yet. Upload your resume to generate your first AI-powered analysis.</p>
            <button 
              className="btn-primary mt-4" 
              onClick={() => setShowEmptyState(false)}
            >
              <UploadCloud size={20} className="btn-icon" />
              Upload Resume
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="dashboard-grid">
        {/* Left Section - Resume Upload */}
        <div className="card dashboard-section">
          <div className="section-header">
            <FileText className="section-icon" size={24} />
            <h2>Upload Resume</h2>
          </div>
          <p className="section-subtitle">Select a PDF version of your resume for AI analysis.</p>
          
          <div className="upload-area">
            <input 
              type="file" 
              id="resume-upload" 
              accept=".pdf" 
              onChange={handleFileChange} 
              className="file-input"
            />
            <label htmlFor="resume-upload" className="upload-label">
              <UploadCloud size={32} className="upload-icon" />
              <span>{file ? file.name : 'Choose a PDF file or drag it here'}</span>
            </label>
          </div>
        </div>

        {/* Right Section - Job & Self Description */}
        <div className="card dashboard-section">
          <div className="form-group">
            <label htmlFor="job-description">
              <Briefcase size={18} className="input-icon" /> Job Description <span className="required">*</span>
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="form-textarea"
              placeholder="Paste the job description here..."
              required
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="self-description">
              <User size={18} className="input-icon" /> Self Description <span className="required">*</span>
            </label>
            <textarea
              id="self-description"
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              className="form-textarea"
              placeholder="Tell us about yourself, your skills, experience, projects, and career goals..."
              required
              rows="4"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Analyze Action */}
      <div className="dashboard-action">
        <button 
          className="btn-primary analyze-btn" 
          onClick={handleAnalyze}
          disabled={!file || !jobDescription.trim() || !selfDescription.trim() || loading || isFetchingPrevious}
        >
          <Sparkles size={20} className="btn-icon" />
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>

        <button
          className={`btn-primary analyze-btn ${showSuccessAnimation ? 'success' : ''}`}
          onClick={handleViewPrevious}
          disabled={isFetchingPrevious || loading}
        >
          {showSuccessAnimation ? (
            <>
              <CheckCircle2 size={20} className="btn-icon" />
              Analysis Retrieved
            </>
          ) : isFetchingPrevious ? (
            <>
              <Loader2 size={20} className="btn-icon spinning" />
              Retrieving Analysis...
            </>
          ) : (
            <>
              <History size={20} className="btn-icon" />
              View Previous Analysis
            </>
          )}
        </button>
      </div>
        </>
      )}

      {/* Toast Notification */}
      {toastError && (
        <div className="toast-container">
          <div className="toast">
            {toastError}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
