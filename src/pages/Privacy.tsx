import { Link } from 'react-router-dom';
import { Eye, Shield, Lock } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="toon-card bg-white p-8 md:p-12 mb-8">
        <div className="flex items-center gap-4 mb-8 border-b-8 border-black/5 pb-8">
          <div className="bg-indigo-500 p-4 rounded-3xl border-4 border-black rotate-[5deg] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none mb-2 font-display">Privacidad</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Protegemos tu identidad ninja</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-4 flex items-center gap-3">
              <Eye className="h-6 w-6 text-indigo-500" />
              ¿Qué recolectamos?
            </h2>
            <div className="bg-indigo-50 border-2 border-black rounded-2xl p-6 font-medium text-slate-600 leading-relaxed italic">
              Solo lo necesario para tu experiencia: Nombre de usuario, correo y tus lecturas favoritas. No vendemos tus datos a nadie, ¡lo prometemos bajo el código RUIWORKS!
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-4 flex items-center gap-3">
              <Lock className="h-6 w-6 text-indigo-500" />
              Seguridad de la Cuenta
            </h2>
            <p className="text-slate-600 font-medium mb-4 italic">
              Tu contraseña está encriptada y protegida. Eres responsable de mantener tu acceso seguro. Si ves algo raro, ¡avísanos rápido!
            </p>
          </section>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-white border-2 border-black p-6 rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
              <h4 className="font-black text-slate-800 uppercase mb-2">Cookies</h4>
              <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic">Usamos cookies para recordar tu sesión y tus preferencias de lectura.</p>
            </div>
            <div className="bg-white border-2 border-black p-6 rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
              <h4 className="font-black text-slate-800 uppercase mb-2">Borrar Cuenta</h4>
              <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic">Puedes solicitar el borrado de tus datos en cualquier momento desde tu perfil.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Link to="/" className="toon-button bg-slate-800 text-white inline-block">Volver al Inicio</Link>
    </div>
  );
}
