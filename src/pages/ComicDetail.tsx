import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useStore } from '../store';
import { Share2, MoreVertical, ThumbsUp, Eye, BookMarked, Flag } from 'lucide-react';

export default function ComicDetail() {
    const { id } = useParams();
    const { user } = useStore();
    const [story, setStory] = useState<any>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [expandedSyn, setExpandedSyn] = useState(false);
    const [orderAsc, setOrderAsc] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showReport, setShowReport] = useState(false);
    
    useEffect(() => {
        if (!id) return;
        
        const fetchDetail = async () => {
            const { data: sData } = await supabase.from('stories').select('*').eq('id', id).single();
            if (sData) {
                setStory(sData);
                // Supabase doesn't easily allow arbitrary increments without RPC, we'll just ignore viewsCount for now.
            }

            const { data: cData } = await supabase.from('chapters').select('*').eq('story_id', id).order('chapter_number', { ascending: true });
            if (cData) {
                setChapters(cData);
            }

            if (user) {
                const { data: libData } = await supabase.from('library').select('user_id').eq('user_id', user.uid).eq('story_id', id).maybeSingle();
                setIsSaved(!!libData);

                const { data: likeData } = await supabase.from('likes').select('user_id').eq('user_id', user.uid).eq('story_id', id).maybeSingle();
                setIsLiked(!!likeData);
            }
        };

        fetchDetail();
    }, [id, user]);

    const handleShare = async () => {
        if (!story) return;
        const text = `¡NO DEJO DE LEER ${story.title} TE INVITO A LEER!`;
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: story.title, text, url });
            } catch (err) {
                console.error(err);
            }
        } else {
            prompt("Copia este link para compartir:", `${text} ${url}`);
        }
    };

    const handleLike = async () => {
        if (!user || !id || !story) return;
        
        if (isLiked) {
            await supabase.from('likes').delete().eq('user_id', user.uid).eq('story_id', id);
            // We should use an RPC, but since we disabled RLS we might fetch and update logic manually, 
            // but we can skip likes_count updating correctly without an RPC and just do what we can.
            // A simple update requires fetching current then updating. Oh wait, we have `story.likes_count`.
            const newCount = Math.max(0, (story.likes_count || 0) - 1);
            await supabase.from('stories').update({ likes_count: newCount }).eq('id', id);
            setIsLiked(false);
            setStory({...story, likes_count: newCount});
        } else {
            await supabase.from('likes').insert({ user_id: user.uid, story_id: id });
            const newCount = (story.likes_count || 0) + 1;
            await supabase.from('stories').update({ likes_count: newCount }).eq('id', id);
            setIsLiked(true);
            setStory({...story, likes_count: newCount});
        }
    };

    const handleLibrary = async () => {
        if (!user || !id) return;
        if (isSaved) {
            await supabase.from('library').delete().eq('user_id', user.uid).eq('story_id', id);
            setIsSaved(false);
        } else {
            await supabase.from('library').insert({ user_id: user.uid, story_id: id });
            setIsSaved(true);
        }
    };

    if (!story) return <div className="p-8 text-center text-slate-400">Cargando...</div>;

    const displayedChapters = orderAsc ? chapters : [...chapters].reverse();

    return (
        <div className="pb-16 relative">
            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
                <div className="absolute inset-0">
                    <img src={story.cover_url} className="w-full h-full object-cover blur-3xl opacity-60 mix-blend-multiply" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent"></div>
                </div>
                
                <div className="absolute bottom-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 translate-y-1/3 md:translate-y-1/4 flex gap-6 items-end">
                    <div className="w-32 md:w-48 xl:w-56 shrink-0 rounded-[2.5rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black aspect-[2/3] bg-white hidden sm:block">
                         <img src={story.cover_url} className="w-full h-full object-cover" alt="Cover" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-16 md:mt-24">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-primary-dark mb-2 tracking-tight drop-shadow-sm font-display">{story.title}</h1>
                        <p className="text-slate-500 font-black mb-4 text-lg">Por <span className="text-primary-dark underline decoration-wavy decoration-primary-light underline-offset-4">{story.author || 'Desconocido'}</span></p>
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
                    <span className="px-3 py-1 rounded-full bg-slate-800/60 text-slate-300 font-medium border border-slate-700/50 flex items-center gap-1.5 shadow-sm">
                        <ThumbsUp className="h-3.5 w-3.5" /> {story.likes_count || 0}
                    </span>
                </div>

                <div className="flex gap-3 mb-10">
                    <button onClick={handleLike} className={`px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${isLiked ? 'bg-primary text-white' : 'bg-white text-slate-800 hover:bg-primary-light'}`}>
                        <ThumbsUp className="h-5 w-5" /> {isLiked ? 'Te Gusta' : 'Dar Like'}
                    </button>
                    <button onClick={handleLibrary} className={`px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${isSaved ? 'bg-emerald-500 text-white' : 'bg-white text-slate-800 hover:bg-emerald-100'}`}>
                        <BookMarked className="h-5 w-5" /> {isSaved ? 'Guardado' : 'Guardar'}
                    </button>
                </div>

                {story.genres && story.genres.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-2">
                        {story.genres.map((g: string) => <span key={g} className="px-3 py-1 bg-slate-900/80 rounded-lg text-xs font-medium text-slate-300 border border-slate-700/50 shadow-inner">{g}</span>)}
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
                            <Link to={`/read/${id}/${chap.id}`} key={chap.id} className="group relative rounded-3xl overflow-hidden bg-white aspect-[3/4] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                                <img src={story.cover_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale-[10%] group-hover:grayscale-0" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex flex-col items-center justify-end p-4 pb-6 transition-all">
                                    <span className="font-black text-4xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)] italic">#{chap.chapter_number}</span>
                                    {chap.title && <span className="text-[10px] font-black text-white mt-1 line-clamp-1 uppercase tracking-tighter bg-primary px-2 py-0.5 rounded-lg border-2 border-black drop-shadow-sm">{chap.title}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
