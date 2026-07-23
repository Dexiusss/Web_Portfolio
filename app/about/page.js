import WhoAmI from '@/components/WhoAmI';
import BlurText from '@/components/BlurText';
import FadeInWrapper from '@/components/FadeInWrapper';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 0;

export default async function About() {
  const { data: experiences } = await supabase.from('experiences').select('*').order('created_at', { ascending: true });
  const safeExperiences = experiences ? experiences.filter(e => !e.is_archived) : [];

  const { data: settingsData } = await supabase.from('settings').select('*');
  const settings = {};
  if (settingsData) {
    settingsData.forEach(item => {
      settings[item.key] = item.value;
    });
  }

  return (
    <main style={{ position: 'relative', overflow: 'hidden', minHeight: '80vh' }}>
      <div className="bg-gradient-side bg-gradient-right" />
      
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div style={{
          fontSize: '3.5rem', 
          fontWeight: 700, 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <BlurText
            text="Know More"
            delay={150}
            animateBy="words"
            direction="top"
            elementsClassName="text-dark"
          />
          <BlurText
            text="About Me!"
            delay={150}
            animateBy="words"
            direction="top"
            elementsClassName="text-pink"
          />
        </div>
        
        <FadeInWrapper delay={1.0}>
          <div style={{
            width: '100px',
            height: '5px',
            background: 'var(--color-pink)',
            margin: '0.5rem auto 2rem auto',
            borderRadius: '2px'
          }} />
        </FadeInWrapper>
      </div>
      
      <FadeInWrapper delay={1.2}>
      <WhoAmI 
        experiences={safeExperiences} 
        image1={settings.whoami_image_1}
        image2={settings.whoami_image_2}
        whoamiText={settings.whoami_text}
        whatidoText1={settings.whatido_text_1}
        whatidoText2={settings.whatido_text_2}
        image3={settings.whatido_image}
      />
      </FadeInWrapper>
    </main>
  );
}
