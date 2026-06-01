import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, getImageUrl } from '../services/api';

export default function AuthorProfile() {
    const { name } = useParams();
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuthorWorks = async () => {
            if (!name) return;
            setLoading(true);
            try {
                // Fetch all stories and filter by author name
                // Supabase permits better querying but using getAll() works too
                const allStories = await api.stories.getAll();
                const filtered = allStories.filter(s => 
                    (s.author && s.author.toLowerCase().includes(name.toLowerCase())) ||
                    (s.writer && s.writer.toLowerCase().includes(name.toLowerCase()))
                );
                setStories(filtered);
            } catch (err) {
                console.error("Error fetching author works:", err);
            }
            setLoading(false);
        };

        fetchAuthorWorks();
    }, [name]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full min-h-[60vh]">
            <div className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12">
                <h1 className="text-3xl md:text-5xl font-black text-primary-dark mb-2 tracking-tight drop-shadow-sm font-display uppercase italic">
                    Obras de {name}
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                    {stories.length} Obra(s) publicadas
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div></div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                    {stories.map(story => (
                        <Link 
                            key={story.id}
                            to={`/comic/${story.id}`} 
                            className="flex flex-col gap-3 group"
                        >
                            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <img 
                                    src={story.cover ? getImageUrl(story.cover) : (story.cover_url || 'https://via.placeholder.com/300x450')} 
                                    alt={story.title}
                                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    {story.status === 'COMPLETED' && <span className="bg-emerald-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Finalizado</span>}
                                    {story.status === 'ONGOING' && <span className="bg-blue-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Emisión</span>}
                                    {story.status === 'SOON' && <span className="bg-primary text-white text-[10px] uppercase font-black px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Pronto</span>}
                                </div>
                            </div>
                            <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors px-1">{story.title}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{story.created_at ? new Date(story.created_at).toLocaleDateString() : ''}</p>
                        </Link>
                    ))}
                    {stories.length === 0 && (
                        <div className="col-span-full py-24 bg-white/50 border-4 border-dashed border-black/10 rounded-[3rem] flex flex-col items-center justify-center text-center">
                            <p className="font-black text-slate-300 uppercase italic tracking-widest text-sm">Este autor aún no tiene obras publicadas.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
