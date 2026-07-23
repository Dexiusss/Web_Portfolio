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

    let x = e.clientX;
    let y = e.clientY;

    // On mobile touch events or SVG child clicks, clientX/clientY can be zero or undefined.
    // Use the button's exact bounding box center as fallback/primary coordinate.
    if (e.currentTarget && typeof e.currentTarget.getBoundingClientRect === 'function') {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];
      document.documentElement.animate(
        {
          clipPath: isDark ? clipPath.reverse() : clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: isDark
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
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
