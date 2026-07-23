"use client";

import { usePathname } from 'next/navigation';
import ContactFooter from './ContactFooter';

export default function GlobalFooter() {
  const pathname = usePathname();

  // Do not show the footer on admin routes
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return <ContactFooter />;
}
