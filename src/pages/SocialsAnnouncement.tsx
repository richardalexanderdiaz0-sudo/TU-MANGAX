import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Instagram } from 'lucide-react';

export default function SocialsAnnouncement() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-8 flex items-center gap-2 font-black uppercase text-sm tracking-widest text-slate-500 hover:text-black transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Volver
      </button>

      <div className="border-8 border-black rounded-[3rem] overflow-hidden bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden border-b-8 border-black">
          <img 
            src="https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=1200&auto=format&fit=crop" 
            alt="Redes Sociales"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <span className="bg-primary text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl mb-4 inline-block border-2 border-black">
              Comunidad
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white uppercase italic tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              ¡Oficialmente TU MANGAX en Redes!
            </h1>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-xl font-medium text-slate-600 leading-relaxed mb-8">
              ¡Hola! Oficialmente <strong>TU MANGAX</strong> está creando sus redes sociales para estar más cerca de ustedes. 
              Únete a nuestra comunidad para enterarte de nuevos lanzamientos, noticias exclusivas, y participar en dinámicas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <a 
                href="https://instagram.com/tu_mangax_oficial"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-3xl border-4 border-black bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 relative overflow-hidden active:translate-y-[2px] transition-all"
              >
                <div className="relative z-10 flex flex-col items-center justify-center text-white h-full gap-4">
                  <Instagram className="w-16 h-16 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]" />
                  <span className="font-black text-xl uppercase tracking-widest drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">Instagram</span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              </a>

              <a 
                href="https://t.me/+el3-Q0reWsoxNWMx"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-3xl border-4 border-black bg-[#0088cc] relative overflow-hidden active:translate-y-[2px] transition-all"
              >
                <div className="relative z-10 flex flex-col items-center justify-center text-white h-full gap-4">
                  <svg viewBox="0 0 24 24" className="w-16 h-16 fill-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.1.02-1.62 1.03-4.57 3.03-.43.3-.82.45-1.17.44-.39-.01-1.14-.22-1.7-.4s-1.01-.28-1-.59c.01-.16.23-.33.68-.51 2.78-1.21 4.63-2.01 5.56-2.4 2.64-1.1 3.19-1.29 3.55-1.29.08 0 .25.02.36.11.09.08.12.19.13.27 0 .05.01.12 0 .19z" /></svg>
                  <span className="font-black text-xl uppercase tracking-widest drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">Telegram</span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              </a>

              <a 
                href="https://x.com/TUMANGAXOFICIAL"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-3xl border-4 border-black bg-black relative overflow-hidden active:translate-y-[2px] transition-all"
              >
                <div className="relative z-10 flex flex-col items-center justify-center text-white h-full gap-4">
                  <svg viewBox="0 0 24 24" className="w-16 h-16 fill-white drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)]"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  <span className="font-black text-xl uppercase tracking-widest drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">Twitter (X)</span>
                </div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
              </a>

              <a 
                href="https://www.tiktok.com/@tu.mangax.oficial?_r=1&_t=ZS-96d1iPswmMH"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-3xl border-4 border-black bg-gradient-to-tr from-[#00f2fe] via-black to-[#fe0979] relative overflow-hidden active:translate-y-[2px] transition-all"
              >
                <div className="relative z-10 flex flex-col items-center justify-center text-white h-full gap-4">
                  <svg viewBox="0 0 24 24" className="w-16 h-16 fill-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.61-5.49-.02-.82-.01-1.64.02-2.46.22-3.1 2.5-5.59 5.56-6.19 1.04-.2 2.1-.16 3.12.06v4.13c-.66-.21-1.39-.23-2.06-.05-.83.21-1.55.8-1.95 1.56-.27.53-.39 1.15-.35 1.75.05.77.38 1.5 1 2.05.61.55 1.45.86 2.28.87 1.43.02 2.79-.81 3.42-2.08.19-.38.31-.81.36-1.23.11-.9.08-1.81.08-2.73V.02z"/></svg>
                  <span className="font-black text-xl uppercase tracking-widest drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">TikTok</span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
