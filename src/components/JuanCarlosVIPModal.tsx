import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Heart, Sparkles, X } from 'lucide-react';

export default function JuanCarlosVIPModal() {
  const { user } = useStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user?.email === 'juancarloselizarparraquezada@gmail.com') {
      const hasSeen = sessionStorage.getItem('seen_vip_thank_you');
      if (!hasSeen) {
        setShow(true);
      }
    }
  }, [user]);

  if (!show) return null;

  const handleClose = () => {
    sessionStorage.setItem('seen_vip_thank_you', 'true');
    setShow(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-8 border-primary w-full max-w-lg rounded-[3rem] shadow-[20px_20px_0px_0px_rgba(255,45,133,0.5)] overflow-hidden relative p-8 text-center animate-bounce-in">
        
        <div className="mx-auto w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary shadow-[8px_8px_0px_0px_rgba(255,45,133,1)] mb-6 relative overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=JuanCarlosVIP&style=circle&backgroundColor=ffdfed" alt="Otaku avatar" className="w-full h-full object-cover" />
        </div>
        
        <Sparkles className="absolute top-8 left-8 h-8 w-8 text-amber-400 animate-pulse" />
        <Heart className="absolute top-12 right-12 h-10 w-10 text-primary animate-bounce" fill="currentColor" />
        <Sparkles className="absolute bottom-20 left-12 h-6 w-6 text-amber-500 animate-pulse" />

        <h2 className="text-3xl sm:text-4xl font-black text-primary uppercase italic tracking-tighter mb-4 drop-shadow-[2px_2px_0px_black]">
          ¡MUCHÍSIMAS GRACIAS JUAN CARLOS! (≧◡≦) ♡
        </h2>
        
        <div className="bg-pink-50 p-6 rounded-3xl border-4 border-black mb-8 relative">
          <div className="absolute -top-4 -left-4 bg-amber-400 text-black border-4 border-black px-4 py-1 rounded-full font-black uppercase text-xs transform -rotate-12">
            VIP LEYENDA
          </div>
          <p className="text-sm font-bold text-slate-800 leading-relaxed">
            De parte de todo el equipo de <span className="text-primary font-black uppercase">Tu MangaX</span>, queremos darte las gracias de todo corazón por tu increíble donación de <strong className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg border-2 border-emerald-600">25 USD</strong>.
          </p>
          <p className="text-sm font-bold text-slate-700 leading-relaxed mt-4">
            Gracias a personas como tú, podemos mantener los servidores activos y seguir mejorando la app para toda la comunidad. ¡Eres oficialmente una leyenda otaku en nuestra historia! ✨
          </p>
        </div>

        <button 
          onClick={handleClose}
          className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-black uppercase text-sm tracking-widest rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex justify-center items-center gap-2"
        >
          <Heart className="h-5 w-5" fill="currentColor" />
          ¡De nada, a seguir leyendo!
        </button>
      </div>
    </div>
  );
}
