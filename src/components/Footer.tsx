import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copyright, Wrench, Heart, Star, HelpCircle, Instagram } from 'lucide-react';
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Credit */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1 rounded-xl border-4 border-black rotate-[-3deg]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 object-contain" viewBox="0 0 512 512">
                  <rect width="512" height="512" rx="128" fill="#FF2D85"/>
                  <path d="M128 160C128 142.3 142.3 128 160 128H352C369.7 128 384 142.3 384 160V352C384 369.7 369.7 384 352 384H160C142.3 384 128 369.7 128 352V160Z" fill="white" stroke="black" strokeWidth="20"/>
                  <path d="M180 180H332V332H180V180Z" fill="#FFFBFF" stroke="black" strokeWidth="12"/>
                  <path d="M256 180V332" stroke="black" strokeWidth="8"/>
                  <circle cx="210" cy="220" r="10" fill="black"/>
                  <circle cx="302" cy="220" r="10" fill="black"/>
                </svg>
              </div>
              <span className="font-display font-black text-2xl tracking-tighter text-primary-dark italic uppercase">TU MANGAX</span>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">HECHO POR</p>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">RIVA Technologies <Copyright className="inline h-3 w-3 -mt-1 text-slate-500" /></p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">FUNDADO POR</p>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">RUIWORKS & Ivan</p>
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
                  <span className="text-[10px] font-black bg-slate-100 border-2 border-black px-2 py-0.5 rounded-lg text-slate-500 grayscale group-hover:grayscale-0 transition-all">v2.0.26 Oficial</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h4 className="font-black text-primary-dark uppercase italic tracking-tighter mb-6 border-b-4 border-black/10 inline-block">Redes</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="https://instagram.com/tu_mangax_oficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-pink-500 transition-colors underline decoration-2 decoration-black/5 underline-offset-4 uppercase tracking-tighter">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://x.com/TUMANGAXOFICIAL" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-black transition-colors underline decoration-2 decoration-black/5 underline-offset-4 uppercase tracking-tighter">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current stroke-none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  Twitter (X)
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@tu.mangax.oficial?_r=1&_t=ZS-96d1iPswmMH" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-[#00f2fe] transition-colors underline decoration-2 decoration-black/5 underline-offset-4 uppercase tracking-tighter">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current stroke-none"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.61-5.49-.02-.82-.01-1.64.02-2.46.22-3.1 2.5-5.59 5.56-6.19 1.04-.2 2.1-.16 3.12.06v4.13c-.66-.21-1.39-.23-2.06-.05-.83.21-1.55.8-1.95 1.56-.27.53-.39 1.15-.35 1.75.05.77.38 1.5 1 2.05.61.55 1.45.86 2.28.87 1.43.02 2.79-.81 3.42-2.08.19-.38.31-.81.36-1.23.11-.9.08-1.81.08-2.73V.02z"/></svg>
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://t.me/+el3-Q0reWsoxNWMx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-blue-500 transition-colors underline decoration-2 decoration-black/5 underline-offset-4 uppercase tracking-tighter">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current stroke-none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.1.02-1.62 1.03-4.57 3.03-.43.3-.82.45-1.17.44-.39-.01-1.14-.22-1.7-.4s-1.01-.28-1-.59c.01-.16.23-.33.68-.51 2.78-1.21 4.63-2.01 5.56-2.4 2.64-1.1 3.19-1.29 3.55-1.29.08 0 .25.02.36.11.09.08.12.19.13.27 0 .05.01.12 0 .19z" /></svg>
                  Telegram
                </a>
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

