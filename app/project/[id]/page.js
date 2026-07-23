
import Link from 'next/link';
import ProjectDetailView from '@/components/ProjectDetailView';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function ProjectDetail({ params }) {
  const { id } = await params;
  
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !project) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1>Project not found</h1>
        <Link href="/" style={{ color: 'var(--color-pink)', textDecoration: 'underline' }}>Go back home</Link>
      </div>
    );
  }

  return <ProjectDetailView project={project} />;
}
