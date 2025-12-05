'use client';

import { use } from 'react';
import { MOCK_USERS } from '@/lib/data';
import { getSmartLocationSuggestions } from '@/lib/chatData';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';

export default function ProfilePage({ params }) {
  const { id } = use(params);
  const user = MOCK_USERS.find(u => u.id === id);
  const [showQuickMeet, setShowQuickMeet] = useState(false);

  if (!user) {
    return notFound();
  }

  const smartLocations = getSmartLocationSuggestions(user.interests);

  return (
    <main className="profile-page">
      <Link href="/" className="back-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <div className="profile-container">
        <div className="profile-card">
          {/* Large Image */}
          <div className="image-section">
            <div className="image-wrapper">
              <Image
                src={user.image}
                alt={user.name}
                fill
                className="profile-image"
                priority
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>

            {/* Event Badge */}
            {user.currentEvent && (
              <div className="event-badge-large">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>{user.currentEvent}</span>
              </div>
            )}

            {/* Status Indicator */}
            {user.status === 'APPROACHABLE' && (
              <div className="status-indicator-large">
                <span className="pulse-dot"></span>
                Available Now
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="details-section">
            <div className="header-row">
              <div>
                <h1 className="profile-name">{user.name}, <span className="age">{user.age}</span></h1>
                <p className="location-text">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  {user.distance} away • {user.location}
                </p>
              </div>

              {user.meetupBadges > 0 && (
                <div className="verified-badge-large">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span>{user.meetupBadges} Verified</span>
                </div>
              )}
            </div>

            <div className="section">
              <h3 className="section-title">About</h3>
              <p className="bio-text">{user.bio}</p>
            </div>

            <div className="section">
              <h3 className="section-title">Interests</h3>
              <div className="interests-grid">
                {user.interests.map((interest, i) => (
                  <span key={i} className="interest-badge">{interest}</span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Link href="/" className="action-btn secondary-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Pass
              </Link>
              <button className="action-btn quick-meet-btn" onClick={() => setShowQuickMeet(true)}>
                ⚡ Quick Meet
              </button>
              <Link href={`/chat/${user.id}`} className="action-btn primary-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Chat
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Meet Modal */}
      {showQuickMeet && (
        <div className="modal-overlay" onClick={() => setShowQuickMeet(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">⚡ Quick Meetup with {user.name}</h3>
            <p className="modal-subtitle">Suggest a perfect spot nearby</p>
            <div className="locations-list">
              {smartLocations.map((loc, i) => (
                <button key={i} className="location-option">
                  <div className="location-info">
                    <strong className="location-name">{loc.name}</strong>
                    <span className="location-meta">{loc.type} • {loc.distance}</span>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
            <button className="modal-close-btn" onClick={() => setShowQuickMeet(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          background: var(--bg-primary);
          padding: var(--spacing-xl) var(--spacing-md);
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--white);
          border: 2px solid var(--light-gray);
          border-radius: var(--radius-full);
          color: var(--dark-gray);
          font-weight: var(--font-weight-semibold);
          text-decoration: none;
          margin-bottom: var(--spacing-lg);
          transition: all var(--transition-base);
        }

        .back-button:hover {
          border-color: var(--primary);
          color: var(--primary);
          transform: translateX(-4px);
        }

        .profile-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .profile-card {
          background: var(--white);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .image-section {
          position: relative;
          width: 100%;
          height: 600px;
          background: var(--light-gray);
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .profile-image {
          object-fit: cover;
        }

        .event-badge-large {
          position: absolute;
          top: var(--spacing-lg);
          left: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          background: var(--white);
          border-radius: var(--radius-full);
          font-weight: var(--font-weight-bold);
          color: var(--primary);
          box-shadow: var(--shadow-lg);
          font-size: 1rem;
        }

        .status-indicator-large {
          position: absolute;
          top: var(--spacing-lg);
          right: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          background: linear-gradient(135deg, var(--success) 0%, var(--secondary) 100%);
          border-radius: var(--radius-full);
          color: var(--white);
          font-weight: var(--font-weight-bold);
          box-shadow: var(--shadow-secondary);
          font-size: 1rem;
        }

        .pulse-dot {
          width: 10px;
          height: 10px;
          background: var(--white);
          border-radius: 50%;
          animation: pulse-bright 2s infinite;
        }

        .details-section {
          padding: var(--spacing-xl);
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-xl);
          gap: var(--spacing-md);
        }

        .profile-name {
          font-size: 2.5rem;
          font-weight: var(--font-weight-extrabold);
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--spacing-sm);
          line-height: 1.2;
        }

        .age {
          font-weight: var(--font-weight-regular);
          opacity: 0.8;
        }

        .location-text {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--dark-gray);
          font-weight: var(--font-weight-medium);
          font-size: 1rem;
        }

        .verified-badge-large {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          background: linear-gradient(135deg, var(--secondary) 0%, var(--success) 100%);
          border-radius: var(--radius-full);
          color: var(--white);
          font-weight: var(--font-weight-bold);
          box-shadow: var(--shadow-secondary);
          white-space: nowrap;
        }

        .section {
          margin-bottom: var(--spacing-xl);
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: var(--font-weight-bold);
          color: var(--black);
          margin-bottom: var(--spacing-md);
        }

        .bio-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--dark-gray);
        }

        .interests-grid {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }

        .interest-badge {
          padding: var(--spacing-sm) var(--spacing-lg);
          background: linear-gradient(135deg, rgba(255, 59, 92, 0.1) 0%, rgba(0, 217, 255, 0.1) 100%);
          border: 2px solid var(--light-gray);
          border-radius: var(--radius-full);
          font-weight: var(--font-weight-semibold);
          color: var(--dark-gray);
          font-size: 0.95rem;
          transition: all var(--transition-base);
        }

        .interest-badge:hover {
          border-color: var(--primary);
          background: linear-gradient(135deg, rgba(255, 59, 92, 0.15) 0%, rgba(0, 217, 255, 0.15) 100%);
          transform: translateY(-2px);
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-md);
          margin-top: var(--spacing-xl);
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          font-weight: var(--font-weight-bold);
          font-size: 1rem;
          text-decoration: none;
          transition: all var(--transition-base);
          border: 2px solid transparent;
        }

        .secondary-btn {
          background: var(--white);
          border-color: var(--light-gray);
          color: var(--dark-gray);
        }

        .secondary-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .quick-meet-btn {
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
          color: var(--black);
          box-shadow: 0 4px 16px rgba(255, 184, 0, 0.3);
        }

        .quick-meet-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 184, 0, 0.4);
        }

        .primary-btn {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: var(--white);
          box-shadow: var(--shadow-primary);
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--spacing-md);
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: var(--white);
          border-radius: var(--radius-xl);
          padding: var(--spacing-xl);
          max-width: 500px;
          width: 100%;
          box-shadow: var(--shadow-xl);
          animation: scaleIn 0.3s ease-out;
        }

        .modal-title {
          font-size: 1.75rem;
          font-weight: var(--font-weight-extrabold);
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--spacing-sm);
        }

        .modal-subtitle {
          color: var(--dark-gray);
          margin-bottom: var(--spacing-xl);
        }

        .locations-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .location-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg);
          background: var(--light-gray);
          border: 2px solid transparent;
          border-radius: var(--radius-md);
          text-align: left;
          transition: all var(--transition-base);
        }

        .location-option:hover {
          background: linear-gradient(135deg, rgba(255, 59, 92, 0.05) 0%, rgba(0, 217, 255, 0.05) 100%);
          border-color: var(--primary);
          transform: translateX(4px);
        }

        .location-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .location-name {
          font-size: 1.1rem;
          font-weight: var(--font-weight-bold);
          color: var(--black);
        }

        .location-meta {
          font-size: 0.9rem;
          color: var(--gray);
        }

        .modal-close-btn {
          width: 100%;
          padding: var(--spacing-md);
          background: var(--light-gray);
          border-radius: var(--radius-md);
          font-weight: var(--font-weight-semibold);
          color: var(--dark-gray);
          transition: all var(--transition-base);
        }

        .modal-close-btn:hover {
          background: var(--gray);
          color: var(--white);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .profile-page {
            padding: var(--spacing-md);
          }

          .image-section {
            height: 500px;
          }

          .details-section {
            padding: var(--spacing-lg);
          }

          .header-row {
            flex-direction: column;
          }

          .profile-name {
            font-size: 2rem;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          .verified-badge-large {
            align-self: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
