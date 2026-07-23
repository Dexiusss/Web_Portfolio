"use client";

import FlowingMenu from './FlowingMenu';

export default function ExpertiseSection({ settings = {} }) {
  const demoItems = [
    {
      text: 'Graphic Design',
      link: '#',
      image: settings.expertise_image_1 || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'
    },
    {
      text: 'UI/UX Design',
      link: '#',
      image: settings.expertise_image_2 || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1000&auto=format&fit=crop'
    },
    {
      text: 'Data Science',
      link: '#',
      image: settings.expertise_image_3 || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop'
    },
    {
      text: 'Business Intelligence',
      link: '#',
      image: settings.expertise_image_4 || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  return (
    <section className="expertise-section" style={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2
          className="text-gradient"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 4rem)',
            fontWeight: 700,
            margin: 0
          }}
        >
          My Expertise!
        </h2>
      </div>

      <div className="expertise-flowing-menu" style={{ position: 'relative', minHeight: '360px', margin: '2rem 0' }}>
        <FlowingMenu
          items={demoItems}
          speed={15}
          textColor="var(--color-pink)"
          bgColor="transparent"
          marqueeBgColor="var(--color-pink)"
          marqueeTextColor="#ffffff"
          borderColor="var(--color-pink)"
        />
      </div>

      <div className="container expertise-desc-wrapper" style={{ marginTop: '3.5rem', textAlign: 'left', maxWidth: '850px', margin: '3.5rem auto 0 auto' }}>
        <p
          style={{
            fontSize: '1.1rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.8,
            margin: 0,
            textAlign: 'justify',
            textAlignLast: 'left'
          }}
        >
          My expertise lies at the intersection of data, technology, and creativity. I combine analytical thinking with visual problem-solving to transform complex information into meaningful insights, intuitive digital experiences, and impactful business solutions.
        </p>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          :global(.expertise-section) {
            padding: 3rem 0 !important;
          }
          :global(.expertise-flowing-menu) {
            min-height: auto !important;
            margin: 1rem 0 !important;
          }
          :global(.expertise-desc-wrapper) {
            margin-top: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}
