import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copyright, Wrench, Heart, Star, HelpCircle, Instagram } from 'lucide-react';
import ErrorReportModal from './ErrorReportModal';

export default function Footer() {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  return (
    <footer className="bg-[#05060c] border-t border-white/5 mt-auto pb-24 md:pb-8 pt-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative text-slate-300">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Credit */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-rose-600 p-2 rounded-xl border border-white/10 overflow-hidden w-10 h-10 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain" viewBox="0 0 512 512">
                  <path d="M128 160C128 142.3 142.3 128 160 128H352C369.7 128 384 142.3 384 160V352C384 369.7 369.7 384 352 384H160C142.3 384 128 369.7 128 352V160Z" fill="white" />
                  <path d="M180 180H332V332H180V180Z" fill="#e11d48" />
                  <path d="M256 180V332" stroke="white" strokeWidth="8"/>
                  <circle cx="210" cy="220" r="10" fill="white"/>
                  <circle cx="302" cy="220" r="10" fill="white"/>
                </svg>
              </div>
              <div className="flex flex-col select-none">
                <span className="font-display font-extrabold text-base tracking-tight text-white leading-none">MangaVerse</span>
                <span className="text-[8px] tracking-[0.14em] font-black uppercase text-rose-500 leading-none mt-1">STUDIO & READER</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest leading-none">HECHO POR</p>
                  <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">RIVA Technologies <Copyright className="inline h-3 w-3 -mt-1 text-rose-500" /></p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest leading-none">FUNDADO POR</p>
                  <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">RUIWORKS & Ivan</p>
                </div>
              </div>
              
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed max-w-xs">
                PARA LOS AMANTES DE <span className="text-rose-500">COMICS</span>, <span className="text-rose-400">MANHWAS</span> Y <span className="text-rose-300">MANGAS</span> EN ESPAÑOL 
                <span className="inline-flex items-center gap-1 ml-1 text-rose-500">
                  <Heart className="h-3 w-3 fill-current animate-pulse" />
                  <Star className="h-3 w-3 fill-current" />
                </span>
              </p>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-display font-black text-rose-500 uppercase tracking-widest text-xs mb-6 pb-2 border-b border-white/5 inline-block">Legal</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/terms" className="text-xs font-extrabold text-slate-400 hover:text-rose-400 transition-colors uppercase tracking-wider">Términos y Condiciones</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-xs font-extrabold text-slate-400 hover:text-rose-400 transition-colors uppercase tracking-wider">Privacidad</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-xs font-extrabold text-slate-400 hover:text-rose-400 transition-colors uppercase tracking-wider">Política de Cookies</Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-display font-black text-rose-500 uppercase tracking-widest text-xs mb-6 pb-2 border-b border-white/5 inline-block">Soporte</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/faq" className="text-xs font-extrabold text-slate-400 hover:text-rose-400 transition-colors uppercase tracking-wider">Preguntas Frecuentes</Link>
              </li>
              <li>
                <button 
                  onClick={() => setIsErrorModalOpen(true)}
                  className="flex items-center gap-2 text-xs font-extrabold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                >
                  <HelpCircle className="h-4 w-4" />
                  Reportar Errores
                </button>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black bg-slate-900 border border-white/10 px-2 py-0.5 rounded-lg text-slate-400 uppercase tracking-widest">v2.0.26 Oficial</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h4 className="font-display font-black text-rose-500 uppercase tracking-widest text-xs mb-6 pb-2 border-b border-white/5 inline-block">Redes</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="https://instagram.com/tu_mangax_oficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-extrabold text-slate-400 hover:text-rose-400 transition-colors uppercase tracking-wider">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://x.com/TUMANGAXOFICIAL" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-extrabold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current stroke-none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  Twitter (X)
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@tu.mangax.oficial?_r=1&_t=ZS-96d1iPswmMH" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-extrabold text-slate-400 hover:text-rose-300 transition-colors uppercase tracking-wider">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current stroke-none"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.61-5.49-.02-.82-.01-1.64.02-2.46.22-3.1 2.5-5.59 5.56-6.19 1.04-.2 2.1-.16 3.12.06v4.13c-.66-.21-1.39-.23-2.06-.05-.83.21-1.55.8-1.95 1.56-.27.53-.39 1.15-.35 1.75.05.77.38 1.5 1 2.05.61.55 1.45.86 2.28.87 1.43.02 2.79-.81 3.42-2.08.19-.38.31-.81.36-1.23.11-.9.08-1.81.08-2.73V.02z"/></svg>
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://t.me/+el3-Q0reWsoxNWMx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-extrabold text-slate-400 hover:text-rose-400 transition-colors uppercase tracking-wider">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current stroke-none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.1.02-1.62 1.03-4.57 3.03-.43.3-.82.45-1.17.44-.39-.01-1.14-.22-1.7-.4s-1.01-.28-1-.59c.01-.16.23-.33.68-.51 2.78-1.21 4.63-2.01 5.56-2.4 2.64-1.1 3.19-1.29 3.55-1.29.08 0 .25.02.36.11.09.08.12.19.13.27 0 .05.01.12 0 .19z" /></svg>
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider italic">
            <Copyright className="h-4 w-4 text-rose-500" />
            <span>2026</span>
            <span className="text-white">MangaVerse</span>
            <span>- Todos los derechos reservados</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
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
