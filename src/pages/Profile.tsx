import React from 'react';
import { useStore } from '../store';
import { api, getImageUrl } from '../services/api';
import LoginModal from '../components/LoginModal';
import { User, LogOut, Shield } from 'lucide-react';

export default function Profile() {
    const { user, userProfile, authLoading } = useStore();
    const [showLogin, setShowLogin] = React.useState(false);

    if (authLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-full mb-8 text-primary border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <User className="h-16 w-16" />
                </div>
                <h2 className="text-3xl font-black mb-4 text-primary-dark uppercase italic tracking-tighter font-display">Tu Perfil</h2>
                <p className="text-slate-500 mb-10 max-w-sm font-bold uppercase text-xs tracking-widest leading-loose">Inicia sesión para guardar favoritos, dejar likes y ser parte de la comunidad.</p>
                
                <button 
                    onClick={() => setShowLogin(true)} 
                    className="toon-button bg-primary text-xl px-12 py-4"
                >
                    ¡INGRESAR A Nexus Manga!
                </button>
                {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
            </div>
        );
    }

    return (
        <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
            <h1 className="text-3xl font-black mb-10 text-primary-dark uppercase italic tracking-tighter font-display">Mi Perfil</h1>
            
            <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                <div className="relative">
                    <img 
                        src={getImageUrl(user.avatar) || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.display_name || userProfile?.displayName || user.email?.split('@')[0] || 'U')}&background=ff69b4&color=fff&size=200`} 
                        alt="Avatar" 
                        className="h-32 w-32 rounded-full object-cover bg-slate-50 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                    />
                    {userProfile?.role === 'admin' && (
                        <div className="absolute bottom-[-5px] right-[-5px] bg-primary p-2 rounded-full border-2 border-black rotate-[12deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" title="Administrador">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                    )}
                </div>
                
                <div className="text-center md:text-left flex-1">
                    <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">{userProfile?.display_name || userProfile?.displayName || user.email?.split('@')[0]}</h2>
                    <p className="text-slate-400 font-bold mb-6 underline decoration-wavy decoration-primary-light underline-offset-4">{user.email}</p>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <span className={`inline-block px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                            userProfile?.role === 'admin' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                            ROL: {userProfile?.role === 'admin' ? 'BOSS' : 'LECTOR'}
                        </span>
                        
                        {(userProfile?.created_at || userProfile?.createdAt) && (
                            <span className="inline-block px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                UNIDO: {new Date(userProfile?.created_at || userProfile?.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-16 space-y-6">
                <button 
                    onClick={() => {
                        localStorage.removeItem('nexus_token');
                        window.location.reload();
                    }} 
                    className="flex items-center justify-center gap-2 text-white font-black bg-red-500 hover:bg-red-600 border-4 border-black px-8 py-5 rounded-3xl w-full transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest text-lg italic"
                >
                    <LogOut className="h-6 w-6 stroke-[3px]" /> Salir de Nexus
                </button>
            </div>
        </div>
    );
}
