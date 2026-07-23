"use client";

import Image from 'next/image';
import Timeline from './Timeline';
import Stack from './Stack';

const StarSVG = () => (
  <svg viewBox="0 0 100 100" style={{ width: '200%', height: '200%' }}>
    <defs>
      <linearGradient id="starGradWhoAmI" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--color-red)" />
        <stop offset="67%" stopColor="var(--color-pink)" />
      </linearGradient>
    </defs>
    <path d="M50 0 L58 35 L85 15 L65 42 L100 50 L65 58 L85 85 L58 65 L50 100 L42 65 L15 85 L35 58 L0 50 L35 42 L15 15 L42 35 Z" fill="url(#starGradWhoAmI)" />
  </svg>
);

export default function WhoAmI({
  experiences,
  isHomepage = false,
  image1,
  image2,
  whoamiText,
  whatidoText1,
  whatidoText2,
  image3
}) {
  const defaultImage1 = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2940&auto=format&fit=crop';
  const defaultImage2 = 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2940&auto=format&fit=crop';
  const defaultImage3 = 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2940&auto=format&fit=crop';

  const img1 = image1 || defaultImage1;
  const img2 = image2 || defaultImage2;
  const img3 = image3 || defaultImage3;

  const textWhoami = whoamiText || "I am a Data Science graduate from Telkom University with a passion for combining data analysis and digital creativity to solve business problems and create meaningful user experiences. I enjoy bridging analytical thinking with creative problem-solving, transforming complex data into actionable insights and intuitive digital solutions.";
  const textWhatido1 = whatidoText1 || "Alongside my analytical background, I have excellence in UI/UX and graphic design, designing user-centered interfaces, creating visual assets, and collaborating directly with clients to deliver digital solutions that balance usability with business objectives. This creative experience has strengthened my ability to understand user needs, communicate ideas visually, and approach challenges from both technical and design perspectives.";
  const textWhatido2 = whatidoText2 || "My technical toolkit includes Python, SQL, MySQL & PostgreSQL, Power BI, Tableau, Microsoft Excel, Google Cloud, NoSQL, machine learning, and data engineering. I enjoy leveraging these tools to improve business processes, optimize operations, and communicate insights through effective data visualization.";

  return (
    <section id="about-me" className="whoami-section" style={{ position: 'relative', padding: '6rem 0', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="whoami-grid" style={{ marginBottom: isHomepage ? '0' : '8rem' }}>
          <div className="whoami-images" style={{ position: 'relative', height: '500px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '80%', height: '85%', position: 'absolute', zIndex: 2 }}>
              <Stack
                randomRotation={false}
                sensitivity={150}
                sendToBackOnClick={true}
                cards={[
                  <Image key="img1" src={img1} alt="Profile 1" fill style={{ objectFit: 'cover' }} />,
                  <Image key="img2" src={img2} alt="Profile 2" fill style={{ objectFit: 'cover' }} />
                ]}
              />
            </div>
            <div style={{ position: 'absolute', top: '-5%', right: '15%', width: '60px', height: '60px', zIndex: 3 }}>
              <StarSVG />
            </div>
            <div style={{ position: 'absolute', bottom: '15%', left: '0%', width: '40px', height: '40px', zIndex: 3 }}>
              <StarSVG />
            </div>

            <div className="swipe-indicator-wrapper" style={{ position: 'absolute', bottom: '-75px', right: '-70px', width: '200px', height: '200px', zIndex: 10, pointerEvents: 'none', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))', transform: 'rotate(-15deg)' }}>
              <Image src="/assets/swipe-indicator.png" alt="Swipe to change picture" fill style={{ objectFit: 'contain' }} />
            </div>
          </div>

          <div className="whoami-content" style={{ textAlign: 'left' }}>
            <h2 className="text-gradient whoami-title" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 700, textAlign: 'left' }}>Who am I?</h2>

            <div className="whoami-text" style={{ width: '100%', textAlign: 'justify', textAlignLast: 'left' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', lineHeight: 1.8, textAlign: 'justify', textAlignLast: 'left' }}>
                {textWhoami}
              </p>
            </div>
          </div>
        </div>

        {!isHomepage && (
          <div className="whatido-grid" style={{ marginBottom: '8rem' }}>
            <div className="whatido-content" style={{ textAlign: 'left' }}>
              <h2 className="text-gradient whatido-title" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 700, marginBottom: '2rem', textAlign: 'left' }}>What I Do?</h2>

              <div className="whatido-text" style={{ width: '100%', textAlign: 'justify', textAlignLast: 'left' }}>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.8, textAlign: 'justify', textAlignLast: 'left' }}>
                  {textWhatido1}
                </p>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.8, textAlign: 'justify', textAlignLast: 'left' }}>
                  {textWhatido2}
                </p>
              </div>
            </div>

            <div className="whatido-images" style={{ position: 'relative', height: '500px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '80%', height: '85%', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                <Image src={img3} alt="What I Do" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'absolute', top: '10%', right: '5%', width: '50px', height: '50px', zIndex: 3 }}>
                <StarSVG />
              </div>
            </div>
          </div>
        )}

        {!isHomepage && (
          <div className="whoami-timeline-wrapper">
            <h2 className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 700, textAlign: 'center', marginBottom: '4rem' }}>
              Experience & Education
            </h2>
            <Timeline experiences={experiences} />
          </div>
        )}
      </div>

      <style jsx>{`
        .whoami-grid, .whatido-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        @media (max-width: 900px) {
          .whoami-grid, .whatido-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .whatido-grid {
            display: flex;
            flex-direction: column-reverse;
          }
        }
      `}</style>
    </section>
  );
}
