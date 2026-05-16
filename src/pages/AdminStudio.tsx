import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useNavigate, Routes, Route, Link, useParams } from 'react-router-dom';
import { supabase, uploadFile } from '../services/supabase';
import { Plus, Image as ImageIcon, Upload, FileText, Settings, ArrowRight, X } from 'lucide-react';

export default function AdminStudio() {
    const { user, userProfile, authLoading } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && (!user || userProfile?.role !== 'admin')) {
            navigate('/');
        }
    }, [user, userProfile, authLoading, navigate]);

    if (authLoading || !user || userProfile?.role !== 'admin') {
         return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-background border-l-4 border-black">
            <div className="p-6 border-b-4 border-black flex items-center justify-between bg-white">
                <h1 className="text-2xl font-black flex items-center gap-2 text-primary-dark font-display uppercase italic"><Upload className="h-6 w-6 text-primary"/> Admin Studio</h1>
                <Link to="/admin/new" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-2xl font-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <Plus className="h-5 w-5"/> Nueva Obra
                </Link>
            </div>
            
            <div className="flex-1 p-6 relative bg-[radial-gradient(#ff69b4_1px,transparent_1px)] [background-size:20px_20px] [background-position:center]">
                <Routes>
                    <Route path="/" element={<StudioHome />} />
                    <Route path="/new" element={<CreationWizard />} />
                    <Route path="/edit/:storyId" element={<EditStory />} />
                </Routes>
            </div>
        </div>
    );
}

