import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getImageUrl } from '../services/api';

interface SoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: any;
}

export default function SoonModal({ isOpen, onClose, story }: SoonModalProps) {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    if (!isOpen || !story.publish_date) return;

    const targetDate = new Date(story.publish_date).getTime();

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(interval);
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, story.publish_date]);

  const coverUrl = story.cover ? getImageUrl(story.cover) : (story.cover_url || '');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-white border-4 border-black rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center relative max-w-sm w-full z-10"
          >
            <img src={coverUrl} alt="Cover" className="w-32 h-48 object-cover rounded-2xl border-2 border-black mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
            
            <p className="text-slate-800 font-black text-xl italic mb-6 leading-relaxed">
              ¡Tranquilo, {story.title} estará disponible en:
            </p>

            <div className="text-2xl font-black tabular-nums bg-slate-100 p-4 rounded-xl border-2 border-black mb-6">
                {timeLeft ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s` : 'Calculando...'}
            </div>
            
            <button 
                onClick={onClose}
                className="bg-primary text-white font-black uppercase tracking-widest px-8 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-primary-dark transition-all hover:translate-x-[1px] hover:translate-y-[1px] w-full"
            >
                Entendido
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
