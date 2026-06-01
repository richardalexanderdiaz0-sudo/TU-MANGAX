import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, getImageUrl } from '../services/api';
import { useStore } from '../store';
import { Share2, MoreVertical, Flame, Eye, BookMarked, Flag, X } from 'lucide-react';
import { supabase } from '../services/supabase';
import LoginModal from '../components/LoginModal';
import ShareModal from '../components/ShareModal';

export default function ComicDetail() {
    const { id } = useParams();
    const { user } = useStore();
    const [story, setStory] = useState<any>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [similarStories, setSimilarStories] = useState<any[]>([]);
    const [expandedSyn, setExpandedSyn] = useState(false);
    const [orderAsc, setOrderAsc] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    
    // Auth Wall modal states
    const [showAuthWall, setShowAuthWall] = useState(false);
    const [authRequestedStory, setAuthRequestedStory] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginInitialMode, setLoginInitialMode] = useState<'login' | 'register'>('login');
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (!id) return;
        
        const fetchDetail = async () => {
            try {
                const sData = await api.stories.getOne(id);
                if (sData) {
                    // Increment views in Supabase in real-time
                    try {
                        const newViewsCount = (sData.views_count || 0) + 1;
                        await supabase.from('stories').update({ views_count: newViewsCount }).eq('id', id);
                        sData.views_count = newViewsCount;
                    } catch (err) {
                        console.error('Error updating views count', err);
                    }
                    setStory(sData);
                }

                const cData = await api.chapters.getByStory(id);
                if (cData) {
                    setChapters(cData);
                }

                // Fetch similar stories
                const allStories = await api.stories.getAll();
                const currentGenres = sData?.genres || [];
                let related = allStories
                    .filter((s: any) => s.id !== id)
                    .map((s: any) => {
                        let score = 0;
                        const sGenres = s.genres || [];
                        const commonGenres = currentGenres.filter((g: string) => sGenres.includes(g));
                        score += commonGenres.length * 2;
                        
                        if (sData?.author && s.author && sData.author === s.author) {
                            score += 3;
                        }

                        // Add small randomizer to break ties and keep UI fresh
                        score += Math.random() * 0.5;

                        return { ...s, score };
                    })
                    .sort((a: any, b: any) => b.score - a.score)
                    .slice(0, 12);

                setSimilarStories(related);

                if (user) {
                    // Logic to check library will depend on Ivan's endpoints
                    setIsSaved(false);
                }
            } catch(e) {
                console.error(e);
            }
        };

        fetchDetail();
    }, [id, user]);

    const handleShare = async () => {
        if (!story) return;
        const msg = `¡No puedo parar de leer ${story.title} en TU MANGAX!\n\nTienes que ver esta obra, ¡te va a encantar! Acompáñame a leerla aquí:`;
        const url = `${window.location.origin}/comic/${id}`;
        
        // Always show the share modal first if navigator native share fails or just for consistency for the user intent
        // Using only native share if available as fallback
        if (navigator.share) {
            try {
                await navigator.share({
                    title: story.title,
                    text: msg,
                    url: url
                });
                return;
            } catch (err) {
                console.log('Native share failed naturally, falling back to modal');
            }
        }
        setShowShareModal(true);
    };

    const handleLibrary = async () => {
        if (!user || !id) return;
        try {
            if (isSaved) {
                await api.interactions.removeFromLibrary(id);
                setIsSaved(false);
            } else {
                await api.interactions.addToLibrary(id);
                setIsSaved(true);
            }
        } catch(e) {
            console.error(e);
        }
    };

    if (!story) return <div className="p-8 text-center text-slate-400">Cargando...</div>;

    const displayedChapters = orderAsc ? chapters : [...chapters].reverse();
    const coverUrl = story.cover ? getImageUrl(story.cover) : (story.cover_url || '');

    return (
        <div className="pb-16 relative font-sans">
            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
                <div className="absolute inset-0">
                    <img src={coverUrl} className="w-full h-full object-cover blur-[6px] opacity-30" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
                </div>
                
                <div className="absolute bottom-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 translate-y-1/3 md:translate-y-1/4 flex gap-6 items-end">
                    <div className="w-28 sm:w-32 md:w-48 xl:w-56 shrink-0 rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black aspect-[2/3] bg-white block">
                         <img src={coverUrl} className="w-full h-full object-cover" alt="Cover" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-16 md:mt-24">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-primary-dark mb-2 tracking-tight drop-shadow-sm font-display">{story.title}</h1>
                        <p className="text-slate-500 font-extrabold mb-4 text-base flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span>
                                Artista: <Link to={`/author/${encodeURIComponent(story.author || 'Desconocido')}`} className="text-primary-dark underline decoration-wavy decoration-primary-light underline-offset-4 hover:text-primary transition-colors font-black">{story.author || 'Desconocido'}</Link>
                            </span>
                            {story.writer && story.writer !== 'Desconocido' && story.writer !== '' && (
                                <>
                                    <span className="text-slate-300">/</span>
                                    <span>
                                        Escritor: <Link to={`/author/${encodeURIComponent(story.writer)}`} className="text-primary-dark underline decoration-wavy decoration-primary-light underline-offset-4 hover:text-primary transition-colors font-black">{story.writer}</Link>
                                    </span>
                                </>
                            )}
                            <span className="text-slate-300">/</span>
                            <span>Agregado: {story.created_at ? new Date(story.created_at).toLocaleDateString() : 'N/A'}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleShare} className="p-3 bg-white hover:bg-primary-light text-slate-800 rounded-full transition-all border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                            <Share2 className="h-5 w-5" />
                        </button>
                        <div className="relative">
                            <button onClick={() => setShowReport(!showReport)} className="p-3 bg-white hover:bg-primary-light text-slate-800 rounded-full transition-all border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                            {showReport && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                                     <button 
                                        onClick={() => {
                                            alert("Reporte enviado.");
                                            setShowReport(false);
                                        }} 
                                        className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-slate-700/80 text-red-400 font-medium transition-colors"
                                    >
                                        <Flag className="h-4 w-4" /> Reportar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 text-sm">
                    <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wide text-xs border ${story.status === 'COMPLETED' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' : 'bg-blue-950/40 text-blue-400 border-blue-500/20'}`}>
                        {story.status === 'COMPLETED' ? 'Finalizado' : 'En Emisión'}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-800/60 text-amber-400 font-extrabold border border-indigo-500/20 flex items-center gap-1.5 shadow-sm">
                        <Flame className="h-3.5 w-3.5 text-amber-500 fill-current animate-pulse" /> {story.views_count || 0} vistas
                    </span>
                </div>

                <div className="flex gap-3 mb-10">
                    <button onClick={handleLibrary} className={`px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${isSaved ? 'bg-emerald-500 text-white' : 'bg-white text-slate-800 hover:bg-emerald-100'}`}>
                        <BookMarked className="h-5 w-5" /> {isSaved ? 'Guardado en Biblioteca' : 'Agregar a Biblioteca'}
                    </button>
                </div>

                {story.genres && story.genres.length > 0 && (
                    <div className="mb-10">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">Etiquetas / Tramas</p>
                        <div className="flex flex-wrap gap-2">
                            {story.genres.map((g: string) => (
                                <Link 
                                    key={g} 
                                    to={`/directory?genre=${encodeURIComponent(g)}`} 
                                    className="px-4 py-2 bg-[#3f4553] text-white hover:bg-primary-dark transition-all rounded-xl font-bold border-2 border-black hover:scale-105 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs tracking-tight uppercase"
                                >
                                    {g}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="md:w-2/3 mb-12 bg-white p-8 rounded-[2rem] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="font-black text-xl mb-4 text-primary-dark uppercase tracking-tight">Sinopsis</h3>
                    <p className={`text-slate-700 leading-relaxed font-medium ${expandedSyn ? '' : 'line-clamp-4'}`}>
                        {story.synopsis}
                    </p>
                    <button onClick={() => setExpandedSyn(!expandedSyn)} className="text-indigo-400 mt-3 font-semibold hover:text-indigo-300 transition-colors">
                        {expandedSyn ? 'Ver menos' : 'Leer más'}
                    </button>
                </div>

                <div className="pt-8">
                    <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
                        <h2 className="text-2xl font-black text-primary-dark tracking-tight uppercase">Capítulos <span className="text-slate-400 font-bold text-lg ml-2">({chapters.length})</span></h2>
                        <button onClick={() => setOrderAsc(!orderAsc)} className="text-sm font-black bg-white hover:bg-primary-light text-slate-800 px-5 py-2 rounded-xl transition-all border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                            {orderAsc ? 'Orden: 1-9' : 'Orden: 9-1'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {displayedChapters.map(chap => (
                            <Link 
                                to={`/read/${id}/${chap.id}`} 
                                onClick={(e) => {
                                    if (!user) {
                                        e.preventDefault();
                                        setAuthRequestedStory(story.title);
                                        setLoginInitialMode('login');
                                        setShowAuthWall(true);
                                    }
                                }}
                                key={chap.id} 
                                className="group relative rounded-3xl overflow-hidden bg-white aspect-[3/4] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                                <img src={coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale-[10%] group-hover:grayscale-0" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex flex-col items-center justify-end p-4 pb-6 transition-all">
                                    <span className="font-black text-4xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)] italic">#{chap.chapter_number}</span>
                                    {chap.title && <span className="text-[10px] font-black text-white mt-1 line-clamp-1 uppercase tracking-tighter bg-primary px-2 py-0.5 rounded-lg border-2 border-black drop-shadow-sm">{chap.title}</span>}
                                    <span className="text-[8px] font-bold text-white mt-1 uppercase tracking-tighter opacity-80">{chap.created_at ? new Date(chap.created_at).toLocaleDateString() : ''}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {similarStories.length > 0 && (
                    <div className="pt-16 pb-8">
                        <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
                            <h2 className="text-2xl font-black text-primary-dark tracking-tight uppercase">Obras Parecidas</h2>
                        </div>
                        <div className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                            {similarStories.map(sim => (
                                <Link 
                                    key={sim.id} 
                                    to={`/comic/${sim.id}`} 
                                    className="flex-none w-32 sm:w-40 flex flex-col gap-3 group snap-start"
                                >
                                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        <img 
                                            src={sim.cover ? getImageUrl(sim.cover) : (sim.cover_url || 'https://via.placeholder.com/300x450')} 
                                            alt={sim.title}
                                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                                        />
                                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                                            {sim.status === 'COMPLETED' && <span className="bg-emerald-500 text-white text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">FIN</span>}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-tight group-hover:text-primary transition-colors px-1">{sim.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Auth Wall Modal */}
            {showAuthWall && (
                <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white border-4 border-black w-full max-w-sm rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative p-8 text-center animate-fade-in">
                        <button 
                            onClick={() => setShowAuthWall(false)} 
                            className="toon-button bg-white p-1 min-w-0 absolute top-4 right-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <X className="h-5 w-5 text-black" />
                        </button>

                        <div className="relative w-28 sm:w-32 aspect-[2/3] mx-auto rounded-3xl overflow-hidden border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4 rotate-[-2deg] mt-4">
                            <img src={coverUrl} className="w-full h-full object-cover" alt="Cover" />
                            <div className="absolute top-2 right-2 bg-primary text-white p-2 rounded-xl border-2 border-black rotate-[5deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <svg className="w-4 h-4 font-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-[1.2] tracking-tight uppercase italic mb-3">
                            ¿Te interesa esta obra verdad?
                        </h3>
                        
                        <p className="text-xs font-bold text-slate-500 mb-6 leading-relaxed max-w-xs mx-auto">
                            Pues <span className="text-primary-dark font-black">regístrate</span> o <span className="text-primary-dark font-black">inicia sesión</span> para leer <span className="text-primary font-black underline decoration-2">{authRequestedStory}</span> y disfrutar de todos nuestros mejores mangas y manhwas de inmediato.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:px-4">
                            <button 
                                onClick={() => {
                                    setShowAuthWall(false);
                                    setLoginInitialMode('login');
                                    setShowLoginModal(true);
                                }}
                                className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 font-black uppercase text-xs tracking-widest rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                            >
                                Iniciar Sesión
                            </button>
                            <button 
                                onClick={() => {
                                    setShowAuthWall(false);
                                    setLoginInitialMode('register');
                                    setShowLoginModal(true);
                                }}
                                className="px-5 py-3 bg-primary hover:bg-primary-dark text-white font-black uppercase text-xs tracking-widest rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                            >
                                Registrarse
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Standard Login / Register Modal */}
            {showLoginModal && (
                <LoginModal 
                    initialMode={loginInitialMode} 
                    onClose={() => setShowLoginModal(false)} 
                />
            )}

            {showShareModal && story && (
                <ShareModal
                    title={story.title}
                    shareText={`¡No puedo parar de leer ${story.title} en TU MANGAX!\n\nTienes que ver esta obra, ¡te va a encantar! Acompáñame a leerla aquí:`}
                    shareUrl={window.location.href}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
}
