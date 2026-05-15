import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface StoryInfo {
    id: string;
    title: string;
    cover_url: string;
    status: string;
    likes_count: number;
    created_at: string;
}

export default function Home() {
    const [recentlyAdded, setRecentlyAdded] = useState<StoryInfo[]>([]);
    const [trending, setTrending] = useState<StoryInfo[]>([]);
    const [allComics, setAllComics] = useState<StoryInfo[]>([]);
    const [completed, setCompleted] = useState<StoryInfo[]>([]);

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
                
                if (recentSnap) setRecentlyAdded(recentSnap as StoryInfo[]);
                if (trendSnap) setTrending(trendSnap as StoryInfo[]);
                if (allSnap) setAllComics(allSnap as StoryInfo[]);
                if (compSnap) setCompleted(compSnap as StoryInfo[]);
            } catch (err) {
                console.error("Error fetching home data:", err);
            }
        };

        fetchStories();
    }, []);

    const renderSection = (title: string, stories: StoryInfo[], link?: string) => {
        if (!stories || stories.length === 0) return null;
        
        return (
            <section className="mb-12">
                <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
                    {link ? (
                        <button onClick={() => navigate(link)} className="flex items-center gap-1 text-xl font-black text-primary-dark hover:text-primary transition-colors group">
                            {title}
                            <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ) : (
                        <h2 className="text-xl font-black text-primary-dark">{title}</h2>
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
            {renderSection("TÍTULOS EN TENDENCIA", trending)}
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
