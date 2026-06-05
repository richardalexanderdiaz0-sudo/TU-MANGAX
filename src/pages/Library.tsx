import React, { useEffect, useState } from 'react';
import { api, getImageUrl } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Trash, Check, X, CheckSquare, Square } from 'lucide-react';

export default function Library() {
    const { user, authLoading } = useStore();
    const navigate = useNavigate();
    const [savedStories, setSavedStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Deletion states
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
                    setSavedStories(libData.filter((s: any) => s.status !== 'SOON'));
                } else {
                    setSavedStories([]);
                }
            } catch (err) {
                console.error("Library fetch error", err);
            }
            setLoading(false);
        };

        fetchLibrary();
    }, [user, navigate, authLoading]);

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        setSelectedIds([]);
    };

    const toggleSelectStory = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(item => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === savedStories.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(savedStories.map(s => s.id));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`¿Estás seguro de que deseas eliminar ${selectedIds.length} obra(s) de tu biblioteca?`)) return;
        
        setLoading(true);
        try {
            await Promise.all(selectedIds.map(id => api.interactions.removeFromLibrary(id)));
            setSavedStories(savedStories.filter(s => !selectedIds.includes(s.id)));
            setSelectedIds([]);
            setIsEditMode(false);
        } catch (err) {
            console.error("Error deleting selected stories", err);
            alert("Hubo un error al eliminar las obras seleccionadas.");
        }
        setLoading(false);
    };

    const handleDeleteSingle = async (e: React.MouseEvent, storyId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("¿Seguro que deseas quitar esta obra de tu biblioteca?")) return;
        
        setLoading(true);
        try {
            await api.interactions.removeFromLibrary(storyId);
            setSavedStories(savedStories.filter(s => s.id !== storyId));
            setSelectedIds(selectedIds.filter(id => id !== storyId));
        } catch (err) {
            console.error("Error deleting story", err);
            alert("Hubo un error al eliminar la obra.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b-4 border-black pb-6">
                <h1 className="text-3xl font-black text-primary-dark uppercase italic tracking-tighter font-display">Mi Biblioteca</h1>
                
                {savedStories.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {isEditMode && (
                            <>
                                <button 
                                    onClick={handleSelectAll} 
                                    className="px-4 py-2 bg-white text-slate-800 border-4 border-black font-black text-xs uppercase tracking-tight rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5"
                                >
                                    {selectedIds.length === savedStories.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                                </button>
                                
                                <button 
                                    onClick={handleDeleteSelected} 
                                    disabled={selectedIds.length === 0}
                                    className={`px-4 py-2 border-4 border-black font-black text-xs uppercase tracking-tight rounded-xl transition-all flex items-center gap-1.5 ${
                                        selectedIds.length === 0 
                                            ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' 
                                            : 'bg-red-500 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                                    }`}
                                >
                                    <Trash className="h-4 w-4" />
                                    Eliminar ({selectedIds.length})
                                </button>
                            </>
                        )}
                        
                        <button 
                            onClick={toggleEditMode} 
                            className={`p-3 border-4 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all ${
                                isEditMode ? 'bg-primary text-white' : 'bg-white hover:bg-slate-50 text-slate-800'
                            }`}
                            title={isEditMode ? "Cancelar Edición" : "Eliminar Obras"}
                        >
                            {isEditMode ? <X className="h-5 w-5 stroke-[2.5px]" /> : <Trash className="h-5 w-5 stroke-[2.5px]" />}
                        </button>
                    </div>
                )}
            </div>
            
            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div></div>
            ) : savedStories.length === 0 ? (
                <div className="text-center py-24 bg-white/50 rounded-[3rem] border-4 border-black/10 border-dashed animate-fade-in">
                    <p className="text-sm font-black text-slate-300 uppercase italic tracking-widest px-4 mb-6">Aún no tienes obras en tu biblioteca...</p>
                    <Link to="/directory" className="toon-button bg-primary inline-block">¡Explorar Historias!</Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                    {savedStories.map(story => {
                        const isSelected = selectedIds.includes(story.id);
                        return (
                            <div 
                                key={story.id}
                                onClick={() => isEditMode && toggleSelectStory(story.id)}
                                className={`flex flex-col gap-3 group relative select-none ${isEditMode ? 'cursor-pointer' : ''}`}
                            >
                                <div className={`relative aspect-[2/3] rounded-3xl overflow-hidden bg-white border-4 border-black transition-all ${
                                    isSelected 
                                        ? 'ring-4 ring-primary scale-[0.98]' 
                                        : 'group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                }`}>
                                    <img 
                                        src={story.cover ? getImageUrl(story.cover) : (story.cover_url || 'https://via.placeholder.com/300x450')} 
                                        alt={story.title}
                                        className={`w-full h-full object-cover transition-all duration-500 ${
                                            isSelected ? 'brightness-75' : 'grayscale-[10%] group-hover:grayscale-0'
                                        }`}
                                    />
                                    
                                    {/* Edit Mode Custom Indicator */}
                                    {isEditMode ? (
                                        <div className="absolute inset-0 bg-black/10 flex flex-col justify-between p-3">
                                            <div className="flex justify-between items-start">
                                                {/* Checkbox */}
                                                <div className={`p-1.5 rounded-lg border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                                                    isSelected ? 'bg-primary text-white' : 'bg-white text-slate-400'
                                                }`}>
                                                    <Check className="h-4 w-4 stroke-[3px]" />
                                                </div>
                                                
                                                {/* Single Item fast delete zafacón */}
                                                <button 
                                                    onClick={(e) => handleDeleteSingle(e, story.id)}
                                                    className="p-1.5 rounded-lg border-2 border-black bg-rose-500 text-white hover:bg-rose-600 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
                                                    title="Eliminar de mi biblioteca"
                                                >
                                                    <Trash className="h-4 w-4 stroke-[2px]" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Standard navigation wrap
                                        <Link 
                                            to={`/comic/${story.id}`} 
                                            className="absolute inset-0"
                                        />
                                    )}
                                </div>
                                
                                <div className="flex justify-between items-center gap-2 px-1">
                                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors flex-1">
                                        {isEditMode ? story.title : (
                                            <Link to={`/comic/${story.id}`} className="hover:text-primary">
                                                {story.title}
                                            </Link>
                                        )}
                                    </h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
