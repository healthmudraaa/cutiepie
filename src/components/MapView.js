'use client';

import { useState } from 'react';

export default function MapView({ users, onUserClick }) {
    // Bangalore coordinates
    const bangaloreCenter = { lat: 12.9716, lng: 77.5946 };

    // Mock coordinates for different areas in Bangalore
    const areaCoordinates = {
        'Indiranagar': { lat: 12.9719, lng: 77.6412 },
        'Koramangala': { lat: 12.9352, lng: 77.6245 },
        'MG Road': { lat: 12.9759, lng: 77.6061 },
        'HSR Layout': { lat: 12.9116, lng: 77.6473 },
        'Jayanagar': { lat: 12.9250, lng: 77.5838 },
        'Whitefield': { lat: 12.9698, lng: 77.7499 },
        'Basavanagudi': { lat: 12.9423, lng: 77.5747 },
        'Sadashivanagar': { lat: 12.9897, lng: 77.5771 },
        'Richmond Town': { lat: 12.9698, lng: 77.6025 },
        'Church Street': { lat: 12.9766, lng: 77.6053 }
    };

    const getCoordinates = (location) => {
        const area = location.split(',')[0].trim();
        return areaCoordinates[area] || bangaloreCenter;
    };

    return (
        <div className="map-view">
            <div className="map-container">
                <div className="map-header">
                    <h3>📍 Bangalore Map View</h3>
                    <p className="map-subtitle">{users.length} users nearby</p>
                </div>

                <div className="map-canvas">
                    {/* Map markers */}
                    {users.map((user) => {
                        const coords = getCoordinates(user.location);
                        // Calculate position relative to center (simplified 2D projection)
                        const x = ((coords.lng - bangaloreCenter.lng) * 800) + 50;
                        const y = ((bangaloreCenter.lat - coords.lat) * 800) + 50;

                        return (
                            <div
                                key={user.id}
                                className="map-marker"
                                style={{
                                    left: `${x}%`,
                                    top: `${y}%`,
                                }}
                                onClick={() => onUserClick(user)}
                            >
                                <div className="marker-pin">
                                    <div className="marker-avatar" style={{ backgroundImage: `url(${user.image})` }}>
                                        {user.currentEvent && <span className="marker-event">📍</span>}
                                    </div>
                                    <div className="marker-pulse"></div>
                                </div>
                                <div className="marker-label">
                                    <span className="marker-name">{user.name}</span>
                                    <span className="marker-distance">{user.distance}</span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Area labels */}
                    <div className="area-label" style={{ left: '60%', top: '35%' }}>Indiranagar</div>
                    <div className="area-label" style={{ left: '55%', top: '65%' }}>Koramangala</div>
                    <div className="area-label" style={{ left: '48%', top: '30%' }}>MG Road</div>
                    <div className="area-label" style={{ left: '58%', top: '75%' }}>HSR Layout</div>
                    <div className="area-label" style={{ left: '40%', top: '60%' }}>Jayanagar</div>
                </div>

                <div className="map-legend">
                    <div className="legend-item">
                        <div className="legend-dot approachable"></div>
                        <span>Approachable</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-dot event"></div>
                        <span>At Event</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .map-view {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .map-container {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 24px;
          overflow: hidden;
        }

        .map-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .map-header h3 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .map-subtitle {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .map-canvas {
          position: relative;
          width: 100%;
          height: 600px;
          background: linear-gradient(135deg, rgba(0,20,40,0.5) 0%, rgba(0,10,20,0.5) 100%);
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid rgba(0, 255, 204, 0.2);
        }

        .map-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
          z-index: 10;
        }

        .marker-pin {
          position: relative;
          width: 50px;
          height: 50px;
        }

        .marker-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          border: 3px solid var(--accent);
          box-shadow: 0 4px 12px rgba(0, 255, 204, 0.4);
          position: relative;
          z-index: 2;
          transition: transform 0.3s;
        }

        .map-marker:hover .marker-avatar {
          transform: scale(1.2);
        }

        .marker-event {
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 1.2rem;
          background: var(--accent);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marker-pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          animation: pulse-ring 2s infinite;
          z-index: 1;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .marker-label {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.9);
          padding: 6px 12px;
          border-radius: 12px;
          white-space: nowrap;
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .map-marker:hover .marker-label {
          opacity: 1;
        }

        .marker-name {
          font-weight: 700;
          font-size: 0.9rem;
        }

        .marker-distance {
          font-size: 0.75rem;
          color: var(--accent);
        }

        .area-label {
          position: absolute;
          color: rgba(255,255,255,0.3);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          pointer-events: none;
        }

        .map-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 16px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .legend-dot.approachable {
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
        }

        .legend-dot.event {
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
          animation: pulse-dot 1.5s infinite;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .map-container {
            padding: 16px;
          }

          .map-canvas {
            height: 400px;
          }

          .marker-avatar {
            width: 40px;
            height: 40px;
          }

          .marker-pin {
            width: 40px;
            height: 40px;
          }

          .marker-pulse {
            width: 40px;
            height: 40px;
          }

          .area-label {
            font-size: 0.7rem;
          }
        }
      `}</style>
        </div>
    );
}
