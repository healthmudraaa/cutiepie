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
    <main className="profile-container">
      <Link href="/" className="back-btn">← Back</Link>

      <div className="profile-content glass">
        <div className="image-wrapper">
          <Image
            src={user.image}
            alt={user.name}
            fill
            className="profile-image"
            priority
          />
          {user.currentEvent && (
            <div className="event-overlay">
              📍 {user.currentEvent}
            </div>
          )}
        </div>

        <div className="details">
          <div className="header">
            <h1 className="name">{user.name}, {user.age}</h1>
            <span className="status-badge" data-status={user.status}>
              {user.status === 'APPROACHABLE' ? '👋 Approachable' : '⛔ Busy'}
            </span>
          </div>

          <p className="location">📍 {user.location} • {user.distance} away</p>

          {user.meetupBadges > 0 && (
            <div className="verification-badge">
              <span className="badge-icon">✓</span>
              <span className="badge-text">{user.meetupBadges} Verified Meetups</span>
            </div>
          )}

          <div className="section">
            <h3>About</h3>
            <p className="bio">{user.bio}</p>
          </div>

          <div className="section">
            <h3>Interests</h3>
            <div className="tags">
              {user.interests.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="action-bar">
            <Link href="/" className="btn-large pass">Pass</Link>
            <button className="btn-large quick-meet" onClick={() => setShowQuickMeet(true)}>
              ⚡ Quick Meet
            </button>
            <Link href={`/chat/${user.id}`} className="btn-large like">Chat</Link>
          </div>
        </div>
      </div>

      {showQuickMeet && (
        <div className="modal-overlay" onClick={() => setShowQuickMeet(false)}>
          <div className="modal glass" onClick={(e) => e.stopPropagation()}>
            <h3>⚡ Quick Meetup with {user.name}</h3>
            <p className="modal-subtitle">Suggest a spot nearby</p>
            <div className="locations">
              {smartLocations.map((loc, i) => (
                <button key={i} className="location-btn">
                  <div className="loc-info">
                    <strong>{loc.name}</strong>
                    <span className="loc-meta">{loc.type} • {loc.distance}</span>
                  </div>
                  <span className="arrow">→</span>
                </button>
              ))}
            </div>
            <button className="close-btn" onClick={() => setShowQuickMeet(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-container {
          min-height: 100vh;
          padding: 20px;
          background: var(--bg-dark);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .back-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          color: white;
          text-decoration: none;
          font-weight: 600;
          z-index: 10;
          padding: 10px 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 30px;
          backdrop-filter: blur(10px);
        }

        .profile-content {
          width: 100%;
          max-width: 500px;
          border-radius: 30px;
          overflow: hidden;
          background: #111;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          height: 500px;
        }

        .profile-image {
          object-fit: cover;
        }

        .event-overlay {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          padding: 12px;
          background: rgba(0, 255, 204, 0.95);
          color: #000;
          border-radius: 16px;
          font-weight: 700;
          text-align: center;
          font-size: 1rem;
        }

        .details {
          padding: 30px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .name {
          font-size: 2rem;
          font-weight: 800;
        }

        .status-badge {
          font-size: 0.8rem;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(255,255,255,0.1);
        }

        .location {
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .verification-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(0, 255, 204, 0.15);
          border: 1.5px solid var(--accent);
          border-radius: 20px;
          margin-bottom: 24px;
        }

        .badge-icon {
          font-size: 1rem;
          color: var(--accent);
        }

        .badge-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent);
        }

        .section {
          margin-bottom: 24px;
        }

        h3 {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .bio {
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .tag {
          padding: 8px 16px;
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .action-bar {
          display: flex;
          gap: 12px;
          margin-top: 40px;
        }

        .btn-large {
          flex: 1;
          padding: 16px;
          border-radius: 30px;
          border: none;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-large:hover {
          transform: scale(1.02);
        }

        .pass {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .quick-meet {
          background: var(--accent);
          color: #000;
          box-shadow: 0 0 20px rgba(0, 255, 204, 0.3);
        }

        .like {
          background: var(--primary);
          color: white;
          box-shadow: 0 0 20px var(--primary-glow);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 200;
        }

        .modal {
          width: 90%;
          max-width: 400px;
          padding: 24px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .modal h3 {
          font-size: 1.3rem;
          margin-bottom: 4px;
        }

        .modal-subtitle {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .locations {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .location-btn {
          padding: 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
        }

        .location-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: var(--accent);
        }

        .loc-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .loc-meta {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .arrow {
          font-size: 1.2rem;
          opacity: 0.5;
        }

        .close-btn {
          width: 100%;
          padding: 12px;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
