"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ImageWithLightbox from '@/components/ImageWithLightbox';
import { usePageTransition } from './PageTransitionContext';

export default function ProjectDetailView({ project }) {
  const blocks = project.content_blocks || [];
  const { triggerProjectOpen } = usePageTransition();

  return (
    <motion.main
      initial={{ opacity: 0, filter: 'blur(14px)', y: 25, scale: 0.97 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      style={{ position: 'relative' }}
    >
      <div className="bg-gradient-side bg-gradient-right" style={{ top: '0%' }} />
      
      <div className="container project-detail-container" style={{ padding: '4rem 1.5rem' }}>
        <button
          type="button"
          onClick={() => triggerProjectOpen('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--color-dark)',
            marginBottom: '2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem'
          }}
        >
          <ArrowLeft size={20} /> Back to Portfolio
        </button>
        
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gradient project-title"
          style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center' }}
        >
          {project.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}
        >
          <div style={{ background: 'var(--color-pink)', color: 'white', padding: '0.4rem 1.4rem', borderRadius: '9999px', fontSize: '0.95rem', fontWeight: 600 }}>
            {project.category}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="project-hero-image"
          style={{ position: 'relative', width: '100%', height: '520px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', marginBottom: '3rem' }}
        >
          <ImageWithLightbox
            src={project.image_url}
            alt={project.title}
          />
        </motion.div>
        
        {project.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="project-description-wrapper"
            style={{ maxWidth: '800px', margin: '0 auto 3.5rem auto', textAlign: 'left' }}
          >
            <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', lineHeight: 1.8, textAlign: 'justify', textAlignLast: 'left' }}>
              {project.description}
            </p>
          </motion.div>
        )}

        {/* Dynamic Blocks Rendering */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {blocks.filter(b => b.type !== '_meta').map((block, idx) => {
            const { type, content } = block;

            if (type === 'text') {
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5 }}
                  style={{ maxWidth: '800px', margin: '0 auto', width: '100%', textAlign: 'left' }}
                >
                  <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.8, textAlign: 'justify', textAlignLast: 'left' }}>
                    {content.text}
                  </p>
                </motion.div>
              );
            }

            if (type === 'image') {
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  className="project-block-image"
                  style={{ position: 'relative', width: '100%', height: '480px', borderRadius: '20px', overflow: 'hidden' }}
                >
                  <ImageWithLightbox src={content.imageUrl} alt="Project image" />
                </motion.div>
              );
            }

            if (type === 'grid-text-image') {
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  className="project-grid-2"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}
                >
                  <div>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.8, textAlign: 'justify', textAlignLast: 'left' }}>{content.text}</p>
                  </div>
                  <div className="project-block-image" style={{ position: 'relative', height: '360px', borderRadius: '20px', overflow: 'hidden' }}>
                    <ImageWithLightbox src={content.imageUrl} alt="Project detail" />
                  </div>
                </motion.div>
              );
            }

            if (type === 'grid-image-text') {
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  className="project-grid-2"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}
                >
                  <div className="project-block-image" style={{ position: 'relative', height: '360px', borderRadius: '20px', overflow: 'hidden' }}>
                    <ImageWithLightbox src={content.imageUrl} alt="Project detail" />
                  </div>
                  <div>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.8, textAlign: 'justify', textAlignLast: 'left' }}>{content.text}</p>
                  </div>
                </motion.div>
              );
            }

            if (type === 'grid-images-2') {
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  className="project-grid-2"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}
                >
                  <div className="project-block-image" style={{ position: 'relative', height: '360px', borderRadius: '20px', overflow: 'hidden' }}>
                    <ImageWithLightbox src={content.imageUrl} alt="Project detail 1" />
                  </div>
                  <div className="project-block-image" style={{ position: 'relative', height: '360px', borderRadius: '20px', overflow: 'hidden' }}>
                    <ImageWithLightbox src={content.imageUrl2} alt="Project detail 2" />
                  </div>
                </motion.div>
              );
            }

            return null;
          })}
        </div>

      </div>

      <style jsx>{`
        :global(.project-detail-container p) {
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        @media (max-width: 768px) {
          :global(.project-detail-container) {
            padding: 2rem 1.25rem !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
          }
          :global(.project-title) {
            font-size: clamp(1.6rem, 6.5vw, 2.4rem) !important;
            word-break: break-word !important;
          }
          :global(.project-hero-image) {
            height: auto !important;
            min-height: 220px !important;
            aspect-ratio: 16 / 10 !important;
            border-radius: 16px !important;
            margin-bottom: 2rem !important;
          }
          :global(.project-block-image) {
            height: auto !important;
            min-height: 200px !important;
            aspect-ratio: 16 / 10 !important;
            border-radius: 16px !important;
          }
          :global(.project-grid-2) {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          :global(.project-description-wrapper) {
            margin-bottom: 2rem !important;
          }
        }
      `}</style>
    </motion.main>
  );
}
