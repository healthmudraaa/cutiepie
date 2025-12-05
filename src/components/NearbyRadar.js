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
          <div className="empty-icon">🙈</div>
          <h3 className="empty-title">You're invisible</h3>
          <p className="empty-text">Switch to Available to start discovering people nearby</p>
        </div>
        <style jsx>{`
          .radar-container {
            padding: var(--spacing-2xl) var(--spacing-md);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 50vh;
          }
          .empty-state {
            text-align: center;
            max-width: 400px;
          }
          .empty-icon {
            font-size: 4rem;
            margin-bottom: var(--spacing-md);
          }
          .empty-title {
            font-size: 1.5rem;
            font-weight: var(--font-weight-bold);
            color: var(--black);
            margin-bottom: var(--spacing-sm);
          }
          .empty-text {
            color: var(--dark-gray);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="radar-container">
      {lastAction === 'LIKED' && (
        <div className="toast-notification">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span>It's a match! Connection request sent</span>
        </div>
      )}

      {!scanning && activeEvents.length > 0 && (
        <div className="filters-section">
          <div className="filters-header">
            <h3 className="filters-title">Discover</h3>
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                </svg>
                Map
              </button>
            </div>
          </div>

          <div className="filter-tabs">
            <button
              className={`filter-tab ${eventFilter === 'all' ? 'active' : ''}`}
              onClick={() => {
                setEventFilter('all');
                setSelectedEvent(null);
              }}
            >
              <span className="tab-label">All Nearby</span>
              <span className="tab-count">{nearbyUsers.length}</span>
            </button>
            <button
              className={`filter-tab ${eventFilter === 'events' ? 'active' : ''}`}
              onClick={() => {
                setEventFilter('events');
                setSelectedEvent(null);
              }}
            >
              <span className="tab-label">At Events</span>
              <span className="tab-count">{eventCount}</span>
              {eventCount > 0 && <span className="live-indicator"></span>}
            </button>
          </div>

          {activeEvents.length > 0 && (
            <div className="event-chips">
              {activeEvents.map((event, index) => (
                <button
                  key={index}
                  className={`event-chip ${selectedEvent === event ? 'active' : ''}`}
                  onClick={() => handleEventClick(event)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span className="chip-label">{event}</span>
                  <span className="chip-count">{getEventCount(event)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {scanning ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p className="loading-text">Finding people nearby...</p>
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
              <p>No one at this location right now</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .radar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--spacing-xl) var(--spacing-md);
        }

        .filters-section {
          margin-bottom: var(--spacing-xl);
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .filters-title {
          font-size: 1.5rem;
          font-weight: var(--font-weight-bold);
          color: var(--black);
        }

        .view-toggle {
          display: flex;
          gap: var(--spacing-xs);
          background: var(--off-white);
          padding: 4px;
          border-radius: var(--radius-md);
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: transparent;
          border-radius: var(--radius-sm);
          color: var(--dark-gray);
          font-size: 0.9rem;
          font-weight: var(--font-weight-medium);
          transition: all var(--transition-fast);
        }

        .toggle-btn:hover {
          background: var(--light-gray);
        }

        .toggle-btn.active {
          background: var(--white);
          color: var(--black);
          box-shadow: var(--shadow-sm);
        }

        .filter-tabs {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
        }

        .filter-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          background: var(--bg-card);
          border: 2px solid var(--light-gray);
          border-radius: var(--radius-md);
          font-weight: var(--font-weight-semibold);
          color: var(--dark-gray);
          transition: all var(--transition-base);
          position: relative;
        }

        .filter-tab:hover {
          border-color: var(--gray);
        }

        .filter-tab.active {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--white);
        }

        .tab-label {
          font-size: 0.95rem;
        }

        .tab-count {
          padding: 2px 8px;
          background: rgba(0,0,0,0.1);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
        }

        .filter-tab.active .tab-count {
          background: rgba(255,255,255,0.2);
        }

        .live-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: var(--secondary);
          border-radius: 50%;
          animation: pulse-live 1.5s infinite;
        }

        @keyframes pulse-live {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        .event-chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }

        .event-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: var(--bg-card);
          border: 1px solid var(--light-gray);
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: var(--font-weight-medium);
          color: var(--dark-gray);
          transition: all var(--transition-base);
        }

        .event-chip:hover {
          border-color: var(--secondary);
          background: rgba(78, 205, 196, 0.05);
        }

        .event-chip.active {
          background: var(--secondary);
          border-color: var(--secondary);
          color: var(--white);
        }

        .chip-count {
          padding: 2px 8px;
          background: rgba(0,0,0,0.1);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: var(--font-weight-semibold);
        }

        .event-chip.active .chip-count {
          background: rgba(255,255,255,0.2);
        }

        .loading-state {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid var(--light-gray);
          border-top-color: var(--primary);
          border-radius: 50%;
          margin: 0 auto var(--spacing-md);
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          color: var(--dark-gray);
          font-weight: var(--font-weight-medium);
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 400px));
          gap: var(--spacing-xl);
          justify-content: center;
        }

        .toast-notification {
          position: fixed;
          bottom: var(--spacing-xl);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          background: var(--secondary);
          color: var(--white);
          border-radius: var(--radius-full);
          font-weight: var(--font-weight-semibold);
          box-shadow: var(--shadow-lg);
          z-index: 1000;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .radar-container {
            padding: var(--spacing-lg) var(--spacing-md);
          }

          .filters-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }

          .view-toggle {
            width: 100%;
          }

          .toggle-btn {
            flex: 1;
            justify-content: center;
          }

          .filter-tabs {
            flex-direction: column;
          }

          .results-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }

          .toast-notification {
            bottom: var(--spacing-lg);
            left: var(--spacing-md);
            right: var(--spacing-md);
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