function StudioHome() {
    const [stories, setStories] = useState<any[]>([]);
    const [loadingFetch, setLoadingFetch] = useState(true);

    const fetchStories = async () => {
        setLoadingFetch(true);
        const { data } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
        if (data) {
            setStories(data);
        }
        setLoadingFetch(false);
    };

    useEffect(() => {
        fetchStories();
    }, []);

    const handleDeleteStory = async (id: string, title: string) => {
        if (!confirm(`¿Estás seguro de que quieres borrar TODA la obra "${title}"? Esta acción no se puede deshacer.`)) return;
        
        try {
            // First delete chapters associated (Supabase might handle this via Cascade, but let's be safe if not configured)
            await supabase.from('chapters').delete().eq('story_id', id);
            // Then delete the story
            const { error } = await supabase.from('stories').delete().eq('id', id);
            
            if (error) throw error;
            fetchStories();
        } catch (err) {
            console.error(err);
            alert("Error al borrar la obra.");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-primary-dark uppercase italic tracking-tight font-display">Todas las Obras</h2>
                <button onClick={fetchStories} className="p-2 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                    <ArrowRight className="h-5 w-5 rotate-90" />
                </button>
            </div>

            {loadingFetch ? (
                <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {stories.map(st => (
                        <div key={st.id} className="toon-card bg-white p-4 flex flex-col group relative">
                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border-2 border-black mb-4">
                                <img src={st.cover_url} className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition" alt=""/>
                                <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                                    <button 
                                        onClick={(e) => { e.preventDefault(); handleDeleteStory(st.id, st.title); }}
                                        className="bg-red-500 text-white p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 transition-all flex items-center justify-center"
                                        title="Borrar Obra"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link to={`/admin/edit/${st.id}`} className="bg-white text-primary-dark px-4 py-2 font-black rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm hover:scale-105 transition-all">
                                        Gestionar Capítulos
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="font-black text-slate-800 line-clamp-1 mb-1">{st.title}</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border-2 border-black ${
                                        st.status === 'COMPLETED' ? 'bg-emerald-400' : st.status === 'SOON' ? 'bg-primary text-white' : 'bg-blue-400'
                                    }`}>
                                        {st.status === 'COMPLETED' ? 'Finalizada' : st.status === 'SOON' ? 'Próximamente' : 'Emisión'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {stories.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white/50 border-4 border-dashed border-black rounded-[3rem]">
                            <p className="font-black text-slate-400 uppercase italic">Aún no has publicado nada...</p>
                            <Link to="/admin/new" className="toon-button bg-primary mt-4 inline-block">¡Empieza Ahora!</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// -------------------------------------------------------------
// WIZARD
// -------------------------------------------------------------
const CATEGORIES = ["YAOI", "BL", "+18", "SHOUJO", "SHOUNEN", "SEINEN", "JOSEI", "KODOMO", "ISEKAI", "YURI", "GL", "OMEGAVERSE"];
const TAGS = ["Acción", "Fantasía", "Drama", "Suspenso", "Vida Cotidiana", "Vida Escolar", "Cárcel", "Bullying", "Chico Rudo", "Romance", "Comedia", "Terror", "Misterio", "Deportes", "Magia", "Vampiros", "Zombies", "Post-apocalíptico", "Reencarnación", "Sistema", "Venganza", "Artes Marciales", "Tragedia"];

function CreationWizard() {
    const navigate = useNavigate();
    const { user, userProfile } = useStore();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [type, setType] = useState('MANHWA');
    const [title, setTitle] = useState('');
    const [authorNameInput, setAuthorNameInput] = useState(userProfile?.display_name || '');
    const [synopsis, setSynopsis] = useState('');
    const [status, setStatus] = useState('COMPLETED');
    const [coverFile, setCoverFile] = useState<File|null>(null);
    const [chapterCount, setChapterCount] = useState(1);

    const [chapters, setChapters] = useState<{cover: File|null, pages: File[], title: string}[]>([]);
    
    const [selectedCats, setSelectedCats] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [publishMode, setPublishMode] = useState('NOW'); // NOW or SOON
    const [publishDate, setPublishDate] = useState('');

    const [draftFound, setDraftFound] = useState<{ date: string, type: string, action: string, data: any } | null>(null);

    // Draft system
    useEffect(() => {
        const savedDraft = localStorage.getItem('story_draft');
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                setDraftFound({
                    date: parsed.updatedAt,
                    type: parsed.type,
                    action: "creando una nueva obra",
                    data: parsed
                });
            } catch (e) {
                localStorage.removeItem('story_draft');
            }
        }
    }, []);

    // Auto-save draft
    useEffect(() => {
        if (!title && !synopsis && chapterCount === 1 && selectedCats.length === 0) return;
        
        const timeout = setTimeout(() => {
            const draftData = {
                type, title, authorNameInput, synopsis, status, chapterCount, selectedCats, selectedTags, publishMode, publishDate,
                updatedAt: new Date().toLocaleString()
            };
            localStorage.setItem('story_draft', JSON.stringify(draftData));
        }, 1000);
        
        return () => clearTimeout(timeout);
    }, [type, title, authorNameInput, synopsis, status, chapterCount, selectedCats, selectedTags, publishMode, publishDate]);

    const restoreDraft = () => {
        if (draftFound) {
            const d = draftFound.data;
            setType(d.type || 'MANHWA');
            setTitle(d.title || '');
            setAuthorNameInput(d.authorNameInput || '');
            setSynopsis(d.synopsis || '');
            setStatus(d.status || 'COMPLETED');
            setChapterCount(d.chapterCount || 1);
            setSelectedCats(d.selectedCats || []);
            setSelectedTags(d.selectedTags || []);
            setPublishMode(d.publishMode || 'NOW');
            setPublishDate(d.publishDate || '');
            setDraftFound(null);
        }
    };

    const discardDraft = () => {
        localStorage.removeItem('story_draft');
        setDraftFound(null);
    };

    useEffect(() => {
        if(chapterCount > chapters.length) {
            const extra = Array.from({length: chapterCount - chapters.length}, () => ({cover: null, pages: [], title: ''}));
            setChapters([...chapters, ...extra]);
        } else if (chapterCount < chapters.length) {
            setChapters(chapters.slice(0, chapterCount));
        }
    }, [chapterCount]);

    const handlePublish = async () => {
        setLoading(true);
        try {
            // Upload main cover
            let mainCoverUrl = '';
            if (coverFile) {
                mainCoverUrl = await uploadFile(coverFile, `covers/${Date.now()}_${coverFile.name}`);
            }

            // Create story in supabase
            const isComingSoon = status === 'ONGOING' && publishMode === 'SOON';
            
            // Combine type + tags + cats for genres column
            const allGenres = [...selectedCats, ...selectedTags];
            if (!allGenres.includes(type)) {
                allGenres.push(type);
            }

            const { data: insertedStory, error: storyErr } = await supabase.from('stories').insert({
                title,
                synopsis,
                author: authorNameInput || userProfile?.display_name || 'Administrador',
                cover_url: mainCoverUrl,
                status: isComingSoon ? 'SOON' : status,
                genres: allGenres,
            }).select('id').single();

            if (storyErr || !insertedStory) {
                throw storyErr || new Error("Story insertion failed");
            }
            const storyId = insertedStory.id;

            // Upload chapter covers and pages
            const chapterDataToInsert = [];
            for (let i = 0; i < chapters.length; i++) {
                const c = chapters[i];
                const pageUrls = [];
                
                for (let j = 0; j < c.pages.length; j++) {
                    const p = c.pages[j];
                    const ext = p.name.split('.').pop();
                    const url = await uploadFile(p, `pages/${storyId}_ch${i+1}_p${j}_${Date.now()}.${ext}`);
                    pageUrls.push(url);
                }
                
                chapterDataToInsert.push({
                    story_id: storyId,
                    chapter_number: i + 1,
                    title: c.title.trim() || `Capítulo ${i+1}`,
                    pages_urls: pageUrls,
                });
            }

            if (chapterDataToInsert.length > 0) {
                await supabase.from('chapters').insert(chapterDataToInsert);
            }

            setLoading(false);
            navigate('/admin');

        } catch (err) {
            console.error(err);
            setLoading(false);
            alert("Error al publicar.");
        }
    };

    if (loading) {
        return <div className="flex flex-col items-center justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mb-4"></div><p className="text-white">Publicando... Por favor espera.</p></div>;
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
            {draftFound && (
                <div className="mb-8 p-6 bg-amber-50 border-4 border-amber-400 rounded-3xl shadow-[4px_4px_0px_0px_rgba(251,191,36,1)]">
                    <h3 className="font-black text-amber-600 uppercase italic mb-2 tracking-tighter text-xl">PROCESO GUARDADO ENCONTRADO</h3>
                    <p className="text-slate-700 font-bold mb-6">
                        Estabas en el sistema a las <span className="text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">{draftFound.date}</span> haciendo <span className="text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">{draftFound.action}</span>. ¿Quieres restaurarlo?
                        <br/>
                        <span className="text-xs text-slate-500 font-normal mt-2 block">(Nota: Tendrás que volver a seleccionar tus imágenes/PDF)</span>
                    </p>
                    <div className="flex gap-4">
                        <button onClick={discardDraft} className="px-6 py-2 bg-white text-slate-500 border-2 border-slate-300 rounded-xl font-black uppercase hover:bg-slate-100 transition-colors">Descartar</button>
                        <button onClick={restoreDraft} className="px-6 py-2 bg-amber-400 text-white border-2 border-black rounded-xl font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-500 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">Restaurar</button>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="flex flex-col gap-6 text-slate-800">
                    <h2 className="text-2xl font-black text-primary-dark border-b-4 border-black/10 pb-4 uppercase italic">Paso 1: Detalles</h2>
                    
                    <div>
                        <label className="block text-sm font-black mb-2 uppercase text-slate-500">Tipo de Obra</label>
                        <select value={type} onChange={e=>setType(e.target.value)} className="w-full bg-slate-100 border-4 border-black rounded-2xl p-3 text-slate-800 font-bold outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
                            <option value="COMIC">Comic</option>
                            <option value="MANGA">Manga</option>
                            <option value="MANHWA">Manhwa</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-black mb-2 uppercase text-slate-500">Portada</label>
                        <label htmlFor="coverFile" className="flex flex-col items-center justify-center w-full min-h-[140px] rounded-3xl border-4 border-dashed border-slate-300 bg-slate-50 hover:bg-primary-light/10 hover:border-primary transition-all cursor-pointer p-6 group">
                            <input 
                                id="coverFile"
                                type="file" 
                                accept="image/jpeg,image/png,image/webp" 
                                onChange={e => setCoverFile(e.target.files?.[0] || null)} 
                                className="hidden" 
                            />
                            <ImageIcon className="h-10 w-10 text-slate-300 group-hover:text-primary mb-3 transition-colors" />
                            <span className="font-black text-slate-400 group-hover:text-primary-dark transition-colors uppercase">
                                {coverFile ? 'Cambiar Portada' : 'Toca para subir portada'}
                            </span>
                            {coverFile && <span className="text-xs text-primary font-black mt-2 underline decoration-wavy">{coverFile.name}</span>}
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-black mb-2 uppercase text-slate-500">Título</label>
                        <input type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-slate-100 border-4 border-black rounded-2xl p-3 text-slate-800 font-bold outline-none focus:border-primary transition-colors" />
                    </div>

                    <div>
                        <label className="block text-sm font-black mb-2 uppercase text-slate-500">Nombre del Autor</label>
                        <input type="text" value={authorNameInput} onChange={e=>setAuthorNameInput(e.target.value)} placeholder="Ej: Richard Alexander" className="w-full bg-slate-100 border-4 border-black rounded-2xl p-3 text-slate-800 font-bold outline-none focus:border-primary transition-colors" />
                    </div>

                    <div>
                        <label className="block text-sm font-black mb-2 uppercase text-slate-500">Pequeña Sinopsis</label>
                        <textarea value={synopsis} onChange={e=>setSynopsis(e.target.value)} className="w-full bg-slate-100 border-4 border-black rounded-2xl p-3 text-slate-800 font-bold h-32 outline-none focus:border-primary transition-colors resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-black mb-2 uppercase text-slate-500">Estado</label>
                            <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full bg-slate-100 border-4 border-black rounded-2xl p-3 text-slate-800 font-bold outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
                                <option value="COMPLETED">Finalizado</option>
                                <option value="ONGOING">En Emisión</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-black mb-2 uppercase text-slate-500">Capítulos</label>
                            <input type="number" min="1" value={chapterCount} onChange={e=>setChapterCount(parseInt(e.target.value)||1)} className="w-full bg-slate-100 border-4 border-black rounded-2xl p-3 text-slate-800 font-bold outline-none focus:border-primary transition-colors" />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button onClick={()=>setStep(2)} disabled={!title || !synopsis} className="toon-button bg-primary text-lg px-10">Siguiente</button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="flex flex-col gap-6 text-slate-800">
                    <h2 className="text-2xl font-black text-primary-dark border-b-4 border-black/10 pb-4 uppercase italic">Paso 2: Contenido</h2>
                    
                    <div className="flex flex-col gap-8 max-h-[50vh] overflow-y-auto pr-3 custom-scrollbar">
                        {chapters.map((ch, i) => (
                            <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                <h3 className="font-black text-lg mb-4 text-primary uppercase">Capítulo {i+1}</h3>
                                <div className="mb-4">
                                    <label className="block text-xs font-black mb-2 uppercase text-slate-400">Nombre del Capítulo (Opcional)</label>
                                    <input 
                                        type="text" 
                                        placeholder={`Ej: El Comienzo`}
                                        value={ch.title || ''}
                                        onChange={e => {
                                            const newCh = [...chapters];
                                            newCh[i].title = e.target.value;
                                            setChapters(newCh);
                                        }}
                                        className="w-full bg-white border-4 border-black rounded-xl p-3 text-slate-800 font-bold outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black mb-2 uppercase text-slate-400">Páginas/Paneles (Imágenes o PDF local)</label>
                                    <label htmlFor={`chapterFile-${i}`} className="flex flex-col items-center justify-center w-full min-h-[120px] rounded-2xl border-4 border-dashed border-slate-300 bg-white hover:bg-primary-light/10 hover:border-primary transition-all cursor-pointer p-6 group">
                                        <input 
                                            id={`chapterFile-${i}`}
                                            type="file" 
                                            multiple 
                                            accept="image/jpeg,image/png,image/webp,application/pdf" 
                                            onChange={e => {
                                                const newCh = [...chapters];
                                                newCh[i].pages = Array.from(e.target.files || []);
                                                setChapters(newCh);
                                            }} 
                                            className="hidden" 
                                        />
                                        <Upload className="h-8 w-8 text-slate-300 group-hover:text-primary mb-2 transition-colors" />
                                        <span className="font-black text-slate-400 group-hover:text-primary-dark transition-colors uppercase text-sm">Cargar Imágenes o PDF</span>
                                    </label>
                                    {ch.pages.length > 0 && <p className="text-xs text-primary mt-3 font-black underline decoration-wavy tracking-tight">{ch.pages.length} ARCHIVOS LISTOS</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-4">
                        <button onClick={()=>setStep(1)} className="toon-button bg-slate-400">Atrás</button>
                        <button onClick={()=>setStep(3)} className="toon-button bg-primary">Siguiente</button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col gap-6 text-slate-800">
                    <h2 className="text-2xl font-black text-primary-dark border-b-4 border-black/10 pb-4 uppercase italic">Paso 3: Categorías</h2>
                    
                    <div>
                        <h3 className="font-black mb-4 uppercase text-slate-500 text-sm">Categorías Principales</h3>
                        <div className="flex flex-wrap gap-3">
                            {CATEGORIES.map(c => (
                                <button 
                                    key={c} onClick={() => setSelectedCats(prev => prev.includes(c) ? prev.filter(x=>x!==c) : [...prev, c])}
                                    className={`px-6 py-2 rounded-2xl border-4 border-black text-sm font-black transition-all transform active:scale-95 ${selectedCats.includes(c) ? 'bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px]' : 'bg-white text-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-black mb-4 uppercase text-slate-500 text-sm">Etiquetas (Multiselección)</h3>
                        <div className="flex flex-wrap gap-3">
                            {TAGS.map(t => (
                                <button 
                                    key={t} onClick={() => setSelectedTags(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev, t])}
                                    className={`px-5 py-2 rounded-2xl border-4 border-black text-xs font-black transition-all transform active:scale-95 ${selectedTags.includes(t) ? 'bg-emerald-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px]' : 'bg-white text-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
                                >
                                    #{t.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mt-8">
                        <button onClick={()=>setStep(2)} className="toon-button bg-slate-400">Atrás</button>
                        <button onClick={()=>setStep(4)} className="toon-button bg-primary">Siguiente</button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="flex flex-col gap-6 text-slate-800">
                    <h2 className="text-2xl font-black text-primary-dark border-b-4 border-black/10 pb-4 uppercase italic">Paso Final</h2>
                    
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border-4 border-black text-slate-700 shadow-inner">
                        <p className="mb-6 font-bold text-lg text-slate-800 leading-tight">
                            ¿ESTÁS LISTO PARA MOSTRAR <span className="text-primary underline decoration-4 decoration-black">{title.toUpperCase()}</span> AL MUNDO?
                        </p>
                        
                        {status === 'ONGOING' && (
                            <div className="mb-8 p-6 border-4 border-primary rounded-3xl bg-white shadow-[4px_4px_0px_0px_rgba(255,105,180,0.3)]">
                                <p className="mb-4 font-black text-primary-dark uppercase text-sm">MODO DE PUBLICACIÓN</p>
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="publishMode" value="NOW" checked={publishMode==='NOW'} onChange={(e)=>setPublishMode(e.target.value)} className="w-5 h-5 accent-primary cursor-pointer" />
                                        <span className="font-black text-slate-700 group-hover:text-primary transition-colors">PUBLICAR YA</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="publishMode" value="SOON" checked={publishMode==='SOON'} onChange={(e)=>setPublishMode(e.target.value)} className="w-5 h-5 accent-primary cursor-pointer" />
                                        <span className="font-black text-slate-700 group-hover:text-primary transition-colors">PRÓXIMAMENTE</span>
                                    </label>
                                </div>
                                {publishMode === 'SOON' && (
                                    <input type="datetime-local" value={publishDate} onChange={e=>setPublishDate(e.target.value)} className="mt-6 bg-slate-50 border-4 border-black p-3 rounded-2xl w-full text-slate-800 font-bold outline-none focus:border-primary appearance-none" />
                                )}
                            </div>
                        )}

                        <div className="border-t-4 border-black/5 pt-6 mt-4">
                            <h3 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest">Resumen de Datos</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                <div><p className="text-[10px] uppercase font-black text-slate-400">Título</p><p className="font-black text-slate-800 leading-none">{title}</p></div>
                                <div><p className="text-[10px] uppercase font-black text-slate-400">Estado</p><p className="font-black text-slate-800 leading-none">{status === 'COMPLETED' ? 'Finalizado' : 'En Emisión'}</p></div>
                                <div><p className="text-[10px] uppercase font-black text-slate-400">Capítulos</p><p className="font-black text-slate-800 leading-none">{chapterCount}</p></div>
                                <div><p className="text-[10px] uppercase font-black text-slate-400">Autor</p><p className="font-black text-primary underline decoration-black underline-offset-2">{authorNameInput}</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between mt-4 items-center bg-white p-4 rounded-3xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <button onClick={()=>setStep(3)} className="text-slate-400 hover:text-black font-black uppercase text-sm tracking-tighter hover:underline decoration-2 transition-all">Aún no (Atrás)</button>
                        <button onClick={handlePublish} className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase italic transform -rotate-1">
                            ¡LISTO, PUBLICAR!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// -------------------------------------------------------------
// EDIT STORY (Manage chapters and metadata)
// -------------------------------------------------------------
function EditStory() {
    const { storyId } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState<any>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [pages, setPages] = useState<File[]>([]);
    const [newChapterTitle, setNewChapterTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingView, setLoadingView] = useState(true);
    const [isEditingMetadata, setIsEditingMetadata] = useState(false);

    // Edit states
    const [editTitle, setEditTitle] = useState('');
    const [editSynopsis, setEditSynopsis] = useState('');
    const [editStatus, setEditStatus] = useState('');

    const handleDeleteStory = async (id: string, title: string) => {
        if (!confirm(`¿Estás seguro de que quieres borrar TODA la obra "${title}"? Esta acción no se puede deshacer.`)) return;
        try {
            await supabase.from('chapters').delete().eq('story_id', id);
            const { error } = await supabase.from('stories').delete().eq('id', id);
            if (error) throw error;
            navigate('/admin');
        } catch (err) {
            console.error(err);
            alert("Error al borrar la obra.");
        }
    };

    const loadData = async () => {
        if (!storyId) return;
        setLoadingView(true);
        const { data: sData } = await supabase.from('stories').select('*').eq('id', storyId).single();
        if (sData) {
            setStory(sData);
            setEditTitle(sData.title);
            setEditSynopsis(sData.synopsis);
            setEditStatus(sData.status);
        }

        const { data: cData } = await supabase.from('chapters').select('*').eq('story_id', storyId).order('chapter_number', { ascending: false });
        if (cData) setChapters(cData);
        setLoadingView(false);
    };

    useEffect(() => {
        loadData();
    }, [storyId]);

    const handleUpdateMetadata = async () => {
        try {
            const { error } = await supabase.from('stories').update({
                title: editTitle,
                synopsis: editSynopsis,
                status: editStatus
            }).eq('id', storyId);

            if (error) throw error;
            setIsEditingMetadata(false);
            loadData();
            alert("Datos actualizados!");
        } catch (err) {
            console.error(err);
            alert("Error al actualizar.");
        }
    };

    const handleAddChapter = async () => {
        if (!story || pages.length === 0) return;
        setLoading(true);
        try {
            const { data: existingChapters } = await supabase.from('chapters').select('chapter_number').eq('story_id', storyId);
            const nextChapNum = existingChapters ? Math.max(0, ...existingChapters.map(c => c.chapter_number)) + 1 : 1;

            const pageUrls = [];
            for (let i = 0; i < pages.length; i++) {
                const p = pages[i];
                const ext = p.name.split('.').pop();
                const url = await uploadFile(p, `pages/${storyId}_ch${nextChapNum}_p${i}_${Date.now()}.${ext}`);
                pageUrls.push(url);
            }

            await supabase.from('chapters').insert({
                story_id: storyId,
                chapter_number: nextChapNum,
                title: newChapterTitle.trim() || `Capítulo ${nextChapNum}`,
                pages_urls: pageUrls,
            });

            setPages([]);
            setNewChapterTitle('');
            loadData();
            setLoading(false);
            alert("Capítulo añadido con éxito!");
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert("Error al subir el capítulo.");
        }
    };

    const handleDeleteChapter = async (chapId: string, chapNum: number) => {
        if (!confirm(`¿Borrar Capítulo ${chapNum}?`)) return;
        try {
            await supabase.from('chapters').delete().eq('id', chapId);
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div className="flex flex-col items-center justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mb-4"></div><p className="text-primary font-black uppercase text-center">Subiendo capítulo...<br/>Por favor espera.</p></div>;
    }

    if (loadingView) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div></div>;
    if (!story) return <div className="p-8 text-slate-800 text-center font-black">Obra no encontrada.</div>;

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20">
            {/* Header Mini Card */}
            <div className="toon-card bg-white p-6 flex flex-col sm:flex-row gap-6 items-center">
                <img src={story.cover_url} className="w-24 aspect-[2/3] object-cover rounded-xl border-2 border-black" alt="" />
                <div className="text-center sm:text-left flex-1">
                    <h2 className="text-2xl font-black text-primary-dark uppercase italic tracking-tighter mb-1 font-display">{story.title}</h2>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border-2 border-black ${
                            story.status === 'COMPLETED' ? 'bg-emerald-400' : story.status === 'SOON' ? 'bg-primary text-white' : 'bg-blue-400'
                        }`}>
                            {story.status === 'COMPLETED' ? 'Finalizada' : story.status === 'SOON' ? 'Próximamente' : 'Emisión'}
                        </span>
                        <button onClick={() => setIsEditingMetadata(!isEditingMetadata)} className="text-xs font-black text-primary hover:underline">
                            {isEditingMetadata ? 'CANCELAR EDICIÓN' : 'EDITAR DETALLES'}
                        </button>
                    </div>
                </div>
                {!isEditingMetadata && (
                    <button 
                        onClick={() => handleDeleteStory(story.id, story.title)}
                        className="bg-red-500 hover:bg-red-600 text-white font-black px-4 py-2 rounded-xl text-xs uppercase tracking-tighter shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black ml-auto sm:ml-0"
                    >
                        Borrar Obra Completa
                    </button>
                )}
                <Link to="/admin" className="text-slate-400 hover:text-black font-black uppercase text-sm mt-4 sm:mt-0 sm:ml-auto">Volver</Link>
            </div>

            {isEditingMetadata && (
                <div className="toon-card bg-white p-8 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-black text-primary-dark border-b-4 border-black/10 pb-4 mb-6 uppercase italic">Editar Información</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black mb-2 uppercase text-slate-400 tracking-widest">Título</label>
                            <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} className="w-full bg-slate-50 border-4 border-black rounded-2xl p-3 text-slate-800 font-bold outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black mb-2 uppercase text-slate-400 tracking-widest">Sinopsis</label>
                            <textarea value={editSynopsis} onChange={e=>setEditSynopsis(e.target.value)} className="w-full bg-slate-50 border-4 border-black rounded-2xl p-3 text-slate-800 font-bold outline-none focus:border-primary h-24 resize-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black mb-2 uppercase text-slate-400 tracking-widest">Estado</label>
                            <select value={editStatus} onChange={e=>setEditStatus(e.target.value)} className="w-full bg-slate-50 border-4 border-black rounded-2xl p-3 text-slate-800 font-bold outline-none focus:border-primary">
                                <option value="ONGOING">En Emisión</option>
                                <option value="COMPLETED">Finalizada</option>
                                <option value="SOON">Próximamente</option>
                            </select>
                        </div>
                        <button onClick={handleUpdateMetadata} className="toon-button bg-emerald-500 w-full mt-4">GUARDAR CAMBIOS</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Add Chapter Form */}
                <div className="toon-card bg-white p-8">
                    <h3 className="font-black text-primary-dark border-b-4 border-black/10 pb-4 mb-6 uppercase italic">Nuevo Capítulo</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black mb-2 uppercase text-slate-400">Nombre del Capítulo (Opcional)</label>
                            <input 
                                type="text" 
                                placeholder="Ej: Un nuevo amanecer"
                                value={newChapterTitle}
                                onChange={e => setNewChapterTitle(e.target.value)}
                                className="w-full bg-slate-50 border-4 border-black rounded-2xl p-3 text-slate-800 font-bold outline-none focus:border-primary mb-4"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black mb-2 uppercase text-slate-400 tracking-widest text-center">Toca para cargar archivos</label>
                            <label htmlFor="newChapterFiles" className="flex flex-col items-center justify-center w-full min-h-[140px] rounded-3xl border-4 border-dashed border-slate-200 bg-slate-50 hover:bg-primary-light/10 hover:border-primary transition-all cursor-pointer p-6 group">
                                <input 
                                    id="newChapterFiles"
                                    type="file" 
                                    multiple 
                                    accept="image/jpeg,image/png,image/webp,application/pdf" 
                                    onChange={e => setPages(Array.from(e.target.files || []))} 
                                    className="hidden" 
                                />
                                <Upload className="h-10 w-10 text-slate-200 group-hover:text-primary mb-3 transition-colors" />
                                <span className="font-black text-slate-300 group-hover:text-primary-dark transition-all text-sm uppercase">Cargar Imágenes o PDF</span>
                            </label>
                            
                            {pages.length > 0 && (
                                <div className="mt-4 p-4 bg-emerald-100 border-2 border-black rounded-2xl text-center text-xs font-black text-emerald-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                                    {pages.length} ARCHIVOS CARGADOS
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={handleAddChapter} 
                            disabled={pages.length === 0} 
                            className="toon-button bg-primary w-full text-lg mt-4 disabled:bg-slate-200 disabled:border-slate-300 disabled:shadow-none"
                        >
                            ¡PUBLICAR CAPÍTULO!
                        </button>
                    </div>
                </div>

                {/* Chapter List */}
                <div className="toon-card bg-white p-8">
                    <h3 className="font-black text-primary-dark border-b-4 border-black/10 pb-4 mb-6 uppercase italic">Capítulos Actuales</h3>
                    
                    <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {chapters.map(chap => (
                            <div key={chap.id} className="flex items-center justify-between p-4 bg-slate-50 border-2 border-black rounded-2xl group active:translate-y-[2px] transition-all">
                                <div className="flex flex-col">
                                    <span className="font-black text-slate-800 italic uppercase">{chap.title || `Capítulo ${chap.chapter_number}`}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cap. {chap.chapter_number} • {chap.pages_urls?.length || 0} páginas</span>
                                </div>
                                <button 
                                    onClick={() => handleDeleteChapter(chap.id, chap.chapter_number)}
                                    className="p-2 border-2 border-black rounded-xl bg-white text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:shadow-none"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        {chapters.length === 0 && (
                            <div className="py-10 text-center text-slate-300 font-bold uppercase italic border-4 border-dashed border-slate-100 rounded-3xl">
                                Sin capítulos aún
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
