import React, { useEffect, useState, useRef } from 'react';
import { api, getImageUrl } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Play, Bell } from 'lucide-react';
import { useStore } from '../store';
import { requestNotificationPermission } from '../services/notifications';

interface StoryInfo {
    id: string;
    title: string;
    cover_url: string;
    status: string;
    likes_count: number;
    created_at: string;
    updated_at?: string;
    isRecentlyUpdated?: boolean;
    author?: string;
    isAnnouncement?: boolean;
    link?: string;
}

// ... HeroSlider stays same ...
function HeroSlider({ stories }: { stories: StoryInfo[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    // Adding Android Announcement and Socials Announcement as slides
    const slideItems = [
        {
            id: 'android-announcement',
            title: '¡PRÓXIMAMENTE APP PARA ANDROID!',
            cover_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop',
            status: 'NEWS',
            isAnnouncement: true,
            link: '/android-announcement'
        },
        {
            id: 'socials-announcement',
            title: '¡SÍGUENOS EN NUESTRAS REDES!',
            cover_url: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=1200&auto=format&fit=crop',
            status: 'NEWS',
            isAnnouncement: true,
            link: '/socials'
        },
        ...stories
    ];
    
    useEffect(() => {
        if (!slideItems || slideItems.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slideItems.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [slideItems.length]);

    if (!slideItems || slideItems.length === 0) return null;

    const currentItem = slideItems[currentIndex];

    return (
        <div className="w-full relative h-[60vh] sm:h-[70vh] lg:h-[80vh] min-h-[400px] mb-12 overflow-hidden bg-slate-900 mx-auto max-w-7xl sm:rounded-b-[3rem] shadow-[0_20px_0_0_rgba(0,0,0,1)] border-b-8 border-black">
            {slideItems.map((item, index) => (
                <div 
                    key={item.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-black/30 z-10"></div>
                    <img 
                        src={item.cover_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover opacity-80 scale-105"
                    />
                </div>
            ))}
            
            <div className="absolute bottom-0 left-0 right-0 z-20 p-8 sm:p-12 lg:p-20 flex flex-col items-start max-w-4xl">
                <div className="flex gap-2 mb-4">
                    {currentItem.isAnnouncement && <span className="bg-red-500 text-white text-xs uppercase font-black px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse">Noticia Exclusiva</span>}
                    {currentItem.status === 'COMPLETED' && <span className="bg-emerald-500 text-white text-xs uppercase font-black px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Finalizado</span>}
                    {currentItem.status === 'ONGOING' && <span className="bg-blue-500 text-white text-xs uppercase font-black px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Emisión</span>}
                    {currentItem.status === 'SOON' && <span className="bg-primary text-white text-xs uppercase font-black px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Pronto</span>}
                    {!currentItem.isAnnouncement && <span className="bg-pink-500 text-white text-xs uppercase font-black px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Tendencia</span>}
                </div>
                
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase italic tracking-tighter mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] line-clamp-2">
                    {currentItem.title}
                </h1>
                
                <div className="flex items-center gap-4 mt-4">
                    {currentItem.isAnnouncement ? (
                        <button 
                            onClick={() => navigate(currentItem.link || '/android-announcement')}
                            className="flex items-center gap-2 bg-primary text-white font-black uppercase text-lg sm:text-xl px-8 py-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black transition-all active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                            Leer Noticia Completa
                        </button>
                    ) : (
                        <button 
                            onClick={() => navigate(`/comic/${currentItem.id}`)}
                            className="flex items-center gap-2 bg-white text-black font-black uppercase text-lg sm:text-xl px-8 py-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-primary hover:text-white transition-all active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <Play className="w-6 h-6 fill-current" />
                            Leer Ahora
                        </button>
                    )}
                </div>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 z-20 flex gap-2">
                {slideItems.map((_, idx) => (
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
    const [recommended, setRecommended] = useState<StoryInfo[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<StoryInfo[]>([]);
    const [notifStatus, setNotifStatus] = useState<string>(
        ('Notification' in window) ? Notification.permission : 'denied'
    );
    const { userProfile } = useStore();

    const handleEnableNotifs = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            setNotifStatus('granted');
        } else {
            setNotifStatus('Notification' in window ? Notification.permission : 'denied');
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await api.stories.getAll();
                const now = new Date().getTime();

                const allStories = response.map((s: any) => {
                    const createdDate = new Date(s.created || s.created_at).getTime();
                    // isRecentlyUpdated logic
                    let isRecentlyUpdated = false;
                    if (s.updated_at) {
                        const updatedDate = new Date(s.updated_at).getTime();
                        if (updatedDate - createdDate > 1000) {
                            const diffDaysUpdate = (now - updatedDate) / (1000 * 60 * 60 * 24);
                            if (diffDaysUpdate <= 1) {
                                isRecentlyUpdated = true;
                            }
                        }
                    }
                    
                    return {
                        ...s,
                        isRecentlyUpdated,
                        cover_url: s.cover ? getImageUrl(s.cover) : (s.cover_url || '')
                    };
                });

                const sortedByRecency = [...allStories].sort((a: any, b: any) => new Date(b.created || b.created_at).getTime() - new Date(a.created || a.created_at).getTime());
                const sortedByLikes = [...allStories].sort((a: any, b: any) => (b.likes_count||0) - (a.likes_count||0));

                const addedRecently = sortedByRecency.filter((s: any) => {
                    const createdDate = new Date(s.created || s.created_at).getTime();
                    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
                    if (s.status === 'COMPLETED') {
                        return diffDays <= 1;
                    } else {
                        return diffDays <= 2;
                    }
                });

                const dailyUpdatesList = allStories.filter(s => s.isRecentlyUpdated)
                    .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

                setRecentlyAdded(addedRecently);
                setTrending(sortedByLikes.slice(0, 15));
                setAllComics(sortedByRecency);
                
                setCompleted(allStories.filter((s: any) => s.status === 'COMPLETED').slice(0, 15));
                setComingSoon(allStories.filter((s: any) => s.status === 'SOON').slice(0, 15));
                setDailyUpdates(dailyUpdatesList);
            } catch (err) {
                console.error("Error fetching home data:", err);
            }
        };

        fetchStories();
    }, []);

    useEffect(() => {
        if (!allComics || allComics.length === 0) return;
        
        let recommends: StoryInfo[] = [];
        if (userProfile?.preferences && userProfile.preferences.length > 0) {
             recommends = allComics.filter(s => {
                 let storyCats: string[] = [];
                 if (s.categories) {
                     try { 
                         let parsed = typeof s.categories === 'string' ? JSON.parse(s.categories) : s.categories;
                         if (Array.isArray(parsed)) storyCats = parsed;
                     } catch(e) {}
                 }
                 if (!Array.isArray(storyCats)) storyCats = [];
                 return userProfile.preferences.some((pref: string) => storyCats.includes(pref));
             }).sort((a: any, b: any) => (b.likes_count||0) - (a.likes_count||0));
             setRecommended(recommends.slice(0, 15));
        } else {
             setRecommended([]);
        }
    }, [allComics, userProfile?.preferences]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
        } else {
            const query = searchQuery.toLowerCase();
            const results = allComics.filter(c => 
                c.title.toLowerCase().includes(query) || 
                (c.author && c.author.toLowerCase().includes(query))
            );
            setSearchResults(results);
        }
    }, [searchQuery, allComics]);

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
            
            <div className="px-4 sm:px-6 lg:px-8 mb-8 max-w-7xl mx-auto">
                <div className="relative group">
                    <input 
                        type="text"
                        placeholder="Buscar obra o autor/a..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-4 border-black rounded-[2rem] pl-14 pr-6 py-4 sm:py-5 text-sm sm:text-lg font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
            </div>

            {/* Banner elegante para activar notificaciones push */}
            {notifStatus === 'default' && (
                <div className="px-4 sm:px-6 lg:px-8 mb-10 max-w-7xl mx-auto">
                    <div className="bg-primary/5 border-4 border-dashed border-primary/40 rounded-[2.5rem] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-primary/10">
                        <div className="flex items-start gap-4">
                            <div className="p-3.5 bg-primary text-white rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 animate-pulse">
                                <Bell className="h-6 w-6 stroke-[3px]" />
                            </div>
                            <div>
                                <h4 className="font-black text-lg text-primary-dark uppercase italic tracking-tight">¡No te pierdas ningún estreno! 🔔</h4>
                                <p className="text-xs sm:text-sm text-slate-600 font-bold mt-1 max-w-2xl leading-relaxed">
                                    Activa las notificaciones automáticas para recibir avisos al instante en tu celular cuando tus mangas favoritos en tu biblioteca publiquen nuevos capítulos.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleEnableNotifs}
                            className="w-full md:w-auto toon-button bg-primary text-white py-3 px-8 uppercase text-xs font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap active:translate-x-[2px] active:translate-y-[2px]"
                        >
                            🔔 Activar Notificaciones
                        </button>
                    </div>
                </div>
            )}

            {searchQuery.trim() !== '' ? (
                renderSection(`RESULTADOS PARA "${searchQuery.toUpperCase()}"`, searchResults)
            ) : (
                <>
                    {recommended.length > 0 && renderSection("RECOMENDADOS PARA TI 👑", recommended)}
                    {renderSection("AÑADIDOS RECIENTEMENTE", recentlyAdded)}
                    {renderSection("ACTUALIZACIONES DIARIAS", dailyUpdates)}
                    {renderSection("PRÓXIMAMENTE", comingSoon)}
                    {renderSection("TÍTULOS EN TENDENCIA", trending)}
                    {renderSection("TODAS LAS OBRAS", allComics.slice(0, 30), "/directory")}
                    {renderSection("TERMINADOS", completed)}
                </>
            )}
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
                    {story.isRecentlyUpdated && <span className="bg-red-600 text-white text-[10px] uppercase font-black px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse">¡ACTUALIZADO!</span>}
                    {story.status === 'COMPLETED' && <span className="bg-emerald-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Finalizado</span>}
                    {story.status === 'ONGOING' && <span className="bg-blue-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Emisión</span>}
                    {story.status === 'SOON' && <span className="bg-primary text-white text-[10px] uppercase font-black px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Pronto</span>}
                </div>
            </div>
            <h3 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors px-1">{story.title}</h3>
        </Link>
    );
}
