import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { PageTransitionProvider } from '@/components/PageTransitionContext';
import Navbar from '@/components/Navbar';
import GlobalFooter from '@/components/GlobalFooter';
import { Figtree } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const figtree = Figtree({ 
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
});

export const metadata = {
  title: 'Ricky Mario | UI/UX Designer & Data Science Portfolio',
  description: 'Portfolio of Ricky Mario Butar Butar, a Data Science Graduate from Telkom University specializing in UI/UX & Graphic Design.',
  keywords: ['Ricky Mario Butar Butar', 'UI/UX Design', 'Data Science', 'Graphic Design', 'Product Design', 'Telkom University'],
  authors: [{ name: 'Ricky Mario Butar Butar' }],
  creator: 'Ricky Mario Butar Butar',
  openGraph: {
    title: 'Ricky Mario | UI/UX Designer & Data Science Portfolio',
    description: 'Data Science Graduate passionate about UI/UX & Graphic Design.',
    url: 'https://rickymario.dev',
    siteName: 'Ricky Mario Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ricky Mario | UI/UX Designer & Data Science Portfolio',
    description: 'Data Science Graduate passionate about UI/UX & Graphic Design.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${figtree.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link href="https://fonts.cdnfonts.com/css/cal-sans" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="light">
          <PageTransitionProvider>
            <Navbar />
            {children}
            <GlobalFooter />
          </PageTransitionProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
