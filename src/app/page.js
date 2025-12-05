'use client';

import { useState } from 'react';
import NearbyRadar from '@/components/NearbyRadar';

export default function Home() {
  const [status, setStatus] = useState('APPROACHABLE');

  const toggleStatus = () => {
    setStatus(prev => prev === 'APPROACHABLE' ? 'BUSY' : 'APPROACHABLE');
  };

  return (
    <main className="app-container">
      {/* Vibrant Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">💕</div>
            <h1 className="logo-text">CutiePie</h1>
          </div>

          <button
            className={`status-toggle ${status.toLowerCase()}`}
            onClick={toggleStatus}
          >
            <span className="status-indicator"></span>
            <span className="status-label">
              {status === 'APPROACHABLE' ? 'Available Now' : 'Busy'}
            </span>
          </button>
        </div>
      </header>

      {/* Eye-catching Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">
            {status === 'APPROACHABLE'
              ? '✨ Find Your Perfect Match Nearby'
              : '🔒 You are currently invisible'}
          </h2>
          <p className="hero-subtitle">
            {status === 'APPROACHABLE'
              ? 'Connect with amazing people around you in real-time'
              : 'Switch to Available to start meeting incredible people'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <NearbyRadar userStatus={status} />

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: var(--bg-primary);
        }

        .app-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--white);
          border-bottom: 2px solid var(--light-gray);
          box-shadow: var(--shadow-md);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--spacing-lg) var(--spacing-xl);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .logo-icon {
          font-size: 2.5rem;
          line-height: 1;
          filter: drop-shadow(0 2px 8px rgba(255, 59, 92, 0.3));
        }

        .logo-text {
          font-size: 2rem;
          font-weight: var(--font-weight-extrabold);
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -1px;
        }

        .status-toggle {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          background: var(--light-gray);
          border-radius: var(--radius-full);
          font-weight: var(--font-weight-bold);
          font-size: 1rem;
          color: var(--dark-gray);
          transition: all var(--transition-base);
          border: 2px solid transparent;
        }

        .status-toggle:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .status-toggle.approachable {
          background: linear-gradient(135deg, var(--success) 0%, var(--secondary) 100%);
          color: var(--white);
          box-shadow: var(--shadow-secondary);
        }

        .status-toggle.approachable:hover {
          box-shadow: var(--shadow-lg);
        }

        .status-toggle.busy {
          background: var(--gray);
          color: var(--white);
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--white);
          animation: pulse-bright 2s infinite;
        }

        @keyframes pulse-bright {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }

        .status-label {
          font-size: 1rem;
        }

        .hero-section {
          background: linear-gradient(135deg, 
            rgba(255, 59, 92, 0.08) 0%, 
            rgba(0, 217, 255, 0.08) 50%,
            rgba(255, 184, 0, 0.08) 100%
          );
          border-bottom: 2px solid var(--light-gray);
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 59, 92, 0.1) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--spacing-2xl) var(--spacing-xl);
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: var(--font-weight-extrabold);
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--spacing-md);
          letter-spacing: -1.5px;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--dark-gray);
          font-weight: var(--font-weight-medium);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .header-content {
            padding: var(--spacing-md) var(--spacing-lg);
          }

          .logo-text {
            font-size: 1.5rem;
          }

          .logo-icon {
            font-size: 2rem;
          }

          .status-label {
            display: none;
          }

          .status-toggle {
            padding: var(--spacing-md);
            min-width: 48px;
            justify-content: center;
          }

          .hero-content {
            padding: var(--spacing-xl) var(--spacing-lg);
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </main>
  );
}
