/**
 * Nexus API Service
 * Este archivo centraliza todas las llamadas al backend de Ivan.
 * Usa la variable de entorno VITE_API_URL para configurar la ruta base.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    getAll: (params?: string) => request(`/stories${params ? `?${params}` : ''}`),
    getOne: (id: string) => request(`/stories/${id}`),
    create: (formData: FormData) => {
      // Nota: Al enviar FormData no debemos poner Content-Type manual, el navegador lo hace
      return request('/stories', { 
        method: 'POST', 
        body: formData,
        headers: { 'Content-Type': undefined } // Hack para que fetch lo maneje
      });
    },
    delete: (id: string) => request(`/stories/${id}`, { method: 'DELETE' }),
    update: (id: string, data: any) => request(`/stories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // Chapters
  chapters: {
    getByStory: (storyId: string) => request(`/chapters?story_id=${storyId}`),
    getOne: (id: string) => request(`/chapters/${id}`),
    create: (formData: FormData) => {
      return request('/chapters', { 
        method: 'POST', 
        body: formData,
        headers: { 'Content-Type': undefined }
      });
    },
    delete: (id: string) => request(`/chapters/${id}`, { method: 'DELETE' }),
  },

  // Interactions
  interactions: {
    getLibrary: () => request('/library'),
    addToLibrary: (storyId: string) => request('/library', { method: 'POST', body: JSON.stringify({ story_id: storyId }) }),
    removeFromLibrary: (id: string) => request(`/library/${id}`, { method: 'DELETE' }),
    toggleLike: (storyId: string) => request('/likes', { method: 'POST', body: JSON.stringify({ story_id: storyId }) }),
    
    // Comments
    getComments: (chapterId: string) => request(`/comments?chapter_id=${chapterId}`),
    postComment: (data: any) => request('/comments', { method: 'POST', body: JSON.stringify(data) }),
    deleteComment: (id: string) => request(`/comments/${id}`, { method: 'DELETE' }),
  }
};

// Helper para URLs de imágenes
export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}/uploads/${path}`;
};
