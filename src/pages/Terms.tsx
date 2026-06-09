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
              Prohibición de Resubida y Piratería
            </h2>
            <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-6 font-medium text-slate-600 leading-relaxed">
              <strong className="text-red-700 block mb-2 uppercase">Queda ESTRICTAMENTE PROHIBIDO:</strong>
              Descargar, capturar pantalla masivamente, desencriptar o extraer los capítulos publicados en <strong>TU MANGAX</strong> para <strong>resubirlos</strong> a otras aplicaciones, sitios web, redes sociales (incluyendo TikTok, Facebook, Instagram), grupos de WhatsApp o canales de Telegram.
              <br/><br/>
              Las traducciones, ediciones (typesetting) y limpieza de scans toman horas de esfuerzo por parte de nuestro equipo (RUIWORKS) y los scanlations asociados. Robar este trabajo y monetizarlo en otros lugares resultará en la <strong>CUENTA SUSPENDIDA PERMANENTEMENTE</strong>, bloqueo de IP y posibles medidas legales contra plataformas infractoras.
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-4 flex items-center gap-3">
              <span className="bg-slate-100 border-2 border-black w-8 h-8 flex items-center justify-center rounded-lg text-primary rotate-6">3</span>
              Comportamiento Comunitario y Cero Tolerancia al Odio
            </h2>
            <p className="text-slate-600 font-medium mb-4">
              Nuestra comunidad es un espacio seguro para que los amantes del manga, manhwa y webtoon disfruten y compartan su pasión. Las siguientes conductas <strong>no serán toleradas bajo ninguna circunstancia</strong>:
            </p>
            <ul className="space-y-4 list-none p-0">
              <li className="bg-white border-2 border-black p-4 rounded-xl flex items-start gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
                <ShieldCheck className="h-6 w-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <span className="text-sm font-black uppercase text-slate-800 block mb-1">Cero Odio y Discriminación</span>
                  <p className="text-xs text-slate-500 font-bold mb-0 leading-tight">Está terminantemente prohibido el discurso de odio (hate speech), racismo, homofobia, transfobia, sexismo o cualquier forma de discriminación hacia personajes, autores, staff de traducción o miembros de la comunidad en los comentarios.</p>
                </div>
              </li>
              <li className="bg-white border-2 border-black p-4 rounded-xl flex items-start gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
                <ShieldCheck className="h-6 w-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <span className="text-sm font-black uppercase text-slate-800 block mb-1">Acoso y Bullying (Cyberbullying)</span>
                  <p className="text-xs text-slate-500 font-bold mb-0 leading-tight">El acoso, las burlas continuas, doxxing (revelar información personal), y ataques directos a otros usuarios están penados con suspensión inmediata de la cuenta. Discutir diferentes opiniones es válido, pero siempre con respeto.</p>
                </div>
              </li>
              <li className="bg-white border-2 border-black p-4 rounded-xl flex items-start gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
                <ShieldCheck className="h-6 w-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <span className="text-sm font-black uppercase text-slate-800 block mb-1">Spoilers Malintencionados</span>
                  <p className="text-xs text-slate-500 font-bold mb-0 leading-tight">Revelar partes críticas de la trama futura en comentarios (procedente de novelas ligeras o raws avanzados) sin previo aviso claro se considerará comportamiento tóxico y puede incurrir en sanción.</p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-4 flex items-center gap-3">
              <span className="bg-slate-100 border-2 border-black w-8 h-8 flex items-center justify-center rounded-lg text-primary -rotate-6">4</span>
              Responsabilidad y Cuenta del Administrador

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
