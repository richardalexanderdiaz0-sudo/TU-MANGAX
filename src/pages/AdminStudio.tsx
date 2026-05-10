import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { collection, query, where, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { uploadFile } from '../services/supabase';
import { Plus, Image as ImageIcon, Upload, FileText, Settings, ArrowRight } from 'lucide-react';

export default function AdminStudio() {
    const { user, userProfile } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || userProfile?.role !== 'admin') {
            navigate('/');
        }
    }, [user, userProfile, navigate]);

    if (!user || userProfile?.role !== 'admin') return null;

    return (
        <div className="flex-1 flex flex-col bg-slate-900 border-l border-slate-800">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h1 className="text-xl font-bold flex items-center gap-2"><Upload className="h-5 w-5 text-indigo-400"/> Admin Studio</h1>
                <Link to="/admin/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-bold flex items-center gap-2 text-sm">
                    <Plus className="h-4 w-4"/> Nueva Obra
                </Link>
            </div>
            
            <div className="flex-1 p-6 relative">
                <Routes>
                    <Route path="/" element={<StudioHome />} />
                    <Route path="/new" element={<CreationWizard />} />
                    <Route path="/edit/:storyId" element={<EditOngoing />} />
                </Routes>
            </div>
        </div>
    );
}

function StudioHome() {
    const [ongoing, setOngoing] = useState<any[]>([]);

    useEffect(() => {
        const f = async () => {
            const q = query(collection(db, 'stories'), where('status', '==', 'ONGOING'));
            const snap = await getDocs(q);
            setOngoing(snap.docs.map(d => ({id: d.id, ...d.data()})));
        };
        f();
    }, []);

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Obras En Emisión (Agregar Capítulos)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {ongoing.map(st => (
                    <Link to={`/admin/edit/${st.id}`} key={st.id} className="block group">
                        <div className="relative aspect-[2/3] rounded overflow-hidden bg-slate-800 border border-slate-700">
                            <img src={st.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition" alt=""/>
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-indigo-600 text-white px-3 py-1 font-bold rounded-full">+ Capítulo</span>
                            </div>
                        </div>
                        <p className="mt-1 font-semibold text-sm truncate">{st.title}</p>
                    </Link>
                ))}
                {ongoing.length === 0 && <p className="text-slate-400 col-span-full">No hay obras en emisión.</p>}
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// WIZARD
// -------------------------------------------------------------
const CATEGORIES = ["YAOI", "BL", "+18", "SHOUJO", "SHOUNEN", "SEINEN"];
const TAGS = ["Acción", "Fantasía", "Drama", "Suspenso", "Vida Cotidiana", "Vida Escolar", "Cárcel", "Bullying", "Chico Rudo", "Romance", "Comedia"];

function CreationWizard() {
    const navigate = useNavigate();
    const { user, userProfile } = useStore();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [type, setType] = useState('MANHWA');
    const [title, setTitle] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [status, setStatus] = useState('COMPLETED');
    const [coverFile, setCoverFile] = useState<File|null>(null);
    const [chapterCount, setChapterCount] = useState(1);

    const [chapters, setChapters] = useState<{cover: File|null, pages: File[]}[]>([]);
    
    const [selectedCats, setSelectedCats] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [publishMode, setPublishMode] = useState('NOW'); // NOW or SOON
    const [publishDate, setPublishDate] = useState('');

    useEffect(() => {
        if(chapterCount > chapters.length) {
            const extra = Array.from({length: chapterCount - chapters.length}, () => ({cover: null, pages: []}));
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

            const storyId = doc(collection(db, 'stories')).id;

            // Upload chapter covers and pages
            const chapterData = [];
            for (let i = 0; i < chapters.length; i++) {
                const c = chapters[i];
                let cCoverUrl = '';
                if (c.cover) {
                    cCoverUrl = await uploadFile(c.cover, `covers/${storyId}_ch${i+1}_${Date.now()}`);
                }
                const pageUrls = [];
                for (let j = 0; j < c.pages.length; j++) {
                    const p = c.pages[j];
                    const url = await uploadFile(p, `pages/${storyId}_ch${i+1}_p${j}_${Date.now()}`);
                    pageUrls.push(url);
                }
                chapterData.push({
                    storyId,
                    chapterNum: i + 1,
                    title: `Capítulo ${i+1}`,
                    coverUrl: cCoverUrl,
                    contentUrls: pageUrls,
                    createdAt: new Date(),
                    pdfUrl: ''
                });
            }

            const isComingSoon = status === 'ONGOING' && publishMode === 'SOON';
            const pubDateVal = isComingSoon && publishDate ? new Date(publishDate).getTime() : Date.now();

            const storyDoc = {
                title,
                synopsis,
                authorId: user!.uid,
                authorName: userProfile?.displayName || 'Administrador',
                coverUrl: mainCoverUrl,
                type,
                status,
                categories: selectedCats,
                tags: selectedTags,
                chapterCount: parseInt(chapterCount.toString(), 10),
                isComingSoon,
                publishDate: pubDateVal,
                createdAt: new Date(),
                updatedAt: new Date(),
                viewsCount: 0,
                likesCount: 0
            };

            await setDoc(doc(db, 'stories', storyId), storyDoc);
            
            for(let i = 0; i < chapterData.length; i++) {
                const cId = doc(collection(db, `stories/${storyId}/chapters`)).id;
                await setDoc(doc(db, `stories/${storyId}/chapters`, cId), chapterData[i]);
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
        return <div className="flex flex-col items-center justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mb-4"></div><p>Publicando... Por favor espera.</p></div>;
    }

    return (
        <div className="max-w-3xl mx-auto bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
            {step === 1 && (
                <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">Paso 1: Detalles de la Obra</h2>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Tipo de Obra</label>
                        <select value={type} onChange={e=>setType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                            <option value="COMIC">Comic</option>
                            <option value="MANGA">Manga</option>
                            <option value="MANHWA">Manhwa</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Portada</label>
                        <input type="file" onChange={e=>setCoverFile(e.target.files?.[0] || null)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" accept="image/*" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Título</label>
                        <input type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Pequeña Sinopsis</label>
                        <textarea value={synopsis} onChange={e=>setSynopsis(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white h-24" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Estado</label>
                        <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                            <option value="COMPLETED">Finalizado</option>
                            <option value="ONGOING">En Emisión</option>
                        </select>
                    </div>

                    {status === 'COMPLETED' ? (
                        <div>
                            <label className="block text-sm font-medium mb-1">Cuántos capítulos tiene?</label>
                            <input type="number" min="1" value={chapterCount} onChange={e=>setChapterCount(parseInt(e.target.value)||1)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium mb-1">Cuántos capítulos tiene hasta ahora?</label>
                            <input type="number" min="1" value={chapterCount} onChange={e=>setChapterCount(parseInt(e.target.value)||1)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                        </div>
                    )}

                    <div className="flex justify-end mt-4">
                        <button onClick={()=>setStep(2)} disabled={!title || !synopsis} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-bold disabled:opacity-50">Siguiente</button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">Paso 2: Contenido de Capítulos</h2>
                    
                    <div className="flex flex-col gap-8 max-h-[60vh] overflow-y-auto pr-2">
                        {chapters.map((ch, i) => (
                            <div key={i} className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                <h3 className="font-bold text-lg mb-4 text-indigo-300">Capítulo {i+1}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-slate-400">Portada del Capítulo (Opcional)</label>
                                        <input type="file" accept="image/*" onChange={e => {
                                            const newCh = [...chapters];
                                            newCh[i].cover = e.target.files?.[0] || null;
                                            setChapters(newCh);
                                        }} className="w-full text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-slate-400">Páginas/Paneles (Selección múltiple)</label>
                                        <input type="file" multiple accept="image/*,application/pdf" onChange={e => {
                                            const newCh = [...chapters];
                                            newCh[i].pages = Array.from(e.target.files || []);
                                            setChapters(newCh);
                                        }} className="w-full text-sm" />
                                        <p className="text-xs text-slate-500 mt-1">{ch.pages.length} archivos seleccionados</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-4">
                        <button onClick={()=>setStep(1)} className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded font-bold">Atrás</button>
                        <button onClick={()=>setStep(3)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-bold">Siguiente</button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">Paso 3: Categorías y Etiquetas</h2>
                    
                    <div>
                        <h3 className="font-bold mb-2">Categorías</h3>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(c => (
                                <button 
                                    key={c} onClick={() => setSelectedCats(prev => prev.includes(c) ? prev.filter(x=>x!==c) : [...prev, c])}
                                    className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${selectedCats.includes(c) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-transparent border-slate-600 text-slate-300 hover:border-slate-400'}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold mb-2">Etiquetas</h3>
                        <div className="flex flex-wrap gap-2">
                            {TAGS.map(t => (
                                <button 
                                    key={t} onClick={() => setSelectedTags(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev, t])}
                                    className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${selectedTags.includes(t) ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-transparent border-slate-600 text-slate-300 hover:border-slate-400'}`}
                                >
                                    #{t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mt-8">
                        <button onClick={()=>setStep(2)} className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded font-bold">Atrás</button>
                        <button onClick={()=>setStep(4)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-bold">Siguiente</button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">Confirmación Final</h2>
                    
                    <div className="bg-slate-900 p-6 rounded-lg text-slate-300">
                        <p className="mb-4">
                            EN PASOS ANTERIORES ELEJISTE QUE <strong>{title.toUpperCase() || 'ESTA OBRA'}</strong> ESTÁ {status === 'COMPLETED' ? 'FINALIZADO' : 'EN EMISIÓN'}.
                        </p>
                        
                        {status === 'ONGOING' && (
                            <div className="mb-6 p-4 border border-indigo-500/50 bg-indigo-500/10 rounded-lg">
                                <p className="mb-2 font-bold text-white">¿Quieres agregar esta obra en próximamente o publicarla de una vez?</p>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="publishMode" value="NOW" checked={publishMode==='NOW'} onChange={(e)=>setPublishMode(e.target.value)} />
                                        Publicar de Una Vez
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="publishMode" value="SOON" checked={publishMode==='SOON'} onChange={(e)=>setPublishMode(e.target.value)} />
                                        Próximamente
                                    </label>
                                </div>
                                {publishMode === 'SOON' && (
                                    <input type="datetime-local" value={publishDate} onChange={e=>setPublishDate(e.target.value)} className="mt-4 bg-slate-800 border border-slate-600 p-2 rounded w-full text-white" />
                                )}
                            </div>
                        )}

                        <div className="border-t border-slate-700 pt-4 mt-4">
                            <h3 className="text-lg font-bold text-white mb-4">ANÁLISIS DE LA OBRA</h3>
                            <p><strong>NOMBRE DE LA OBRA:</strong> {title}</p>
                            <p><strong>Estado:</strong> {status === 'COMPLETED' ? 'Finalizado' : 'En Emisión'}</p>
                            <p><strong>Número de capítulos:</strong> {chapterCount}</p>
                            <p><strong>Tipo de obra:</strong> {type}</p>
                            <p><strong>Etiquetas:</strong> {selectedTags.join(', ')}</p>
                            <p><strong>Categoría:</strong> {selectedCats.join(', ')}</p>
                            <p><strong>Nombre del autor:</strong> {userProfile?.displayName}</p>
                        </div>

                        <p className="mt-6 text-sm text-yellow-400">
                            AL PUBLICAR ({title.toUpperCase()}): APARECERÁ EN EL HOME, EN LA BÚSQUEDA. 
                            SOLO APARECERÁ EL NOMBRE DEL AUTOR, LOS USUARIOS PODRÁN LEER PERO NO VER TU PERFIL.
                        </p>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button onClick={()=>setStep(3)} className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded font-bold">No, no publicar (Atrás)</button>
                        <button onClick={handlePublish} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                            Sí, Publicar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// -------------------------------------------------------------
// EDIT ONGOING (Add single chapter)
// -------------------------------------------------------------
function EditOngoing() {
    return (
        <div className="max-w-xl mx-auto bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 text-center text-slate-300">
            <h2 className="text-2xl font-bold text-white mb-4">Agregar Capítulo (Próximamente)</h2>
            <p>La interfaz para agregar nuevos capítulos a obras en emisión seguiría un flujo similar al paso 2, simplemente anexando un nuevo documento a la subcolección `chapters` e incrementando el `chapterCount` de la obra paterna.</p>
            <Link to="/admin" className="inline-block mt-6 text-indigo-400 hover:text-indigo-300 font-bold">Volver al Estudio</Link>
        </div>
    );
}
