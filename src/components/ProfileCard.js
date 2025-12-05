'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ProfileCard({ user, onLike, onPass }) {
  const handlePassClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPass(user.id);
  };

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onLike(user.id);
  };

  return (
    <div className="profile-card">
      <Link href={`/profile/${user.id}`} className="card-link">
        {/* Photo Section */}
        <div className="photo-wrapper">
          <div className="image-container">
            <Image
              src={user.image}
              alt={user.name}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="profile-photo"
              priority
            />
          </div>

          {/* Event Badge */}
          {user.currentEvent && (
            <div className="event-badge">
              <span>📍</span>
              <span>{user.currentEvent}</span>
            </div>
          )}

          {/* Status Badge */}
          <div className={`status-badge ${user.status.toLowerCase()}`}>
            <span className="dot"></span>
            {user.status === 'APPROACHABLE' ? 'Available' : 'Busy'}
          </div>
        </div>

        {/* Info Section */}
        <div className="card-info">
          <div className="info-row">
            <div className="name-age">
              <h3>{user.name}</h3>
              <span className="age">{user.age}</span>
            </div>
            <span className="distance">{user.distance}</span>
          </div>

          {user.meetupBadges > 0 && (
            <div className="verified">
              ✓ {user.meetupBadges} Verified
            </div>
          )}

          <p className="bio">{user.bio}</p>

          <div className="tags">
            {user.interests.map((interest, i) => (
              <span key={i} className="tag">{interest}</span>
            ))}
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="actions" onClick={(e) => e.stopPropagation()}>
        <button className="action-btn pass-btn" onClick={handlePassClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <button className="action-btn like-btn" onClick={handleLikeClick}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .profile-card {
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
          border-radius: 24px;
          overflow: hidden;
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          transition: transform 0.3s ease;
        }

        .profile-card:hover {
          transform: translateY(-4px);
        }

        .card-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .photo-wrapper {
          position: relative;
          width: 100%;
          height: 550px;
          background: #1a1a1a;
          overflow: hidden;
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .profile-photo {
          object-fit: cover;
        }

        .event-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: linear-gradient(135deg, #00FFCC 0%, #00CC99 100%);
          border-radius: 16px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #000;
          box-shadow: 0 4px 16px rgba(0, 255, 204, 0.4);
          z-index: 2;
        }

        .status-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          border-radius: 16px;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1.5px solid rgba(255,255,255,0.2);
          z-index: 2;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
        }

        .status-badge.busy .dot {
          background: #ff4444;
          box-shadow: 0 0 8px #ff4444;
        }

        .card-info {
          padding: 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.8));
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .name-age {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .name-age h3 {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 0;
        }

        .age {
          font-size: 1.4rem;
          opacity: 0.7;
        }

        .distance {
          padding: 6px 12px;
          background: rgba(0, 255, 204, 0.15);
          border: 1.5px solid var(--accent);
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent);
        }

        .verified {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(0, 255, 204, 0.12);
          border: 1px solid rgba(0, 255, 204, 0.3);
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 12px;
        }

        .bio {
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 12px;
          opacity: 0.9;
        }

        .tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .tag {
          padding: 6px 12px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 16px;
          padding: 16px 20px 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
        }

        .action-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }

        .action-btn:hover {
          transform: scale(1.1);
        }

        .action-btn:active {
          transform: scale(0.95);
        }

        .pass-btn {
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
          color: #333;
        }

        .like-btn {
          background: linear-gradient(135deg, var(--primary) 0%, #ff1a4d 100%);
          color: white;
          box-shadow: 0 4px 20px var(--primary-glow);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .profile-card {
            max-width: 100%;
          }

          .photo-wrapper {
            height: 480px;
          }

          .name-age h3 {
            font-size: 1.5rem;
          }

          .age {
            font-size: 1.2rem;
          }

          .action-btn {
            width: 56px;
            height: 56px;
          }
        }
      `}</style>
    </div>
  );
}
