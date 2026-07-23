"use client";

import { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

const PageTransitionContext = createContext({
  isBlurring: false,
  triggerProjectOpen: () => {},
});

export function PageTransitionProvider({ children }) {
  const router = useRouter();

  const triggerProjectOpen = (url) => {
    // Navigate immediately without click-time blur/shrink animation or artificial delay
    router.push(url);
  };

  return (
    <PageTransitionContext.Provider value={{ isBlurring: false, triggerProjectOpen }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  return useContext(PageTransitionContext);
}
