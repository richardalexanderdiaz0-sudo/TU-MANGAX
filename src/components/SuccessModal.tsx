import { motion, AnimatePresence } from 'motion/react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function SuccessModal({ isOpen, onClose, title }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white border-4 border-black rounded-[2rem] p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-center relative max-w-sm w-full"
          >
            <div className="flex justify-center mb-6">
              <motion.svg 
                viewBox="0 0 24 24" 
                className="w-20 h-20 text-emerald-500"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path 
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14" 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.path 
                  d="M22 4L12 14.01l-3-3" 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
              </motion.svg>
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase italic mb-2">¡Éxito!</h2>
            <p className="text-slate-600 font-bold mb-6 italic">{title} publicado con éxito.</p>
            <button 
                onClick={onClose}
                className="bg-emerald-500 text-white font-black uppercase tracking-widest px-8 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-emerald-600 transition-all hover:scale-105"
            >
                Aceptar
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
