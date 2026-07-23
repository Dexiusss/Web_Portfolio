"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

export default function ImageWithLightbox({ src, alt }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const modalContent = isOpen ? (
    <div 
      onClick={() => setIsOpen(false)}
      onTouchEnd={(e) => {
        e.stopPropagation();
        setIsOpen(false);
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 9999999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'zoom-out',
        padding: '2rem 1rem',
        boxSizing: 'border-box'
      }}
    >
      <div 
        style={{ 
          position: 'relative', 
          width: '92vw', 
          height: '85vh', 
          maxWidth: '1400px', 
          maxHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Image 
          src={src} 
          alt={alt} 
          fill 
          style={{ objectFit: 'contain' }} 
          unoptimized
        />
      </div>

      <button 
        type="button"
        onClick={() => setIsOpen(false)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '25px',
          background: 'rgba(255, 255, 255, 0.25)',
          border: 'none',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          color: 'white',
          fontSize: '1.8rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000000,
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        &times;
      </button>
    </div>
  ) : null;

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
      >
        <Image 
          src={src} 
          alt={alt} 
          fill 
          style={{ objectFit: 'cover' }} 
        />
      </div>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
