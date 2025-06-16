import type React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../redux/store"
import {  logoutUser } from "../redux/slices/userSlice"
import { clearUrls } from "../redux/slices/urlSlice"
import "../styles/Header.scss"

const Header: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  // Fix: Handle potential null/undefined state
  const userState = useSelector((state: RootState) => state.user)
  const user = userState?.user || null

  const handleLogout = () => {
    dispatch( logoutUser())
    dispatch(clearUrls())
    navigate("/")
  }

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (user) {
      navigate("/dashboard")
    } else {
      navigate("/login")
    }
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">✂️</span>
            URL Shortener
          </Link>

          <nav className="nav">
            {user ? (
              <div className="nav-authenticated">
                <button onClick={handleDashboardClick} className="nav-link nav-button">
                  Dashboard
                </button>
                <div className="user-menu">
                  <span className="user-name">{user.name}</span>
                  <button onClick={handleLogout} className="btn btn-outline btn-small">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="nav-public">
                <button onClick={handleDashboardClick} className="nav-link nav-button">
                  Dashboard
                </button>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-small">
                  Sign Up
                </Link>
                   <Link to="/" className="btn btn-primary btn-small">
                  Home
                </Link>

              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
