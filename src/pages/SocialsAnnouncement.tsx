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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
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
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
