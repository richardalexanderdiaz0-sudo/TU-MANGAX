import { createClient } from '@supabase/supabase-js';

// PROYECTO PRINCIPAL (TUS OBRAS ESTÁN AQUÍ)
const primaryUrl = 'https://lomrnbdizrtunqimuhae.supabase.co';
const primaryKey = 'sb_publishable_2aKC-wv-Yc_4m3uMLxc17A_1mGCQUiv';

// PROYECTO SECUNDARIO (NUEVO - PARA CUANDO EL PRIMERO SE LLENE)
const secondaryUrl = 'https://kqrjnmxgzlpkwgnzifoy.supabase.co';
const secondaryKey = 'sb_publishable_k1IeSlXmYK5dDFr8eX-6xg_E7BEgmUG';

export const supabase = createClient(primaryUrl, primaryKey);
export const supabaseSecondary = createClient(secondaryUrl, secondaryKey);

export async function uploadFile(file: File, path: string): Promise<string> {
    // 1. Intentamos subir al proyecto 1 (Principal)
    try {
        const { data, error } = await supabase.storage
            .from('nexus-storage')
            .upload(path, file, {
                upsert: true,
                cacheControl: '3600'
            });

        if (error) {
            const errorMsg = error.message.toLowerCase();
            const isLimitError = errorMsg.includes('quota') || 
                               errorMsg.includes('limit') || 
                               errorMsg.includes('capacity') ||
                               errorMsg.includes('payload too large');
            
            if (isLimitError) {
                console.log('--- STORAGE PROYECTO 1 LLENO. Probando Proyecto 2... ---');
                return await uploadToSecondary(file, path);
            }
            throw error;
        }

        const { data: publicUrlData } = supabase.storage.from('nexus-storage').getPublicUrl(path);
        return publicUrlData.publicUrl;
    } catch (err: any) {
        // Si no es un error de red básico, intentamos el secundario
        console.warn('Reintentando en Proyecto 2 por error en Proyecto 1:', err);
        return await uploadToSecondary(file, path);
    }
}

async function uploadToSecondary(file: File, path: string): Promise<string> {
    try {
        const { data, error } = await supabaseSecondary.storage
            .from('nexus-storage')
            .upload(path, file, {
                upsert: true,
                cacheControl: '3600'
            });

        if (error) {
            console.error('Error crítico: Proyecto 2 también falló o no está configurado:', error);
            throw error;
        }

        const { data: publicUrlData } = supabaseSecondary.storage.from('nexus-storage').getPublicUrl(path);
        return publicUrlData.publicUrl;
    } catch (err) {
        console.error('Fallo total en ambos proyectos de Supabase.');
        throw err;
    }
}
