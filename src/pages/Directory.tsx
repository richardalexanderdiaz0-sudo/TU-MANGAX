import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Directory() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [stories, setStories] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const statusFilter = searchParams.get('status') || '';

    useEffect(() => {
        fetchDirectory();
    }, [statusFilter]);

    const fetchDirectory = async () => {
        setLoading(true);
        try {
            let query = supabase.from('stories').select('*').order('created_at', { ascending: false });

            if (statusFilter) {
                query = query.eq('status', statusFilter);
            }

            const { data, error } = await query;
            if (data && !error) {
                setStories(data);
            }
        } catch (err) {
            console.error("Directory fetch error:", err);
        }
        setLoading(false);
    };

    const filteredStories = stories.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <h1 className="text-3xl font-black mb-8 text-primary-dark font-display uppercase italic tracking-tighter">Directorio</h1>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar por título..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white border-4 border-black text-slate-800 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold placeholder:text-slate-300"
                    />
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <select 
                        value={statusFilter}
                        onChange={(e) => {
                            if (e.target.value) searchParams.set('status', e.target.value);
                            else searchParams.delete('status');
                            setSearchParams(searchParams);
                        }}
                        className="bg-white border-4 border-black text-slate-800 rounded-2xl px-6 py-3 focus:outline-none focus:border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold appearance-none cursor-pointer"
                    >
                        <option value="">Cualquier Estado</option>
                        <option value="ONGOING">En Emisión</option>
                        <option value="COMPLETED">Finalizado</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div></div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                    {filteredStories.map(story => (
                        <Link 
                            key={story.id}
                            to={`/comic/${story.id}`} 
                            className="flex flex-col gap-3 group"
                        >
                            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <img 
                                    src={story.cover_url || 'https://via.placeholder.com/300x450'} 
                                    alt={story.title}
                                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    {story.status === 'COMPLETED' && <span className="bg-emerald-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Finalizado</span>}
                                    {story.status === 'ONGOING' && <span className="bg-blue-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Emisión</span>}
                                </div>
                            </div>
                            <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors px-1">{story.title}</h3>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
