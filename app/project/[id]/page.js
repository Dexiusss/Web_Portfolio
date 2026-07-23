import Link from 'next/link';
import ProjectDetailView from '@/components/ProjectDetailView';
import { createClient } from '@supabase/supabase-js';
import { mockProjects } from '@/lib/data';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function ProjectDetail({ params }) {
  const { id } = await params;
  const supabase = getSupabase();
  let project = null;

  if (supabase) {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (data) project = data;
    } catch (e) {
      console.error('ProjectDetail DB error:', e);
    }
  }

  // Fallback to mock project if not found in database
  if (!project) {
    project = mockProjects.find(p => String(p.id) === String(id));
  }

  if (!project) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1>Project not found</h1>
        <Link href="/" style={{ color: 'var(--color-pink)', textDecoration: 'underline' }}>Go back home</Link>
      </div>
    );
  }

  return <ProjectDetailView project={project} />;
}
