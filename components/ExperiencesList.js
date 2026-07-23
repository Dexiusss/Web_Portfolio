"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryTags from './CategoryTags';
import { usePageTransition } from './PageTransitionContext';

export default function ExperiencesList({ experiences }) {
  const [activeCategory, setActiveCategory] = useState('Graphic Design Work');
  const { triggerProjectOpen } = usePageTransition();

  // Filter experiences by active category
  const filteredExperiences = experiences.filter(exp => exp.category === activeCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Category Filter */}
      <div style={{ marginBottom: '4rem' }}>
        <CategoryTags activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      </div>

      {/* Vertical List */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeCategory}
          initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ display: 'flex', flexDirection: 'column', gap: '4rem', width: '100%' }}
        >
          {filteredExperiences.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.5, fontSize: '1.2rem' }}>No experiences found in this category.</p>
          ) : (
            filteredExperiences.map(exp => (
              <div key={exp.id} className="experience-card">
                
                {/* Image */}
                <div className="exp-image" style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '48px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                  {exp.thumbnail_url || exp.image_url ? (
                    <Image src={exp.thumbnail_url || exp.image_url} alt={exp.title || exp.role} fill style={{ objectFit: 'cover', objectPosition: 'top' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#999' }}>No Image</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-gradient exp-title" style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
                  {exp.title || exp.role}
                </h2>
                
                {/* Description */}
                <p className="exp-desc" style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.8, margin: 0 }}>
                  {exp.description}
                </p>

                {/* Button */}
                <button
                  type="button"
                  onClick={() => triggerProjectOpen(`/project/${exp.id}`)}
                  className="pill-button pill-button-primary exp-button"
                  style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', boxShadow: '0 4px 14px rgba(var(--glow-button-rgb), 0.4)', cursor: 'pointer' }}
                >
                  Learn More
                </button>

              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
