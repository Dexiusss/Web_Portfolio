import Hero from '@/components/Hero';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import WhoAmI from '@/components/WhoAmI';
import ExpertiseSection from '@/components/ExpertiseSection';
import WorkSection from '@/components/WorkSection';
import SoftwareMarquee from '@/components/SoftwareMarquee';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 0;

export default async function Home() {
  const { data: projects } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  const { data: experiences } = await supabase.from('experiences').select('*').order('created_at', { ascending: true });
  const { data: software } = await supabase.from('software').select('*').order('order_index', { ascending: true });
  
  const { data: settingsData } = await supabase.from('settings').select('*');
  const settings = {};
  if (settingsData) {
    settingsData.forEach(item => {
      settings[item.key] = item.value;
    });
  }

  const safeProjects = projects
    ? projects
        .filter(p => !p.is_archived)
        .map(p => ({
          ...p,
          thumbnail_url: p.thumbnail_url || (Array.isArray(p.content_blocks) ? p.content_blocks.find(b => b.type === '_meta')?.thumbnail_url : null) || p.image_url
        }))
    : [];
  const safeExperiences = experiences ? experiences.filter(e => !e.is_archived) : [];
  const safeSoftware = software || [];

  return (
    <main style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background gradients */}
      <div className="bg-glow-left" style={{ top: '5%' }} />
      <div className="bg-glow-right" style={{ top: '30%' }} />
      <div className="bg-glow-left" style={{ top: '65%' }} />
      
      <div className="container">
        <Hero />
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <ProjectsShowcase projects={safeProjects} />
      </div>
      
      <div style={{ marginTop: '0rem', marginBottom: '0' }}>
        <WhoAmI 
          experiences={safeExperiences} 
          isHomepage={true} 
          image1={settings.whoami_image_1 || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2940&auto=format&fit=crop'}
          image2={settings.whoami_image_2 || 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2940&auto=format&fit=crop'}
          whoamiText={settings.whoami_text}
        />
      </div>

      <ExpertiseSection settings={settings} />

      <div style={{ marginTop: '0', marginBottom: '8rem' }}>
        <SoftwareMarquee software={safeSoftware} />
      </div>
      
      <WorkSection projects={safeProjects} />
    </main>
  );
}
