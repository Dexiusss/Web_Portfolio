"use client";

import React from 'react';

export default function SoftwareMarquee({ software = [] }) {
  const displaySoftware = software.length > 0 ? software : [
    { id: '1', name: 'Software 1', image_url: 'https://via.placeholder.com/150' },
    { id: '2', name: 'Software 2', image_url: 'https://via.placeholder.com/150' },
    { id: '3', name: 'Software 3', image_url: 'https://via.placeholder.com/150' },
  ];

  return (
    <div style={{
      width: '100%',
      padding: '2rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--color-dark)',
          marginBottom: '0.5rem'
        }}>
          Software I Used!
        </h2>
        <div style={{
          height: '3px',
          width: '120px',
          background: 'linear-gradient(90deg, var(--color-pink), var(--color-purple))',
          margin: '0 auto',
          borderRadius: '4px'
        }} />
      </div>

      {/* Marquee Container */}
      <div className="marquee-container" style={{
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '1rem 0', // Give some breathing room for the shadow
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
      }}>
        <div className="marquee-content" style={{
          display: 'flex',
          gap: '5rem', // Slightly wider gap
          padding: '0 2rem',
          alignItems: 'center',
          animation: 'marquee-scroll 20s linear infinite'
        }}>
          {/* Double the list for seamless looping */}
          {[...displaySoftware, ...displaySoftware, ...displaySoftware].map((sw, idx) => (
            <div key={`${sw.id}-${idx}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexShrink: 0
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(255, 80, 173, 0.15)', // subtle theme-colored glow
                overflow: 'hidden',
                padding: '10px'
              }}>
                <img src={sw.image_url} alt={sw.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                background: 'linear-gradient(90deg, var(--color-pink), var(--color-purple))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {sw.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
