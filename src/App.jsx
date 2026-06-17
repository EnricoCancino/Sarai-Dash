import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState('auth') // 'auth' or 'camera'
  const [isLogged, setIsLogged] = useState(false)

  const handleOpenAuth = () => {
    setShowModal(true)
    setStep('auth')
  }

  const handleAuthSubmit = (e) => {
    e.preventDefault()
    // Move to camera step after submitting details
    setStep('camera')
  }

  const handleCameraVerify = () => {
    setCount((prev) => prev + 1)
    setIsLogged(true)
    setTimeout(() => {
      setShowModal(false)
      setIsLogged(false)
    }, 2000) // Autoclose popup after success message
  }

  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <header className="navbar">
        <div className="brand">
          <img src={heroImg} className="logo-img" alt="Sarai Dash" />
          <span className="brand-name">Sarai Dash</span>
        </div>
        <div className="tech-stack">
          <img src={viteLogo} alt="Vite" />
          <img src={reactLogo} alt="React" />
        </div>
      </header>

      {/* Main Page Area */}
      <main className="main-content">
        <section id="center" className="hero-box">
          <h1 className="title">Sarai Dash</h1>
          <p className="subtitle">
            Sign in and sign out securely right from your terminal without interrupting your workflow.
          </p>

          <button type="button" className="action-btn" onClick={handleOpenAuth}>
            Launch Session Desk
          </button>

          <div className="stats">
            <p>Active Desk Sessions Tracked: <strong>{count}</strong></p>
          </div>
        </section>
      </main>

      {/* Overlay Dialog/Modal Popup */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>

            {step === 'auth' && (
              <div className="step-container">
                <h2>Sign In / Sign Up</h2>
                <p>Provide your seat ID token to synchronize tracking.</p>
                <form onSubmit={handleAuthSubmit} className="auth-form">
                  <input type="text" placeholder="Employee ID Number" required />
                  <input type="password" placeholder="Passcode / Desk PIN" required />
                  <button type="submit" className="submit-btn">Proceed to Verification</button>
                </form>
              </div>
            )}

            {step === 'camera' && (
              <div className="step-container">
                <h2>Camera Attendance</h2>
                {!isLogged ? (
                  <>
                    <p>Position your face relative to your workspace lens.</p>
                    <div className="camera-viewfinder">
                      <div className="scan-target"></div>
                      <span className="camera-status-dot">● LIVE STREAM</span>
                    </div>
                    <button type="button" className="submit-btn capture" onClick={handleCameraVerify}>
                      Capture & Confirm Attendance
                    </button>
                  </>
                ) : (
                  <div className="success-state">
                    <div className="success-checkmark">✓</div>
                    <h3>Session Approved</h3>
                    <p>Your desk record has been safely updated.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden layout elements preserved from native project styles */}
      <div className="ticks"></div>
      <section id="spacer"></section>
    </div>
  )
}

export default App