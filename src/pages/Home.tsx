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
    views_count?: number;
    created_at: string;
    updated_at?: string;
    isRecentlyUpdated?: boolean;
    author?: string;
    isAnnouncement?: boolean;
    link?: string;
    publish_date?: string;
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
        <div className="w-full relative h-[60vh] sm:h-[70vh] lg:h-[80vh] min-h-[400px] mb-12 overflow-hidden bg-[#06070d] mx-auto max-w-7xl sm:rounded-b-[3rem] border-b border-white/5 shadow-2xl">
            {slideItems.map((item, index) => (
                <div 
                    key={item.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05060b] via-slate-950/70 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-black/20 z-10"></div>
                    <img 
                        src={item.cover_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover opacity-80 transition-transform duration-[8000ms] scale-102"
                    />
                </div>
            ))}
            
            <div className="absolute bottom-0 left-0 right-0 z-20 p-8 sm:p-12 lg:p-20 flex flex-col items-start max-w-4xl">
                <div className="flex gap-2 mb-4">
                    {currentItem.isAnnouncement && <span className="bg-rose-600 text-white text-xs uppercase font-sub-heading tracking-wider font-extrabold px-3.5 py-1 rounded-full shadow-lg shadow-rose-500/20 animate-pulse">Noticia Exclusiva</span>}
                    {currentItem.status === 'COMPLETED' && <span className="bg-emerald-600 text-white text-xs uppercase font-sub-heading tracking-wider font-extrabold px-3.5 py-1 rounded-full shadow-lg shadow-emerald-500/20">Finalizado</span>}
                    {currentItem.status === 'ONGOING' && <span className="bg-blue-600 text-white text-xs uppercase font-sub-heading tracking-wider font-extrabold px-3.5 py-1 rounded-full shadow-lg shadow-blue-500/20">Emisión</span>}
                    {currentItem.status === 'SOON' && <span className="bg-rose-500 text-white text-xs uppercase font-sub-heading tracking-wider font-extrabold px-3.5 py-1 rounded-full shadow-lg shadow-rose-400/20">Pronto</span>}
                    {!currentItem.isAnnouncement && <span className="bg-amber-500 text-slate-950 text-[11px] uppercase tracking-wider font-black px-3.5 py-1 rounded-full shadow-lg shadow-amber-500/20">🔥 Tendencia</span>}
                </div>
                
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter mb-4 line-clamp-2 leading-none">
                    {currentItem.title}
                </h1>
                
                <div className="flex items-center gap-4 mt-4">
                    {currentItem.isAnnouncement ? (
                        <button 
                            onClick={() => navigate(currentItem.link || '/android-announcement')}
                            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-xs sm:text-sm tracking-wider px-6 py-3 rounded-2xl transition-all shadow-lg hover:scale-102 border border-rose-500/20"
                        >
                            Leer Noticia Completa
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button 
                                onClick={() => navigate(`/comic/${currentItem.id}`)}
                                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-xs sm:text-sm tracking-wider px-6 py-3 rounded-2xl transition-all shadow-lg hover:scale-102 border border-rose-500/10"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                Leer Ahora
                            </button>
                            <button 
                                onClick={() => navigate('/directory')}
                                className="flex items-center gap-2 bg-[#12131d]/90 hover:bg-[#1a1c2b] text-slate-200 font-extrabold uppercase text-xs sm:text-sm tracking-wider px-6 py-3 rounded-2xl transition-all hover:scale-102 border border-white/5 shadow-md"
                            >
                                Explorar Catálogo General
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 z-20 flex gap-2">
                {slideItems.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-rose-500 w-6' : 'bg-white/30 hover:bg-white/50'}`}
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
                const sortedByViews = [...allStories].sort((a: any, b: any) => (b.views_count||0) - (a.views_count||0));

                const addedRecently = sortedByRecency.filter((s: any) => {
                    const createdDate = new Date(s.created || s.created_at).getTime();
                    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
                    if (s.status === 'COMPLETED') {
                        return diffDays <= 1;
                    } else if (s.status === 'SOON') {
                        return false;
                    } else {
                        return diffDays <= 2;
                    }
                });

                const dailyUpdatesList = allStories.filter(s => s.isRecentlyUpdated && s.status !== 'SOON')
                    .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

                setAllComics(sortedByRecency.filter(s => s.status !== 'SOON'));
            } catch (err) {
                console.error("Error fetching home data:", err);
            }
        };

        fetchStories();
        
        const interval = setInterval(() => {
            setAllComics(prev => {
                let changed = false;
                const nowTime = Date.now();
                const next = prev.map(s => {
                    if (s.status === 'SOON' && s.publish_date) {
                        const target = new Date(s.publish_date).getTime();
                        if (nowTime >= target) {
                            changed = true;
                            // Assume it goes to ONGOING, let api.ts update on next refresh if needed
                            return { ...s, status: 'ONGOING' };
                        }
                    }
                    return s;
                });
                return changed ? next : prev;
            });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!allComics || allComics.length === 0) return;
        
        const now = Date.now();
        const sortedByViews = [...allComics].sort((a: any, b: any) => (b.views_count||0) - (a.views_count||0));
        
        const addedRecently = allComics.filter((s: any) => {
            const createdDate = new Date(s.created || s.created_at).getTime();
            const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
            if (s.status === 'COMPLETED') {
                return diffDays <= 1;
            } else {
                return diffDays <= 2;
            }
        });

        const dailyUpdatesList = allComics.filter(s => s.isRecentlyUpdated)
            .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

        setRecentlyAdded(addedRecently.filter(s => s.status !== 'SOON'));
        setTrending(sortedByViews.filter(s => s.status !== 'SOON').slice(0, 15));
        setCompleted(allComics.filter((s: any) => s.status === 'COMPLETED').slice(0, 15));
        setComingSoon(allComics.filter((s: any) => s.status === 'SOON').slice(0, 15));
        setDailyUpdates(dailyUpdatesList.filter(s => s.status !== 'SOON'));
        
        // Recommendations
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
                 return userProfile.preferences.some((pref: string) => storyCats.includes(pref)) && s.status !== 'SOON';
             }).sort((a: any, b: any) => (b.views_count||0) - (a.views_count||0));
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
                (c.author && c.author.toLowerCase().includes(query)) ||
                (c.writer && c.writer.toLowerCase().includes(query))
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
            className="flex flex-col gap-3 min-w-[150px] max-w-[150px] sm:min-w-[180px] sm:max-w-[180px] snap-start group relative"
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
                {/* Micro fire overlay chip indicating views count */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/85 font-black text-[10.5px] text-amber-400 px-2 py-0.5 rounded-lg border-2 border-black select-none z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span>🔥</span>
                    <span>{story.views_count || 0}</span>
                </div>
            </div>
            <h3 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors px-1">{story.title}</h3>
        </Link>
    );
}
