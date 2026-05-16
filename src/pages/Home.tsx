import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Play } from 'lucide-react';

interface StoryInfo {
    id: string;
    title: string;
    cover_url: string;
    status: string;
    likes_count: number;
    created_at: string;
}

function HeroSlider({ stories }: { stories: StoryInfo[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!stories || stories.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % stories.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [stories]);

    if (!stories || stories.length === 0) return null;

    const currentStory = stories[currentIndex];

    return (
        <div className="w-full relative h-[60vh] sm:h-[70vh] lg:h-[80vh] min-h-[400px] mb-12 overflow-hidden bg-slate-900 mx-auto max-w-7xl sm:rounded-b-[3rem] shadow-[0_20px_0_0_rgba(0,0,0,1)] border-b-8 border-black">
            {stories.map((story, index) => (
                <div 
                    key={story.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-black/30 z-10"></div>
                    <img 
                        src={story.cover_url} 
                        alt={story.title} 
                        className="w-full h-full object-cover opacity-80 scale-105"
                    />
                </div>
            ))}
            
            <div className="absolute bottom-0 left-0 right-0 z-20 p-8 sm:p-12 lg:p-20 flex flex-col items-start max-w-4xl">
                <div className="flex gap-2 mb-4">
                    {currentStory.status === 'COMPLETED' && <span className="bg-emerald-500 text-white text-xs uppercase font-black px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Finalizado</span>}
                    {currentStory.status === 'ONGOING' && <span className="bg-blue-500 text-white text-xs uppercase font-black px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Emisión</span>}
                    {currentStory.status === 'SOON' && <span className="bg-primary text-white text-xs uppercase font-black px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Pronto</span>}
                    <span className="bg-pink-500 text-white text-xs uppercase font-black px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Tendencia</span>
                </div>
                
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase italic tracking-tighter mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] line-clamp-2">
                    {currentStory.title}
                </h1>
                
                <div className="flex items-center gap-4 mt-4">
                    <button 
                        onClick={() => navigate(`/comic/${currentStory.id}`)}
                        className="flex items-center gap-2 bg-white text-black font-black uppercase text-lg sm:text-xl px-8 py-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-primary hover:text-white transition-all active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <Play className="w-6 h-6 fill-current" />
                        Leer Ahora
                    </button>
                </div>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 z-20 flex gap-2">
                {stories.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full border-2 border-black transition-all ${idx === currentIndex ? 'bg-primary w-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white/50 hover:bg-white'}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Home() {
    const [recentlyAdded, setRecentlyAdded] = useState<StoryInfo[]>([]);
    const [trending, setTrending] = useState<StoryInfo[]>([]);
    const [allComics, setAllComics] = useState<StoryInfo[]>([]);
    const [completed, setCompleted] = useState<StoryInfo[]>([]);
    const [comingSoon, setComingSoon] = useState<StoryInfo[]>([]);
    const [dailyUpdates, setDailyUpdates] = useState<StoryInfo[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStories = async () => {
            try {
                // Recently added
                const { data: recentSnap } = await supabase
                    .from('stories')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(15);
                    
                // Trending (by likes)
                const { data: trendSnap } = await supabase
                    .from('stories')
                    .select('*')
                    .order('likes_count', { ascending: false })
                    .limit(15);

                const { data: allSnap } = await supabase
                    .from('stories')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(30);
                    
                const { data: compSnap } = await supabase
                    .from('stories')
                    .select('*')
                    .eq('status', 'COMPLETED')
                    .limit(15);

                const { data: soonSnap } = await supabase
                    .from('stories')
                    .select('*')
                    .eq('status', 'SOON')
                    .limit(15);
                
                if (recentSnap) setRecentlyAdded(recentSnap as StoryInfo[]);
                if (trendSnap) setTrending(trendSnap as StoryInfo[]);
                if (allSnap) setAllComics(allSnap as StoryInfo[]);
                if (compSnap) setCompleted(compSnap as StoryInfo[]);
                if (soonSnap) setComingSoon(soonSnap as StoryInfo[]);
                // For daily updates, let's just use recently added for now or random
                if (recentSnap) setDailyUpdates(recentSnap.slice(0, 8) as StoryInfo[]);
            } catch (err) {
                console.error("Error fetching home data:", err);
            }
        };

        fetchStories();
    }, []);

    const renderSection = (title: string, stories: StoryInfo[], link?: string) => {
        return (
            <section className="mb-12">
                <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
                    {link ? (
                        <button onClick={() => navigate(link)} className="flex items-center gap-1 text-xl font-black text-primary-dark hover:text-primary transition-colors group uppercase italic tracking-tighter">
                            {title}
                            <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ) : (
                        <h2 className="text-xl font-black text-primary-dark uppercase italic tracking-tighter">{title}</h2>
                    )}
                </div>
                
                {stories && stories.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8 snap-x hide-scrollbar">
                        {stories.map(story => (
                            <StoryCard key={story.id} story={story} />
                        ))}
                    </div>
                ) : (
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="bg-white/50 border-4 border-dashed border-black/10 rounded-[2.5rem] py-16 flex flex-col items-center justify-center text-center">
                            <p className="font-black text-slate-300 uppercase italic text-sm tracking-widest px-4">
                                Aun no hay nada por aquí... por ahora
                            </p>
                        </div>
                    </div>
                )}
            </section>
        );
    };

    return (
        <div className="pb-8">
            <HeroSlider stories={trending.slice(0, 5)} />
            {renderSection("AÑADIDOS RECIENTEMENTE", recentlyAdded)}
            {renderSection("ACTUALIZACIONES DIARIAS", dailyUpdates)}
            {renderSection("PRÓXIMAMENTE", comingSoon)}
            {renderSection("TÍTULOS EN TENDENCIA", trending)}
            {renderSection("TODAS LAS OBRAS", allComics, "/directory")}
            {renderSection("TERMINADOS", completed)}
        </div>
    );
}

function StoryCard({ story }: { story: StoryInfo, key?: React.Key }) {
    return (
        <Link 
            to={`/comic/${story.id}`} 
            className="flex flex-col gap-3 min-w-[150px] max-w-[150px] sm:min-w-[180px] sm:max-w-[180px] snap-start group"
        >
            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <img 
                    src={story.cover_url || 'https://via.placeholder.com/300x450?text=No+Cover'} 
                    alt={story.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {story.status === 'COMPLETED' && <span className="bg-emerald-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Finalizado</span>}
                    {story.status === 'ONGOING' && <span className="bg-blue-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Emisión</span>}
                    {story.status === 'SOON' && <span className="bg-primary text-white text-[10px] uppercase font-black px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Pronto</span>}
                </div>
            </div>
            <h3 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors px-1">{story.title}</h3>
        </Link>
    );
}
