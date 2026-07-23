"use client";

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

const PageTransitionContext = createContext({
  isBlurring: false,
  triggerProjectOpen: () => {},
});

export function PageTransitionProvider({ children }) {
  const [isBlurring, setIsBlurring] = useState(false);
  const router = useRouter();

  const triggerProjectOpen = (url) => {
    setIsBlurring(true);
    setTimeout(() => {
      router.push(url);
      // Reset blur after navigation
      setTimeout(() => {
        setIsBlurring(false);
      }, 500);
    }, 280);
  };

  return (
    <PageTransitionContext.Provider value={{ isBlurring, triggerProjectOpen }}>
      <div style={isBlurring ? {
        filter: 'blur(16px)',
        transform: 'scale(0.97)',
        opacity: 0.5,
        transition: 'filter 0.35s cubic-bezier(0.25, 1, 0.5, 1), transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease',
        willChange: 'filter, transform, opacity'
      } : undefined}>
        {children}
      </div>
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  return useContext(PageTransitionContext);
}
