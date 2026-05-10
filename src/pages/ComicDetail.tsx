import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, getDocs, updateDoc, increment, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useStore } from '../store';
import { Share2, MoreVertical, Heart, Plus, ThumbsUp, Eye, BookMarked, Flag } from 'lucide-react';

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
            const docRef = doc(db, 'stories', id);
            const d = await getDoc(docRef);
            if (d.exists()) {
                setStory({ id: d.id, ...d.data() });
                // Increment views
                updateDoc(docRef, { viewsCount: increment(1) });
            }

            const chRef = collection(db, `stories/${id}/chapters`);
            const chQ = query(chRef, orderBy('chapterNum', 'asc'));
            const chSnap = await getDocs(chQ);
            setChapters(chSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            if (user) {
                const libDoc = await getDoc(doc(db, `users/${user.uid}/library/${id}`));
                setIsSaved(libDoc.exists());

                const likeDoc = await getDoc(doc(db, `stories/${id}/likes/${user.uid}`));
                setIsLiked(likeDoc.exists());
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
        const likeRef = doc(db, `stories/${id}/likes/${user.uid}`);
        const storyRef = doc(db, 'stories', id);
        if (isLiked) {
            await deleteDoc(likeRef);
            await updateDoc(storyRef, { likesCount: increment(-1) });
            setIsLiked(false);
            setStory({...story, likesCount: story.likesCount - 1});
        } else {
            await setDoc(likeRef, { userId: user.uid, storyId: id, createdAt: new Date() });
            await updateDoc(storyRef, { likesCount: increment(1) });
            setIsLiked(true);
            setStory({...story, likesCount: story.likesCount + 1});
        }
    };

    const handleLibrary = async () => {
        if (!user || !id) return;
        const libRef = doc(db, `users/${user.uid}/library/${id}`);
        if (isSaved) {
            await deleteDoc(libRef);
            setIsSaved(false);
        } else {
            await setDoc(libRef, { storyId: id, addedAt: new Date() });
            setIsSaved(true);
        }
    };

    if (!story) return <div className="p-8 text-center">Cargando...</div>;

    const displayedChapters = orderAsc ? chapters : [...chapters].reverse();

    return (
        <div className="pb-16 relative">
            {/* BIG HERO COVER */}
            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
                <div className="absolute inset-0">
                    <img src={story.coverUrl} className="w-full h-full object-cover blur-sm opacity-50" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                </div>
                
                <div className="absolute bottom-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 translate-y-1/3 md:translate-y-1/4 flex gap-6 items-end">
                    <div className="w-32 md:w-48 xl:w-56 shrink-0 rounded-lg overflow-hidden shadow-2xl border border-slate-700 aspect-[2/3] bg-slate-800 hidden sm:block">
                         <img src={story.coverUrl} className="w-full h-full object-cover" alt="Cover" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-16 md:mt-24">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">{story.title}</h1>
                        <p className="text-slate-400 font-medium mb-4">Por {story.authorName || 'Administrador'}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleShare} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
                            <Share2 className="h-5 w-5" />
                        </button>
                        <div className="relative">
                            <button onClick={() => setShowReport(!showReport)} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                            {showReport && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10">
                                    <button 
                                        onClick={() => {
                                            alert("Reporte enviado.");
                                            setShowReport(false);
                                        }} 
                                        className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-slate-700 text-red-400"
                                    >
                                        <Flag className="h-4 w-4" /> Reportar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 text-sm">
                    <span className={`px-2 py-1 rounded bg-slate-800 font-medium ${story.status === 'COMPLETED' ? 'text-emerald-400' : 'text-blue-400'}`}>
                        {story.status === 'COMPLETED' ? 'Finalizado' : 'En Emisión'}
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-medium">{story.type}</span>
                    <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 flex items-center gap-1">
                        <Eye className="h-4 w-4" /> {story.viewsCount || 0}
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" /> {story.likesCount || 0}
                    </span>
                </div>

                <div className="flex gap-2 mb-8">
                    <button onClick={handleLike} className={`px-4 py-2 rounded font-bold flex items-center gap-2 transition-colors ${isLiked ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                        <ThumbsUp className="h-5 w-5" /> {isLiked ? 'Me Gusta' : 'Dar Like'}
                    </button>
                    <button onClick={handleLibrary} className={`px-4 py-2 rounded font-bold flex items-center gap-2 transition-colors ${isSaved ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                        <BookMarked className="h-5 w-5" /> {isSaved ? 'En Biblioteca' : '+ Agregar'}
                    </button>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                    {story.categories?.map((c: string) => <span key={c} className="px-2 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">{c}</span>)}
                    {story.tags?.map((t: string) => <span key={t} className="px-2 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-slate-700">#{t}</span>)}
                </div>

                <div className="md:w-2/3 mb-10">
                    <h3 className="font-bold text-lg mb-2">Sinopsis</h3>
                    <p className={`text-slate-300 leading-relaxed ${expandedSyn ? '' : 'line-clamp-3'}`}>
                        {story.synopsis}
                    </p>
                    <button onClick={() => setExpandedSyn(!expandedSyn)} className="text-indigo-400 mt-2 font-medium hover:text-indigo-300">
                        {expandedSyn ? 'Ver menos' : 'Leer más'}
                    </button>
                </div>

                {/* Chapters */}
                <div className="border-t border-slate-800 pt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Episodios ({chapters.length})</h2>
                        <button onClick={() => setOrderAsc(!orderAsc)} className="text-sm bg-slate-800 px-3 py-1 rounded">
                            {orderAsc ? 'Inicio a Fin' : 'Fin a Inicio'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {displayedChapters.map(chap => (
                            <Link to={`/read/${id}/${chap.id}`} key={chap.id} className="group relative rounded-md overflow-hidden bg-slate-800 aspect-video">
                                <img src={chap.coverUrl || story.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors flex items-center justify-center p-2 text-center">
                                    <span className="font-bold text-white shadow-sm">Capítulo {chap.chapterNum}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
