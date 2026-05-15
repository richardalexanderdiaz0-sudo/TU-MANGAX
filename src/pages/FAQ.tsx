import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, Rocket, Book } from 'lucide-react';
import { useState } from 'react';

const FAQS = [
  {
    q: "¿Cómo puedo leer capítulos?",
    a: "Solo busca tu obra favorita en el Explorador, haz clic en el título y selecciona el capítulo que quieras disfrutar. ¡Fácil como comer ramen!",
    icon: <Book className="h-5 w-5 text-primary" />
  },
  {
    q: "¿Puedo subir mis propias obras?",
    a: "Por ahora la gestión de obras está reservada para el panel de Estudio, pero estamos trabajando para habilitar más creadores pronto.",
    icon: <Rocket className="h-5 w-5 text-indigo-500" />
  },
  {
    q: "¿Por qué es gratis?",
    a: "TU MANGAX nace del amor por el arte. Es un proyecto de RUIWORKS para fans, por fans.",
    icon: <HelpCircle className="h-5 w-5 text-orange-500" />
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="toon-card bg-white p-8 md:p-12 mb-8">
        <div className="flex items-center gap-4 mb-8 border-b-8 border-black/5 pb-8">
          <div className="bg-orange-500 p-4 rounded-3xl border-4 border-black rotate-[-3deg] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <HelpCircle className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none mb-2 font-display">Dudas Ninja</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Preguntas Frecuentes (FAQ)</p>
          </div>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white border-2 border-black p-2 rounded-xl group-hover:rotate-12 transition-transform">
                    {faq.icon}
                  </div>
                  <span className="font-black text-slate-800 uppercase italic tracking-tighter text-lg">{faq.q}</span>
                </div>
                <ChevronDown className={`h-6 w-6 text-slate-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`transition-all duration-300 ${openIndex === i ? 'max-h-[300px] border-t-4 border-black/5 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="p-6 text-slate-600 font-medium italic bg-slate-50">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Link to="/" className="toon-button bg-slate-800 text-white inline-block">Volver al Inicio</Link>
    </div>
  );
}
