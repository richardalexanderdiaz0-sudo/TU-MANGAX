import React from 'react';
import { useStore } from '../store';
import { XCircle, AlertTriangle } from 'lucide-react';

export default function SuspendedModal() {
  const { userProfile } = useStore();

  if (!userProfile?.is_suspended) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-4 backdrop-blur-xl">
      <div className="bg-white border-8 border-red-600 w-full max-w-md rounded-[3rem] shadow-[15px_15px_0px_0px_rgba(220,38,38,1)] overflow-hidden relative p-8 text-center animate-bounce-in">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center border-4 border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] mb-6">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        
        <h2 className="text-3xl font-black text-red-600 uppercase italic tracking-tighter mb-4">
          ¡Ups... Cuenta Suspendida! (╥﹏╥)
        </h2>
        
        <p className="text-sm font-bold text-slate-700 mb-6 leading-relaxed bg-red-50 p-4 rounded-2xl border-2 border-red-600 border-dashed">
          Lamentablemente has sido suspendido por el administrador por violar los <span className="text-red-600 font-black underline decoration-2">términos y políticas</span> de la app.
          <br /><br />
          No se permite el odio, bullying, o resubir capítulos a otras apps. Hasta la próxima...
        </p>

        <a 
          href="/#/terms" 
          target="_blank"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-xs tracking-widest rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          <AlertTriangle className="h-4 w-4" />
          Leer Políticas y Términos
        </a>
      </div>
    </div>
  );
}
