import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySession } from '../auth/session';
import { deleteImageFromStorage } from '../deleteImageHelper';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie || !verifySession(sessionCookie.value)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataObj = await request.json();

    const { data: insertedData, error } = await supabase
      .from('software')
      .insert([dataObj])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: insertedData });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('software')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });
      
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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

    const dataObj = await request.json();
    const { id, ...updateData } = dataObj;

    // Fetch existing software to get the old image URL
    const { data: existingSoftware } = await supabase
      .from('software')
      .select('image_url')
      .eq('id', id)
      .single();

    if (existingSoftware && updateData.image_url && existingSoftware.image_url !== updateData.image_url) {
      await deleteImageFromStorage(existingSoftware.image_url);
    }

    const { data: updatedData, error } = await supabase
      .from('software')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
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

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    // Fetch existing software to get the old image URL
    const { data: existingSoftware } = await supabase
      .from('software')
      .select('image_url')
      .eq('id', id)
      .single();

    if (existingSoftware && existingSoftware.image_url) {
      await deleteImageFromStorage(existingSoftware.image_url);
    }

    const { error } = await supabase
      .from('software')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
