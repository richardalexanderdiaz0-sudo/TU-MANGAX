import React, { useState } from 'react';
import { useStore } from '../store';
import { signInWithGoogle, loginWithEmail, registerWithEmail } from '../services/firebase';
import { X, Mail, Lock } from 'lucide-react';

interface Props {
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function LoginModal({ onClose, initialMode = 'login' }: Props) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
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
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, displayName || email.split('@')[0]);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      let errorMsg = 'Error al procesar la solicitud';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMsg = 'Correo o contraseña incorrectos';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'El correo ya está registrado';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'La contraseña debe tener al menos 6 caracteres';
      } else {
        errorMsg = err.message || errorMsg;
      }
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al iniciar sesión con Google');
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

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t-2 border-dashed border-slate-300"></div>
              <span className="flex-shrink mx-4 text-slate-400 font-extrabold text-[10px] tracking-widest uppercase">O</span>
              <div className="flex-grow border-t-2 border-dashed border-slate-300"></div>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleSignIn} 
              disabled={loading}
              className="bg-white hover:bg-slate-50 text-slate-700 font-black uppercase text-sm py-3.5 px-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48c0,-0.61 -0.06,-1.2 -0.16,-1.7c0.01,-0.07 0.01,-0.13 0.03,-0.2Z" fill="#4285F4" />
                  <path d="M12,21c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.58c-0.92,0.62 -2.1,0.98 -3.42,0.98c-2.34,0 -4.33,-1.58 -5.04,-3.7H1.7v2.66C3.18,18.84 7.24,21 12,21Z" fill="#34A853" stopColor="#34A853" />
                  <path d="M6.96,13.52a5.4,5.4,0,0,1,0,-3.04V7.82H1.7a8.99,8.99,0,0,0,0,8.36l5.26,-2.66Z" fill="#FBBC05" />
                  <path d="M12,6.72c1.32,0 2.51,0.46 3.44,1.35L17.9,5.61C15.96,3.8 14.12,3 12,3C7.24,3 3.18,5.16 1.7,7.82l5.26,2.66c0.71,-2.12 2.7,-3.76 5.04,-3.76Z" fill="#EA4335" />
                </g>
              </svg>
              Iniciar con Google
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

