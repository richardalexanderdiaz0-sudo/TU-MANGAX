import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface StoryInfo {
    id: string;
    title: string;
    coverUrl: string;
    type: string;
    status: string;
    isComingSoon: boolean;
    publishDate?: number;
    viewsCount: number;
    chapterCount: number;
}

export default function Home() {
    const [recentlyAdded, setRecentlyAdded] = useState<StoryInfo[]>([]);
    const [comingSoon, setComingSoon] = useState<StoryInfo[]>([]);
    const [trending, setTrending] = useState<StoryInfo[]>([]);
    const [allComics, setAllComics] = useState<StoryInfo[]>([]);
    const [completed, setCompleted] = useState<StoryInfo[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStories = async () => {
            const storiesRef = collection(db, 'stories');
            
            // Due to Firestore indexing rules, we'll fetch recently published (active)
            const recentQ = query(storiesRef, where('isComingSoon', '==', false), orderBy('createdAt', 'desc'), limit(15));
            const soonQ = query(storiesRef, where('isComingSoon', '==', true), orderBy('publishDate', 'asc'), limit(15));
            const trendQ = query(storiesRef, where('isComingSoon', '==', false), orderBy('viewsCount', 'desc'), limit(15));
            const allQ = query(storiesRef, where('isComingSoon', '==', false), orderBy('createdAt', 'desc'), limit(30));
            const completedQ = query(storiesRef, where('status', '==', 'COMPLETED'), limit(15));

            try {
                const [recentSnap, soonSnap, trendSnap, allSnap, compSnap] = await Promise.all([
                    getDocs(recentQ),getDocs(soonQ),getDocs(trendQ),getDocs(allQ),getDocs(completedQ)
                ]);
                
                setRecentlyAdded(recentSnap.docs.map(d => ({ id: d.id, ...d.data() } as StoryInfo)));
                setComingSoon(soonSnap.docs.map(d => ({ id: d.id, ...d.data() } as StoryInfo)));
                setTrending(trendSnap.docs.map(d => ({ id: d.id, ...d.data() } as StoryInfo)));
                setAllComics(allSnap.docs.map(d => ({ id: d.id, ...d.data() } as StoryInfo)));
                setCompleted(compSnap.docs.map(d => ({ id: d.id, ...d.data() } as StoryInfo)));
            } catch (err) {
                console.error("Error fetching home data:", err);
            }
        };

        fetchStories();
    }, []);

    const renderSection = (title: string, stories: StoryInfo[], link?: string) => {
        if (stories.length === 0) return null;
        
        return (
            <section className="mb-12">
                <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
                    {link ? (
                        <button onClick={() => navigate(link)} className="flex items-center gap-1 text-xl font-bold hover:text-primary transition-colors group">
                            {title}
                            <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ) : (
                        <h2 className="text-xl font-bold">{title}</h2>
                    )}
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8 snap-x hide-scrollbar">
                    {stories.map(story => (
                        <StoryCard key={story.id} story={story} />
                    ))}
                </div>
            </section>
        );
    };

    return (
        <div className="py-8">
            {renderSection("AÑADIDOS RECIENTEMENTE", recentlyAdded)}
            {renderSection("PRÓXIMAMENTE", comingSoon)}
            {renderSection("TÍTULOS EN TENDENCIA", trending)}
            
            {/* The user requested CÓMICS Y MANHWAS which redirects to directory on click */}
            {renderSection("CÓMICS Y MANHWAS", allComics, "/directory")}
            
            {renderSection("TERMINADOS", completed)}
            {renderSection("CÓMICS/MANHWAS/MANGAS TERMINADOS", completed, "/directory?status=COMPLETED")}
        </div>
    );
}

function StoryCard({ story }: { story: StoryInfo, key?: React.Key }) {
    return (
        <Link 
            to={`/comic/${story.id}`} 
            className="flex flex-col gap-2 min-w-[140px] max-w-[140px] sm:min-w-[160px] sm:max-w-[160px] snap-start group"
        >
            <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-slate-800">
                <img 
                    src={story.coverUrl || 'https://via.placeholder.com/300x450?text=No+Cover'} 
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {story.isComingSoon && <span className="bg-indigo-600 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow">Próximamente</span>}
                    {story.status === 'COMPLETED' && <span className="bg-emerald-600 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow">Finalizado</span>}
                    {story.status === 'ONGOING' && !story.isComingSoon && <span className="bg-blue-600 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow">Actualizado</span>}
                </div>
            </div>
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{story.title}</h3>
            <p className="text-xs text-slate-400 capitalize">{story.type.toLowerCase()}</p>
        </Link>
    );
}
