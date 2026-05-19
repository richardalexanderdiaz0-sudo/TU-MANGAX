import React, { useState } from 'react';
import { useStore } from '../store';
import { api } from '../services/api';
import { X, Mail, Lock } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let authData;
      if (isLogin) {
        authData = await api.auth.login({ email, password });
      } else {
        const data = {
          email,
          password,
          display_name: displayName || email.split('@')[0],
          role: email === 'richardalexanderdiaz0@gmail.com' ? 'admin' : 'user',
        };
        await api.auth.register(data);
        authData = await api.auth.login({ email, password });
      }

      if (authData?.token) {
        localStorage.setItem('nexus_token', authData.token);
        window.location.reload(); 
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al procesar la solicitud');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black w-full max-w-sm rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
        <button onClick={onClose} disabled={loading} className="toon-button bg-white p-1 min-w-0 absolute top-4 right-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <X className="h-5 w-5 text-black" />
        </button>
        <div className="p-8">
          <h2 className="text-3xl font-black text-primary-dark mb-8 uppercase italic tracking-tighter">
            {isLogin ? '¡HOLA DE NUEVO!' : '¡SÉ PARTE!'}
          </h2>
          
          {error && <p className="text-red-500 text-xs mb-6 bg-red-100 border-2 border-black p-3 rounded-xl font-black uppercase italic tracking-tighter shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">{error}</p>}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Apodo / Name</label>
                <input 
                  type="text" 
                  value={displayName} onChange={e=>setDisplayName(e.target.value)}
                  className="w-full bg-slate-50 border-4 border-black rounded-2xl p-4 text-slate-800 font-bold outline-none focus:border-primary transition-colors placeholder:text-slate-300" 
                  placeholder="Tu nombre ninja"
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Email / Correo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email} onChange={e=>setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-4 border-black rounded-2xl pl-12 pr-4 py-4 text-slate-800 font-bold outline-none focus:border-primary transition-colors placeholder:text-slate-300" 
                  placeholder="ejemplo@manga.com"
                  required 
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Password / Clave</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password} onChange={e=>setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-4 border-black rounded-2xl pl-12 pr-4 py-4 text-slate-800 font-bold outline-none focus:border-primary transition-colors placeholder:text-slate-300" 
                  placeholder="••••••••"
                  required 
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="toon-button bg-primary text-xl w-full py-4 mt-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex justify-center items-center gap-3">
              {loading && <div className="h-5 w-5 rounded-full border-4 border-white/20 border-t-white animate-spin" />}
              {loading ? 'DAME UN MOMENTO...' : isLogin ? 'ENTRAR' : '¡LISTO, UNIRME!'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-black uppercase text-slate-400 tracking-tighter">
            {isLogin ? '¿PRIMERA VEZ AQUÍ?' : '¿YA TIENES CUENTA?'}
            <button disabled={loading} onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-primary hover:text-primary-dark ml-2 underline decoration-black decoration-2 underline-offset-4 disabled:opacity-50 transition-all">
              {isLogin ? 'REGÍSTRATE GRATIS' : 'INICIA SESIÓN'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
