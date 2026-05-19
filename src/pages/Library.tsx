import React, { useEffect, useState } from 'react';
import { api, getImageUrl } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function Library() {
    const { user, authLoading } = useStore();
    const navigate = useNavigate();
    const [savedStories, setSavedStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        
        if (!user) {
            navigate('/');
            return;
        }

        const fetchLibrary = async () => {
            try {
                const libData = await api.interactions.getLibrary();
                
                if (libData && libData.length > 0) {
                    // Assuming Ivan returns the stories directly or in an array
                    setSavedStories(libData);
                }
            } catch (err) {
                console.error("Library fetch error", err);
            }
            setLoading(false);
        };

        fetchLibrary();
    }, [user, navigate, authLoading]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
            <h1 className="text-3xl font-black mb-8 text-primary-dark uppercase italic tracking-tighter font-display">Mi Biblioteca</h1>
            
            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div></div>
            ) : savedStories.length === 0 ? (
                <div className="text-center py-24 bg-white/50 rounded-[3rem] border-4 border-black/10 border-dashed">
                    <p className="text-sm font-black text-slate-300 uppercase italic tracking-widest px-4 mb-6">Aun no hay nada por aquí... por ahora</p>
                    <Link to="/directory" className="toon-button bg-primary inline-block">¡Explorar Historias!</Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                    {savedStories.map(story => (
                        <Link 
                            key={story.id}
                            to={`/comic/${story.id}`} 
                            className="flex flex-col gap-3 group relative"
                        >
                            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <img 
                                    src={story.cover ? getImageUrl(story.cover) : (story.cover_url || 'https://via.placeholder.com/300x450')} 
                                    alt={story.title}
                                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors px-1">{story.title}</h3>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
