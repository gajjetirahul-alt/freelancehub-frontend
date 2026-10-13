import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, LayoutDashboard, FolderSearch, MessageCircle, User, LogOut, PlusCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon"><Zap size={20} /></div>
          <div className="brand-text">Freelance<span>Hub</span></div>
        </Link>

        <button className="navbar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <NavLink to="/projects" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
            <FolderSearch size={16} /> Projects
          </NavLink>

          {user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>

              {user.role === 'CLIENT' && (
                <NavLink to="/projects/new" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                  <PlusCircle size={16} /> Post Project
                </NavLink>
              )}

              <NavLink to="/messages" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                <MessageCircle size={16} /> Messages
              </NavLink>

              <NavLink to="/profile" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                <User size={16} /> Profile
              </NavLink>
            </>
          )}
        </div>

        <div className="navbar-user">
          {user ? (
            <>
              <Link to="/profile" className="navbar-user-info">
                <div className="navbar-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="navbar-username">{user.name}</span>
                  <span className="navbar-role">{user.role}</span>
                </div>
              </Link>
              <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
