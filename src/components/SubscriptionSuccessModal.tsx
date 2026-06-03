import { motion, AnimatePresence } from 'motion/react';

interface SubscriptionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyTitle: string;
  type: 'subscribe' | 'unsubscribe';
}

export default function SubscriptionSuccessModal({ isOpen, onClose, storyTitle, type }: SubscriptionSuccessModalProps) {
  const isSubscribe = type === 'subscribe';
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-white border-4 border-black rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center relative max-w-xs w-full z-10"
          >
            <div className="flex justify-center mb-6">
              <motion.svg 
                viewBox="0 0 24 24" 
                className={`w-20 h-20 ${isSubscribe ? 'text-emerald-500' : 'text-red-500'}`}
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isSubscribe ? (
                    <>
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
                            transition={{ duration: 0.5, delay: 0.3 }}
                        />
                    </>
                ) : (
                    <>
                        <motion.path 
                            d="M18 6L6 18" 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                        <motion.path 
                            d="M6 6l12 12" 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        />
                    </>
                )}
              </motion.svg>
            </div>
            
            <p className="text-slate-800 font-black text-sm italic mb-6 leading-relaxed">
              {isSubscribe 
                ? `Entendido, recibirás una notificación en tu dispositivo cuando haya un nuevo capítulo de ${storyTitle} 📌`
                : `Entendido! Ya no recibirás una notificación sobre futuros capítulos de ${storyTitle}!`
              }
            </p>
            
            <button 
                onClick={onClose}
                className={`${isSubscribe ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'} text-white font-black uppercase tracking-widest px-8 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] w-full`}
            >
                Entendido
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
