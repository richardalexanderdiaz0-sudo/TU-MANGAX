import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Coins, ShieldCheck, Zap, Star, MessageCircle, Info, Award, Users, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { api } from '../services/api';

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
  const [supporters, setSupporters] = useState<any[]>([]);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const donors = await api.donations.getDonors();
        let mapped: Array<{name: string, amount: string, message?: string}> = donors.map(d => ({ name: d.display_name, amount: d.donation_amount || 'Variable' }));
        
        // Ensure Juan Carlos is in the list
        const juanIndex = mapped.findIndex(d => d.name.toLowerCase().includes('juan') && d.name.toLowerCase().includes('carlos'));
        if (juanIndex === -1) {
            mapped = [{ name: 'Juan Carlos Elizar Parra Quezada', amount: '25 USD', message: '¡Muchísimas gracias por tu increíble aporte para mantener los servidores activos! Eres un pilar para TU MANGAX 💖' }, ...mapped];
        } else {
            mapped[juanIndex].message = '¡Muchísimas gracias por tu increíble aporte para mantener los servidores activos! Eres un pilar para TU MANGAX 💖';
            mapped[juanIndex].name = 'Juan Carlos Elizar Parra Quezada';
            mapped[juanIndex].amount = '25 USD';
            const juan = mapped.splice(juanIndex, 1)[0];
            mapped.unshift(juan);
        }

        setSupporters(mapped);
      } catch (err) {
        console.error("Error fetching donors", err);
      }
    };
    fetchDonors();
  }, []);

  const handleDonate = () => {
    const amount = selectedAmount === 'custom' ? customAmount : selectedAmount;
    if (!amount || Number(amount) <= 0) {
      alert("Por favor, ingresa un monto válido.");
      return;
    }

    const userName = userProfile?.display_name || 'Un Usuario';

    const message = `Hola, soy ${userName} y quiero donar voluntariamente ${amount} pesos dominicanos para la app TU MANGAX.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/18494021508?text=${encodedMessage}`;
    
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
            <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">Apoyas directamente a RUIWORKS & Ivan para seguir dedicando tiempo a este arte.</p>
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
        <div className="bg-slate-100 rounded-2xl border-2 border-black border-dashed p-6 mb-12">
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

        {/* Supporters / Apoyadores Section */}
        <div className="border-t-4 border-black pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-400 p-2.5 rounded-xl border-2 border-black rotate-[-3deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Award className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-display font-black text-2xl tracking-tight text-slate-800 uppercase italic">Apoyadores</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] leading-none">Nuestros Héroes y Leyendas</p>
              </div>
            </div>
          </div>

          {supporters.length === 0 ? (
            <div className="bg-slate-50 border-4 border-black border-dashed rounded-3xl p-8 py-10 text-center relative overflow-hidden">
              <p className="text-sm font-black text-slate-400 uppercase tracking-wider italic">no hay donaciones todavia...</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">¡Sé el primero en colaborar vía WhatsApp y entra a la lista!</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
                {supporters.map((sup: any, idx: number) => (
                  <div key={idx} className="bg-amber-50 hover:bg-amber-100/70 border-2 border-black p-4 rounded-2xl flex flex-col gap-3 transition-all hover:scale-[1.02] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-100 transition-opacity">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 border-2 border-black rounded-full bg-primary/15 flex items-center justify-center overflow-hidden shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 pr-6">
                        <p className="font-extrabold text-slate-800 uppercase tracking-tight text-xs leading-none break-words mb-1">{sup.name}</p>
                        <p className="text-[10px] font-black text-primary uppercase leading-none tracking-wider italic">{sup.amount} {String(sup.amount).includes('USD') ? '' : 'DOP'}</p>
                        </div>
                    </div>
                    {sup.message && (
                        <p className="text-xs font-bold text-slate-600 bg-white p-3 rounded-xl border-2 border-black/10 italic leading-snug">
                            "{sup.message}"
                        </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Gratitude words */}
              <div className="bg-indigo-50 border-4 border-black rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex gap-3 items-start">
                  <div className="bg-white border-2 border-black p-2 rounded-xl shrink-0 rotate-[-4deg]">
                    <Heart className="h-5 w-5 text-indigo-500 fill-current animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-indigo-900 uppercase italic tracking-tight text-sm mb-1 leading-none">¡Gracias infinitas a nuestros héroes!</h4>
                    <p className="text-xs font-bold text-indigo-700 uppercase leading-relaxed italic">
                      "Queremos expresar nuestro más sincero agradecimiento a cada persona que aporta su granito de arena. Su apoyo directo nos motiva y ayuda a cubrir los costos para mantener TU MANGAX en línea y seguir sumando capítulos increíbles. ¡Esta gran marca y comunidad continúa fuerte gracias a ustedes!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/" className="text-sm font-black text-slate-400 hover:text-black uppercase italic tracking-tighter">Volver a leer mangas</Link>
      </div>
    </div>
  );
}
