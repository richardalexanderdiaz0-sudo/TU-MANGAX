import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, getImageUrl } from '../services/api';
import { useStore } from '../store';
import { Heart, Info, Share2, ChevronLeft, ChevronRight, Menu, X, Plus } from 'lucide-react';
import PdfReader from '../components/PdfReader';

export default function ReadingView() {
    const { storyId, chapterId } = useParams();
    const { user } = useStore();
    const navigate = useNavigate();

    const [story, setStory] = useState<any>(null);
    const [chapter, setChapter] = useState<any>(null);
    const [allChapters, setAllChapters] = useState<any[]>([]);
    const [uiVisible, setUiVisible] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    
    useEffect(() => {
        if (!storyId || !chapterId) return;

        const fetchData = async () => {
            try {
                const sDoc = await api.stories.getOne(storyId);
                if (sDoc) setStory(sDoc);

                const cDoc = await api.chapters.getOne(chapterId);
                if (cDoc) setChapter(cDoc);

                const chSnap = await api.chapters.getByStory(storyId);
                if (chSnap) {
                    setAllChapters(chSnap);
                }
                
                // Auto add to library
                if (user) {
                    try {
                        await api.interactions.addToLibrary(storyId);
                    } catch(e) {
                         // Likely already in library or auth error
                    }
                }
            } catch(e) {
                console.error(e);
            }
        };

        fetchData();
        window.scrollTo(0,0);
        setUiVisible(false);
        setDrawerOpen(false);
    }, [storyId, chapterId, user]);

    const currentIndex = allChapters.findIndex(c => c.id === chapterId);
    const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

    const toggleUi = () => {
        if (drawerOpen) return;
        setUiVisible(!uiVisible);
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!story) return;
        const text = `¡NO DEJO DE LEER ${story.title} TE INVITO A LEER!`;
        const url = window.location.href;
        if (navigator.share) {
            try { await navigator.share({ title: story.title, text, url }); } catch (err) {}
        } else {
            prompt("Copia este link para compartir:", `${text} ${url}`);
        }
    };

    const toggleSubscribed = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!subscribed) {
            alert("ENTENDIDO, RECIBIRÁS UNA NOTIFICACIÓN DE TU CAMPANA CUANDO HAYA UNA NUEVA ACTUALIZACIÓN DE CAPÍTULO");
            setSubscribed(true);
        } else {
            setSubscribed(false);
        }
    };

    if (!chapter) return <div className="h-screen bg-black text-white flex items-center justify-center font-black uppercase italic tracking-tighter">Cargando...</div>;

    return (
        <div className="bg-[#111] min-h-screen relative text-slate-100 font-sans cursor-pointer select-none" onClick={toggleUi}>
            
            {/* Top UI */}
            <div className={`fixed top-0 inset-x-0 h-20 bg-white border-b-4 border-black flex items-center justify-between px-6 z-40 transition-transform duration-500 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] ${uiVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div 
                    className="flex flex-col"
                    onClick={(e) => { e.stopPropagation(); navigate(`/comic/${storyId}`); }}
                >
                    <h2 className="font-black text-primary-dark line-clamp-1 uppercase italic tracking-tighter leading-none">{story?.title || 'Comic'}</h2>
                    <p className="text-xs font-black text-slate-400 mt-1 uppercase tracking-widest">Capítulo {chapter.chapter_number}</p>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={toggleSubscribed} className="toon-button bg-white p-2 min-w-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                        {subscribed ? <Heart className="h-6 w-6 text-red-500 fill-red-500" /> : <Heart className="h-6 w-6 text-primary" />}
                        {!subscribed && <Plus className="h-3 w-3 absolute top-0 right-0 text-white border-2 border-black bg-black rounded-full" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/comic/${storyId}`); }} className="toon-button bg-white p-2 min-w-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Info className="h-6 w-6 text-primary" />
                    </button>
                    <button onClick={handleShare} className="toon-button bg-white p-2 min-w-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Share2 className="h-6 w-6 text-primary" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center select-none pb-12">
                {chapter.pages && chapter.pages.map((filename: string, i: number) => {
                    const url = getImageUrl(filename);
                    const isPdf = filename.toLowerCase().includes('.pdf');
                    
                    if (isPdf) {
                        return <PdfReader key={i} url={url} />;
                    }

                    return <img key={i} src={url} alt={`Page ${i+1}`} className="w-full h-auto block" loading="lazy" />;
                })}
                
                <div className="py-16 flex flex-col items-center gap-8 border-t-4 border-black/20 w-full mt-8 bg-black/40">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center px-4">
                        Fin de {chapter.title || `Capítulo ${chapter.chapter_number}`}
                    </h3>
                    <div className="flex gap-4 cursor-auto px-4" onClick={e=>e.stopPropagation()}>
                        {prevChapter && <button onClick={() => navigate(`/read/${storyId}/${prevChapter.id}`)} className="toon-button bg-slate-500 text-lg">Anterior</button>}
                        {nextChapter && <button onClick={() => navigate(`/read/${storyId}/${nextChapter.id}`)} className="toon-button bg-primary text-xl px-10">Siguiente</button>}
                    </div>
                </div>

                <div className="pb-32"></div>
            </div>

            {/* Bottom UI */}
            <div className={`fixed bottom-0 inset-x-0 h-20 bg-white border-t-4 border-black flex items-center justify-between px-8 z-40 transition-transform duration-500 shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)] ${uiVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                <button 
                    onClick={(e) => { e.stopPropagation(); if(prevChapter) navigate(`/read/${storyId}/${prevChapter.id}`); }} 
                    className={`toon-button bg-slate-100 p-2 min-w-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${!prevChapter ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
                    disabled={!prevChapter}
                >
                    <ChevronLeft className="h-8 w-8 text-black" />
                </button>

                <button onClick={(e) => { e.stopPropagation(); setDrawerOpen(true); setUiVisible(false); }} className="toon-button bg-primary-light p-2 min-w-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary transition-colors">
                    <Menu className="h-8 w-8 text-white" />
                </button>

                <button 
                    onClick={(e) => { e.stopPropagation(); if(nextChapter) navigate(`/read/${storyId}/${nextChapter.id}`); }} 
                    className={`toon-button bg-slate-100 p-2 min-w-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${!nextChapter ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
                    disabled={!nextChapter}
                >
                    <ChevronRight className="h-8 w-8 text-black" />
                </button>
            </div>

            {/* Episodes Drawer */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-primary/20 backdrop-blur-md cursor-auto p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white border-4 border-black rounded-[2.5rem] flex flex-col h-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b-4 border-black bg-primary-light/10">
                            <h3 className="font-black text-2xl text-primary-dark uppercase italic tracking-tighter">Episodios</h3>
                            <button onClick={() => setDrawerOpen(false)} className="toon-button bg-white p-2 min-w-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><X className="h-6 w-6 text-black" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
                            {allChapters.map(chap => (
                                <div 
                                    key={chap.id} 
                                    onClick={() => { setDrawerOpen(false); navigate(`/read/${storyId}/${chap.id}`); }}
                                    className={`flex items-center gap-6 p-3 rounded-2xl cursor-pointer transition-all border-4 ${chap.id === chapterId ? 'bg-primary/10 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-slate-50 border-transparent hover:border-black/10'}`}
                                >
                                    <div className="relative w-24 h-16 rounded-xl overflow-hidden border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        <img src={story?.cover ? getImageUrl(story.cover) : (story?.cover_url || '')} className="w-full h-full object-cover" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1">
                                            <span className="text-[10px] font-black text-white uppercase italic">Cap {chap.chapter_number}</span>
                                        </div>
                                    </div>
                                    <span className={`font-black uppercase italic tracking-tighter text-lg ${chap.id === chapterId ? 'text-primary' : 'text-slate-700'}`}>{chap.title || `Capítulo ${chap.chapter_number}`}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
