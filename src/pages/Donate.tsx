import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Coins, ShieldCheck, Zap, Star, MessageCircle, Info } from 'lucide-react';
import { useStore } from '../store';

const AMOUNTS = [
  { val: 10, label: '10' },
  { val: 25, label: '25' },
  { val: 50, label: '50' },
  { val: 1000, label: '1000' },
];

export default function Donate() {
  const { userProfile } = useStore();
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom' | null>(null);

  const handleDonate = () => {
    const amount = selectedAmount === 'custom' ? customAmount : selectedAmount;
    if (!amount || Number(amount) <= 0) {
      alert("Por favor, ingresa un monto válido.");
      return;
    }

    const userName = userProfile?.display_name || 'Un Usuario';
    const message = `Hola, soy ${userName} y quiero donar voluntariamente ${amount} pesos dominicanos para la app TU MANGAX.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/18293165263?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="toon-card bg-white p-8 md:p-12 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Heart className="h-40 w-40 text-primary fill-current" />
        </div>
        
        <div className="flex items-center gap-4 mb-8 border-b-8 border-black/5 pb-8 relative z-10">
          <div className="bg-primary p-4 rounded-3xl border-4 border-black rotate-[-5deg] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <Coins className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-primary-dark uppercase italic tracking-tighter leading-none mb-2 font-display">Apoya el Proyecto</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Ayúdanos a mantener TU MANGAX en línea</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-rose-50 border-2 border-black p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="bg-white border-2 border-black p-3 rounded-xl mb-4 rotate-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-black text-slate-800 uppercase text-xs mb-2 italic">Gana la App</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">Servidores más rápidos, mejor seguridad y actualizaciones constantes.</p>
          </div>

          <div className="bg-indigo-50 border-2 border-black p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="bg-white border-2 border-black p-3 rounded-xl mb-4 -rotate-3">
              <Star className="h-6 w-6 text-indigo-500" />
            </div>
            <h3 className="font-black text-slate-800 uppercase text-xs mb-2 italic">Ganas Tú</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">Insignia de "Donante VIP" en tu perfil (próximamente) y prioridad en sugerencias.</p>
          </div>

          <div className="bg-amber-50 border-2 border-black p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="bg-white border-2 border-black p-3 rounded-xl mb-4 rotate-6">
              <Heart className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-black text-slate-800 uppercase text-xs mb-2 italic">Gana el Creador</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">Apoyas directamente a RUIWORKS para seguir dedicando tiempo a este arte.</p>
          </div>
        </div>

        {/* Amount Selector */}
        <div className="mb-12">
          <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter mb-6 text-center">Elige tu Monto (DOP)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {AMOUNTS.map((amt) => (
              <button
                key={amt.val}
                onClick={() => setSelectedAmount(amt.val)}
                className={`p-6 rounded-2xl border-4 border-black transition-all flex flex-col items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
                  selectedAmount === amt.val ? 'bg-primary text-white scale-105' : 'bg-white hover:bg-slate-50 text-slate-800'
                }`}
              >
                <span className="text-2xl font-black italic tracking-tighter">${amt.val}</span>
                <span className="text-[10px] font-bold uppercase opacity-60">Pesos</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setSelectedAmount('custom')}
            className={`w-full p-4 rounded-2xl border-4 border-black transition-all font-black uppercase italic tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] mb-4 ${
              selectedAmount === 'custom' ? 'bg-indigo-500 text-white' : 'bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            Monto Personalizado
          </button>

          {selectedAmount === 'custom' && (
            <input
              type="number"
              placeholder="Ingresa el monto en pesos..."
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full p-4 rounded-xl border-4 border-black text-center font-black text-xl italic tracking-tighter focus:scale-[1.02] transition-transform mb-6"
            />
          )}

          <button
            onClick={handleDonate}
            disabled={!selectedAmount}
            className="w-full toon-button bg-emerald-500 text-white py-6 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group transition-all"
          >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span className="text-xl">COLABORAR VÍA WHATSAPP</span>
          </button>
          
          <p className="text-center mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            * Se abrirá automáticamente WhatsApp para un pago seguro directo con el creador
          </p>
        </div>

        {/* Terms Section */}
        <div className="bg-slate-100 rounded-2xl border-2 border-black border-dashed p-6">
          <h4 className="flex items-center gap-2 font-black text-slate-800 uppercase text-xs mb-4">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Políticas de Donación Voluntaria
          </h4>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="bg-white border-2 border-black w-5 h-5 flex items-center justify-center rounded-lg text-[10px] font-black shrink-0">1</span>
              <p className="text-[10px] font-bold text-slate-500 uppercase leading-tight italic">Toda donación es <span className="text-primary font-black">100% Voluntaria</span>. No existe obligación de pago para disfrutar de los contenidos básicos.</p>
            </li>
            <li className="flex gap-3">
              <span className="bg-white border-2 border-black w-5 h-5 flex items-center justify-center rounded-lg text-[10px] font-black shrink-0">2</span>
              <p className="text-[10px] font-bold text-slate-500 uppercase leading-tight italic">No se realizan reembolsos de donaciones procesadas, ya que se consideran apoyos directos al mantenimiento.</p>
            </li>
            <li className="flex gap-3">
              <span className="bg-white border-2 border-black w-5 h-5 flex items-center justify-center rounded-lg text-[10px] font-black shrink-0">3</span>
              <p className="text-[10px] font-bold text-slate-500 uppercase leading-tight italic">Al donar, confirmas que eres el titular de los fondos y que lo haces por amor al arte y al proyecto.</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/" className="text-sm font-black text-slate-400 hover:text-black uppercase italic tracking-tighter">Volver a leer mangas</Link>
      </div>
    </div>
  );
}
