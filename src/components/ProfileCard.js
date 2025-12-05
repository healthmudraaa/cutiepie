'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ProfileCard({ user }) {
  return (
    <div className="profile-card-container">
      <Link href={`/profile/${user.id}`} className="profile-card">
        {/* Image Section */}
        <div className="card-image-wrapper">
          <div className="image-container">
            <Image
              src={user.image}
              alt={user.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="profile-image"
              priority
            />
          </div>

          {/* Gradient Overlay */}
          <div className="image-gradient"></div>

          {/* Event Badge */}
          {user.currentEvent && (
            <div className="event-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span>{user.currentEvent}</span>
            </div>
          )}

          {/* Status Indicator */}
          {user.status === 'APPROACHABLE' && (
            <div className="status-dot"></div>
          )}
        </div>

        {/* Info Section */}
        <div className="card-info">
          <div className="info-header">
            <div className="name-row">
              <h3 className="name">{user.name}</h3>
              <span className="age">{user.age}</span>
            </div>
            {user.meetupBadges > 0 && (
              <div className="verified-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>{user.meetupBadges}</span>
              </div>
            )}
          </div>

          <div className="distance-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span>{user.distance} away</span>
          </div>

          <p className="bio">{user.bio}</p>

          <div className="interests">
            {user.interests.slice(0, 3).map((interest, i) => (
              <span key={i} className="interest-tag">{interest}</span>
            ))}
            {user.interests.length > 3 && (
              <span className="interest-more">+{user.interests.length - 3}</span>
            )}
          </div>
        </div>
      </Link>

      <style jsx>{`
        .profile-card-container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .profile-card {
          display: block;
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: all var(--transition-base);
          text-decoration: none;
          color: inherit;
        }

        .profile-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }

        .card-image-wrapper {
          position: relative;
          width: 100%;
          height: 500px;
          background: var(--light-gray);
          overflow: hidden;
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .profile-image {
          object-fit: cover;
        }

        .image-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
          pointer-events: none;
        }

        .event-badge {
          position: absolute;
          top: var(--spacing-md);
          left: var(--spacing-md);
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: var(--white);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: var(--font-weight-semibold);
          color: var(--primary);
          box-shadow: var(--shadow-md);
        }

        .status-dot {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          width: 14px;
          height: 14px;
          background: var(--secondary);
          border: 3px solid var(--white);
          border-radius: 50%;
          box-shadow: var(--shadow-sm);
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .card-info {
          padding: var(--spacing-lg);
        }

        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-sm);
        }

        .name-row {
          display: flex;
          align-items: baseline;
          gap: var(--spacing-sm);
        }

        .name {
          font-size: 1.5rem;
          font-weight: var(--font-weight-bold);
          color: var(--black);
          margin: 0;
        }

        .age {
          font-size: 1.25rem;
          font-weight: var(--font-weight-regular);
          color: var(--dark-gray);
        }

        .verified-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: rgba(78, 205, 196, 0.1);
          border-radius: var(--radius-full);
          color: var(--secondary-dark);
          font-size: 0.85rem;
          font-weight: var(--font-weight-semibold);
        }

        .distance-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: var(--spacing-md);
          color: var(--dark-gray);
          font-size: 0.9rem;
          font-weight: var(--font-weight-medium);
        }

        .distance-row svg {
          opacity: 0.6;
        }

        .bio {
          font-size: 0.95rem;
          line-height: 1.5;
          color: var(--dark-gray);
          margin-bottom: var(--spacing-md);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .interests {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .interest-tag {
          padding: 6px 12px;
          background: var(--off-white);
          border: 1px solid var(--light-gray);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: var(--font-weight-medium);
          color: var(--dark-gray);
        }

        .interest-more {
          padding: 6px 12px;
          background: var(--light-gray);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: var(--font-weight-semibold);
          color: var(--dark-gray);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .card-image-wrapper {
            height: 450px;
          }

          .name {
            font-size: 1.35rem;
          }

          .age {
            font-size: 1.15rem;
          }
        }
      `}</style>
    </div>
  );
}
