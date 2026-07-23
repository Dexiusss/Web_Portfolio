"use client";

import Link from 'next/link';

export default function ContactFooter() {
  return (
    <footer style={{ padding: '4rem 0', background: 'var(--color-footer-bg)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'space-between' }}>
          
          {/* Left Side: Contact Info */}
          <div style={{ flex: '1', minWidth: '280px' }}>
            <h2 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Get in Touch!
            </h2>
            <div style={{
              width: '180px',
              height: '3px',
              background: 'linear-gradient(90deg, var(--color-pink) 0%, transparent 100%)',
              marginBottom: '2.5rem',
              borderRadius: '2px'
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <Link href="https://linkedin.com/in/rickymariobutarbutar" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.05rem', color: 'var(--color-dark)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-pink)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-dark)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                linkedin.com/in/rickymariobutarbutar
              </Link>
              <Link href="https://instagram.com/dexiusss" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.05rem', color: 'var(--color-dark)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-pink)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-dark)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                instagram.com/dexiusss
              </Link>
              <Link href="https://github.com/Dexiusss" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.05rem', color: 'var(--color-dark)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-pink)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-dark)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                github.com/Dexiusss
              </Link>
              <Link href="mailto:rickymario62@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.05rem', color: 'var(--color-dark)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-pink)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-dark)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                rickymario62@gmail.com
              </Link>
              <Link href="tel:081345601252" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.05rem', color: 'var(--color-dark)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-pink)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-dark)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                081345601252
              </Link>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div style={{ flex: '1.2', minWidth: '320px' }}>
            <h2 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Contact Me
            </h2>
            <div style={{
              width: '180px',
              height: '3px',
              background: 'linear-gradient(90deg, var(--color-pink) 0%, transparent 100%)',
              marginBottom: '1.5rem',
              borderRadius: '2px'
            }} />

            <form action="https://formsubmit.co/rickymario62@gmail.com" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Form border box */}
              <div style={{
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                background: 'var(--color-card-bg)'
              }}>
                <input type="text" name="_honey" style={{ display: 'none' }} />
                <input type="hidden" name="_captcha" value="true" />
                <input type="hidden" name="_subject" value="New Contact from Portfolio!" />

                <input type="text" name="name" placeholder="Name" required style={{ border: 'none', background: 'transparent', padding: '0.5rem 0', fontSize: '1rem', outline: 'none', color: 'var(--color-dark)' }} />
                <input type="text" name="surname" placeholder="Surname" required style={{ border: 'none', background: 'transparent', padding: '0.5rem 0', fontSize: '1rem', outline: 'none', color: 'var(--color-dark)' }} />
                <input type="email" name="email" placeholder="Email" required style={{ border: 'none', background: 'transparent', padding: '0.5rem 0', fontSize: '1rem', outline: 'none', color: 'var(--color-dark)' }} />
                <textarea name="message" placeholder="Messages" required rows={2} style={{ border: 'none', background: 'transparent', padding: '0.5rem 0', fontSize: '1rem', outline: 'none', resize: 'vertical', color: 'var(--color-dark)' }} />
              </div>

              <button type="submit" className="pill-button pill-button-primary" style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }}>
                Send!
              </button>
            </form>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.1)', opacity: 0.6 }}>
          &copy; {new Date().getFullYear()} Ricky Mario Butar-Butar. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
