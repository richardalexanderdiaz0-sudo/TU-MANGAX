import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useStore } from '../store';
import { Heart, Info, Share2, ChevronLeft, ChevronRight, Menu, X, Plus } from 'lucide-react';

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
            const sDoc = await getDoc(doc(db, 'stories', storyId));
            if (sDoc.exists()) setStory({ id: sDoc.id, ...sDoc.data() });

            const cDoc = await getDoc(doc(db, `stories/${storyId}/chapters/${chapterId}`));
            if (cDoc.exists()) setChapter({ id: cDoc.id, ...cDoc.data() });

            const chRef = collection(db, `stories/${storyId}/chapters`);
            const chSnap = await getDocs(query(chRef, orderBy('chapterNum', 'asc')));
            setAllChapters(chSnap.docs.map(d => ({ id: d.id, ...d.data() })));
            
            // Auto add to library
            if (user) {
                const libRef = doc(db, `users/${user.uid}/library/${storyId}`);
                await setDoc(libRef, { storyId, addedAt: new Date() }, { merge: true });
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

    if (!chapter) return <div className="h-screen bg-black text-white flex items-center justify-center">Cargando...</div>;

    return (
        <div className="bg-[#111] min-h-screen relative text-slate-100 font-sans cursor-pointer selects-none" onClick={toggleUi}>
            
            {/* Top UI */}
            <div className={`fixed top-0 inset-x-0 h-16 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-4 z-40 transition-transform duration-300 ${uiVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div 
                    className="flex flex-col"
                    onClick={(e) => { e.stopPropagation(); navigate(`/comic/${storyId}`); }}
                >
                    <h2 className="font-bold text-sm line-clamp-1">{story?.title || 'Comic'}</h2>
                    <p className="text-xs text-slate-300">Capítulo {chapter.chapterNum}</p>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={toggleSubscribed} className="p-2 transition-colors hover:bg-white/10 rounded-full relative">
                        {subscribed ? <Heart className="h-6 w-6 text-red-500 fill-red-500" /> : <Heart className="h-6 w-6 text-white" />}
                        {!subscribed && <Plus className="h-3 w-3 absolute top-1 right-1 text-white border border-black bg-black rounded-full shadow" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/comic/${storyId}`); }} className="p-2 transition-colors hover:bg-white/10 rounded-full">
                        <Info className="h-6 w-6 text-white" />
                    </button>
                    <button onClick={handleShare} className="p-2 transition-colors hover:bg-white/10 rounded-full">
                        <Share2 className="h-6 w-6 text-white" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center select-none pb-20">
                {chapter.contentUrls && chapter.contentUrls.map((url: string, i: number) => (
                    <img key={i} src={url} alt={`Page ${i+1}`} className="w-full h-auto block" loading="lazy" />
                ))}
                
                <div className="py-12 flex flex-col items-center gap-4 border-t border-slate-800 w-full mt-4">
                    <h3 className="text-lg font-bold">Fin del Capítulo {chapter.chapterNum}</h3>
                    <div className="flex gap-4 cursor-auto" onClick={e=>e.stopPropagation()}>
                        {prevChapter && <button onClick={() => navigate(`/read/${storyId}/${prevChapter.id}`)} className="px-6 py-2 bg-slate-800 rounded-full hover:bg-slate-700">Anterior</button>}
                        {nextChapter && <button onClick={() => navigate(`/read/${storyId}/${nextChapter.id}`)} className="px-6 py-2 bg-indigo-600 rounded-full hover:bg-indigo-700 font-bold">Siguiente Capítulo</button>}
                    </div>
                </div>
            </div>

            {/* Bottom UI */}
            <div className={`fixed bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/90 to-black/50 flex items-center justify-between px-6 z-40 transition-transform duration-300 ${uiVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                <button 
                    onClick={(e) => { e.stopPropagation(); if(prevChapter) navigate(`/read/${storyId}/${prevChapter.id}`); }} 
                    className={`p-2 transition-colors hover:bg-white/10 rounded-full ${!prevChapter ? 'opacity-30' : ''}`}
                    disabled={!prevChapter}
                >
                    <ChevronLeft className="h-8 w-8 text-white" />
                </button>

                <button onClick={(e) => { e.stopPropagation(); setDrawerOpen(true); setUiVisible(false); }} className="p-2 transition-colors hover:bg-white/10 rounded-full">
                    <Menu className="h-8 w-8 text-white" />
                </button>

                <button 
                    onClick={(e) => { e.stopPropagation(); if(nextChapter) navigate(`/read/${storyId}/${nextChapter.id}`); }} 
                    className={`p-2 transition-colors hover:bg-white/10 rounded-full ${!nextChapter ? 'opacity-30' : ''}`}
                    disabled={!nextChapter}
                >
                    <ChevronRight className="h-8 w-8 text-white" />
                </button>
            </div>

            {/* Episodes Drawer */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm cursor-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
                        <h3 className="font-bold text-lg">Episodios</h3>
                        <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-slate-800 rounded-full"><X className="h-6 w-6" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                        {allChapters.map(chap => (
                            <div 
                                key={chap.id} 
                                onClick={() => { setDrawerOpen(false); navigate(`/read/${storyId}/${chap.id}`); }}
                                className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-slate-800 ${chap.id === chapterId ? 'bg-slate-800 border border-indigo-500' : ''}`}
                            >
                                <img src={chap.coverUrl || story?.coverUrl} className="w-20 h-12 object-cover rounded" alt="" />
                                <span className={`font-bold ${chap.id === chapterId ? 'text-indigo-400' : 'text-slate-200'}`}>Capítulo {chap.chapterNum}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
