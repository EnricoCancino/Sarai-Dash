import { useState, useRef, useEffect } from 'react'
import './dashboard.css'

// Safely define asset paths as string URLs to prevent Vite bundler resolution errors on binary files
const reactLogo = "https://cdnjs.cloudflare.com/ajax/libs/logos/1.0.0/react.svg"
const viteLogo = "https://vitejs.dev/logo.svg"
const heroImg = "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80"

// Local relative path strings for your custom assets (safely fallback to inline icons if loading fails)
const bagongPilipinasImg = "./assets/BagongPilipinas.png"
const dostLogoImg = "./assets/DOST LOGO GLOBAL.png"
const saraiIlocosImg = "./assets/Sarai-IlocosRegion.png"

export default function Dashboard() {
  // Navigation & UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('tracker'); // tracker, list, about
  const [currentStep, setCurrentStep] = useState(1); // 1: Home/Details, 2: Camera, 3: Submission, 4: Success
  
  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('SARAI Research');
  const [actionType, setActionType] = useState('Sign In'); // 'Sign In' or 'Sign Out'
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  // Simulated live state indicator
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Restored Mock Attendance Database State
  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: 'SARAI-001', name: 'Dr. Maria Santos', dept: 'SARAI', time: '08:15 AM', date: 'June 17, 2026', type: 'Sign In', status: 'On Desk', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { id: 'SARAI-002', name: 'Engr. Juan Dela Cruz', dept: 'CEST', time: '08:30 AM', date: 'June 17, 2026', type: 'Sign In', status: 'On Desk', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150' },
    { id: 'SARAI-003', name: 'Clarissa Ramirez', dept: 'OJT', time: '09:02 AM', date: 'June 17, 2026', type: 'Sign In', status: 'On Desk', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    { id: 'SARAI-004', name: 'Arnel Bautista', dept: 'OTHERS', time: '05:00 PM', date: 'June 16, 2026', type: 'Sign Out', status: 'Left Desk', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' }
  ]);


  const resetForm = () => {
    setEmployeeId('');
    setEmployeeName('');
    setCapturedPhoto(null);
    setCurrentStep(1);
  };

  // Handlers: start process, camera control, capture, and submit
  const handleStartProcess = async (action) => {
    setActionType(action); // 'AM IN', 'AM OUT', 'PM IN', 'PM OUT', 'Sign In', 'Sign Out'
    if (!employeeId || !employeeName) {
      alert('Please enter Employee ID and Name');
      return;
    }
    setCurrentStep(2);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraStream(stream);
      setCameraError(false);
    } catch (err) {
      console.warn('Camera start failed', err);
      setCameraError(true);
      setCameraStream(null);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedPhoto(dataUrl);
      stopCamera();
      setCurrentStep(3);
      return;
    }
    // fallback image when camera not available
    setCapturedPhoto('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop');
    setCurrentStep(3);
  };

  const handleSubmitAttendance = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
    const isCheckIn = ['Sign In', 'AM IN', 'PM IN'].includes(actionType);
    const newLog = {
      id: employeeId || `SARAI-${Math.random().toString(36).slice(2,8).toUpperCase()}`,
      name: employeeName || 'Unknown',
      dept: department,
      time,
      date,
      type: actionType,
      status: isCheckIn ? 'On Desk' : 'Left Desk',
      photo: capturedPhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
    };
    setAttendanceLogs(prev => [newLog, ...prev]);
    setCurrentStep(4);
    setCapturedPhoto(null);
  };

  // Filter and Search logic
  const filteredLogs = attendanceLogs.filter(log => {
    const matchesSearch = log.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === 'All' || log.dept === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="sarai-app">
      {/* Background patterns representing crop-sensing grids & scientific design */}
      <div className="sarai-grid-background"></div>

      {/* Modern High-Aesthetic Header */}
      <header className="sarai-navbar">
        <div className="nav-container">
          <div className="nav-brand-group">
            <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Open sidebar drawer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: '24px', height: '24px'}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="brand-logo-wrapper">
              <img 
                src={saraiIlocosImg} 
                alt="Sarai Ilocos Logo" 
                className="brand-image-logo" 
                onError={(e) => {
                  // Fallback if local asset is temporarily unmapped during build checks
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="brand-logo-fallback-text" style={{display: 'none', fontSize: '24px'}}>🌱</div>
              <div className="brand-title-container">
                <span className="logo-badge">Ilocos Region Hub</span>
                <h1 className="brand-title">SARAI <span>DASH</span></h1>
              </div>
            </div>
          </div>

          <div className="quick-stats-badge">
            <span className="dot-pulse"></span>
            <span>Live Attendance Server Active</span>
          </div>

          <div className="nav-links-desktop">
            <button className={`nav-link ${activeMenu === 'tracker' ? 'active' : ''}`} onClick={() => { setActiveMenu('tracker'); resetForm(); }}>Tracker</button>
            <button className={`nav-link ${activeMenu === 'list' ? 'active' : ''}`} onClick={() => setActiveMenu('list')}>Logs Directory</button>
            <button className={`nav-link ${activeMenu === 'about' ? 'active' : ''}`} onClick={() => setActiveMenu('about')}>About Project</button>
          </div>
        </div>
      </header>

      {/* Side Slide-out Navigation Drawer */}
      <div className={`side-drawer ${isSidebarOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Sarai Dash Navigation</h3>
          <button className="close-drawer-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
        </div>
        <div className="drawer-links">
          <button className={`drawer-item ${activeMenu === 'tracker' ? 'active' : ''}`} onClick={() => { setActiveMenu('tracker'); setIsSidebarOpen(false); resetForm(); }}>
            🌱 Seat Attendance Tracker
          </button>
          <button className={`drawer-item ${activeMenu === 'list' ? 'active' : ''}`} onClick={() => { setActiveMenu('list'); setIsSidebarOpen(false); }}>
            📊 Real-Time Daily Logs
          </button>
          <button className={`drawer-item ${activeMenu === 'about' ? 'active' : ''}`} onClick={() => { setActiveMenu('about'); setIsSidebarOpen(false); }}>
            ℹ️ About Sarai & Partners
          </button>
        </div>
        <div className="drawer-logos">
          <div className="logo-grid">
            <img src={viteLogo} className="partner-icon" alt="Vite Logo" />
            <img src={reactLogo} className="partner-icon spin" alt="React Logo" />
          </div>
          <p className="drawer-footer-text">Project Sarai Dash v2.1<br />Agricultural Crop Protection and Climate Analytics Platform</p>
        </div>
      </div>

      {/* Main Layout Area */}
      <main className="main-content-container">
        
        {/* About Section View */}
        {activeMenu === 'about' && (
          <div className="about-section-container card-container">
            <div className="about-hero-header">
              <h2>About Project Sarai Dash</h2>
              <p className="subtitle">Compact & convenient localized check-in helper for SARAI team researchers, field officers, and administrators.</p>
            </div>
            <div className="about-content-grid">
              <div className="about-card text-block">
                <h3>What is Sarai Dash?</h3>
                <p>Designed as an ergonomic web application, <strong>Sarai Dash</strong> allows research personnel, lab scientists, and administrative staffers to log their working hours directly from their workstations, lab benches, or crop modeling terminal desks.</p>
                <p>No queues, no centralized biometric hubs, and complete adherence to dynamic field research scheduling protocols.</p>
                
                <div className="features-list">
                  <div className="feat-item">
                    <span className="feat-icon">⚡</span>
                    <div>
                      <strong>Compact Desk Convenience:</strong> Seamless attendance logging without interrupting agricultural climate modeling workflows.
                    </div>
                  </div>
                  <div className="feat-item">
                    <span className="feat-icon">📷</span>
                    <div>
                      <strong>Photo Verification:</strong> Secure snapshot alignment keeps verification transparent and prevents proxy logs.
                    </div>
                  </div>
                  <div className="feat-item">
                    <span className="feat-icon">🛰️</span>
                    <div>
                      <strong>UPLB & DOST Integration:</strong> Coordinated monitoring alignment supporting localized crop forecasting networks.
                    </div>
                  </div>
                </div>
              </div>

              <div className="about-image-card">
                <div className="image-placeholder">
                  <img src={heroImg} alt="Sarai Dash Banner" className="hero-img-display" onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}/>
                  <div className="fallback-hero-graphic" style={{display: 'none'}}>
                    <div className="leaf-circle">🌱</div>
                    <span>Project SARAI Crop Intelligence Platform</span>
                  </div>
                </div>
                <div className="partner-attribution-banner">
                  <div className="gov-seal">
                    <img src={dostLogoImg} alt="DOST Logo" className="attribution-logo" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <div className="gov-seal">
                    <img src={bagongPilipinasImg} alt="Bagong Pilipinas" className="attribution-logo" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <div className="gov-seal">
                    <img src={saraiIlocosImg} alt="SARAI" className="attribution-logo" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="center-action-btn">
              <button className="primary-btn shrink-on-press" onClick={() => setActiveMenu('tracker')}>
                Go back to Attendance Hub
              </button>
            </div>
          </div>
        )}

        {/* Tracker View */}
        {activeMenu === 'tracker' && (
          <div className="tracker-workflow-layout">
            
            {/* HERO COMPONENT - Introducing Project Sarai Dash */}
            <div className="tracker-hero-banner">
              <div className="hero-badge">
                <span className="leaf-emoji">🌾</span> Smart Farm & Agricultural Tech
              </div>
              <h2>Dedicated SARAI  Ecosystem</h2>
              <p style={{ ctextAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                All in one place, workspace.
              </p>
            </div>

            <div className="tracker-main-grid">
              
              {/* Left Column: Workflow Container */}
              <div className="workflow-card card-container">
                
                {/* Step Indicator Top Bar */}
                <div className="step-bar-indicator">
                  <div className={`step-dot ${currentStep >= 1 ? 'active' : ''}`}>
                    <span className="number">1</span>
                    <span className="label">Employee Data</span>
                  </div>
                  <div className="step-connector"></div>
                  <div className={`step-dot ${currentStep >= 2 ? 'active' : ''}`}>
                    <span className="number">2</span>
                    <span className="label">Camera Audit</span>
                  </div>
                  <div className="step-connector"></div>
                  <div className={`step-dot ${currentStep >= 3 ? 'active' : ''}`}>
                    <span className="number">3</span>
                    <span className="label">Final Sign</span>
                  </div>
                </div>

                {/* STEP 1: HOME/DETAILS SCREEN */}
                {currentStep === 1 && (
                  <div className="step-panel animate-fade-in">
                    <div className="panel-instruction">
                      <h3>Welcome to Desk Tracker</h3>
                      <p>Enter your personnel credentials to unlock camera-verified check in/out.</p>
                    </div>

                    <form className="credential-form">
                      <div className="form-group">
                        <label htmlFor="emp-id">Employee / ID Number</label>
                        <input 
                          type="text" 
                          id="emp-id"
                          placeholder="e.g. SARAI-2026-085" 
                          value={employeeId} 
                          onChange={(e) => setEmployeeId(e.target.value)} 
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="emp-name">Full Name</label>
                        <input 
                          type="text" 
                          id="emp-name"
                          placeholder="e.g. Dr. Maria Santos" 
                          value={employeeName} 
                          onChange={(e) => setEmployeeName(e.target.value)} 
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="emp-dept">Station / Department</label>
                        <select 
                          id="emp-dept" 
                          value={department} 
                          onChange={(e) => setDepartment(e.target.value)}
                        >
                          <option value="SARAI">SARAI</option>
                          <option value="CEST">CEST</option>
                          <option value="OJT">OJT</option>
                          <option value="OTHERS">OTHERS</option>
                          <option value="Administration">Administration</option>
                        </select>
                      </div>

                      <div className="attendance-action-panel">
                        <button 
                          type="button" 
                          onClick={() => handleStartProcess('AM IN')}
                          className="action-btn time-action-btn am-in-trigger"
                        >
                          <span className="action-icon">🌅</span>
                          <div className="action-label">
                            <strong>AM IN</strong>
                            <span className="action-sub">Morning Arrival</span>
                          </div>
                        </button>

                        <button 
                          type="button" 
                          onClick={() => handleStartProcess('AM OUT')}
                          className="action-btn time-action-btn am-out-trigger"
                        >
                          <span className="action-icon">🍽️</span>
                          <div className="action-label">
                            <strong>AM OUT</strong>
                            <span className="action-sub">Lunch Break</span>
                          </div>
                        </button>

                        <button 
                          type="button" 
                          onClick={() => handleStartProcess('PM IN')}
                          className="action-btn time-action-btn pm-in-trigger"
                        >
                          <span className="action-icon">☕</span>
                          <div className="action-label">
                            <strong>PM IN</strong>
                            <span className="action-sub">After Lunch</span>
                          </div>
                        </button>

                        <button 
                          type="button" 
                          onClick={() => handleStartProcess('PM OUT')}
                          className="action-btn time-action-btn pm-out-trigger"
                        >
                          <span className="action-icon">🌙</span>
                          <div className="action-label">
                            <strong>PM OUT</strong>
                            <span className="action-sub">End of Day</span>
                          </div>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* STEP 2: CAMERA CAPTURE PANEL */}
                {currentStep === 2 && (
                  <div className="step-panel animate-fade-in">
                    <div className="panel-instruction flex-header">
                      <div>
                        <h3>Camera Verification</h3>
                        <p>Verify your physical presence at your desk station. Align your face nicely.</p>
                      </div>
                      <span className={`pill-badge ${['Sign In', 'AM IN', 'PM IN'].includes(actionType) ? 'in-badge' : 'out-badge'}`}>{actionType}</span>
                    </div>

                    <div className="camera-viewfinder-box">
                      {cameraError ? (
                        <div className="camera-simulation-banner">
                          <div className="simulated-avatar">
                            <span className="scan-line"></span>
                            <div className="fallback-graphic-icon">👤</div>
                          </div>
                          <div className="simulated-meta">
                            <span className="cam-status text-warning">● Offline Simulated Camera Feed</span>
                            <p>Hardware blocked or unavailable. Press capture to simulate secure desk validation.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="live-video-holder">
                          <span className="focus-reticle"></span>
                          <span className="scan-line-live"></span>
                          <video ref={videoRef} autoPlay playsInline className="video-player"></video>
                        </div>
                      )}
                      
                      {/* Canvas used quietly for capturing image stream */}
                      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                    </div>

                    <div className="control-bar-buttons">
                      <button className="secondary-btn flex-center-btn" onClick={() => { stopCamera(); setCurrentStep(1); }}>
                        ← Back to Details
                      </button>
                      
                      <button className="primary-btn btn-highlight flex-center-btn" onClick={capturePhoto}>
                        📸 Take Desk Photo
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: SUBMIT / CONFIRM DETAILS */}
                {currentStep === 3 && (
                  <div className="step-panel animate-fade-in">
                    <div className="panel-instruction">
                      <h3>Confirm Attendance Entry</h3>
                      <p>Double-check your credentials and verify snapshot detail accuracy.</p>
                    </div>

                    <div className="summary-card-details">
                      <div className="captured-preview-frame">
                        <img src={capturedPhoto} alt="Employee Desk Capture" className="preview-image" />
                        <span className="timestamp-stamp-watermark">Desk Capture • Approved Location</span>
                      </div>

                      <div className="summary-fields-table">
                        <div className="field-row">
                          <span className="field-label">Name</span>
                          <span className="field-val">{employeeName}</span>
                        </div>
                        <div className="field-row">
                          <span className="field-label">ID Number</span>
                          <span className="field-val highlight-mono">{employeeId}</span>
                        </div>
                        <div className="field-row">
                          <span className="field-label">Substation</span>
                          <span className="field-val">{department}</span>
                        </div>
                        <div className="field-row">
                          <span className="field-label">Log Type</span>
                          <span className={`field-val font-bold ${['Sign In', 'AM IN', 'PM IN'].includes(actionType) ? 'text-green' : 'text-orange'}`}>
                            {actionType === 'AM IN' && '🌅 AM IN'} 
                            {actionType === 'AM OUT' && '🍽️ AM OUT'} 
                            {actionType === 'PM IN' && '☕ PM IN'} 
                            {actionType === 'PM OUT' && '🌙 PM OUT'} 
                            {actionType === 'Sign In' && '☀️ Sign In'} 
                            {actionType === 'Sign Out' && '🌙 Sign Out'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="control-bar-buttons mt-4">
                      <button className="secondary-btn" onClick={() => { setCapturedPhoto(null); setCurrentStep(1); }}>
                        Start Over
                      </button>
                      
                      <button className="primary-btn btn-success" onClick={handleSubmitAttendance}>
                        ✓ Submit {actionType}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: SUCCESS SUMMARY STATE */}
                {currentStep === 4 && (
                  <div className="step-panel animate-fade-in success-splash">
                    <div className="success-icon-animation">
                      <div className="checkmark-circle">✓</div>
                    </div>

                    <h3>
                      {actionType === 'AM IN' && '🌅 AM IN Recorded Successfully!'}
                      {actionType === 'AM OUT' && '🍽️ AM OUT Recorded Successfully!'}
                      {actionType === 'PM IN' && '☕ PM IN Recorded Successfully!'}
                      {actionType === 'PM OUT' && '🌙 PM OUT Recorded Successfully!'}
                      {actionType === 'Sign In' && '☀️ Sign In Registered Successfully!'}
                      {actionType === 'Sign Out' && '🌙 Sign Out Registered Successfully!'}
                    </h3>
                    <p className="success-sub">Thank you, {employeeName}. Your physical presence logs have been instantly logged to the SARAI climate system databases.</p>

                    <div className="desk-tips-card">
                      <h4>💡 Healthy Desk Reminders:</h4>
                      <ul>
                        <li>Align your seat posture. Keep your back straight to prevent desk fatigues!</li>
                        <li>Take regular 20-second breaks to stare outside at green foliage.</li>
                        <li>Hydrate! A glass of water is vital to support active cognitive modeling.</li>
                      </ul>
                    </div>

                    <div className="control-bar-buttons mt-4">
                      <button className="primary-btn btn-full-width" onClick={resetForm}>
                        Return to Hub Home
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Live Attendance Stream Board */}
              <div className="live-records-panel card-container">
                <div className="records-header">
                  <div className="records-title-group">
                    <h3>Active Attendance Logs</h3>
                    <p className="live-ticker"><span className="live-dot-indicator"></span> Real-time station feeds</p>
                  </div>
                  <div className="logs-counter">
                    <span className="counter-val">{filteredLogs.length}</span> entries listed
                  </div>
                </div>

                {/* Filter and Search Bar widget */}
                <div className="attendance-filter-controls">
                  <input 
                    type="text" 
                    placeholder="Search name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-field"
                  />
                  <select 
                    value={filterDept} 
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="dept-filter-dropdown"
                  >
                    <option value="All">All Stations</option>
                    <option value="SARAI">SARAI</option>
                    <option value="CEST">CEST</option>
                    <option value="OJT">OJT</option>
                    <option value="OTHERS">OTHERS</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                {/* Interactive Dynamic Logs Loop */}
                <div className="logs-scroller">
                  {filteredLogs.length === 0 ? (
                    <div className="no-logs-fallback">
                      <span className="no-logs-icon">🔍</span>
                      <p>No desk attendance matches your search parameters.</p>
                    </div>
                  ) : (
                    filteredLogs.map((log, index) => (
                      <div className={`individual-log-row ${log.type === 'Sign In' ? 'log-signin' : 'log-signout'}`} key={index}>
                        <div className="log-avatar-box">
                          <img src={log.photo} alt={log.name} className="log-photo-thumbnail" />
                          <span className={`mini-status-badge ${log.type === 'Sign In' ? 'online' : 'offline'}`}></span>
                        </div>

                        <div className="log-core-details">
                          <h4 className="log-name-title">{log.name}</h4>
                          <div className="log-meta-tagline">
                            <span className="log-dept-pill">{log.dept}</span>
                            <span className="log-id-code">ID: {log.id}</span>
                          </div>
                        </div>

                        <div className="log-timestamp-group">
                          <span className={`badge-indicator ${log.type === 'Sign In' ? 'in' : 'out'}`}>{log.type}</span>
                          <span className="time-string">{log.time}</span>
                          <span className="date-string">{log.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="panel-disclaimer">
                  <p>🛡️ Sarai Dash handles snapshots in adherence with data protection guidelines. Snapshots are processed locally for compliance audits.</p>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* List Direct View */}
        {activeMenu === 'list' && (
          <div className="card-container directory-container-block">
            <div className="directory-header-group">
              <div>
                <h2>Sarai Desk Daily Registry</h2>
                <p>Complete logs list audit records for Project SARAI partners and research staff.</p>
              </div>
              <button className="primary-btn flex-center-btn" onClick={() => setActiveMenu('tracker')}>
                + New Desk Audit Sign
              </button>
            </div>

            <div className="directory-controls-bar">
              <input 
                type="text" 
                placeholder="Filter by research investigator name or ID code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field full-search-width"
              />
            </div>

            <div className="directory-table-responsive">
              <table className="sarai-data-table">
                <thead>
                  <tr>
                    <th>Desk Snapshot</th>
                    <th>Staff / Researcher Name</th>
                    <th>Station ID</th>
                    <th>Substation Division</th>
                    <th>Action Register</th>
                    <th>Logged Stamp</th>
                    <th>Desk Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr key={index} className="table-data-row">
                      <td>
                        <div className="table-snapshot-holder">
                          <img src={log.photo} alt={log.name} className="table-thumbnail-preview" />
                        </div>
                      </td>
                      <td className="table-bold-name">{log.name}</td>
                      <td className="table-mono-id">{log.id}</td>
                      <td>{log.dept}</td>
                      <td>
                        <span className={`table-action-pill ${log.type === 'Sign In' ? 'in-pill' : 'out-pill'}`}>
                          {log.type}
                        </span>
                      </td>
                      <td>
                        <div className="table-timestamp-box">
                          <strong>{log.time}</strong>
                          <span>{log.date}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-indicator-dot-label ${log.type === 'Sign In' ? 'on-desk' : 'away'}`}>
                          <span className="dot"></span>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Decorative Brand footer */}
      <footer className="sarai-footer">
        <div className="footer-links-row">
          <span>Project SARAI &copy; 2026</span>
          <span className="separator">•</span>
          <span>Department of Science and Technology (DOST)</span>
          <span className="separator">•</span>
          <span>University of the Philippines Los Baños (UPLB)</span>
        </div>
      </footer>
    </div>
  )
}