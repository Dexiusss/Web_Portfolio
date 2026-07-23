"use client";

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function Timeline({ experiences = [] }) {
  const [activeTab, setActiveTab] = useState('Work Experience');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const parseDate = (durationStr) => {
    if (!durationStr) return new Date(0);
    const startPart = durationStr.split('-')[0].trim();
    const date = new Date(startPart);
    return isNaN(date.getTime()) ? new Date(0) : date;
  };

  const filtered = experiences
    .filter(exp => exp.category === activeTab)
    .sort((a, b) => parseDate(b.duration) - parseDate(a.duration));

  return (
    <div className="timeline-wrapper" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', marginTop: '6rem' }}>
      
      {/* Tabs */}
      <div className="timeline-tabs-container">
        <button 
          type="button"
          onClick={() => setActiveTab('Work Experience')}
          className={`timeline-tab-btn ${activeTab === 'Work Experience' ? 'active' : ''}`}
        >
          <span className="desktop-tab">Work Experience</span>
          <span className="mobile-tab">Work Exp</span>
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('Organization and Volunteer')}
          className={`timeline-tab-btn ${activeTab === 'Organization and Volunteer' ? 'active' : ''}`}
        >
          <span className="desktop-tab">Organization and Volunteer</span>
          <span className="mobile-tab">Org & Volunteer</span>
        </button>
      </div>

      {/* Animated Vertical Timeline */}
      <div ref={ref} className="timeline-content-wrapper" style={{ position: 'relative', padding: '2rem 0' }}>
        
        {/* The Central Animated Line */}
        <div className="timeline-center-line" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '4px', transform: 'translateX(-50%)', background: 'rgba(var(--glow-button-rgb), 0.2)', borderRadius: '4px' }}>
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: '100%' } : { height: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ width: '100%', background: 'linear-gradient(to bottom, var(--color-pink), var(--color-purple))', borderRadius: '4px' }}
          />
        </div>

        {/* Timeline Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {filtered.map((exp, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div key={exp.id || index} className="timeline-row" style={{ 
                display: 'flex', 
                justifyContent: isLeft ? 'flex-start' : 'flex-end',
                alignItems: 'center',
                width: '100%',
                position: 'relative'
              }}>
                
                {/* The Dot on the line */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{ delay: 0.5 + (index * 0.3), duration: 0.4 }}
                  className="timeline-dot"
                  style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '24px',
                    height: '24px',
                    background: 'var(--color-pink)',
                    border: '4px solid var(--color-bg-base)',
                    borderRadius: '50%',
                    zIndex: 2,
                    boxShadow: '0 0 10px rgba(var(--glow-button-rgb), 0.5)'
                  }}
                />

                {/* The Content Card */}
                <motion.div 
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -50 : 50 }}
                  transition={{ delay: 0.7 + (index * 0.3), duration: 0.5 }}
                  className={`timeline-card ${isLeft ? 'card-left' : 'card-right'}`}
                  style={{ 
                    width: '45%', 
                    background: 'var(--color-card-bg)', 
                    padding: '2rem', 
                    borderRadius: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    textAlign: isLeft ? 'right' : 'left',
                    position: 'relative'
                  }}
                >
                  {index === 0 && activeTab === 'Work Experience' && (
                    <div className="now-badge" style={{ position: 'absolute', top: '-15px', [isLeft ? 'right' : 'left']: '2rem', background: 'var(--color-pink)', color: 'white', padding: '0.2rem 1.5rem', borderRadius: '9999px', fontWeight: 700, fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(var(--glow-button-rgb), 0.3)' }}>
                      Now!
                    </div>
                  )}
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-pink)', marginBottom: '0.5rem' }}>{exp.company}</h3>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '1rem' }}>{exp.role}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem', fontWeight: 600 }}>{exp.duration || exp.start_date}</p>
                  
                  <p className="timeline-desc" style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.6, textAlign: 'justify', textAlignLast: 'left' }}>
                    {exp.description}
                  </p>
                </motion.div>

              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .timeline-tabs-container {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 4rem;
        }
        .timeline-tab-btn {
          background: transparent;
          color: var(--color-nav-text);
          border: 2px solid var(--color-nav-text);
          padding: 0.6rem 1.8rem;
          border-radius: 9999px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          white-space: nowrap;
        }
        .timeline-tab-btn.active {
          background: linear-gradient(90deg, var(--color-pink), var(--color-purple));
          color: white;
          border: 2px solid transparent;
          box-shadow: 0 4px 15px rgba(var(--glow-button-rgb), 0.3);
        }
        .mobile-tab {
          display: none;
        }
        .desktop-tab {
          display: inline;
        }

        @media (max-width: 768px) {
          :global(.timeline-wrapper) {
            margin-top: 3rem !important;
          }
          .timeline-tabs-container {
            gap: 0.5rem;
            margin-bottom: 2rem;
            padding: 0 0.5rem;
          }
          .timeline-tab-btn {
            padding: 0.45rem 0.85rem;
            font-size: 0.8rem;
          }
          .mobile-tab {
            display: inline;
          }
          .desktop-tab {
            display: none;
          }
          :global(.timeline-desc) {
            display: none !important;
          }
          :global(.timeline-card) {
            width: 82% !important;
            padding: 1.25rem !important;
            text-align: left !important;
            margin-left: 2.5rem !important;
          }
          :global(.timeline-card h3),
          :global(.timeline-card h4),
          :global(.timeline-card p),
          :global(.timeline-card span) {
            text-align: left !important;
          }
          :global(.timeline-row) {
            justify-content: flex-start !important;
          }
          :global(.timeline-center-line) {
            left: 1rem !important;
            transform: none !important;
          }
          :global(.timeline-dot) {
            left: 1rem !important;
            transform: translateX(-50%) !important;
          }
          :global(.now-badge) {
            left: 1rem !important;
            right: auto !important;
            font-size: 0.85rem !important;
            padding: 0.15rem 0.8rem !important;
            top: -12px !important;
          }
        }
      `}</style>
    </div>
  );
}
