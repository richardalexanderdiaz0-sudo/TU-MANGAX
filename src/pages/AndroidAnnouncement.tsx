import React, { useEffect } from 'react';
import { useStore } from '../store';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AndroidAnnouncement() {
    const { user, userProfile } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        localStorage.setItem('hasReadAndroidNews', 'true');
        // Despachar evento para actualizar el Navbar
        window.dispatchEvent(new Event('androidNewsRead'));
    }, []);

    const greeting = user 
        ? `Hola ${userProfile?.username || 'Usuario'}...`
        : `¡Hola, usuario nuevo! Gracias por registrarte en "TU MANGAX" y en hora buena...`;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 pb-24">
            <button 
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold uppercase tracking-widest text-sm"
            >
                <ChevronLeft className="w-5 h-5" />
                Volver
            </button>

            <div className="bg-white border-4 border-black rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="inline-flex items-center gap-2 bg-primary text-white border-2 border-black px-4 py-2 rounded-xl text-sm font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6 md:mb-8">
                    🔥 NOTICIA EXCLUSIVA
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight uppercase italic mb-8 border-b-4 border-black pb-8">
                    ¡TU MANGAX Llegará a Android Muy Pronto! 📱
                </h1>

                <div className="prose prose-lg prose-slate max-w-none prose-p:font-medium prose-p:text-slate-700 prose-headings:font-black prose-headings:text-slate-900 prose-headings:uppercase">
                    <p className="text-xl md:text-2xl font-bold text-primary-dark !leading-relaxed rounded-2xl bg-primary/10 p-6 md:p-8 border-2 border-primary/20 mb-10">
                        {greeting} ¡Entraste justo a tiempo porque TU MANGAX próximamente será una App nativa para tu celular!
                    </p>

                    <p>
                        Así es, RUIWORKS ESTÁ TRABAJANDO y dedicando todo el esfuerzo gracias a tu apoyo para crear una **APLICACIÓN PARA ANDROID** oficial y exclusiva de TU MANGAX. 
                        Por ahora solo estará disponible para Android y el proceso de desarrollo va a toda marcha.
                    </p>

                    <p>
                        Posiblemente estará disponible en los próximos <strong>2 o 3 días, o menos o más</strong>... No te podemos dar una fecha exacta porque estamos puliendo detalles para que quede perfecta. ¡Pero de que estará disponible, LO ESTARÁ! Prepárate para leer todos tus manhwas y mangas favoritos con el mejor rendimiento y la mejor experiencia de lectura directamente desde una app en tu móvil.
                    </p>

                    <div className="my-12">
                        <img 
                            src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop" 
                            alt="Android App Coming Soon" 
                            className="w-full h-auto aspect-video object-cover rounded-[2rem] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                        />
                    </div>

                    <h2 className="text-3xl mt-16 mb-8 underline decoration-primary decoration-4 underline-offset-8">Preguntas Frecuentes (FAQ) 💬</h2>

                    <div className="space-y-6">
                        <div className="bg-slate-50 border-4 border-black p-6 rounded-3xl">
                            <h3 className="text-lg md:text-xl font-black mb-3">¿Qué pasará con mis obras guardadas y mi cuenta? 📚</h3>
                            <p className="text-slate-700 font-medium">¡No te preocupes por nada! Todo está guardado en la nube de RUIWORKS. Al iniciar sesión en la App Android con exactamente las mismas credenciales que usas aquí, ¡toda tu biblioteca, historial de lectura y favoritos estarán ahí guardados de forma mágica!</p>
                        </div>

                        <div className="bg-slate-50 border-4 border-black p-6 rounded-3xl">
                            <h3 className="text-lg md:text-xl font-black mb-3">¿Seguirán las Donaciones? 💖</h3>
                            <p className="text-slate-700 font-medium">¡Sí! Todo seguirá igual. Quienes donen recibirán las insignias en su perfil y los beneficios se mantendrán sincronizados entres la versión Web y la App. Su apoyo nos permite seguir creando y mejorando ambas versiones.</p>
                        </div>

                        <div className="bg-slate-50 border-4 border-black p-6 rounded-3xl">
                            <h3 className="text-lg md:text-xl font-black mb-3">¿La versión Web será borrada? 💻</h3>
                            <p className="text-slate-700 font-medium">¡NO! Seguirá existiendo tanto la página Web como la nueva App Android. Ambas convivirán y se actualizarán a la par, de manera que tú puedes elegir cómo y en qué plataforma prefieres disfrutar de tus lecturas.</p>
                        </div>

                        <div className="bg-slate-50 border-4 border-black p-6 rounded-3xl">
                            <h3 className="text-lg md:text-xl font-black mb-3">¿Será gratuita la App Android? 💸</h3>
                            <p className="text-slate-700 font-medium">¡Completamente gratuita! Podrás descargarla en formato APK (y posteriormente en la tienda). Nuestro objetivo sigue siendo traer el mejor entretenimiento directamente a tu celular.</p>
                        </div>

                        <div className="bg-slate-50 border-4 border-black p-6 rounded-3xl">
                            <h3 className="text-lg md:text-xl font-black mb-3">¿Habrá versión para iOS (iPhone)? 🍏</h3>
                            <p className="text-slate-700 font-medium">Por los momentos todos nuestros esfuerzos están enfocados en lanzar una versión muy robusta para Android. Pero si la app tiene un éxito rotundo, consideraremos crear la versión de iOS en un futuro a largo plazo.</p>
                        </div>
                    </div>

                    <div className="mt-16 text-center border-t-4 border-black pt-12">
                        <p className="text-2xl font-black italic uppercase text-slate-800">Atentamente,</p>
                        <p className="text-amber-500 font-black text-3xl md:text-4xl uppercase tracking-tighter mt-2">RIVAN TECHNOLOGIES</p>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mt-1">Founded by RUIWORKS</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
