import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { BookOpen, X, Star, Calendar } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  status: string;
  synopsis?: string;
  chapter_count?: number;
}

export default function DailySuggestionModal() {
  const [show, setShow] = useState(false);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkDailySuggestion = async () => {
      try {
        const todayStr = new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD"
        const lastShownDate = localStorage.getItem('daily_suggestion_shown');

        // We only want to trigger the modal if it hasn't been shown today.
        // During testing, if they reload they shouldn't be spammed, but they can see it once.
        if (lastShownDate === todayStr) {
          setLoading(false);
          return;
        }

        // Fetch all stories and get their chapter counts
        const { data: storiesData, error: storiesError } = await supabase
          .from('stories')
          .select('id, title, author, cover_url, status, synopsis');

        if (storiesError || !storiesData || storiesData.length === 0) {
          setLoading(false);
          return;
        }

        // Deterministic daily choice
        // Let's digest the current date (year, month, day) to always get a solid, stable integer index
        const today = new Date();
        const dateScore = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();
        const selectedIndex = dateScore % storiesData.length;
        const selectedStory = storiesData[selectedIndex];

        // Let's get the chapter count for this story
        const { count, error: countError } = await supabase
          .from('chapters')
          .select('*', { count: 'exact', head: true })
          .eq('story_id', selectedStory.id);

        const chapterCount = countError ? 0 : (count || 0);

        setStory({
          ...selectedStory,
          chapter_count: chapterCount
        });
        
        // Show modal!
        setShow(true);
        // Mark as shown for today
        localStorage.setItem('daily_suggestion_shown', todayStr);
      } catch (err) {
        console.error("Error setting up daily suggestion:", err);
      } finally {
        setLoading(false);
      }
    };

    checkDailySuggestion();
  }, []);

  if (!show || !story) return null;

  const handleReadNow = () => {
    setShow(false);
    navigate(`/comic/${story.id}`);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Container with neobrutalist layout */}
      <div className="bg-white border-8 border-black w-full max-w-md rounded-[2.5rem] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden relative p-6 sm:p-8">
        
        {/* Close button with bold shape */}
        <button 
          onClick={() => setShow(false)} 
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-black border-4 border-black p-1.5 rounded-full transition-transform hover:scale-110 active:scale-95 z-10"
        >
          <X className="w-5 h-5 stroke-[3px]" />
        </button>

        {/* Title Group */}
        <div className="text-center mb-6">
          <div className="inline-block bg-primary text-white border-4 border-black px-4 py-2 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase font-display italic font-black text-xs md:text-sm tracking-widest relative -rotate-1 mb-3">
            ✨️ SUGERENCIA DE EL DIA 💫
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            ¡Descubre tu próxima lectura favorita!
          </p>
        </div>

        {/* Book Visual Section */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative w-40 h-56 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,45,133,1)] overflow-hidden bg-slate-100 group">
            <img 
              src={story.cover_url || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600"} 
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {story.status === 'COMPLETED' ? (
              <span className="absolute top-2 left-2 text-[8px] font-black uppercase text-white bg-emerald-500 border-2 border-black px-2 py-0.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Completo
              </span>
            ) : (
              <span className="absolute top-2 left-2 text-[8px] font-black uppercase text-white bg-blue-500 border-2 border-black px-2 py-0.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Emisión
              </span>
            )}
          </div>

          <div className="text-center px-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic leading-tight mb-1 line-clamp-2 drop-shadow-[1px_1px_0px_rgba(255,255,255,1)]">
              {story.title}
            </h3>
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
              Autor: {story.author || 'Desconocido'}
            </p>
            
            <div className="flex justify-center items-center gap-2">
              <span className="bg-indigo-50 border-2 border-black text-indigo-700 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-tight flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <BookOpen className="w-3.5 h-3.5 stroke-[2.5px]" />
                {story.chapter_count} capítulos
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <button 
            onClick={handleReadNow}
            className="w-full bg-emerald-400 hover:bg-emerald-500 text-black font-black uppercase text-lg py-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 select-none"
          >
            ¡Ir a Leer! 📚
          </button>
          
          <button 
            onClick={() => setShow(false)}
            className="w-full bg-white hover:bg-slate-55 text-slate-500 hover:text-black font-black uppercase text-xs py-2 rounded-xl border-2 border-slate-200 transition-colors"
          >
            Quizás más tarde
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Cada día una sorpresa nueva en TU MANGAX 💙
          </p>
        </div>

      </div>
    </div>
  );
}
