import { Link } from 'react-router-dom';
import { ShieldCheck, Info, FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="toon-card bg-white p-8 md:p-12 mb-8">
        <div className="flex items-center gap-4 mb-8 border-b-8 border-black/5 pb-8">
          <div className="bg-primary p-4 rounded-3xl border-4 border-black rotate-[-5deg] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-primary-dark uppercase italic tracking-tighter leading-none mb-2 font-display">Términos y Condiciones</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Última actualización: Mayo 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-4 flex items-center gap-3">
              <span className="bg-slate-100 border-2 border-black w-8 h-8 flex items-center justify-center rounded-lg text-primary rotate-3">1</span>
              Aceptación del Usuario
            </h2>
            <div className="bg-slate-50 border-2 border-black rounded-2xl p-6 font-medium text-slate-600 leading-relaxed italic">
              Al acceder a <span className="text-primary font-bold">TU MANGAX</span>, aceptas estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna parte, por favor no utilices el servicio. Recuerda que somos una plataforma para amantes del arte gráfico.
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-4 flex items-center gap-3">
              <span className="bg-slate-100 border-2 border-black w-8 h-8 flex items-center justify-center rounded-lg text-primary -rotate-3">2</span>
              Uso del Contenido
            </h2>
            <p className="text-slate-600 font-medium mb-4"> Todo el contenido visual (mangas, manhwas, cómics) es propiedad de sus respectivos autores y editoriales. <span className="text-primary-dark font-black underline decoration-black/10">TU MANGAX</span> actúa como un visualizador de contenido facilitado por la comunidad.</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
              <li className="bg-white border-2 border-black p-4 rounded-xl flex items-center gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-xs font-black uppercase text-slate-500">No distribuir sin permiso</span>
              </li>
              <li className="bg-white border-2 border-black p-4 rounded-xl flex items-center gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
                <Info className="h-5 w-5 text-blue-500 shrink-0" />
                <span className="text-xs font-black uppercase text-slate-500">Respetar a los creadores</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-4 flex items-center gap-3">
              <span className="bg-slate-100 border-2 border-black w-8 h-8 flex items-center justify-center rounded-lg text-primary rotate-6">3</span>
              Responsabilidad
            </h2>
            <p className="text-slate-600 font-medium italic">
              Nos esforzamos por mantener la mejor calidad, pero no garantizamos la disponibilidad ininterrumpida del servicio. ¡Estamos en constante mejora impulsada por <span className="text-primary font-bold">RUIWORKS</span>!
            </p>
          </section>
        </div>
      </div>
      
      <Link to="/" className="toon-button bg-slate-800 text-white inline-block">Volver al Inicio</Link>
    </div>
  );
}
