'use client';

import { useState } from 'react';
import NearbyRadar from '@/components/NearbyRadar';

export default function Home() {
  const [status, setStatus] = useState('APPROACHABLE');

  const toggleStatus = () => {
    setStatus(prev => prev === 'APPROACHABLE' ? 'BUSY' : 'APPROACHABLE');
  };

  return (
    <main className="main-container">
      <header className="app-header glass">
        <div className="logo">CutiePie</div>
        <button
          className={`user-status ${status.toLowerCase()}`}
          onClick={toggleStatus}
        >
          <span className="status-dot"></span>
          <span className="status-text">{status === 'APPROACHABLE' ? 'Approachable' : 'Busy'}</span>
        </button>
      </header>

      <section className="hero">
        <h1 className="title glow-text">Find your vibe.</h1>
        <p className="subtitle">
          {status === 'APPROACHABLE'
            ? 'Discover who is nearby and ready to chat.'
            : 'You are currently hidden from others.'}
        </p>
      </section>

      <NearbyRadar userStatus={status} />

      <style jsx>{`
        .main-container {
          min-height: 100vh;
          background: radial-gradient(circle at top, #1a1a1a, var(--bg-dark));
          padding-top: 80px;
          padding-bottom: 20px;
        }

        .app-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(to right, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -1px;
        }

        .user-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          padding: 8px 16px;
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-status:hover {
          background: rgba(255,255,255,0.2);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .user-status.approachable .status-dot {
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
        }

        .user-status.busy .status-dot {
          background: #ff4444;
          box-shadow: 0 0 10px #ff4444;
        }

        .hero {
          text-align: center;
          padding: 40px 20px;
        }

        .title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .main-container {
            padding-top: 70px;
          }

          .app-header {
            padding: 12px 16px;
          }

          .logo {
            font-size: 1.3rem;
          }

          .status-text {
            display: none;
          }

          .user-status {
            padding: 10px 12px;
            min-width: 44px;
            justify-content: center;
          }

          .hero {
            padding: 30px 16px;
          }

          .title {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </main>
  );
}
