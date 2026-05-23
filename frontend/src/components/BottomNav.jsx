import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import '../styles/bottom-nav.css'

const BottomNav = () => {
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      // attempt user logout, then partner logout to cover both account types
      await api.get('/api/auth/user/logout')
    } catch (err) {
      // ignore and try partner logout
    }

    try {
      await api.get('/api/auth/food-partner/logout')
    } catch (err) {
      // ignore
    }

    navigate('/user/login')
  }

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Bottom">
      <div className="bottom-nav__inner">
        <NavLink to="/home" end className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* home icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.5 12 3l9 7.5"/>
              <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Home</span>
        </NavLink>

        <NavLink to="/saved" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* bookmark icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Saved</span>
        </NavLink>

        <button onClick={handleLogout} className={`bottom-nav__item bottom-nav__logout`} aria-label="Logout">
          <span className="bottom-nav__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </span>
          <span className="bottom-nav__label">Logout</span>
        </button>
      </div>
    </nav>
  )
}

export default BottomNav