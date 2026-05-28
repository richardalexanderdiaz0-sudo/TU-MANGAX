import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, X, Sparkles, AlertCircle } from 'lucide-react';

export default function DonationReminderModal() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 30 minutes in milliseconds
  const REMINDER_INTERVAL_MS = 30 * 60 * 1000;

  useEffect(() => {
    // If the user lands on the donation page itself, don't show the popup
    if (location.pathname === '/donate') {
      return;
    }

    // Initialize/Check logic
    const checkDonationReminder = () => {
      const lastShown = localStorage.getItem('last_donation_reminder_shown');
      const now = Date.now();

      if (!lastShown) {
        // First session: schedule it for 30 minutes from now so we don't shock them immediately
        localStorage.setItem('last_donation_reminder_shown', String(now));
        return;
      }

      const timePassed = now - parseInt(lastShown, 10);
      if (timePassed >= REMINDER_INTERVAL_MS) {
        setShow(true);
      }
    };

    // Run the check on mount
    checkDonationReminder();

    // Check periodically (every 10 seconds)
    const interval = setInterval(() => {
      // Don't trigger if already open or if they are currently on the payment page
      if (!show && location.pathname !== '/donate') {
        checkDonationReminder();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [location.pathname, show]);

  const handleClose = () => {
    setShow(false);
    // Reset/defer the timer for another 30 minutes
    localStorage.setItem('last_donation_reminder_shown', String(Date.now()));
  };

  const handleDonate = () => {
    setShow(false);
    // Reset/defer timer so they aren't prompted right after deciding to look at the page
    localStorage.setItem('last_donation_reminder_shown', String(Date.now()));
    navigate('/donate');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 overflow-hidden transition-all bg-[#0c0e15] border border-white/10 rounded-[2.5rem] shadow-2xl">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button top right */}
        <button 
          onClick={handleClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Content Header */}
        <div className="flex flex-col items-center text-center mt-4">
          <div className="bg-rose-500/15 p-4 rounded-full border border-rose-500/20 mb-4 animate-bounce">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20 mb-3">
            <Sparkles className="w-3 h-3" /> Apoya Nuestra Comunidad
          </div>
          
          <h3 className="text-2xl font-display font-black text-white tracking-tight uppercase italic leading-tight mb-3">
            ¿Disfrutas de TU MANGAX?
          </h3>
          
          <p className="text-slate-300 text-xs leading-relaxed font-medium max-w-sm mb-6">
            Mantenemos el sitio activo, rápido y libre de anuncios molestos gracias a lectores como tú. 
            Si deseas apoyarnos a cubrir los servidores e incentivar el desarrollo de la plataforma, 
            puedes realizar una donación voluntaria. ¡Cada moneda cuenta y marca la diferencia! 📖✨
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleDonate}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-xs tracking-wider py-4 rounded-2xl transition-all shadow-lg hover:scale-102 border border-rose-500/10 flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            Aportar una donación ❤️
          </button>
          
          <button
            onClick={handleClose}
            className="w-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-black uppercase text-[10px] tracking-wider py-3 rounded-2xl transition-all flex items-center justify-center cursor-pointer select-none"
          >
            Quizás más tarde, gracias
          </button>
        </div>

        {/* Subtle Footer Disclaimer */}
        <div className="text-center mt-5">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3 text-slate-600" /> No es obligatorio, seguirás leyendo gratis de todos modos
          </p>
        </div>

      </div>
    </div>
  );
}
