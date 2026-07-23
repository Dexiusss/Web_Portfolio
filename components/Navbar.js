"use client";

import Link from 'next/link';
import { User } from 'lucide-react';
import PillNav from './PillNav';
import StaggeredMenu from './StaggeredMenu';
import ThemeToggle from './ThemeToggle';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import GlassSurface from './GlassSurface';

export default function Navbar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  const items = [
    { label: 'Home', href: '/' },
    { label: 'About Me', href: '/about' },
    { label: 'Experiences', href: '/experiences' },
    { label: 'Extra', href: '/extra' },
  ];

  const socialItems = [
    { label: 'LinkedIn', link: 'https://linkedin.com' },
    { label: 'GitHub', link: 'https://github.com' }
  ];

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '2rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <PillNav
        items={items}
        baseColor="var(--color-nav-bg)"
        pillColor="transparent"
        pillTextColor="var(--color-nav-text)"
        hoveredPillTextColor="#ffffff"
        hoverCircleBg="var(--color-purple)"
      />

      <div className="mobile-only-menu" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 999, pointerEvents: 'none' }}>
        <StaggeredMenu
          items={items.map(i => ({ label: i.label, link: i.href }))}
          socialItems={socialItems}
          displaySocials={true}
          menuButtonColor="var(--color-dark)"
          openMenuButtonColor="var(--color-dark)"
          colors={['var(--color-pink)', 'var(--color-purple)']}
          accentColor="var(--color-pink)"
          position="right"
        />
      </div>

      {/* Login & Theme Toggle */}
      <div className="nav-actions" style={{
        position: 'absolute',
        right: '2rem',
        top: '2rem',
        display: 'flex',
        gap: '1rem',
        zIndex: 100
      }}>
        <ThemeToggle />
        {isDark ? (
          <GlassSurface
            width={45}
            height={45}
            borderRadius={9999}
            displace={2.2}
            distortionScale={-60}
            redOffset={-14}
            greenOffset={8}
            blueOffset={11}
            brightness={42}
            opacity={0.67}
            backgroundOpacity={0.39}
            mixBlendMode="screen"
            blur={11}
            saturation={1}
            className="nav-action-glass"
          >
            <Link href="/admin" style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-dark)',
              transition: 'transform 0.2s',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title="Admin Dashboard"
            >
              <User size={20} />
            </Link>
          </GlassSurface>
        ) : (
          <Link href="/admin" style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: 'var(--color-nav-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            color: 'var(--color-dark)',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Admin Dashboard"
          >
            <User size={20} />
          </Link>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          :global(.mobile-only-menu) {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 0 !important;
            z-index: 99999 !important;
            pointer-events: none !important;
          }
          :global(.nav-actions) {
            position: fixed !important;
            top: 1rem !important;
            right: 1.25rem !important;
            z-index: 100000 !important;
            pointer-events: auto !important;
          }
        }
      `}</style>
    </nav>
  );
}
