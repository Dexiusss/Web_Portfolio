import { createClient } from '@supabase/supabase-js';
import ExperiencesList from '@/components/ExperiencesList';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 0; // Disable static caching so it always fetches fresh data

export default async function Experiences() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  const safeProjects = projects
    ? projects
        .filter(p => !p.is_archived)
        .map(p => ({
          ...p,
          thumbnail_url: p.thumbnail_url || (Array.isArray(p.content_blocks) ? p.content_blocks.find(b => b.type === '_meta')?.thumbnail_url : null) || p.image_url
        }))
    : [];

  return (
    <main style={{ position: 'relative', overflow: 'hidden', minHeight: '80vh' }}>
      <div className="bg-gradient-side bg-gradient-left" />
      <div className="bg-gradient-side bg-gradient-right" style={{ top: '40%' }} />
      
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '1000px' }}>
        <h1 className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>
          My Experiences!
        </h1>
        
        <ExperiencesList experiences={safeProjects} />
      </div>
    </main>
  );
}
