/**
 * Nexus API Service conectado directamente a Supabase
 * Maneja la subida de imágenes a Supabase Storage y base de datos con Firebase Auth integrado.
 */

import { supabase } from './supabase';
import { auth } from './firebase';

// Helper para convertir archivo a base64 (solo si fuera necesario, pero usaremos subida nativa a Storage)
const fileToBinary = async (file: File): Promise<ArrayBuffer> => {
  return await file.arrayBuffer();
};

// Sube archivos (como portadas, capítulos de imágenes, etc.) a Supabase Storage
const uploadToSupabaseStorage = async (file: File, folder: string): Promise<string> => {
  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('nexus-storage')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw new Error(`Error subiendo archivo: ${error.message}`);
  }

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('nexus-storage')
    .getPublicUrl(fileName);

  return publicUrl;
};

// Asegurar que el usuario de Firebase esté registrado en la tabla de Supabase para integridad de llaves foráneas
const ensureSupabaseUser = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', currentUser.uid)
    .single();

  if (!existingUser) {
    const email = currentUser.email || 'correo@nexus.com';
    await supabase.from('users').insert({
      id: currentUser.uid,
      email: email,
      display_name: currentUser.displayName || email.split('@')[0],
      photo_url: currentUser.photoURL || '',
      role: email === 'richardalexanderdiaz0@gmail.com' ? 'admin' : 'user'
    });
  }
  return currentUser.uid;
};

