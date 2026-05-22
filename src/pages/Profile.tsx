import React from 'react';
import { useStore } from '../store';
import { api, getImageUrl } from '../services/api';
import { logout } from '../services/firebase';
import LoginModal from '../components/LoginModal';
import { User, LogOut, Shield, Bell, BellOff, BellRing, Megaphone, Image as ImageIcon, Video, Send, X } from 'lucide-react';
import { requestNotificationPermission } from '../services/notifications';

export default function Profile() {
    const { user, userProfile, authLoading } = useStore();
    const [showLogin, setShowLogin] = React.useState(false);
    const [permission, setPermission] = React.useState<NotificationPermission>(
        ('Notification' in window) ? Notification.permission : 'default'
    );

    // News draft states for community news (campana)
    const [newsTitle, setNewsTitle] = React.useState('');
    const [newsContent, setNewsContent] = React.useState('');
    const [newsLink, setNewsLink] = React.useState('');
    const [newsFiles, setNewsFiles] = React.useState<File[]>([]);
    const [uploadingNews, setUploadingNews] = React.useState(false);
    const [submitSuccess, setSubmitSuccess] = React.useState(false);
    const [submitError, setSubmitError] = React.useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const arr = Array.from(e.target.files);
            setNewsFiles((prev) => [...prev, ...arr]);
        }
    };

    const removeSelectedFile = (idx: number) => {
        setNewsFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const handlePublishNews = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsTitle.trim() || !newsContent.trim()) return;

        setUploadingNews(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            await api.announcements.create(newsTitle, newsContent, newsFiles, newsLink.trim() || undefined);
            setSubmitSuccess(true);
            setNewsTitle('');
            setNewsContent('');
            setNewsLink('');
            setNewsFiles([]);
            
            // Dispatch dynamic news update event to sync bell immediately
            window.dispatchEvent(new Event('androidNewsRead'));
            
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        } catch (err: any) {
            console.error(err);
            setSubmitError(err.message || 'Error al subir archivos e insertar noticia.');
        } finally {
            setUploadingNews(false);
        }
    };

    const handleEnableNotifications = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            setPermission('granted');
        } else {
            setPermission('Notification' in window ? Notification.permission : 'denied');
        }
    };

    if (authLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-full mb-8 text-primary border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <User className="h-16 w-16" />
                </div>
                <h2 className="text-3xl font-black mb-4 text-primary-dark uppercase italic tracking-tighter font-display">Tu Perfil</h2>
                <p className="text-slate-500 mb-10 max-w-sm font-bold uppercase text-xs tracking-widest leading-loose">Inicia sesión para guardar favoritos, dejar likes y ser parte de la comunidad.</p>
                
                <button 
                    onClick={() => setShowLogin(true)} 
                    className="toon-button bg-primary text-xl px-12 py-4"
                >
                    ¡INGRESAR A Nexus Manga!
                </button>
                {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
            </div>
        );
    }

    return (
        <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
            <h1 className="text-3xl font-black mb-10 text-primary-dark uppercase italic tracking-tighter font-display">Mi Perfil</h1>
            
            <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                <div className="relative">
                    <img 
                        src={getImageUrl(user.avatar) || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.display_name || userProfile?.displayName || user.email?.split('@')[0] || 'U')}&background=ff69b4&color=fff&size=200`} 
                        alt="Avatar" 
                        className="h-32 w-32 rounded-full object-cover bg-slate-50 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                    />
                    {userProfile?.role === 'admin' && (
                        <div className="absolute bottom-[-5px] right-[-5px] bg-primary p-2 rounded-full border-2 border-black rotate-[12deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" title="Administrador">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                    )}
                </div>
                
                <div className="text-center md:text-left flex-1">
                    <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">{userProfile?.display_name || userProfile?.displayName || user.email?.split('@')[0]}</h2>
                    <p className="text-slate-400 font-bold mb-6 underline decoration-wavy decoration-primary-light underline-offset-4">{user.email}</p>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <span className={`inline-block px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                            userProfile?.role === 'admin' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                            ROL: {userProfile?.role === 'admin' ? 'BOSS' : 'LECTOR'}
                        </span>
                        
                        {(userProfile?.created_at || userProfile?.createdAt) && (
                            <span className="inline-block px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                UNIDO: {new Date(userProfile?.created_at || userProfile?.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Panel de Configuración de Notificaciones */}
            <div className="mt-10 bg-white border-4 border-black rounded-[2.5rem] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-2xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                        permission === 'granted' ? 'bg-emerald-100 text-emerald-600' : permission === 'denied' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-500'
                    }`}>
                        {permission === 'granted' ? <BellRing className="h-8 w-8 animate-bounce" /> : permission === 'denied' ? <BellOff className="h-8 w-8" /> : <Bell className="h-8 w-8" />}
                    </div>
                    <div>
                        <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight">Notificaciones Push</h3>
                        <p className="text-xs text-slate-500 font-bold max-w-md leading-relaxed mt-1">
                            {permission === 'granted' 
                                ? '¡Excelente! Estás suscrito. Recibirás una alerta inmediata en tu barra de notificaciones del celular o PC cada vez que se suba un nuevo capítulo de tus mangas de la biblioteca.' 
                                : permission === 'denied' 
                                ? 'Has bloqueado las notificaciones en este navegador. Restablécelas en la configuración del candado de tu navegador para poder recibir alertas instantáneas.'
                                : 'Activa las alertas del sistema para que te avisemos al instante cada vez que un manga en tu biblioteca reciba nuevos capítulos.'
                            }
                        </p>
                    </div>
                </div>

                {permission !== 'granted' && (
                    <button
                        onClick={handleEnableNotifications}
                        disabled={permission === 'denied'}
                        className={`toon-button uppercase tracking-wider text-sm font-black whitespace-nowrap ${
                            permission === 'denied' 
                                ? 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                                : 'bg-primary text-white'
                        }`}
                    >
                        {permission === 'denied' ? 'Bloqueado' : '🔔 Activar Alertas'}
                    </button>
                )}

                {permission === 'granted' && (
                    <div className="bg-emerald-50 text-emerald-600 border-2 border-emerald-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1">
                        ● ACTIVO
                    </div>
                )}
            </div>

            {/* Panel de Creación de Noticias para Administración */}
            {userProfile?.role === 'admin' && (
                <div id="admin-news-panel" className="mt-10 bg-white border-4 border-black rounded-[2.5rem] p-6 sm:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-slate-850">
                    <div className="flex items-center gap-3 border-b-4 border-black pb-4 mb-6">
                        <div className="bg-primary p-2.5 rounded-xl border-2 border-black rotate-[-3deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Megaphone className="h-6 w-6 text-white stroke-[2.5px]" />
                        </div>
                        <div>
                            <h3 className="font-black text-2xl uppercase tracking-tighter">Nueva Noticia Global</h3>
                            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Se enviará inmediatamente al icono de la campana</p>
                        </div>
                    </div>

                    <form onSubmit={handlePublishNews} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Título de la Noticia</label>
                            <input 
                                type="text"
                                value={newsTitle}
                                onChange={(e) => setNewsTitle(e.target.value)}
                                placeholder="Ej: ¡Nuevo Manhwa en emisión o Actualización de la App!"
                                required
                                className="w-full px-5 py-4 border-4 border-black rounded-2xl bg-slate-50 font-bold focus:outline-none focus:ring-4 focus:ring-primary focus:bg-white text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Contenido de la Noticia</label>
                            <textarea 
                                value={newsContent}
                                onChange={(e) => setNewsContent(e.target.value)}
                                placeholder="Escribe el cuerpo del anuncio o contenido detallado..."
                                required
                                rows={6}
                                className="w-full px-5 py-4 border-4 border-black rounded-2xl bg-slate-50 font-bold focus:outline-none focus:ring-4 focus:ring-primary focus:bg-white text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Pegar Link / Enlace de Interés (Opcional)</label>
                            <input 
                                type="url"
                                value={newsLink}
                                onChange={(e) => setNewsLink(e.target.value)}
                                placeholder="Ej: https://tupagina.com/unir-discord o un capitulo de manhwa"
                                className="w-full px-5 py-4 border-4 border-black rounded-2xl bg-slate-50 font-bold focus:outline-none focus:ring-4 focus:ring-primary focus:bg-white text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Adjuntar Fotos y Videos (Opcional)</label>
                            
                            <div className="border-4 border-dashed border-black rounded-2xl bg-slate-50 p-6 text-center hover:bg-slate-100/50 transition-colors relative cursor-pointer group">
                                <input 
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center justify-center gap-2 py-4">
                                    <div className="p-3 bg-white rounded-xl border-2 border-black group-hover:rotate-12 transition-transform shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-slate-600">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-705 mt-2">Arrastra o elige imágenes/videos aquí</p>
                                    <p className="text-[10px] text-slate-400 font-bold">Formatos permitidos: imágenes y videos ruiworks</p>
                                </div>
                            </div>

                            {/* Previsualización de archivos seleccionados */}
                            {newsFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Archivos adjuntos ({newsFiles.length})</p>
                                    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                                        {newsFiles.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 border-2 border-black bg-white rounded-xl text-xs font-bold gap-3 animate-fade-in">
                                                <div className="flex items-center gap-2 truncate">
                                                    {file.type.startsWith('video/') ? (
                                                        <Video className="w-4 h-4 text-rose-500 shrink-0" />
                                                    ) : (
                                                        <ImageIcon className="w-4 h-4 text-sky-500 shrink-0" />
                                                    )}
                                                    <span className="truncate text-slate-700">{file.name}</span>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => removeSelectedFile(idx)}
                                                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border-2 border-transparent hover:border-black active:translate-x-[0.5px] active:translate-y-[0.5px]"
                                                >
                                                    <X className="w-4 h-4 stroke-[3px]" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {submitError && (
                            <div className="bg-red-50 text-red-600 border-2 border-red-505 p-4 rounded-xl text-xs font-bold animate-pulse">
                                ⚠ Error: {submitError}
                            </div>
                        )}

                        {submitSuccess && (
                            <div className="bg-emerald-50 text-emerald-600 border-2 border-emerald-500 p-4 rounded-xl text-xs font-black uppercase tracking-tight">
                                🎉 ¡Noticia global publicada y enviada a todas las campanas!
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={uploadingNews}
                            className={`flex items-center justify-center gap-2 text-white font-black border-4 border-black px-6 py-4 rounded-2xl w-full transition-all uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                                uploadingNews 
                                    ? 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed' 
                                    : 'bg-primary hover:bg-primary-dark'
                            }`}
                        >
                            {uploadingNews ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                    Subiendo y alertando...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 stroke-[2.5px]" /> Publicar Noticia Global
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}

            <div className="mt-6 space-y-6">
                <button 
                    onClick={() => logout()} 
                    className="flex items-center justify-center gap-2 text-white font-black bg-red-500 hover:bg-red-600 border-4 border-black px-8 py-5 rounded-3xl w-full transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest text-lg italic"
                >
                    <LogOut className="h-6 w-6 stroke-[3px]" /> Salir de Nexus
                </button>
            </div>
        </div>
    );
}
