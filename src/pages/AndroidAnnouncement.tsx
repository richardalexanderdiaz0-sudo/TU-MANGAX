import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { ChevronLeft, Calendar, User, Trash2, Megaphone, Video, Image as ImageIcon, MessageSquare, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function AndroidAnnouncement() {
    const { user, userProfile } = useStore();
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const data = await api.announcements.getAll();
            setAnnouncements(data);
            
            // Mark as read
            if (data && data.length > 0) {
                const latestId = String(data[0].id || data[0].created_at || 'initial');
                localStorage.setItem('last_seen_announcement_id', latestId);
                localStorage.setItem('hasReadAndroidNews', 'true'); // Backward compatibility
                window.dispatchEvent(new Event('androidNewsRead'));
            }
        } catch (e) {
            console.error("Error loading announcements", e);
        }
        setLoading(false);
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        fetchAnnouncements();
    }, []);

    const handleDelete = async (id: string | number) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta noticia permanente para todos?")) return;
        try {
            await api.announcements.delete(id);
            setAnnouncements(announcements.filter(item => item.id !== id));
            // Trigger update in navbar
            window.dispatchEvent(new Event('androidNewsRead'));
        } catch (err) {
            console.error("Error deleting announcement", err);
            alert("No se pudo eliminar la noticia.");
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }) + ' ' + new Date(dateStr).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Reciente';
        }
    };

    const isAdmin = userProfile?.role === 'admin';

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 pb-24">
            <button 
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold uppercase tracking-widest text-sm"
            >
                <ChevronLeft className="w-5 h-5" />
                Volver
            </button>

            {/* Header decorativo de noticias */}
            <div className="flex items-center gap-4 mb-10">
                <div className="bg-primary p-4 rounded-3xl border-4 border-black rotate-[-3deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white">
                    <Megaphone className="w-8 h-8 stroke-[2.5px]" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-none tracking-tight uppercase italic">
                        Canal Oficial de Noticias
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-black mt-1">
                        Novedades, actualizaciones y anuncios de RUIWORKS
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-24 bg-white border-4 border-black rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-r-transparent"></div>
                    <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">Sincronizando noticias del mundo...</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {announcements.length === 0 ? (
                        <div className="bg-white border-4 border-black rounded-[2.5rem] p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-loose">No hay noticias publicadas por el momento.</p>
                        </div>
                    ) : (
                        announcements.map((item, index) => (
                            <div 
                                key={item.id || index}
                                className="bg-white border-4 border-black rounded-[2.5rem] md:rounded-[3.1rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all animate-fade-in relative"
                            >
                                {/* Admin Actions */}
                                {isAdmin && (
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="absolute top-6 right-6 p-3 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white border-2 border-black rounded-2xl transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
                                        title="Eliminar Noticia"
                                    >
                                        <Trash2 className="w-5 h-5 stroke-[2px]" />
                                    </button>
                                )}

                                <div className="p-6 md:p-12">
                                    {/* Etiqueta y fecha */}
                                    <div className="flex flex-wrap items-center gap-3 mb-6">
                                        <span className="px-4 py-1.5 bg-primary text-white border-2 border-black rounded-xl text-xs font-black uppercase tracking-tight shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            {index === 0 ? '🔥 ANUNCIO OFICIAL' : '📢 NOVEDAD'}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(item.created_at)}
                                        </div>
                                    </div>

                                    {/* Título de la noticia */}
                                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-[1.1] tracking-tight uppercase italic mb-6">
                                        {item.title}
                                    </h2>

                                    {/* Contenido formateado */}
                                    <div className="prose prose-slate max-w-none text-slate-700 font-medium text-base md:text-lg mb-8 leading-relaxed whitespace-pre-line">
                                        {item.content}
                                    </div>

                                    {/* Adjunto de Video */}
                                    {item.video_url && (
                                        <div className="mb-8 border-4 border-black rounded-[2rem] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-black">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b-2 border-black text-white text-xs font-black uppercase tracking-wider">
                                                <Video className="w-4 h-4 text-rose-500" /> Adjunto de Video
                                            </div>
                                            <video 
                                                src={item.video_url} 
                                                controls 
                                                className="w-full max-h-[500px]"
                                                poster="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200"
                                            />
                                        </div>
                                    )}

                                    {/* Galería de imágenes adjuntas */}
                                    {item.media_urls && item.media_urls.length > 0 && (
                                        <div className="mb-8 space-y-4">
                                            <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest flex items-center gap-1.5">
                                                <ImageIcon className="w-3.5 h-3.5" /> Fotos adjuntas ({item.media_urls.length})
                                            </p>
                                            <div className={`grid gap-4 ${
                                                item.media_urls.length === 1 
                                                    ? 'grid-cols-1' 
                                                    : item.media_urls.length === 2 
                                                    ? 'grid-cols-2' 
                                                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                                            }`}>
                                                {item.media_urls.map((imgUrl: string, idx: number) => (
                                                    <div 
                                                        key={idx} 
                                                        className="relative border-4 border-black rounded-[1.5rem] overflow-hidden aspect-video bg-slate-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group"
                                                    >
                                                        <img 
                                                            src={imgUrl} 
                                                            alt={`Adjunto ${idx + 1}`}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Enlace adjunto de interés */}
                                    {item.link_url && (
                                        <div className="mt-8 pt-6 border-t-2 border-slate-100 flex">
                                            <a 
                                                href={item.link_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-6 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-black uppercase text-xs sm:text-sm tracking-widest rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                                            >
                                                <ExternalLink className="w-4 h-4 stroke-[3px]" />
                                                Abrir Enlace Adjunto / Noticia
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Bloque estático FAQ al final para mantener la sección de preguntas de manera elegante */}
            <div className="mt-20 border-t-4 border-black pt-16">
                <h2 className="text-3xl font-black text-slate-850 uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-primary stroke-[2.5px]" /> Preguntas Frecuentes (FAQ)
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-slate-50 border-4 border-black p-6 rounded-3xl">
                        <h3 className="text-lg font-black mb-3 uppercase">¿Qué pasará con mis obras guardadas y mi cuenta? 📚</h3>
                        <p className="text-slate-700 text-sm font-medium">¡No te preocupes por nada! Todo está guardado de forma segura en la nube ruiworks. Al iniciar sesión en nuestra App con exactamente las mismas credenciales, ¡toda tu biblioteca, historial de lectura y favoritos estarán sincronizados de forma inmediata y automática!</p>
                    </div>

                    <div className="bg-slate-50 border-4 border-black p-6 rounded-3xl">
                        <h3 className="text-lg font-black mb-3 uppercase">¿Seguirán las Donaciones? 💖</h3>
                        <p className="text-slate-700 text-sm font-medium">¡Sí! Todo seguirá igual. Quienes donen recibirán las insignias en su perfil y los beneficios se mantendrán sincronizados entres la versión Web y la App. Su apoyo nos permite seguir creando y mejorando ambas versiones.</p>
                    </div>

                    <div className="bg-slate-50 border-4 border-black p-6 rounded-3xl">
                        <h3 className="text-lg font-black mb-3 uppercase">¿La versión Web será borrada? 💻</h3>
                        <p className="text-slate-700 text-sm font-medium">¡NO! Seguirá existiendo tanto la página Web como la nueva App Android. Ambas convivirán y se actualizarán a la par, de manera que tú puedes elegir cómo y en qué plataforma prefieres disfrutar de tus lecturas.</p>
                    </div>

                    <div className="bg-slate-50 border-4 border-black p-6 rounded-3xl">
                        <h3 className="text-lg font-black mb-3 uppercase">¿Será gratuita la App Android? 💸</h3>
                        <p className="text-slate-700 text-sm font-medium">¡Completamente gratuita! Podrás descargarla en formato APK (y posteriormente en la tienda). Nuestro objetivo sigue siendo traer el mejor entretenimiento directamente a tu celular.</p>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-2xl font-black italic uppercase text-slate-850">Atentamente,</p>
                    <p className="text-primary font-black text-3xl md:text-4xl uppercase tracking-tighter mt-2">RIVAN TECHNOLOGIES</p>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">Founded by RUIWORKS</p>
                </div>
            </div>
        </div>
    );
}
