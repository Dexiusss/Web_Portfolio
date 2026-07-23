"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';

export default function Gallery({ projects }) {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animationFrameId;
    
    const scroll = () => {
      if (scrollRef.current && !isHovered) {
        // Auto scroll
        scrollRef.current.scrollLeft += 1;
        
        // Loop back if at the end
        if (scrollRef.current.scrollLeft + scrollRef.current.clientWidth >= scrollRef.current.scrollWidth - 1) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <section 
      ref={scrollRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        padding: '2rem 0',
        overflowX: 'auto',
        display: 'flex',
        gap: '1.5rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        cursor: isHovered ? 'grab' : 'default'
      }}
    >
      <style jsx>{`
        section::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {projects.map((project) => (
        <Link key={project.id} href={`/project/${project.id}`} style={{
          minWidth: '300px',
          height: '400px',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          flexShrink: 0,
          display: 'block'
        }}>
          <Image 
            src={project.image_url || project.imageUrl || '/assets/placeholder.png'}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '1.5rem',
            color: 'white'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{project.title}</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{project.category}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
