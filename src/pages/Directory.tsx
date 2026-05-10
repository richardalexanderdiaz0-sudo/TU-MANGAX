import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

export default function Directory() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [stories, setStories] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const typeFilter = searchParams.get('type') || '';
    const statusFilter = searchParams.get('status') || '';
    const categoryFilter = searchParams.get('category') || '';

    useEffect(() => {
        fetchDirectory();
    }, [typeFilter, statusFilter, categoryFilter]);

    const fetchDirectory = async () => {
        setLoading(true);
        let q = collection(db, 'stories');
        
        try {
            // Because Firestore requires composite indexes for multiple where + orderBy, 
            // we will fetch all published stories and filter clientside. This is acceptable for modest catalogs.
            const snap = await getDocs(query(q, where('isComingSoon', '==', false)));
            let data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));

            if (typeFilter) data = data.filter((s: any) => s.type === typeFilter);
            if (statusFilter) data = data.filter((s: any) => s.status === statusFilter);
            if (categoryFilter) data = data.filter((s: any) => s.categories && s.categories.includes(categoryFilter));
            
            setStories(data);
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
            <h1 className="text-3xl font-bold mb-8">Directorio</h1>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar por título..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500"
                    />
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <select 
                        value={typeFilter}
                        onChange={(e) => {
                            if (e.target.value) searchParams.set('type', e.target.value);
                            else searchParams.delete('type');
                            setSearchParams(searchParams);
                        }}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none"
                    >
                        <option value="">Cualquier Tipo</option>
                        <option value="COMIC">Comic</option>
                        <option value="MANGA">Manga</option>
                        <option value="MANHWA">Manhwa</option>
                    </select>

                    <select 
                        value={statusFilter}
                        onChange={(e) => {
                            if (e.target.value) searchParams.set('status', e.target.value);
                            else searchParams.delete('status');
                            setSearchParams(searchParams);
                        }}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none"
                    >
                        <option value="">Cualquier Estado</option>
                        <option value="ONGOING">En Emisión</option>
                        <option value="COMPLETED">Finalizado</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div></div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredStories.map(story => (
                        <Link 
                            key={story.id}
                            to={`/comic/${story.id}`} 
                            className="flex flex-col gap-2 group"
                        >
                            <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-slate-800">
                                <img 
                                    src={story.coverUrl || 'https://via.placeholder.com/300x450'} 
                                    alt={story.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    {story.status === 'COMPLETED' && <span className="bg-emerald-600 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow">Finalizado</span>}
                                </div>
                            </div>
                            <h3 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{story.title}</h3>
                            <p className="text-xs text-slate-400 capitalize">{story.type.toLowerCase()}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
