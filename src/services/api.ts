/**
 * Nexus API Service
 * Este archivo centraliza todas las llamadas al backend de Ivan.
 * Usa la variable de entorno VITE_API_URL para configurar la ruta base.
 */

import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to determine if a value is base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};

const SEED_STORIES: any[] = [];

const SEED_CHAPTERS: any[] = [];

const SEED_COMMENTS: any[] = [];

const LOCAL_STORIES_KEY = 'nexus_local_stories';
const LOCAL_CHAPTERS_KEY = 'nexus_local_chapters';
const LOCAL_LIBRARY_KEY = 'nexus_local_library';
const LOCAL_LIKES_KEY = 'nexus_local_likes';
const LOCAL_COMMENTS_KEY = 'nexus_local_comments';

const getLocalStories = () => {
  const data = localStorage.getItem(LOCAL_STORIES_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(SEED_STORIES));
    return SEED_STORIES;
  }
  let stories = JSON.parse(data);
  const containsMock = stories.some((s: any) => ['story-1', 'story-2', 'story-3', 'story-4', 'story-5', 'story-6'].includes(s.id));
  if (containsMock) {
    stories = stories.filter((s: any) => !['story-1', 'story-2', 'story-3', 'story-4', 'story-5', 'story-6'].includes(s.id));
    localStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(stories));
  }
  return stories;
};

const saveLocalStories = (stories: any[]) => {
  localStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(stories));
};

const getLocalChapters = () => {
  const data = localStorage.getItem(LOCAL_CHAPTERS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_CHAPTERS_KEY, JSON.stringify(SEED_CHAPTERS));
    return SEED_CHAPTERS;
  }
  let chapters = JSON.parse(data);
  const containsMock = chapters.some((c: any) => ['chap-1-1', 'chap-1-2', 'chap-2-1', 'chap-3-1'].includes(c.id));
  if (containsMock) {
    chapters = chapters.filter((c: any) => !['chap-1-1', 'chap-1-2', 'chap-2-1', 'chap-3-1'].includes(c.id));
    localStorage.setItem(LOCAL_CHAPTERS_KEY, JSON.stringify(chapters));
  }
  return chapters;
};

const saveLocalChapters = (chapters: any[]) => {
  localStorage.setItem(LOCAL_CHAPTERS_KEY, JSON.stringify(chapters));
};

const getLocalLibrary = () => {
  const data = localStorage.getItem(LOCAL_LIBRARY_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalLibrary = (lib: any[]) => {
  localStorage.setItem(LOCAL_LIBRARY_KEY, JSON.stringify(lib));
};

const getLocalLikes = () => {
  const data = localStorage.getItem(LOCAL_LIKES_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalLikes = (likes: any[]) => {
  localStorage.setItem(LOCAL_LIKES_KEY, JSON.stringify(likes));
};

const getLocalComments = () => {
  const data = localStorage.getItem(LOCAL_COMMENTS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(SEED_COMMENTS));
    return SEED_COMMENTS;
  }
  let comments = JSON.parse(data);
  const containsMock = comments.some((c: any) => ['comment-1', 'comment-2'].includes(c.id));
  if (containsMock) {
    comments = comments.filter((c: any) => !['comment-1', 'comment-2'].includes(c.id));
    localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments));
  }
  return comments;
};

const saveLocalComments = (comments: any[]) => {
  localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments));
};

async function withFallback<T>(apiCall: () => Promise<T>, fallbackCall: () => T | Promise<T>): Promise<T> {
  try {
    return await apiCall();
  } catch (err: any) {
    const isNetworkError = !err.status && (
      err.message?.includes('Failed to fetch') || 
      err.message?.includes('fetch') || 
      err.message?.includes('NetworkError') || 
      err.name === 'TypeError'
    );
    if (isNetworkError) {
      console.warn("Ivan's backend is not running or unreachable. Using robust interactive LocalStorage fallback:", err);
      return await fallbackCall();
    }
    throw err;
  }
}

