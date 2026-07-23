import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySession } from '../auth/session';
import { deleteImageFromStorage } from '../deleteImageHelper';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');
      
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Convert array of {key, value} to an object
    const settingsObj = {};
    if (data) {
      data.forEach(item => {
        settingsObj[item.key] = item.value;
      });
    }

    return NextResponse.json({ data: settingsObj });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie || !verifySession(sessionCookie.value)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key, value } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }

    // Fetch existing setting to get the old image URL (only if it's an image setting)
    if (key.includes('image')) {
      const { data: existingSetting } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .single();

      if (existingSetting && existingSetting.value && existingSetting.value !== value) {
        await deleteImageFromStorage(existingSetting.value);
      }
    }

    const { data, error } = await supabase
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' })
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
