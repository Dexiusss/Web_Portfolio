"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function ExtraPage() {
  return (
    <main style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          padding: '3.5rem 2rem',
          borderRadius: '32px',
          background: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1.2rem',
          borderRadius: '9999px',
          background: 'rgba(191, 41, 226, 0.1)',
          color: 'var(--color-purple)',
          fontWeight: 600,
          fontSize: '0.9rem',
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} />
          <span>Special Projects & Playground</span>
        </div>

        <h1 className="text-gradient" style={{
          fontSize: 'clamp(2.8rem, 8vw, 4.5rem)',
          fontWeight: 700,
          marginBottom: '1rem',
          lineHeight: 1.1
        }}>
          Extra
        </h1>

        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
          fontWeight: 600,
          color: 'var(--color-purple)',
          marginBottom: '1.5rem',
          letterSpacing: '0.5px'
        }}>
          Coming Soon
        </h2>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.8,
          marginBottom: '2.5rem',
          maxWidth: '460px',
          margin: '0 auto 2.5rem auto'
        }}>
          Something exciting is in the works! New design experiments, data visualization prototypes, and creative tools will be posted here soon.
        </p>

        <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
          <button className="pill-button pill-button-primary" style={{ fontSize: '1rem', gap: '0.5rem', padding: '0.75rem 1.8rem' }}>
            <ArrowLeft size={18} />
            Back to Home
          </button>
        </Link>
      </motion.div>

      <style jsx>{`
        main::before {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--color-purple) 0%, transparent 70%);
          opacity: 0.15;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 1;
        }
      `}</style>
    </main>
  );
}
