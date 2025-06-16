import { Link } from "react-router-dom"
import "../styles/Homepage.scss"

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="container">
        <header className="hero-section">
          <h1 className="hero-title">
            Shorten Your URLs with <span className="highlight">Ease</span>
          </h1>
          <p className="hero-description">
            Create short, memorable links in seconds. Track clicks, manage your URLs, and share with confidence.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        </header>

        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✂️</div>
              <h3>Quick & Easy</h3>
              <p>Shorten any URL in seconds with our simple and intuitive interface.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your URLs are protected with enterprise-grade security and privacy controls.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Instant redirects with 99.9% uptime guarantee for all your shortened links.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HomePage
