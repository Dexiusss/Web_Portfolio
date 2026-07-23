"use client";

import { Shapes, Palette, UserRoundCheck } from 'lucide-react';

export default function CategoryTags({ activeCategory, onCategoryChange }) {
  const tags = [
    { name: 'Graphic Design Work', labelMobile: 'Graphic Design', icon: <Shapes className="tag-icon" size={15} /> },
    { name: 'UI/UX Work', labelMobile: 'UI/UX', icon: <Palette className="tag-icon" size={15} /> },
    { name: 'Data Analysis Work', labelMobile: 'Data Analysis', icon: <UserRoundCheck className="tag-icon" size={15} /> }
  ];

  return (
    <div className="category-tags-wrapper">
      <div className="category-tags-container">
        {tags.map((tag) => {
          const isActive = activeCategory === tag.name || (!activeCategory && tag.name === 'Graphic Design Work');
          return (
            <button
              key={tag.name}
              type="button"
              onClick={() => onCategoryChange(tag.name)}
              className={`category-tag-btn ${isActive ? 'active' : ''}`}
            >
              {tag.icon}
              <span className="desktop-label">{tag.name}</span>
              <span className="mobile-label">{tag.labelMobile}</span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .category-tags-wrapper {
          display: flex;
          justify-content: center;
          padding: 1rem 0.5rem 0 0.5rem;
          width: 100%;
          box-sizing: border-box;
        }
        .category-tags-container {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--color-nav-bg);
          padding: 0.35rem;
          border-radius: 9999px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          max-width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          box-sizing: border-box;
        }
        .category-tags-container::-webkit-scrollbar {
          display: none;
        }
        .category-tag-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: transparent;
          color: var(--color-nav-text);
          padding: 0.5rem 1.1rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          border: none;
          white-space: nowrap;
          flex-shrink: 0;
          box-sizing: border-box;
        }
        .category-tag-btn.active {
          background: linear-gradient(90deg, var(--color-pink), var(--color-purple));
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(var(--glow-button-rgb), 0.3);
        }
        .mobile-label {
          display: none;
        }
        .desktop-label {
          display: inline;
        }

        @media (max-width: 640px) {
          .category-tags-wrapper {
            padding: 0.5rem 0.25rem 0 0.25rem;
          }
          .category-tags-container {
            padding: 0.25rem;
            gap: 0.15rem;
            max-width: calc(100vw - 1rem);
          }
          .category-tag-btn {
            padding: 0.35rem 0.55rem;
            font-size: 0.7rem;
            gap: 0.2rem;
          }
          .mobile-label {
            display: inline;
          }
          .desktop-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
