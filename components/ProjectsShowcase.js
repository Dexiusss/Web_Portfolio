"use client";

import { useState } from 'react';
import CategoryTags from './CategoryTags';
import CircularGallery from './CircularGallery';
import { usePageTransition } from './PageTransitionContext';

export default function ProjectsShowcase({ projects }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const { triggerProjectOpen } = usePageTransition();

  const filteredProjects = activeCategory
    ? projects.filter(p => p.category === activeCategory)
    : projects;

  return (
    <>
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <CategoryTags
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
      <div className="circular-gallery-container" style={{ marginTop: '-3.5rem', height: '580px', position: 'relative', width: '100vw', marginLeft: 'calc(-50vw + 50%)', zIndex: 0 }}>
        <CircularGallery
          items={filteredProjects}
          bend={0.6}
          borderRadius={0.04}
          textColor="#ffffff"
          onClick={(project) => {
            if (project && project.id) {
              triggerProjectOpen(`/project/${project.id}`);
            }
          }}
        />
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .circular-gallery-container {
            height: 420px !important;
            margin-top: -4.5rem !important;
            margin-bottom: -2.5rem !important;
          }
        }
      `}</style>
    </>
  );
}
