"use client";
import Link from 'next/link';
import BlurText from './BlurText';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="hero-section" style={{
      position: 'relative',
      padding: '4rem 1rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '55vh'
    }}>
      {/* Decorative SVGs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1.5 }}>
        <div className="hero-decor-pencil" style={{ position: 'absolute', top: '5%', right: '8%', zIndex: -1, animation: 'float 6s ease-in-out infinite' }}>
          <svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(15deg)' }}>
            {/* Pencil */}
            <polygon points="10,90 25,85 15,75" fill="none" stroke="var(--color-pink)" strokeWidth="6" strokeLinejoin="round" />
            <polygon points="25,85 85,25 75,15 15,75" fill="none" stroke="var(--color-pink)" strokeWidth="6" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1.5 }}>
        <div className="hero-decor-star" style={{ position: 'absolute', top: '12%', left: '5%', zIndex: -1, animation: 'pulse 3s infinite' }}>
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-red)" />
                <stop offset="67%" stopColor="var(--color-pink)" />
              </linearGradient>
            </defs>
            {/* 8-point Sparkle Star */}
            <path d="M50 0 L58 35 L85 15 L65 42 L100 50 L65 58 L85 85 L58 65 L50 100 L42 65 L15 85 L35 58 L0 50 L35 42 L15 15 L42 35 Z" fill="url(#starGrad)" />
          </svg>
        </div>
      </motion.div>

      {/* Main Content */}
      <div style={{
        fontSize: 'clamp(2.4rem, 8vw, 4.5rem)',
        fontWeight: 700,
        marginBottom: '1.25rem',
        lineHeight: 1.1,
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
        <BlurText
          text="Hello There!"
          delay={150}
          animateBy="words"
          direction="top"
          elementsClassName="text-gradient"
        />
      </div>

      {/* Wrapper to easily position the vector relative to the text */}
      <div style={{ position: 'relative', maxWidth: '600px', width: '100%', margin: '0 auto 2rem auto', padding: '0 0.5rem' }}>

        {/* Top-Left Pacman / Cutout Gradient */}
        {/* <-- YOU CAN MANUALLY ADJUST TOP AND LEFT HERE TO MOVE THE LEFT VECTOR --> */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 1.5 }}>
          <div style={{ position: 'absolute', top: '-60px', left: '-55px', zIndex: -1 }}>
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="gradCutout" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--color-purple)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--color-pink)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path d="M50 50 L100 50 A50 50 0 1 0 50 100 Z" fill="url(#gradCutout)" />
            </svg>
          </div>
        </motion.div>

        {/* Bottom-Right Pacman / Cutout Gradient */}
        {/* <-- YOU CAN MANUALLY ADJUST BOTTOM AND RIGHT HERE TO MOVE THE RIGHT VECTOR --> */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1.5 }}>
          <div style={{ position: 'absolute', bottom: '-75px', right: '-65px', zIndex: -1 }}>
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
              <defs>
                <radialGradient id="gradCutoutRight" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--color-purple)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--color-pink)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path d="M50 50 L100 50 A50 50 0 1 0 50 100 Z" fill="url(#gradCutoutRight)" />
            </svg>
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
          style={{
          fontSize: '1.1rem',
          lineHeight: 1.6,
          color: 'var(--color-text-muted)',
          margin: 0,
          textAlign: 'justify',
          textAlignLast: 'left'
        }}>
          My Name is <span style={{ color: 'var(--color-pink)', fontWeight: 600 }}>Ricky Mario Butar Butar</span>. I am a Data Science Graduate from Telkom University who is passionate in the UI/UX & Graphic Design World!
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1.0, ease: "easeOut" }}
      >
        <Link href="/about" style={{ textDecoration: 'none' }}>
          <button className="pill-button pill-button-primary" style={{ fontSize: '1.1rem', gap: '0.5rem' }}>
            Learn More
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </Link>
      </motion.div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(15deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(15deg); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .hero-decor-pencil {
            top: 1% !important;
            right: 2% !important;
            transform: scale(0.65);
          }
          .hero-decor-star {
            top: 2% !important;
            left: 2% !important;
            transform: scale(0.65);
          }
        }
      `}</style>
    </section>
  );
}