export const api = {
  // Auth
  auth: {
    login: async () => { throw new Error('Usa la sesión directa de Firebase.'); },
    register: async () => { throw new Error('Usa el registro directo de Firebase.'); },
    me: async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;
      await ensureSupabaseUser();
      return {
        uid: currentUser.uid,
        id: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        avatar: currentUser.photoURL,
      };
    }
  },

  // Stories (Mangas/Manhwas)
  stories: {
    getAll: async (params?: string) => {
      let query = supabase.from('stories').select('*, chapters(created_at)').order('created_at', { ascending: false });
      
      if (params && params.includes('status=')) {
        const statusVal = params.split('status=')[1]?.split('&')[0];
        if (statusVal) {
          query = query.eq('status', statusVal);
        }
      }
      
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      
      return (data || []).map((story: any) => {
          const chapterDates = story.chapters?.map((c: any) => new Date(c.created_at).getTime()) || [];
          const lastUpdate = chapterDates.length > 0 ? new Date(Math.max(...chapterDates)).toISOString() : story.created_at;
          const { chapters, ...rest } = story; // Remove chapters from payload to keep it light
          return {
              ...rest,
              updated_at: lastUpdate
          };
      });
    },

    getOne: async (id: string) => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw new Error(error.message);
      return data;
    },

    create: async (formData: FormData) => {
      await ensureSupabaseUser();
      const title = formData.get('title') as string || 'Nueva Obra';
      const synopsis = formData.get('synopsis') as string || '';
      const status = (formData.get('status') as string) || 'ONGOING';
      const author = (formData.get('author') as string) || 'Desconocido';
      
      const coverFile = formData.get('cover');
      let cover_url = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600';
      
      if (coverFile instanceof File && coverFile.size > 0) {
        cover_url = await uploadToSupabaseStorage(coverFile, 'covers');
      }

      const { data, error } = await supabase
        .from('stories')
        .insert({
          title,
          synopsis,
          status,
          author,
          cover_url,
          likes_count: 0
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return { success: true };
    },

    update: async (id: string, data: any) => {
      const { data: updated, error } = await supabase
        .from('stories')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return updated;
    }
  },

  // Chapters (Soporta imágenes directas, múltiples, PDFs, etc.)
  chapters: {
    getByStory: async (storyId: string) => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('story_id', storyId)
        .order('chapter_number', { ascending: true });

      if (error) throw new Error(error.message);
      // Mapear pages_urls a la propiedad 'pages' que espera el front-end
      return (data || []).map(ch => ({
        ...ch,
        pages: ch.pages_urls || []
      }));
    },

    getOne: async (id: string) => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      return {
        ...data,
        pages: data.pages_urls || []
      };
    },

    create: async (formData: FormData) => {
      await ensureSupabaseUser();
      const storyId = formData.get('story_id') as string || formData.get('story') as string;
      const chapterNum = Number(formData.get('chapter_number') || 1);
      const title = formData.get('title') as string || `Capítulo ${chapterNum}`;
      
      const pagesFiles = formData.getAll('pages');
      const pages_urls: string[] = [];

      for (const file of pagesFiles) {
        if (file instanceof File && file.size > 0) {
          const uploadedUrl = await uploadToSupabaseStorage(file, `pages/${storyId}/chap-${chapterNum}`);
          pages_urls.push(uploadedUrl);
        } else if (typeof file === 'string' && file.startsWith('http')) {
          pages_urls.push(file);
        }
      }

      if (pages_urls.length === 0) {
        pages_urls.push("https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800");
      }

      const { data, error } = await supabase
        .from('chapters')
        .insert({
          story_id: storyId,
          title,
          chapter_number: chapterNum,
          pages_urls
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      
      // Update story to ONGOING if it was SOON
      await supabase.from('stories').update({ status: 'ONGOING' }).eq('id', storyId).eq('status', 'SOON');

      return {
        ...data,
        pages: data.pages_urls || []
      };
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return { success: true };
    }
  },

  // Interactions (Biblioteca, Likes, Comentarios)
  interactions: {
    getLibrary: async () => {
      const userId = await ensureSupabaseUser();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('library')
        .select('stories (*)')
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
      return (data || []).map((item: any) => item.stories).filter(Boolean);
    },

    addToLibrary: async (storyId: string) => {
      const userId = await ensureSupabaseUser();
      if (!userId) throw new Error("Debes haber iniciado sesión.");

      const { error } = await supabase
        .from('library')
        .insert({ user_id: userId, story_id: storyId });

      if (error && error.code !== '23505') { // Ignorar error de clave duplicada
        throw new Error(error.message);
      }
      return { success: true };
    },

    removeFromLibrary: async (storyId: string) => {
      const userId = await ensureSupabaseUser();
      if (!userId) throw new Error("Debes haber iniciado sesión.");

      const { error } = await supabase
        .from('library')
        .delete()
        .eq('user_id', userId)
        .eq('story_id', storyId);

      if (error) throw new Error(error.message);
      return { success: true };
    },

    toggleLike: async (storyId: string) => {
      const userId = await ensureSupabaseUser();
      if (!userId) throw new Error("Debes haber iniciado sesión.");

      // Verificar si ya tiene like
      const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', userId)
        .eq('story_id', storyId)
        .single();

      if (existingLike) {
        // Quitar Like
        await supabase.from('likes').delete().eq('user_id', userId).eq('story_id', storyId);
        // Decrementar contador
        const { data: story } = await supabase.from('stories').select('likes_count').eq('id', storyId).single();
        const newCount = Math.max(0, (story?.likes_count || 0) - 1);
        await supabase.from('stories').update({ likes_count: newCount }).eq('id', storyId);
      } else {
        // Dar Like
        await supabase.from('likes').insert({ user_id: userId, story_id: storyId });
        // Incrementar contador
        const { data: story } = await supabase.from('stories').select('likes_count').eq('id', storyId).single();
        const newCount = (story?.likes_count || 0) + 1;
        await supabase.from('stories').update({ likes_count: newCount }).eq('id', storyId);
      }

      return { success: true };
    },

    // Comments
    getComments: async (chapterId: string) => {
      const { data, error } = await supabase
        .from('comments')
        .select('*, users (display_name, photo_url)')
        .eq('chapter_id', chapterId)
        .order('created_at', { ascending: true });

      if (error) throw new Error(error.message);

      return (data || []).map(c => ({
        id: c.id,
        chapter_id: c.chapter_id,
        content: c.content,
        created: c.created_at,
        user: c.user_id,
        expand: {
          user: {
            display_name: c.users?.display_name || 'Usuario de Nexus',
            avatar: c.users?.photo_url || ''
          }
        }
      }));
    },

    postComment: async (data: any) => {
      const userId = await ensureSupabaseUser();
      if (!userId) throw new Error("Debes haber iniciado sesión.");

      const chapterId = data.chapter_id || data.chapter;
      const { data: comment, error } = await supabase
        .from('comments')
        .insert({
          chapter_id: chapterId,
          user_id: userId,
          content: data.content
        })
        .select('*, users (display_name, photo_url)')
        .single();

      if (error) throw new Error(error.message);

      return {
        id: comment.id,
        chapter_id: comment.chapter_id,
        content: comment.content,
        created: comment.created_at,
        user: comment.user_id,
        expand: {
          user: {
            display_name: comment.users?.display_name || 'Usuario de Nexus',
            avatar: comment.users?.photo_url || ''
          }
        }
      };
    },

    deleteComment: async (id: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return { success: true };
    }
  }
};

// Helper para URLs de imágenes
export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path;
};
