import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copyright, Wrench, Heart, Star, HelpCircle } from 'lucide-react';
import ErrorReportModal from './ErrorReportModal';

export default function Footer() {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  return (
    <footer className="bg-white border-t-8 border-black mt-auto pb-24 md:pb-8 pt-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo and Credit */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1 rounded-xl border-4 border-black rotate-[-3deg]">
                <img src="/TU-MANGAX/logo.svg" className="w-8 h-8 object-contain" alt="Logo" />
              </div>
              <span className="font-display font-black text-2xl tracking-tighter text-primary-dark italic uppercase">TU MANGAX</span>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Wrench className="h-5 w-5 text-slate-800" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Desarrollado por</p>
                  <p className="font-black text-slate-800 uppercase italic tracking-tighter">RUIWORKS</p>
                </div>
              </div>
              
              <p className="text-xs font-black text-slate-500 uppercase tracking-tighter leading-relaxed max-w-xs">
                PARA LOS AMANTES DE <span className="text-primary">COMICS</span>, <span className="text-indigo-500">MANHWAS</span> Y <span className="text-orange-500">MANGAS</span> EN ESPAÑOL 
                <span className="inline-flex items-center gap-1 ml-1 text-primary">
                  <Heart className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                </span>
              </p>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-black text-primary-dark uppercase italic tracking-tighter mb-6 border-b-4 border-black/10 inline-block">Legal</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/terms" className="text-sm font-black text-slate-400 hover:text-primary transition-colors underline decoration-2 decoration-black/5 underline-offset-4 uppercase tracking-tighter">Términos y Condiciones</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm font-black text-slate-400 hover:text-primary transition-colors underline decoration-2 decoration-black/5 underline-offset-4 uppercase tracking-tighter">Privacidad</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm font-black text-slate-400 hover:text-primary transition-colors underline decoration-2 decoration-black/5 underline-offset-4 uppercase tracking-tighter">Política de Cookies</Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-black text-primary-dark uppercase italic tracking-tighter mb-6 border-b-4 border-black/10 inline-block">Soporte</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/faq" className="text-sm font-black text-slate-400 hover:text-primary transition-colors underline decoration-2 decoration-black/5 underline-offset-4 uppercase tracking-tighter">Preguntas Frecuentes</Link>
              </li>
              <li>
                <button 
                  onClick={() => setIsErrorModalOpen(true)}
                  className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-red-500 transition-colors underline decoration-2 decoration-black/5 underline-offset-4 uppercase tracking-tighter"
                >
                  <HelpCircle className="h-4 w-4" />
                  Reportar Errores
                </button>
              </li>
              <li>
                <div className="flex items-center gap-2 group cursor-help">
                  <span className="text-[10px] font-black bg-slate-100 border-2 border-black px-2 py-0.5 rounded-lg text-slate-500 grayscale group-hover:grayscale-0 transition-all">v2.0.26 Beta</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t-4 border-black/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-tighter italic">
            <Copyright className="h-4 w-4" />
            <span>2026</span>
            <span className="text-primary-dark">TU MANGAX</span>
            <span>- Todos los derechos reservados</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Servidores Online</span>
          </div>
        </div>
      </div>

      <ErrorReportModal 
        isOpen={isErrorModalOpen} 
        onClose={() => setIsErrorModalOpen(false)} 
      />
    </footer>
  );
}

