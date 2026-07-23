import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function deleteImageFromStorage(imageUrl) {
  try {
    if (!imageUrl || !imageUrl.includes('portfolio-assets')) return;

    const parts = imageUrl.split('/portfolio-assets/');
    if (parts.length === 2) {
      const filePath = parts[1];
      const { error } = await supabase.storage.from('portfolio-assets').remove([filePath]);
      if (error) {
        console.error('Error deleting old image:', error);
      } else {
        console.log('Successfully deleted old image:', filePath);
      }
    }
  } catch (err) {
    console.error('Failed to parse or delete old image:', err);
  }
}
