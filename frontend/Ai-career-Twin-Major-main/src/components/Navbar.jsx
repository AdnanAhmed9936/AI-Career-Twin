import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-icon">🎓</span>
        <span className="logo-text">
          AI Career <span>Twin</span>
        </span>
      </Link>

      <div className="navbar-links">
        <NavLink to="/" end className="nav-link">
          Home
        </NavLink>

        <NavLink to="/dashboard" className="nav-link">
          Dashboard
        </NavLink>

        <NavLink to="/profile" className="nav-link">
          My Profile
        </NavLink>

        <NavLink to="/skills" className="nav-link">
          My Skills
        </NavLink>

        <NavLink to="/roadmap" className="nav-link">
          Roadmap
        </NavLink>

        <NavLink to="/jobs" className="nav-link">
          Jobs
        </NavLink>
      </div>

      <div className="navbar-actions">
        <Link to="/login" className="login-button">
          Login
        </Link>

        <Link to="/register" className="signup-button">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;