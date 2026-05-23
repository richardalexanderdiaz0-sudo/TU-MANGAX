import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Sparkles, Check, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

const GENRES = [
  "Acción", "Romance", "Comedia", "Misterio", "Terror", 
  "Fantasía", "Ciencia Ficción", "Aventura", "Drama", "Boys Love", "Isekai"
];

export default function PreferencesModal() {
  const { userProfile, user, setUser } = useStore();
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Show if logged in and hasn't set preferences and modal hasn't been closed manually
    if (user && userProfile && !userProfile.preferences) {
        const dismissed = sessionStorage.getItem('preferences_dismissed_' + user.uid);
        if (!dismissed) {
          setShow(true);
        }
    }
  }, [user, userProfile]);

  if (!show) return null;

  const toggleGenre = (genre: string) => {
    if (selected.includes(genre)) {
      setSelected(selected.filter(g => g !== genre));
    } else {
      if (selected.length < 5) setSelected([...selected, genre]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.auth.updatePreferences(user!.uid, selected);
      
      // Actualizar el context actual para no volver a preguntar
      setUser(user, { ...userProfile, preferences: selected });
      setShow(false);
    } catch (e) {
      console.error(e);
      // Failsafe
      sessionStorage.setItem('preferences_dismissed_' + user!.uid, 'true');
      setShow(false);
    }
    setSaving(false);
  };

  const handleSkip = () => {
    sessionStorage.setItem('preferences_dismissed_' + user!.uid, 'true');
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-md animate-fade-in">
      <div className="bg-white border-8 border-black w-full max-w-xl rounded-[3rem] shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative p-8">
        <button onClick={handleSkip} disabled={saving} className="absolute top-6 right-6 font-black text-xs uppercase text-slate-400 hover:text-black tracking-widest transition-colors select-none">
          Omitir
        </button>

        <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full border-4 border-primary flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
            </div>
        </div>

        <h2 className="text-3xl font-black text-center text-primary-dark uppercase italic tracking-tighter mb-2">
          ¿Qué te gusta leer?
        </h2>
        <p className="text-center font-bold text-slate-500 mb-8 text-sm">
          Elige hasta 5 géneros para personalizar tus recomendaciones en el Inicio.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {GENRES.map(genre => {
            const isSelected = selected.includes(genre);
            return (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-4 py-2 rounded-2xl border-4 text-sm font-black uppercase tracking-tight transition-all active:translate-y-[2px] active:scale-95 select-none ${
                    isSelected 
                        ? 'border-black bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                        : 'border-slate-200 bg-white text-slate-500 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {isSelected && <Check className="h-4 w-4 inline-block mr-1 stroke-[4px]" />}
                {genre}
              </button>
            );
          })}
        </div>

        <button 
            onClick={handleSave}
            disabled={saving || selected.length === 0}
            className="w-full bg-black text-white font-black uppercase text-xl py-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,45,133,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(255,45,133,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(255,45,133,1)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
        >
            {saving ? 'Guardando...' : '¡Listo, mostrar recomendaciones!'}
            {!saving && <ChevronRight className="h-6 w-6 stroke-[3px]" />}
        </button>
      </div>
    </div>
  );
}
