import { createClient } from '@supabase/supabase-js';
import ExperiencesList from '@/components/ExperiencesList';
import { mockProjects } from '@/lib/data';

export const revalidate = 0;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function Experiences() {
  const supabase = getSupabase();
  let projects = null;

  if (supabase) {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) projects = data;
    } catch (e) {
      console.error('Experiences page DB error:', e);
    }
  }

  const safeProjects = (projects && projects.length > 0)
    ? projects
      .filter(p => !p.is_archived)
      .map(p => ({
        ...p,
        thumbnail_url: p.thumbnail_url || (Array.isArray(p.content_blocks) ? p.content_blocks.find(b => b.type === '_meta')?.thumbnail_url : null) || p.image_url
      }))
    : mockProjects;

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
