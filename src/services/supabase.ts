import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lomrnbdizrtunqimuhae.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2aKC-wv-Yc_4m3uMLxc17A_1mGCQUiv';

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
