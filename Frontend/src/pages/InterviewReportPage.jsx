import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { 
  ChevronLeft, Download, CheckCircle2, ChevronDown, ChevronUp, 
  Code, Users, Wrench, Calendar, Copy, Check, Search, CheckSquare, Inbox
} from 'lucide-react';
import './InterviewReport.scss';

// --- Utility Functions for Smart Rendering ---
const getField = (obj, keys) => {
  if (!obj || typeof obj !== 'object') return null;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return obj[key];
    }
  }
  return null;
};

const KEY_MAPPINGS = {
  question: ['question', 'Question', 'title'],
  answer: ['answer', 'expectedAnswer', 'modelAnswer', 'sampleAnswer', 'idealAnswer'],
  intention: ['intention', 'purpose', 'whyAsked', 'reason'],
  difficulty: ['difficulty', 'level'],
  tip: ['tip', 'tips', 'advice', 'proTip'],
  skill: ['skill', 'name', 'technology'],
  importance: ['importance', 'priority', 'level'],
  reason: ['reason', 'explanation', 'why'],
  recommendation: ['recommendation', 'action', 'nextSteps'],
  day: ['day', 'date', 'step', 'title'],
  duration: ['duration', 'time', 'estimatedTime']
};

const formatKeyLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

const RenderAIField = ({ label, value }) => {
  if (value === null || value === undefined || value === '') return null;

  const renderContent = (val) => {
    if (typeof val === 'string' || typeof val === 'number') {
      return <span>{val}</span>;
    }
    if (Array.isArray(val)) {
      return (
        <ul className="ai-list" style={{ paddingLeft: '1.25rem', margin: '0.25rem 0' }}>
          {val.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '0.25rem' }}>{renderContent(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof val === 'object') {
      return (
        <div className="ai-nested-obj" style={{ paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.1)', marginTop: '0.5rem' }}>
          {Object.entries(val).map(([k, v], idx) => (
            <div key={idx} className="ai-nested-item" style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: '#94a3b8' }}>{formatKeyLabel(k)}:</strong> {renderContent(v)}
            </div>
          ))}
        </div>
      );
    }
    return String(val);
  };

  return (
    <div className="ai-field" style={{ marginBottom: '0.75rem' }}>
      {label && <strong className="ai-field-label" style={{ color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>{label}:</strong>}
      <div className="ai-field-content" style={{ color: '#e2e8f0', lineHeight: '1.5' }}>
        {renderContent(value)}
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="empty-state">
    <div className="empty-icon">
      <Inbox size={48} />
    </div>
    <p>{message || "No data available for this section."}</p>
  </div>
);

const SectionAccordion = ({ id, title, icon: Icon, count, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  return (
    <div id={id} className={`glass-card accordion-section ${isExpanded ? 'expanded' : ''}`}>
      <div 
        className="accordion-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="accordion-title">
          <div className="icon-wrapper">
            <Icon size={20} />
          </div>
          <h2>{title}</h2>
          <span className="count-badge">{count}</span>
        </div>
        <button className="expand-btn" aria-label="Toggle Section">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      <div className="accordion-content">
        {children}
      </div>
    </div>
  );
};

const InterviewReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const reportData = location.state?.report;

  if (!reportData) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const interviewReport = reportData?.interviewReport || {};
  
  const matchScoreRaw = 
    interviewReport?.matchScore ??
    reportData?.matchScore ??
    interviewReport?.analysis?.matchScore ??
    interviewReport?.overallMatchScore;

  const matchScore = matchScoreRaw !== undefined && matchScoreRaw !== null
    ? parseInt(String(matchScoreRaw).replace(/\D/g, ''), 10) || 0
    : null;

  const getMatchScoreBadge = (score) => {
    if (score >= 90) return { label: 'Excellent Match', color: 'success' };
    if (score >= 75) return { label: 'Good Match', color: 'primary' };
    if (score >= 60) return { label: 'Average Match', color: 'warning' };
    return { label: 'Needs Improvement', color: 'danger' };
  };

  const technicalQuestions = interviewReport?.technicalQuestions || [];
  const behavioralQuestions = interviewReport?.behavioralQuestions || [];
  const skillGaps = interviewReport?.SkillGaps || [];
  const preparationPlan = interviewReport?.preparationPlan || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [practiced, setPracticed] = useState({});
  const [copied, setCopied] = useState({});
  const [expandedAnswers, setExpandedAnswers] = useState({});

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopied({ ...copied, [id]: true });
    setTimeout(() => setCopied({ ...copied, [id]: false }), 2000);
  };

  const togglePractice = (id) => {
    setPracticed({ ...practiced, [id]: !practiced[id] });
  };

  const toggleAnswer = (id) => {
    setExpandedAnswers({ ...expandedAnswers, [id]: !expandedAnswers[id] });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getDifficultyColor = (diff) => {
    const d = String(diff)?.toLowerCase();
    if (d?.includes('easy')) return 'success';
    if (d?.includes('medium')) return 'warning';
    if (d?.includes('hard')) return 'danger';
    return 'primary';
  };

  const filteredTech = useMemo(() => 
    technicalQuestions?.filter(q => {
      const questionText = String(getField(q, KEY_MAPPINGS.question) || '');
      const answerText = String(getField(q, KEY_MAPPINGS.answer) || '');
      const sq = searchQuery.toLowerCase();
      return questionText.toLowerCase().includes(sq) || answerText.toLowerCase().includes(sq);
    }),
  [searchQuery, technicalQuestions]);

  const filteredBehav = useMemo(() => 
    behavioralQuestions?.filter(q => {
      const questionText = String(getField(q, KEY_MAPPINGS.question) || '');
      const tipText = String(getField(q, KEY_MAPPINGS.tip) || getField(q, KEY_MAPPINGS.answer) || '');
      const sq = searchQuery.toLowerCase();
      return questionText.toLowerCase().includes(sq) || tipText.toLowerCase().includes(sq);
    }),
  [searchQuery, behavioralQuestions]);

  const totalQuestions = (technicalQuestions?.length || 0) + (behavioralQuestions?.length || 0);
  const practicedCount = Object.values(practiced).filter(Boolean).length;
  const progressPercent = totalQuestions > 0 ? Math.round((practicedCount / totalQuestions) * 100) : 0;

  return (
    <div className="report-container">
      {/* Sticky Header */}
      <header className="report-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ChevronLeft size={20} /> Dashboard
        </button>
        <button className="download-btn">
          <Download size={18} /> Download PDF
        </button>
      </header>

      <div className="report-content-wrapper">
        <div className="hero-section text-center">
          <div className="success-badge">
            <CheckCircle2 size={16} /> Analysis Complete
          </div>
          <h1 className="hero-title">AI Interview Report</h1>
          <p className="hero-subtitle">Personalized feedback based on your resume and the job description</p>
        </div>

        {matchScore !== null && (
          <div className="match-score-card glass-card">
            <div className="match-score-content">
              <div className="match-score-info">
                <h2>🎯 Resume Match Score</h2>
                <p>This score represents how closely your resume matches the selected job description.</p>
                <span className={`badge badge-${getMatchScoreBadge(matchScore).color} match-badge`}>
                  {getMatchScoreBadge(matchScore).label}
                </span>
              </div>
              <div className="match-score-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path className={`circle stroke-${getMatchScoreBadge(matchScore).color}`}
                    strokeDasharray={`${matchScore}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage">{matchScore}%</text>
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="controls-section glass-card">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search questions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="progress-container">
            <div className="progress-text">
              <span>Practice Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="segmented-tabs">
          <button onClick={() => scrollToSection('tech')} className="tab">Technical</button>
          <button onClick={() => scrollToSection('behav')} className="tab">Behavioral</button>
          <button onClick={() => scrollToSection('skills')} className="tab">Skill Gaps</button>
          <button onClick={() => scrollToSection('prep')} className="tab">Prep Plan</button>
        </div>

        <div className="sections-container">
          
          {/* Technical Questions */}
          <SectionAccordion id="tech" title="Technical Questions" icon={Code} count={filteredTech?.length || 0} defaultExpanded={true}>
            <div className="question-list">
              {(!filteredTech || filteredTech.length === 0) ? (
                <EmptyState message="No technical questions found." />
              ) : (
                filteredTech.map((q, idx) => {
                  const id = `tech-${idx}`;
                  const questionText = getField(q, KEY_MAPPINGS.question);
                  const answerText = getField(q, KEY_MAPPINGS.answer);
                  const intentionText = getField(q, KEY_MAPPINGS.intention);
                  const difficulty = getField(q, KEY_MAPPINGS.difficulty);

                  return (
                    <div key={id} className={`question-card ${practiced[id] ? 'practiced' : ''}`}>
                      <div className="q-header">
                        <span className="q-number">Q{idx + 1}</span>
                        {difficulty && <span className={`badge badge-${getDifficultyColor(difficulty)}`}>{difficulty}</span>}
                      </div>
                      
                      {questionText && <h3 className="q-text">{String(questionText)}</h3>}
                      
                      <div className="q-actions">
                        {(answerText || intentionText) && (
                          <button className="action-btn" onClick={() => toggleAnswer(id)}>
                            {expandedAnswers[id] ? 'Hide Answer Details' : 'Show Answer Details'}
                          </button>
                        )}
                        <div className="right-actions">
                          {questionText && (
                            <button className="icon-btn" onClick={() => handleCopy(questionText, id)} title="Copy Question">
                              {copied[id] ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                          )}
                          <button 
                            className={`icon-btn ${practiced[id] ? 'active' : ''}`} 
                            onClick={() => togglePractice(id)} 
                            title="Mark as Practiced"
                          >
                            <CheckSquare size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {expandedAnswers[id] && (answerText || intentionText) && (
                        <div className="expected-answer">
                          {intentionText && (
                            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              <h4>Intention</h4>
                              <p>{String(intentionText)}</p>
                            </div>
                          )}
                          {answerText && (
                            <div>
                              <h4>Expected Answer</h4>
                              <RenderAIField value={answerText} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </SectionAccordion>

          {/* Behavioral Questions */}
          <SectionAccordion id="behav" title="Behavioral Questions" icon={Users} count={filteredBehav?.length || 0} defaultExpanded={true}>
            <div className="timeline-layout">
              {(!filteredBehav || filteredBehav.length === 0) ? (
                <EmptyState message="No behavioral questions found." />
              ) : (
                filteredBehav.map((q, idx) => {
                  const id = `behav-${idx}`;
                  const questionText = getField(q, KEY_MAPPINGS.question);
                  const answerText = getField(q, KEY_MAPPINGS.answer) || getField(q, KEY_MAPPINGS.tip);
                  const intentionText = getField(q, KEY_MAPPINGS.intention);
                  const difficulty = getField(q, KEY_MAPPINGS.difficulty);

                  return (
                    <div key={id} className="timeline-item">
                      <div className="timeline-marker">{idx + 1}</div>
                      <div className={`question-card timeline-card ${practiced[id] ? 'practiced' : ''}`}>
                        {difficulty && (
                          <div className="q-header" style={{ marginBottom: '0.5rem' }}>
                            <span className={`badge badge-${getDifficultyColor(difficulty)}`}>{difficulty}</span>
                          </div>
                        )}
                        {questionText && <h3 className="q-text">{String(questionText)}</h3>}
                        
                        <div className="q-actions">
                          {(answerText || intentionText) && (
                            <button className="action-btn" onClick={() => toggleAnswer(id)}>
                              {expandedAnswers[id] ? 'Hide Details' : 'Show Details'}
                            </button>
                          )}
                          <div className="right-actions">
                            {questionText && (
                              <button className="icon-btn" onClick={() => handleCopy(questionText, id)}>
                                {copied[id] ? <Check size={16} /> : <Copy size={16} />}
                              </button>
                            )}
                            <button 
                              className={`icon-btn ${practiced[id] ? 'active' : ''}`} 
                              onClick={() => togglePractice(id)}
                            >
                              <CheckSquare size={16} />
                            </button>
                          </div>
                        </div>
                        
                        {expandedAnswers[id] && (answerText || intentionText) && (
                          <div className="expected-answer tip-box">
                            {intentionText && (
                              <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <h4>Interviewer's Intention</h4>
                                <p>{String(intentionText)}</p>
                              </div>
                            )}
                            {answerText && (
                              <div>
                                <h4>Suggested Answer</h4>
                                <RenderAIField value={answerText} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </SectionAccordion>

          {/* Skill Gaps */}
          <SectionAccordion id="skills" title="Skill Gaps" icon={Wrench} count={skillGaps?.length || 0} defaultExpanded={false}>
            <div className="skills-grid">
              {(!skillGaps || skillGaps.length === 0) ? (
                <div style={{ gridColumn: '1 / -1' }}><EmptyState message="No skill gaps identified." /></div>
              ) : (
                skillGaps.map((skillObj, idx) => {
                  if (typeof skillObj !== 'object') return null;
                  const skillName = getField(skillObj, KEY_MAPPINGS.skill);
                  const importance = getField(skillObj, KEY_MAPPINGS.importance);
                  const reason = getField(skillObj, KEY_MAPPINGS.reason);
                  const recommendation = getField(skillObj, KEY_MAPPINGS.recommendation);
                  
                  // Render extra keys not caught by mappings
                  const knownKeys = [...KEY_MAPPINGS.skill, ...KEY_MAPPINGS.importance, ...KEY_MAPPINGS.reason, ...KEY_MAPPINGS.recommendation];
                  const extraEntries = Object.entries(skillObj).filter(([k]) => !knownKeys.includes(k));

                  return (
                    <div key={idx} className="skill-chip-card">
                      <div className="skill-header">
                        {skillName && <h3>{String(skillName)}</h3>}
                        {importance && (
                          <span className={`badge badge-${
                            String(importance).toLowerCase() === 'high' ? 'danger' : 
                            String(importance).toLowerCase() === 'medium' ? 'warning' : 'primary'
                          }`}>
                            {String(importance)}
                          </span>
                        )}
                      </div>
                      {reason && <p className="skill-reason" style={{marginBottom: '0.5rem'}}>{String(reason)}</p>}
                      {recommendation && <p className="skill-reason" style={{marginBottom: '0.5rem'}}><strong>Recommendation:</strong> {String(recommendation)}</p>}
                      
                      {extraEntries.length > 0 && (
                        <div style={{marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem'}}>
                          {extraEntries.map(([k, v], i) => (
                            <RenderAIField key={i} label={formatKeyLabel(k)} value={v} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </SectionAccordion>

          {/* Preparation Plan */}
          <SectionAccordion id="prep" title="Preparation Plan" icon={Calendar} count={preparationPlan?.length || 0} defaultExpanded={false}>
            <div className="prep-timeline">
              {(!preparationPlan || preparationPlan.length === 0) ? (
                <EmptyState message="No preparation plan available." />
              ) : (
                preparationPlan.map((plan, idx) => {
                  if (typeof plan !== 'object') {
                    return (
                      <div key={idx} className="prep-day-card">
                        <div className="prep-content">
                          <RenderAIField value={plan} />
                        </div>
                      </div>
                    );
                  }

                  const dayBadge = getField(plan, KEY_MAPPINGS.day) || `Step ${idx + 1}`;
                  
                  // Extract all properties dynamically
                  const entries = Object.entries(plan);
                  // Remove the day/title from the body since it's used as the badge
                  const dayKeys = KEY_MAPPINGS.day;
                  const filteredEntries = entries.filter(([k]) => !dayKeys.includes(k));

                  return (
                    <div key={idx} className="prep-day-card">
                      {dayBadge && <div className="day-badge" style={{minWidth: '100px', textAlign: 'center'}}>{String(dayBadge)}</div>}
                      
                      <div className="prep-content" style={{ padding: '1.25rem', flexGrow: 1 }}>
                        {filteredEntries.map(([k, v], i) => (
                           <RenderAIField key={i} label={formatKeyLabel(k)} value={v} />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </SectionAccordion>

        </div>
      </div>
      
      {/* Floating Action Button for mobile */}
      <button className="fab-download">
        <Download size={20} />
      </button>
    </div>
  );
};

export default InterviewReportPage;
