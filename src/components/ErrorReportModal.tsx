import { useState } from 'react';
import { X, AlertCircle, Check, Send, HelpCircle } from 'lucide-react';
import { useStore } from '../store';

interface ErrorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ERROR_OPTIONS = [
  'Error al cargar la página',
  'Imágenes en blanco / no cargan',
  'Capítulo equivocado',
  'Páginas desordenadas',
  'Error de sesión',
  'Carga muy lenta'
];

export default function ErrorReportModal({ isOpen, onClose }: ErrorReportModalProps) {
  const { userProfile } = useStore();
  const [selectedErrors, setSelectedErrors] = useState<string[]>([]);
  const [customError, setCustomError] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const toggleError = (error: string) => {
    setSelectedErrors(prev => 
      prev.includes(error) ? prev.filter(e => e !== error) : [...prev, error]
    );
  };

  const handleSend = () => {
    const userName = userProfile?.display_name || 'Usuario invitado';
    const allErrors = [...selectedErrors, customError].filter(Boolean).join(', ');
    
    if (!allErrors) {
      alert("Por favor, selecciona o escribe al menos un error.");
      return;
    }

    const subject = `Reporte de Errores - TU MANGAX - ${userName}`;
    const body = `Hola, soy ${userName} y quiero reportar estos errores: ${allErrors}`;
    const mailtoUrl = `mailto:Richardalexanderdiaz0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-primary p-6 flex items-center justify-between border-b-4 border-black">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl border-2 border-black rotate-[-3deg]">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Reportar Errores</h2>
          </div>
          <button onClick={onClose} className="bg-white p-2 rounded-xl border-2 border-black hover:rotate-90 transition-transform">
            <X className="h-5 w-5 text-black" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Selecciona lo que está fallando:</p>
          
          <div className="grid grid-cols-1 gap-2 mb-6">
            {ERROR_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => toggleError(opt)}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all font-bold text-sm ${
                  selectedErrors.includes(opt) 
                  ? 'bg-primary/5 border-primary text-primary shadow-[2px_2px_0px_0px_rgba(255,45,133,1)] translate-x-[-1px] translate-y-[-1px]' 
                  : 'bg-slate-50 border-black/5 text-slate-600 hover:border-black/10'
                }`}
              >
                {opt}
                {selectedErrors.includes(opt) && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Otro error (Opcional):</p>
            <textarea
              value={customError}
              onChange={(e) => setCustomError(e.target.value)}
              placeholder="Explica brevemente..."
              className="w-full p-4 rounded-2xl border-2 border-black/10 bg-slate-50 font-medium text-sm focus:border-primary transition-colors h-24 resize-none"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={isSent}
            className={`w-full toon-button flex items-center justify-center gap-3 py-4 ${isSent ? 'bg-emerald-500' : 'bg-primary'}`}
          >
            {isSent ? (
              <>
                <Check className="h-5 w-5" />
                ENVIANDO...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                ENVIAR REPORTE
              </>
            )}
          </button>
          
          <p className="text-center mt-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">
            Se abrirá tu gestor de correo para enviar el reporte a Richard
          </p>
        </div>
      </div>
    </div>
  );
}
