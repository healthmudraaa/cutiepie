'use client';

import { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import MapView from './MapView';
import { MOCK_USERS } from '@/lib/data';

export default function NearbyRadar({ userStatus }) {
  const [scanning, setScanning] = useState(true);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const [eventFilter, setEventFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    if (userStatus === 'BUSY') {
      setNearbyUsers([]);
      setScanning(false);
      return;
    }

    setScanning(true);
    const timer = setTimeout(() => {
      setScanning(false);
      setNearbyUsers(MOCK_USERS);
    }, 2000);
    return () => clearTimeout(timer);
  }, [userStatus]);

  const handleLike = (id) => {
    setNearbyUsers(prev => prev.filter(u => u.id !== id));
    setLastAction('LIKED');
    setTimeout(() => setLastAction(null), 2000);
  };

  const handlePass = (id) => {
    setNearbyUsers(prev => prev.filter(u => u.id !== id));
    setLastAction('PASSED');
    setTimeout(() => setLastAction(null), 2000);
  };

  const handleEventClick = (eventName) => {
    setSelectedEvent(eventName);
    setEventFilter('specific');
  };

  const handleUserClick = (user) => {
    window.location.href = `/profile/${user.id}`;
  };

  const filteredUsers = eventFilter === 'all'
    ? nearbyUsers
    : eventFilter === 'events'
      ? nearbyUsers.filter(u => u.currentEvent)
      : nearbyUsers.filter(u => u.currentEvent === selectedEvent);

  const activeEvents = [...new Set(nearbyUsers.filter(u => u.currentEvent).map(u => u.currentEvent))];
  const eventCount = nearbyUsers.filter(u => u.currentEvent).length;

  const getEventCount = (eventName) => {
    return nearbyUsers.filter(u => u.currentEvent === eventName).length;
  };

  if (userStatus === 'BUSY') {
    return (
      <div className="radar-container">
        <div className="empty-state">
          <div className="icon">🙈</div>
          <h3>You are hidden</h3>
          <p>Switch to <b>Approachable</b> to see who's nearby.</p>
        </div>
        <style jsx>{`
          .radar-container {
            width: 100%;
            min-height: 60vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }
          .empty-state {
            text-align: center;
            opacity: 0.7;
          }
          .icon { font-size: 4rem; margin-bottom: 16px; }
          h3 { font-size: 1.5rem; margin-bottom: 8px; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="radar-container">
      {lastAction === 'LIKED' && (
        <div className="toast-match">
          <span>✨ It's a Vibe! Request sent.</span>
        </div>
      )}

      {!scanning && activeEvents.length > 0 && (
        <div className="event-filter-section">
          <div className="filter-header">
            <h3 className="filter-title">🎯 Discover</h3>
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Grid
              </button>
              <button
                className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                </svg>
                Map
              </button>
            </div>
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${eventFilter === 'all' ? 'active' : ''}`}
              onClick={() => {
                setEventFilter('all');
                setSelectedEvent(null);
              }}
            >
              <span className="filter-icon">👥</span>
              <div className="filter-content">
                <span className="filter-label">All Nearby</span>
                <span className="filter-count">{nearbyUsers.length} users</span>
              </div>
            </button>
            <button
              className={`filter-btn event-filter ${eventFilter === 'events' ? 'active' : ''}`}
              onClick={() => {
                setEventFilter('events');
                setSelectedEvent(null);
              }}
            >
              <span className="filter-icon">📍</span>
              <div className="filter-content">
                <span className="filter-label">At Events Now</span>
                <span className="filter-count">{eventCount} active</span>
              </div>
              {eventCount > 0 && <span className="pulse-dot"></span>}
            </button>
          </div>

          {activeEvents.length > 0 && (
            <div className="event-chips-section">
              <h4 className="chips-title">📍 Browse by Location</h4>
              <div className="event-chips">
                {activeEvents.map((event, index) => (
                  <button
                    key={index}
                    className={`event-chip ${selectedEvent === event ? 'active' : ''}`}
                    onClick={() => handleEventClick(event)}
                  >
                    <span className="chip-name">{event}</span>
                    <span className="chip-count">{getEventCount(event)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {scanning ? (
        <div className="scanner">
          <div className="ripple"></div>
          <div className="ripple delay-1"></div>
          <div className="ripple delay-2"></div>
          <p className="scanning-text glow-text">Scanning...</p>
        </div>
      ) : viewMode === 'map' ? (
        <MapView users={filteredUsers} onUserClick={handleUserClick} />
      ) : (
        <div className="results-grid">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <ProfileCard
                key={user.id}
                user={user}
                onLike={handleLike}
                onPass={handlePass}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No one at this location right now...</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .radar-container {
          width: 100%;
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
        }

        .event-filter-section {
          width: 100%;
          max-width: 1200px;
          margin-bottom: 40px;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .filter-title {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .view-toggle {
          display: flex;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          padding: 4px;
          border-radius: 12px;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .toggle-btn:hover {
          color: white;
        }

        .toggle-btn.active {
          background: var(--accent);
          color: #000;
        }

        .filter-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .filter-btn {
          position: relative;
          padding: 20px;
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .filter-btn:active {
          transform: scale(0.98);
        }

        .filter-btn:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .filter-btn.active {
          background: rgba(255, 51, 102, 0.2);
          border-color: var(--primary);
          box-shadow: 0 0 20px rgba(255, 51, 102, 0.3);
        }

        .filter-btn.event-filter.active {
          background: rgba(0, 255, 204, 0.2);
          border-color: var(--accent);
          box-shadow: 0 0 20px rgba(0, 255, 204, 0.3);
        }

        .filter-icon {
          font-size: 2rem;
        }

        .filter-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
        }

        .filter-label {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .filter-count {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .pulse-dot {
          width: 12px;
          height: 12px;
          background: var(--accent);
          border-radius: 50%;
          animation: pulse-dot 1.5s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.3);
            opacity: 0.7;
          }
        }

        .event-chips-section {
          margin-top: 20px;
          padding: 20px;
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .chips-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--accent);
        }

        .event-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .event-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(0, 255, 204, 0.1);
          border: 2px solid rgba(0, 255, 204, 0.3);
          border-radius: 20px;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
        }

        .event-chip:hover {
          background: rgba(0, 255, 204, 0.2);
          border-color: var(--accent);
          transform: translateY(-2px);
        }

        .event-chip.active {
          background: var(--accent);
          color: #000;
          border-color: var(--accent);
          box-shadow: 0 4px 12px rgba(0, 255, 204, 0.4);
        }

        .chip-name {
          font-weight: 600;
        }

        .chip-count {
          padding: 2px 8px;
          background: rgba(0,0,0,0.3);
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .event-chip.active .chip-count {
          background: rgba(0,0,0,0.2);
        }

        .scanner {
          position: relative;
          width: 300px;
          height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .ripple {
          position: absolute;
          border: 2px solid var(--primary);
          border-radius: 50%;
          opacity: 0;
          animation: ripple 3s infinite cubic-bezier(0, 0.2, 0.8, 1);
        }

        .delay-1 { animation-delay: 1s; }
        .delay-2 { animation-delay: 2s; }

        .scanning-text {
          margin-top: 350px;
          font-size: 1.2rem;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 450px));
          gap: 60px 24px;
          width: 100%;
          max-width: 1200px;
          justify-content: center;
          padding-bottom: 40px;
        }

        .toast-match {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary);
          color: white;
          padding: 12px 24px;
          border-radius: 30px;
          font-weight: 600;
          box-shadow: 0 10px 30px var(--primary-glow);
          z-index: 200;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes ripple {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 300px; height: 300px; opacity: 0; }
        }
        
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .radar-container {
            padding: 16px;
          }

          .event-filter-section {
            margin-bottom: 24px;
          }

          .filter-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .filter-title {
            font-size: 1.3rem;
          }

          .view-toggle {
            width: 100%;
          }

          .toggle-btn {
            flex: 1;
            justify-content: center;
          }

          .filter-buttons {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .filter-btn {
            padding: 16px;
          }

          .filter-icon {
            font-size: 1.5rem;
          }

          .filter-label {
            font-size: 0.9rem;
          }

          .event-chips-section {
            padding: 16px;
          }

          .chips-title {
            font-size: 0.9rem;
          }

          .event-chip {
            font-size: 0.85rem;
            padding: 8px 12px;
          }

          .scanner {
            width: 200px;
            height: 200px;
          }

          .scanning-text {
            font-size: 1rem;
            margin-top: 250px;
          }

          .results-grid {
            grid-template-columns: 1fr;
            gap: 50px 16px;
          }

          .toast-match {
            bottom: 20px;
            font-size: 0.9rem;
            padding: 10px 20px;
          }
        }
      `}</style>
    </div>
  );
}
