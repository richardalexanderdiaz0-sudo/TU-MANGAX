import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Coins, ShieldCheck, Zap, Star, Award, Users, Sparkles, CreditCard, ArrowRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { useStore } from '../store';
import { api } from '../services/api';

const AMOUNTS = [
  { val: 1, label: '1', desc: 'Un cafecito para el desarrollador', emoji: '☕' },
  { val: 2, label: '2', desc: 'Ramen del programador', emoji: '🍜' },
  { val: 3, label: '3', desc: 'Ayuda para el servidor', emoji: '📚' },
  { val: 5, label: '5', desc: 'Lector nocturno', emoji: '🌙' },
  { val: 7, label: '7', desc: 'Boost para TU MANGAX', emoji: '🚀' },
  { val: 10, label: '10', desc: 'Fan legendario', emoji: '💎' },
  { val: 15, label: '15', desc: 'Modo ultra apoyo', emoji: '🔥' },
  { val: 20, label: '20', desc: 'Patrocinador otaku', emoji: '👑' },
  { val: 25, label: '25', desc: 'Héroe de la comunidad', emoji: '🩵' },
  { val: 50, label: '50', desc: 'Leyenda de TU MANGAX', emoji: '🌌' },
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

  const triggerPaypal = (amount: number | string) => {
    const paypalUrl = `https://paypal.me/JParraquezada/${amount}`;
    window.open(paypalUrl, '_blank');
  };

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    triggerPaypal(amount);
  };

  const handleCustomDonate = () => {
    if (!customAmount || Number(customAmount) <= 0) {
      alert("Por favor, ingresa un monto válido.");
      return;
    }
    triggerPaypal(customAmount);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Container in elegant dark mode */}
      <div className="bg-slate-950 border-4 border-black rounded-[2.5rem] p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 pb-8 border-b-4 border-slate-800 relative z-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-primary p-4 rounded-3xl border-4 border-black rotate-[-5deg] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:rotate-[5deg] transition-transform duration-300">
              <Coins className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-rose-500 uppercase italic tracking-tighter leading-none mb-2 font-display">
                Apoya el Proyecto
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                Ayúdanos a mantener TU MANGAX en línea y creciendo cada día
              </p>
            </div>
          </div>
          
          <div className="bg-slate-900 border-2 border-slate-700 px-4 py-2 rounded-2xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Moneda: USD ($)</span>
          </div>
        </div>

        {/* Core dynamic benefit badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/90 hover:bg-slate-900 border-2 border-black/80 p-6 rounded-3xl flex flex-col items-center text-center transition-all hover:scale-[1.02] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="bg-rose-500/10 border-2 border-rose-500/30 p-3 rounded-2xl mb-4 rotate-3">
              <Zap className="h-6 w-6 text-rose-400" />
            </div>
            <h3 className="font-black text-slate-200 uppercase text-xs mb-2 italic">Gana la App</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
              Servidores estables ultrarrápidos, capacidad para más lectores y actualizaciones fantásticas.
            </p>
          </div>

          <div className="bg-slate-900/90 hover:bg-slate-900 border-2 border-black/80 p-6 rounded-3xl flex flex-col items-center text-center transition-all hover:scale-[1.02] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="bg-indigo-500/10 border-2 border-indigo-500/30 p-3 rounded-2xl mb-4 -rotate-3">
              <Star className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="font-black text-slate-200 uppercase text-xs mb-2 italic">Ganas Tú</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
              Insignia reluciente de "Donador VIP" en tu perfil y completa prioridad en sugerencias.
            </p>
          </div>

          <div className="bg-slate-900/90 hover:bg-slate-900 border-2 border-black/80 p-6 rounded-3xl flex flex-col items-center text-center transition-all hover:scale-[1.02] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="bg-amber-500/10 border-2 border-amber-500/30 p-3 rounded-2xl mb-4 rotate-6">
              <Heart className="h-6 w-6 text-amber-400 fill-current" />
            </div>
            <h3 className="font-black text-slate-200 uppercase text-xs mb-2 italic">Gana el Creador</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
              Apoyas directamente el arduo trabajo de RUIWORKS & Ivan para dedicar su vida a este arte.
            </p>
          </div>
        </div>

        {/* Beautiful motivational quote */}
        <div className="bg-gradient-to-r from-rose-500/15 via-indigo-500/10 to-transparent text-slate-250 p-5 rounded-2xl border-2 border-slate-700 text-center mb-10 max-w-2xl mx-auto shadow-inner relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-rose-500" />
          <p className="font-extrabold uppercase italic tracking-tight text-xs sm:text-sm leading-relaxed">
            “Cada donación ayuda a mejorar la app, servidores y futuras funciones 💙”
          </p>
        </div>

        {/* Gift Selector */}
        <div className="mb-12 relative z-10">
          <h2 className="text-xl font-black text-slate-200 uppercase italic tracking-tighter mb-6 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Elige tu Regalo Voluntario (USD)
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {AMOUNTS.map((amt) => (
              <button
                key={amt.val}
                onClick={() => handlePresetClick(amt.val)}
                className={`p-4 rounded-2xl border-4 border-black transition-all flex items-center justify-between text-left gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98] active:shadow-none hover:border-rose-500 ${
                  selectedAmount === amt.val 
                    ? 'bg-rose-500/25 border-rose-500 text-white' 
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{amt.emoji}</span>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm leading-tight text-white">{amt.desc}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${selectedAmount === amt.val ? 'text-rose-400' : 'text-slate-500'}`}>
                      Clic para enviar
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 bg-black/40 border border-slate-700/50 px-2.5 py-1 rounded-xl">
                  <span className="text-sm font-black italic tracking-tighter text-amber-400">${amt.val}</span>
                  <span className="text-[8px] font-black uppercase text-slate-400">USD</span>
                </div>
              </button>
            ))}
          </div>

          {/* Custom Selector option */}
          <button
            onClick={() => setSelectedAmount('custom')}
            className={`w-full p-4 rounded-2xl border-4 border-black transition-all flex items-center justify-between text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98] active:shadow-none hover:border-indigo-500 ${
              selectedAmount === 'custom' ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">✨</span>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm leading-tight text-white">Monto Personalizado</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${selectedAmount === 'custom' ? 'text-indigo-400' : 'text-slate-500'}`}>
                  Elige la cantidad exacta para donar en PayPal
                </span>
              </div>
            </div>
            <span className="text-sm font-black italic tracking-tighter whitespace-nowrap shrink-0 bg-indigo-500/30 border border-indigo-500/50 px-3 py-1 rounded-xl text-indigo-350">
              DONAR OTRA CANTIDAD
            </span>
          </button>

          {/* Show input when custom is selected */}
          {selectedAmount === 'custom' && (
            <div className="mt-4 p-5 bg-slate-900 border-2 border-slate-800 rounded-3xl animate-fade-in">
              <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 text-center">
                Escribe tu aporte en dólares (USD)
              </label>
              <div className="relative max-w-xs mx-auto mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-500">$</span>
                <input
                  type="number"
                  placeholder="Ej: 5"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-black/50 border-4 border-black rounded-2xl pl-10 pr-16 py-4 text-center font-black text-2xl text-white outline-none focus:border-indigo-500 placeholder:text-slate-700"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500 uppercase">USD</span>
              </div>
              
              <button
                onClick={handleCustomDonate}
                disabled={!customAmount || Number(customAmount) <= 0}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase text-sm py-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98] active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                Ir a PayPal con mi monto <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="text-center mt-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider max-w-lg mx-auto">
              * Nota: Al presionar cualquier opción, se te redirigirá instantáneamente a la pasarela oficial de PayPal de manera segura para concretar el pago. 
            </p>
            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-2 animate-pulse">
              Las donaciones ayudan a mantener servidores y futuras mejoras ✨
            </p>
          </div>
        </div>

        {/* Detailed Terms and Policies Segment */}
        <div className="bg-slate-900/60 rounded-3xl border-2 border-slate-800 p-6 mb-12">
          <h4 className="flex items-center gap-2 font-black text-slate-300 uppercase text-xs mb-4">
            <ShieldCheck className="h-4 w-4 text-rose-500" />
            Términos y Condiciones Detallados de la Donación
          </h4>
          <div className="space-y-4 text-slate-400 font-medium text-[10px] uppercase leading-relaxed tracking-tight">
            <div className="flex gap-3">
              <span className="bg-slate-800 border border-slate-700 w-5 h-5 flex items-center justify-center rounded-lg text-[9px] font-black shrink-0 text-white">1</span>
              <div>
                <strong className="text-slate-200 block">Naturaleza Voluntaria e Incondicional:</strong>
                <p>
                  Todas las contribuciones económicas realizadas a través de PayPal son 100% de carácter voluntario, altruista y desinteresado. El acceso a las lecturas básicas fundamentales de TU MANGAX seguirá siendo libre de cobro obligatorio.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <span className="bg-slate-800 border border-slate-700 w-5 h-5 flex items-center justify-center rounded-lg text-[9px] font-black shrink-0 text-white">2</span>
              <div>
                <strong className="text-slate-200 block">Política Absoluta de No-Reembolsos:</strong>
                <p>
                  Debido a que estas aportaciones se destinan de manera directa e inmediata a sufragar los costes fijos de mantenimiento del servidor, adquisición de espacio, licencias de protección y desarrollo del aplicativo, <strong className="text-rose-400">NO SE REALIZARÁN REEMBOLSOS NI CANCELACIONES</strong> bajo ningún concepto una vez procesada la donación en PayPal.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="bg-slate-800 border border-slate-700 w-5 h-5 flex items-center justify-center rounded-lg text-[9px] font-black shrink-0 text-white">3</span>
              <div>
                <strong className="text-slate-200 block">Declaración de Fondos y Edad:</strong>
                <p>
                  Al efectuar la transacción, confirmas expresamente que cuentas con la mayoría de edad legal requerida en tu país, o posees el consentimiento explícito de tus tutores legales, y que eres el titular legítimo del método de pago utilizado.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="bg-slate-800 border border-slate-700 w-5 h-5 flex items-center justify-center rounded-lg text-[9px] font-black shrink-0 text-white">4</span>
              <div>
                <strong className="text-slate-200 block">No Adquisición de Derechos Comerciales:</strong>
                <p>
                  Colaborar voluntariamente con TU MANGAX no confiere al usuario ningún derecho de copyright, propiedad comercial, autoridad administrativa o poder de veto/decisión sobre los títulos publicados, traducciones del staff o políticas de la comunidad.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Supporters / Apoyadores Section */}
        <div className="border-t-4 border-slate-800 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-400 p-2.5 rounded-xl border-2 border-black rotate-[-3deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Award className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-display font-black text-2xl tracking-tight text-white uppercase italic">
                  Apoyadores
                </h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] leading-none">
                  Nuestros Héroes y Leyendas de la Plataforma
                </p>
              </div>
            </div>
          </div>

          {supporters.length === 0 ? (
            <div className="bg-slate-900 border-4 border-slate-800 border-dashed rounded-3xl p-8 py-10 text-center relative overflow-hidden">
              <p className="text-sm font-black text-slate-500 uppercase tracking-wider italic">no hay donaciones todavía registradas...</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                ¡Colabora en PayPal para ingresar a nuestro salón de héroes!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {supporters.map((sup: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="bg-slate-900 hover:bg-slate-850 border-2 border-slate-800 p-4 rounded-2xl flex flex-col gap-3 transition-all hover:scale-[1.02] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-80 group-hover:scale-110 transition-transform">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 border-2 border-slate-700 rounded-full bg-slate-850 flex items-center justify-center overflow-hidden shrink-0">
                        <Users className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="min-w-0 pr-6">
                        <p className="font-extrabold text-slate-200 uppercase tracking-tight text-xs leading-none break-words mb-1">
                          {sup.name}
                        </p>
                        <p className="text-[10px] font-black text-rose-400 uppercase leading-none tracking-wider italic">
                          {sup.amount}
                        </p>
                      </div>
                    </div>
                    {sup.message && (
                      <p className="text-xs font-bold text-slate-400 bg-black/40 p-3 rounded-xl border border-slate-800 italic leading-snug">
                        "{sup.message}"
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Gratitude words */}
              <div className="bg-slate-950 border-4 border-slate-800 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="absolute top-[-50%] right-[-50%] w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex gap-3 items-start relative z-10">
                  <div className="bg-slate-900 border-2 border-slate-700 p-2 rounded-xl shrink-0 rotate-[-4deg]">
                    <Heart className="h-5 w-5 text-rose-500 fill-current animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-rose-400 uppercase italic tracking-tight text-sm mb-1 leading-none">
                      ¡Gracias infinitas por tu apoyo incondicional!
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed italic">
                      "Queremos expresar nuestro más sincero agradecimiento a cada persona que aporta su granito de arena. Su apoyo directo nos motiva y ayuda a cubrir los costos para mantener TU MANGAX en línea y seguir sumando capítulos increíbles. ¡Esta gran marca y comunidad continúa fuerte gracias a ustedes!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Link 
          to="/" 
          className="text-xs font-black text-slate-400 hover:text-indigo-400 uppercase italic tracking-widest hover:translate-y-[-1px] transition-transform"
        >
          ← Volver al inicio de TU MANGAX
        </Link>
      </div>
    </div>
  );
}
