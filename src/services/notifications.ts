import { supabase } from './supabase';
import { auth } from './firebase';

/**
 * Servicio de Notificaciones en Tiempo Real para TU MANGAX
 * Gestiona el permiso de notificaciones nativas en dispositivo y la suscripción a Supabase Realtime.
 */

// Solicitar permisos de notificación al usuario
export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        console.warn('Este navegador no soporta notificaciones de escritorio.');
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // Mostrar notificación de prueba elegante
            showNotification(
                '¡Notificaciones Activadas! 🔔',
                'Te avisaremos inmediatamente cuando se suban nuevos capítulos de tus historias en la biblioteca.',
                '/logo.svg'
            );
            return true;
        }
    } catch (error) {
        console.error('Error al solicitar permiso de notificaciones:', error);
    }
    return false;
};

// Enviar una notificación nativa al sistema/dispositivo
export const showNotification = async (title: string, body: string, iconUrl?: string, data?: any) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }

    try {
        // Preferir mostrar por el Service Worker registrado para que aparezca en el tray y pantalla de bloqueo en móviles
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            if (registration) {
                const options: any = {
                    body,
                    icon: iconUrl || '/logo.svg',
                    badge: '/logo.svg',
                    vibrate: [200, 100, 200],
                    data: {
                        url: data?.url || '/',
                    }
                };
                registration.showNotification(title, options);
                return;
            }
        }

        // Fallback a notificación clásica si no hay Service Worker activo
        new Notification(title, {
            body,
            icon: iconUrl || '/logo.svg'
        });
    } catch (e) {
        console.error('Error mostrando la notificación:', e);
    }
};

// Inicializar canales de Supabase Realtime para notificaciones en tiempo real
export const initializeRealtimeNotifications = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    // Suscribirse a inserciones de nuevos capítulos (INSERT es el evento cuando se añade un capítulo)
    const channel = supabase
        .channel('realtime_chapters_notifications')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'chapters' },
            async (payload) => {
                const newChapter = payload.new;
                if (!newChapter) return;

                try {
                    const storyId = newChapter.story_id;
                    const chapterNum = newChapter.chapter_number;
                    const chapterTitle = newChapter.title || `Capítulo ${chapterNum}`;

                    // Verificar con Supabase si el usuario actual tiene esta obra guardada en su 'library'
                    const { data: libraryEntry, error: libErr } = await supabase
                        .from('library')
                        .select('story_id')
                        .eq('user_id', currentUser.uid)
                        .eq('story_id', storyId)
                        .maybeSingle();

                    if (libErr) {
                        console.error('Error al validar biblioteca del usuario:', libErr);
                        return;
                    }

                    // Si está en su biblioteca, obtenemos la información del manga (nombre e imagen) para la notificación
                    if (libraryEntry) {
                        const { data: story, error: storyErr } = await supabase
                            .from('stories')
                            .select('title, cover_url')
                            .eq('id', storyId)
                            .single();

                        if (storyErr || !story) {
                            // Envió de notificación básica sin portada de fallback
                            showNotification(
                                '¡Nuevo Capítulo Disponible! 📖',
                                `Se publicó el ${chapterTitle} de tu obra guardada.`,
                                undefined,
                                { url: `/comic/${storyId}` }
                            );
                        } else {
                            // Envió de notificación enriquecida con título de obra y portada
                            showNotification(
                                `¡Nuevo Capítulo de ${story.title}! 📖✨`,
                                `Ya puedes leer el ${chapterTitle}. ¡Vuela a verlo antes de que te lo cuenten!`,
                                story.cover_url,
                                { url: `/comic/${storyId}` }
                            );
                        }
                    }
                } catch (err) {
                    console.error('Error procesando realtime notification:', err);
                }
            }
        )
        .subscribe();

    return channel;
};
