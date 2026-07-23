import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { deleteImageFromStorage } from '../deleteImageHelper';
import { verifySession } from '../auth/session';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie || !verifySession(sessionCookie.value)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectData = await request.json();
    let dataToInsert = { ...projectData };

    let { data: insertedData, error } = await supabase
      .from('projects')
      .insert([dataToInsert])
      .select();

    if (error && error.message && error.message.includes('thumbnail_url')) {
      delete dataToInsert.thumbnail_url;
      const retry = await supabase
        .from('projects')
        .insert([dataToInsert])
        .select();
      insertedData = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: insertedData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (data) {
      data.forEach(proj => {
        if (!proj.thumbnail_url && Array.isArray(proj.content_blocks)) {
          const meta = proj.content_blocks.find(b => b.type === '_meta');
          if (meta && meta.thumbnail_url) {
            proj.thumbnail_url = meta.thumbnail_url;
          }
        }
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie || !verifySession(sessionCookie.value)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectData = await request.json();
    const { id, ...updateData } = projectData;

    // Fetch existing project to get the old image URL
    const { data: existingProject } = await supabase
      .from('projects')
      .select('image_url')
      .eq('id', id)
      .single();

    if (existingProject && updateData.image_url && existingProject.image_url !== updateData.image_url) {
      await deleteImageFromStorage(existingProject.image_url);
    }

    let dataToUpdate = { ...updateData };
    let { data: updatedData, error } = await supabase
      .from('projects')
      .update(dataToUpdate)
      .eq('id', id)
      .select();

    if (error && error.message && error.message.includes('thumbnail_url')) {
      delete dataToUpdate.thumbnail_url;
      const retry = await supabase
        .from('projects')
        .update(dataToUpdate)
        .eq('id', id)
        .select();
      updatedData = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie || !verifySession(sessionCookie.value)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Fetch existing project to get the old image URL
    const { data: existingProject } = await supabase
      .from('projects')
      .select('image_url')
      .eq('id', id)
      .single();

    if (existingProject && existingProject.image_url) {
      await deleteImageFromStorage(existingProject.image_url);
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
