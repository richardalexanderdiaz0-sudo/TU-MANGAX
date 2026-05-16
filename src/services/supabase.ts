import { createClient } from '@supabase/supabase-js';

// PROYECTO PRINCIPAL (DONDE ESTÁN TUS OBRAS ACTUALES)
const primaryUrl = 'https://lomrnbdizrtunqimuhae.supabase.co';
const primaryKey = 'sb_publishable_2aKC-wv-Yc_4m3uMLxc17A_1mGCQUiv';

export const supabase = createClient(primaryUrl, primaryKey);

// PROYECTO SECUNDARIO (NUEVO, PARA CUANDO EL PRIMERO SE LLENE)
const secondaryUrl = 'https://kqrjnmxgzlpkwgnzifoy.supabase.co';
const secondaryKey = 'sb_publishable_k1IeSlXmYK5dDFr8eX-6xg_E7BEgmUG';
export const supabaseSecondary = createClient(secondaryUrl, secondaryKey);

export async function uploadFile(file: File, path: string): Promise<string> {
    // Intentamos subir al NUEVO proyecto primero si el primero ya está lleno
    // O podemos intentar en el primario y si falla ir al secundario automáticamente.
    try {
        const { data, error } = await supabase.storage
            .from('nexus-storage')
            .upload(path, file, {
                upsert: true,
                cacheControl: '3600'
            });

        if (error) {
            // Si el error es de cuota/espacio, intentamos en el secundario
            if (error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('limit')) {
                console.log('Primario lleno, intentando en proyecto secundario...');
                const { data: secondData, error: secondError } = await supabaseSecondary.storage
                    .from('nexus-storage')
                    .upload(path, file, { upsert: true, cacheControl: '3600' });
                
                if (secondError) throw secondError;

                const { data: publicUrlData } = supabaseSecondary.storage
                    .from('nexus-storage')
                    .getPublicUrl(path);
                return publicUrlData.publicUrl;
            }
            throw error;
        }

        const { data: publicUrlData } = supabase.storage
            .from('nexus-storage')
            .getPublicUrl(path);

        return publicUrlData.publicUrl;
    } catch (err) {
        // Como último recurso, si falla el primario por cualquier razón, intentamos el secundario directamente
        console.warn('Reintentando subida en secundario por error:', err);
        const { data, error } = await supabaseSecondary.storage
            .from('nexus-storage')
            .upload(path, file, { upsert: true, cacheControl: '3600' });
        
        if (error) throw error;
        
        const { data: publicUrlData } = supabaseSecondary.storage
            .from('nexus-storage')
            .getPublicUrl(path);
        return publicUrlData.publicUrl;
    }
}
