import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kqrjnmxgzlpkwgnzifoy.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_k1IeSlXmYK5dDFr8eX-6xg_E7BEgmUG';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadFile(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
        .from('nexus-storage')
        .upload(path, file, {
            upsert: true,
            cacheControl: '3600'
        });

    if (error) {
        console.error('Error uploading file:', error);
        throw error;
    }

    const { data: publicUrlData } = supabase.storage
        .from('nexus-storage')
        .getPublicUrl(path);

    return publicUrlData.publicUrl;
}