// Helper para peticiones fetch
async function request(endpoint: string, options: any = {}) {
  const token = localStorage.getItem('nexus_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    login: (credentials: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (data: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request('/auth/me'),
  },

  // Stories (Mangas/Manhwas)
  stories: {
    getAll: (params?: string) => withFallback(
      () => request(`/stories${params ? `?${params}` : ''}`),
      () => {
        let stories = getLocalStories();
        if (params && params.includes('status=')) {
          const statusVal = params.split('status=')[1]?.split('&')[0];
          if (statusVal) {
            stories = stories.filter((s: any) => s.status === statusVal);
          }
        }
        return stories;
      }
    ),
    getOne: (id: string) => withFallback(
      () => request(`/stories/${id}`),
      () => {
        const stories = getLocalStories();
        const story = stories.find((s: any) => s.id === id);
        if (!story) throw new Error("Obra no encontrada localmente");
        return story;
      }
    ),
    create: (formData: FormData) => withFallback(
      () => request('/stories', { 
        method: 'POST', 
        body: formData,
        headers: { 'Content-Type': undefined }
      }),
      async () => {
        const title = formData.get('title') as string || 'Nueva Obra';
        const synopsis = formData.get('synopsis') as string || '';
        const status = (formData.get('status') as any) || 'ONGOING';
        const coverFile = formData.get('cover');
        
        let cover_url = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600';
        if (coverFile instanceof File) {
          cover_url = await fileToBase64(coverFile);
        }

        const newStory = {
          id: `story-${Date.now()}`,
          title,
          synopsis,
          status,
          likes_count: 0,
          cover_url,
          cover: "",
          created_at: new Date().toISOString(),
          created: new Date().toISOString()
        };

        const list = getLocalStories();
        list.unshift(newStory);
        saveLocalStories(list);
        return newStory;
      }
    ),
    delete: (id: string) => withFallback(
      () => request(`/stories/${id}`, { method: 'DELETE' }),
      () => {
        const list = getLocalStories().filter((s: any) => s.id !== id);
        saveLocalStories(list);
        return { success: true };
      }
    ),
    update: (id: string, data: any) => withFallback(
      () => request(`/stories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
      () => {
        const list = getLocalStories();
        const idx = list.findIndex((s: any) => s.id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...data };
          saveLocalStories(list);
          return list[idx];
        }
        throw new Error("Obra no encontrada para actualizar");
      }
    ),
  },

  // Chapters
  chapters: {
    getByStory: (storyId: string) => withFallback(
      () => request(`/chapters?story_id=${storyId}`),
      () => {
        const chapters = getLocalChapters();
        return chapters.filter((c: any) => c.story_id === storyId || c.story === storyId);
      }
    ),
    getOne: (id: string) => withFallback(
      () => request(`/chapters/${id}`),
      () => {
        const chapters = getLocalChapters();
        const chap = chapters.find((c: any) => c.id === id);
        if (!chap) throw new Error("Capítulo no encontrado localmente");
        return chap;
      }
    ),
    create: (formData: FormData) => withFallback(
      () => request('/chapters', { 
        method: 'POST', 
        body: formData,
        headers: { 'Content-Type': undefined }
      }),
      async () => {
        const storyId = formData.get('story_id') as string || formData.get('story') as string;
        const chapterNum = Number(formData.get('chapter_number') || 1);
        const title = formData.get('title') as string || `Capítulo ${chapterNum}`;
        
        const pagesFiles = formData.getAll('pages');
        const pages: string[] = [];
        for (const file of pagesFiles) {
          if (file instanceof File) {
            pages.push(await fileToBase64(file));
          } else if (typeof file === 'string') {
            pages.push(file);
          }
        }

        if (pages.length === 0) {
          pages.push("https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800");
        }

        const newChapter = {
          id: `chapter-${Date.now()}`,
          story: storyId,
          story_id: storyId,
          chapter_number: chapterNum,
          title,
          pages,
          created_at: new Date().toISOString(),
          created: new Date().toISOString()
        };

        const list = getLocalChapters();
        list.push(newChapter);
        saveLocalChapters(list);
        return newChapter;
      }
    ),
    delete: (id: string) => withFallback(
      () => request(`/chapters/${id}`, { method: 'DELETE' }),
      () => {
        const list = getLocalChapters().filter((c: any) => c.id !== id);
        saveLocalChapters(list);
        return { success: true };
      }
    ),
  },

  // Interactions
  interactions: {
    getLibrary: () => withFallback(
      () => request('/library'),
      () => {
        const libIds = getLocalLibrary();
        const stories = getLocalStories();
        return stories.filter((s: any) => libIds.includes(s.id));
      }
    ),
    addToLibrary: (storyId: string) => withFallback(
      () => request('/library', { method: 'POST', body: JSON.stringify({ story_id: storyId }) }),
      () => {
        const lib = getLocalLibrary();
        if (!lib.includes(storyId)) {
          lib.push(storyId);
          saveLocalLibrary(lib);
        }
        return { success: true };
      }
    ),
    removeFromLibrary: (id: string) => withFallback(
      () => request(`/library/${id}`, { method: 'DELETE' }),
      () => {
        const lib = getLocalLibrary().filter((sId: string) => sId !== id);
        saveLocalLibrary(lib);
        return { success: true };
      }
    ),
    toggleLike: (storyId: string) => withFallback(
      () => request('/likes', { method: 'POST', body: JSON.stringify({ story_id: storyId }) }),
      () => {
        const likes = getLocalLikes();
        const idx = likes.indexOf(storyId);
        const stories = getLocalStories();
        const sIdx = stories.findIndex((s: any) => s.id === storyId);

        if (idx !== -1) {
          likes.splice(idx, 1);
          if (sIdx !== -1) {
            stories[sIdx].likes_count = Math.max(0, (stories[sIdx].likes_count || 0) - 1);
          }
        } else {
          likes.push(storyId);
          if (sIdx !== -1) {
            stories[sIdx].likes_count = (stories[sIdx].likes_count || 0) + 1;
          }
        }
        saveLocalLikes(likes);
        saveLocalStories(stories);
        return { success: true };
      }
    ),
    
    // Comments
    getComments: (chapterId: string) => withFallback(
      () => request(`/comments?chapter_id=${chapterId}`),
      () => {
        const comments = getLocalComments();
        return comments.filter((c: any) => c.chapter === chapterId || c.chapter_id === chapterId);
      }
    ),
    postComment: (data: any) => withFallback(
      () => request('/comments', { method: 'POST', body: JSON.stringify(data) }),
      () => {
        const comments = getLocalComments();
        const userEmail = auth.currentUser?.email || 'usuario@nexus.com';
        const userDisplayName = auth.currentUser?.displayName || userEmail.split('@')[0];
        const userPhoto = auth.currentUser?.photoURL || '';

        const newComment = {
          id: `comment-${Date.now()}`,
          chapter: data.chapter_id || data.chapter,
          chapter_id: data.chapter_id || data.chapter,
          content: data.content,
          parent: data.parent_id || data.parent,
          parent_id: data.parent_id || data.parent,
          user: auth.currentUser?.uid || 'offline-user',
          expand: {
            user: {
              display_name: userDisplayName,
              avatar: userPhoto
            }
          },
          created: new Date().toISOString()
        };

        comments.push(newComment);
        saveLocalComments(comments);
        return newComment;
      }
    ),
    deleteComment: (id: string) => withFallback(
      () => request(`/comments/${id}`, { method: 'DELETE' }),
      () => {
        const list = getLocalComments().filter((c: any) => c.id !== id);
        saveLocalComments(list);
        return { success: true };
      }
    ),
  }
};

// Helper para URLs de imágenes
export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}/uploads/${path}`;
};
