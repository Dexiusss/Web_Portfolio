"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { usePageTransition } from './PageTransitionContext';

export default function WorkSection({ projects }) {
  const displayProjects = projects.slice(0, 3);
  // Duplicate for seamless infinite loop
  const loopProjects = [...displayProjects, ...displayProjects];

  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { triggerProjectOpen } = usePageTransition();

  useEffect(() => {
    let animationFrameId;

    const scroll = () => {
      if (scrollRef.current && !isHovered) {
        scrollRef.current.scrollTop += 0.5; // slow scroll

        // Loop back if we reached half of the total scroll height (since content is duplicated)
        if (scrollRef.current.scrollTop >= scrollRef.current.scrollHeight / 2) {
          scrollRef.current.scrollTop = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <section className="container work-section-wrapper" style={{ padding: '4rem 0', position: 'relative', fontWeight: 400 }}>
      <div className="work-grid">
        {/* Mobile-only Title Header (renders on top of the gallery on mobile) */}
        <div className="work-header-mobile">
          <h2 className="work-title text-gradient" style={{ fontSize: 'clamp(2.5rem, 7vw, 4rem)', fontWeight: 700, textAlign: 'left', margin: 0 }}>
            My Work
          </h2>
        </div>

        {/* Left column of images - Scrollable */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="work-gallery"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            flex: 1,
            minWidth: '300px',
            height: '800px',
            overflowY: 'hidden',
            padding: '1rem',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            cursor: isHovered ? 'grab' : 'default',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
          }}
        >
          {loopProjects.map((project, idx) => (
            <div
              key={`${project.id}-${idx}`}
              onClick={(e) => {
                e.preventDefault();
                triggerProjectOpen(`/project/${project.id}`);
              }}
              style={{
                position: 'relative',
                width: '100%',
                height: '350px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                flexShrink: 0,
                display: 'block',
                cursor: 'pointer'
              }}
            >
              <Image
                src={project.thumbnail_url || project.image_url || project.imageUrl || '/assets/placeholder.png'}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
          ))}
        </div>

        {/* Right column description */}
        <div className="work-content" style={{ flex: 1, minWidth: '300px', padding: '2rem' }}>
          <h2 className="work-title desktop-only-title text-gradient" style={{ fontSize: 'clamp(2.5rem, 7vw, 4rem)', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'left' }}>
            My Work
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', fontWeight: 400, marginBottom: '2rem', lineHeight: 1.8, textAlign: 'justify', textAlignLast: 'left' }}>
            Every project tells a story of solving a problem. From building interactive dashboards and analyzing complex datasets to designing intuitive digital experiences, each project reflects my passion for turning ideas into impactful solutions. Explore the work that has shaped my journey as a Data Analyst and Digital Creative.
          </p>
          <Link href="/experiences" style={{ textDecoration: 'none' }}>
            <button className="pill-button pill-button-primary">
              Explore More
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .work-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          align-items: center;
          justify-content: center;
        }
        .work-header-mobile {
          display: none;
          width: 100%;
        }
        .desktop-only-title {
          display: block;
        }

        @media (max-width: 768px) {
          :global(.work-section-wrapper) {
            padding: 3rem 1.25rem !important;
          }
          .work-header-mobile {
            display: block;
            margin-bottom: 1rem;
            padding: 0;
          }
          .desktop-only-title {
            display: none;
          }
          .work-content {
            padding: 1.5rem 0 !important;
          }
          .work-gallery {
            height: 420px !important;
            padding: 0.5rem 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
