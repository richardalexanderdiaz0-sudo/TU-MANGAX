import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Lock } from 'lucide-react';

interface PremiumDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyTitle: string;
}

export default function PremiumDownloadModal({ isOpen, onClose, storyTitle }: PremiumDownloadModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-white relative max-w-lg w-full z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                <X size={24} />
            </button>
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-500/20 p-4 rounded-full">
                <Download className="w-12 h-12 text-yellow-500" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-center">📥 ¿Te gusta mucho {storyTitle}?</h2>
            <p className="text-zinc-400 mb-6 text-center leading-relaxed">
              Llévala contigo a cualquier lugar y disfrútala incluso sin conexión a internet.<br/>
              Con la Descarga Premium podrás obtener la obra completa en formato PDF.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-zinc-300 gap-3"><span className="text-yellow-500">✨</span> Acceso inmediato.</li>
              <li className="flex items-center text-zinc-300 gap-3"><span className="text-yellow-500">📄</span> Descarga en PDF.</li>
              <li className="flex items-center text-zinc-300 gap-3"><span className="text-yellow-500">📱</span> Lectura sin conexión.</li>
              <li className="flex items-center text-zinc-300 gap-3"><span className="text-yellow-500">❤️</span> Apoyas el crecimiento de TU MANGAX.</li>
            </ul>
            
            <div className="flex gap-4">
                <button 
                    onClick={onClose}
                    className="flex-1 bg-zinc-800 text-white font-bold py-4 rounded-xl border border-zinc-700 hover:bg-zinc-700 transition"
                >
                    Cancelar
                </button>
                <button 
                    className="flex-1 bg-yellow-500 text-zinc-950 font-bold py-4 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                >
                    <Lock size={18} /> Desbloquear Descarga
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
