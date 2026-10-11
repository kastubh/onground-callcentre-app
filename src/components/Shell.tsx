import { useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Radio,
  Phone,
  ChevronDown,
  Bell,
  Menu,
  Headphones,
  Sparkles,
} from 'lucide-react';
export default function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const location = useLocation();
  return (
    <div className="app-shell">
      <aside className={open ? 'sidebar open' : 'sidebar'}>
        <NavLink to="/" className="brand">
          <span className="brand-mark">og</span>
          <span>
            On-Ground<span className="brand-ai">.ai</span>
          </span>
        </NavLink>
        <div className="workspace">
          <span className="workspace-icon">S</span>
          <div>
            <strong>The Sleep Company</strong>
            <small>Call Centre workspace</small>
          </div>
          <ChevronDown size={14} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav onClick={() => setOpen(false)}>
          <NavLink end to="/">
            <LayoutDashboard size={17} />
            Dashboard
          </NavLink>
          <NavLink
            to="/plan/calls"
            className={location.pathname.startsWith('/plan') ? 'plan-link active' : 'plan-link'}
          >
            <Phone size={17} />
            Plan
            <ChevronDown size={14} className="ml-auto" />
          </NavLink>
          <div className="subnav">
            <NavLink to="/plan/calls">
              Calls to make<span>10</span>
            </NavLink>
            <NavLink to="/plan/incoming">
              Incoming<span>5</span>
            </NavLink>
            <NavLink to="/plan/recent">Recent</NavLink>
            <NavLink to="/plan/practise">Practise a call</NavLink>
          </div>
          <NavLink to="/calendar">
            <CalendarDays size={17} />
            Calendar
          </NavLink>
          <NavLink to="/pulse">
            <Radio size={17} />
            Pulse
            <span className="nav-dot" />
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="shift-status">
            <span className="live-dot" />
            Your shift is going strong<small>Every conversation counts.</small>
          </div>
          <div className="sidebar-person">
            <span className="avatar">AR</span>
            <div>
              <strong>Arvind Rajan</strong>
              <small>Call Centre Agent</small>
            </div>
          </div>
        </div>
      </aside>
      {open && (
        <button
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <div className="workspace-main">
        <header className="topbar">
          <button
            className="icon-button hamburger"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            <Menu size={20} />
          </button>
          <div className="topbar-context">
            <span className="live-dot" />
            Agent workspace<span className="topbar-separator">/</span>
            <span className="muted">The Sleep Company</span>
          </div>
          <div className="topbar-actions">
            <span className="available">
              <span className="live-dot" />
              Available
            </span>
            <div className="notification-wrap">
              <button
                className="icon-button notification"
                aria-label="Notifications"
                onClick={() => setNotifications(!notifications)}
              >
                <Bell size={18} />
                <span>3</span>
              </button>
              {notifications && (
                <div className="notification-popover">
                  <strong>Your updates</strong>
                  <p>2 callbacks need your attention.</p>
                  <p>Sunita shared an update in Pulse.</p>
                  <p>You earned 120 points today.</p>
                  <NavLink to="/pulse" onClick={() => setNotifications(false)}>
                    Open Pulse →
                  </NavLink>
                </div>
              )}
            </div>
            <span className="points">
              <Sparkles size={14} />
              1,240 pts<span>🔥 7</span>
            </span>
            <span className="avatar top-avatar">AR</span>
          </div>
        </header>
        <main className="main-content">{children}</main>
        <footer className="app-footer">
          <span>On-Ground.ai · A little better, every call.</span>
          <span>
            <Headphones size={13} />
            Your workspace, in sync
          </span>
        </footer>
      </div>
    </div>
  );
}
