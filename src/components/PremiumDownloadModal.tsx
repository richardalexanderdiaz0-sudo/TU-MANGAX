import { motion, AnimatePresence } from 'motion/react';
import { X, Gem, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PremiumDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyTitle: string;
}

export default function PremiumDownloadModal({ isOpen, onClose, storyTitle }: PremiumDownloadModalProps) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-white relative max-w-lg w-full z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                <X size={24} />
            </button>
            <div className="flex justify-center mb-6">
              <div className="bg-amber-500/10 p-4 rounded-full">
                <Gem className="w-12 h-12 text-amber-500" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-center">💎 Descargas Premium</h2>
            <p className="text-zinc-400 mb-6 text-center leading-relaxed">
              ¿Quieres descargar <span className='text-white font-semibold'>{storyTitle}</span> para leerla sin conexión?<br/>
              Las descargas forman parte de los beneficios Premium de TU MANGAX.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-zinc-300 gap-3"><span className="text-amber-500">✨</span> Lectura sin conexión.</li>
              <li className="flex items-center text-zinc-300 gap-3"><span className="text-amber-500">📥</span> Descargas en PDF.</li>
              <li className="flex items-center text-zinc-300 gap-3"><span className="text-amber-500">🚀</span> Futuras ventajas exclusivas.</li>
            </ul>
            
            <div className="flex gap-4">
                <button 
                    onClick={onClose}
                    className="flex-1 bg-zinc-800 text-white font-bold py-4 rounded-xl border border-zinc-700 hover:bg-zinc-700 transition"
                >
                    Cancelar
                </button>
                <button 
                    onClick={() => { onClose(); navigate('/donate'); }}
                    className="flex-1 bg-amber-500 text-zinc-950 font-bold py-4 rounded-xl hover:bg-amber-400 transition flex items-center justify-center gap-2"
                >
                    <Lock size={18} /> Ver Planes Premium
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
