"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import GlassSurface from "./GlassSurface";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button 
        style={{
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          background: 'var(--color-nav-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          color: 'var(--color-dark)',
          border: 'none'
        }}
      >
        <span style={{ width: 20, height: 20 }} />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = (e) => {
    const newTheme = isDark ? 'light' : 'dark';
    
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    let originStr = '50% 0px';
    let endRadius = 1000;

    if (isMobile) {
      originStr = '50% 0px';
      endRadius = Math.hypot(window.innerWidth, window.innerHeight);
    } else {
      let x = 0;
      let y = 0;
      if (e.currentTarget && typeof e.currentTarget.getBoundingClientRect === 'function') {
        const rect = e.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else if (e.clientX && e.clientY) {
        x = e.clientX;
        y = e.clientY;
      } else {
        x = window.innerWidth - 60;
        y = 45;
      }
      originStr = `${x}px ${y}px`;
      endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${originStr})`,
            `circle(${endRadius}px at ${originStr})`
          ],
        },
        {
          duration: 450,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  if (isDark) {
    return (
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
        <button
          onClick={toggleTheme}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-dark)',
            transition: 'transform 0.2s',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Switch to light mode"
        >
          <Sun size={20} />
        </button>
      </GlassSurface>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
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
        border: 'none',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      title="Switch to dark mode"
    >
      <Moon size={20} />
    </button>
  );
}
