import React, { useState } from 'react';
import { useStore } from '../store';
import { loginWithEmail, registerWithEmail, resetPassword } from '../services/firebase';
import { X, Mail, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function LoginModal({ onClose, initialMode = 'login' }: Props) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setError('Por favor, ingresa tu correo para recuperar la contraseña.');
      return;
    }
    setLoading(true);
    setError('');
    setResetMessage('');
    try {
      await resetPassword(email);
      setResetMessage('¡Checkea tu correo! Te enviamos un link.');
    } catch (err: any) {
      let errorMsg = 'Error al enviar correo';
      if (err.code === 'auth/user-not-found') {
        errorMsg = 'No hay usuario con este correo.';
      } else {
         errorMsg = err.message || errorMsg;
      }
      setError(errorMsg);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && !acceptedTerms) {
      setError('Debes aceptar los términos y políticas para registrarte.');
      return;
    }

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
          {resetMessage && <p className="text-emerald-600 text-xs mb-6 bg-emerald-100 border-2 border-black p-3 rounded-xl font-black uppercase italic tracking-tighter shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">{resetMessage}</p>}
          
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
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <button type="button" onClick={handleResetPassword} className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors cursor-pointer select-none">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="flex items-start gap-3 mt-1 text-left">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setAcceptedTerms(!acceptedTerms);
                  }}
                  className="w-6 h-6 shrink-0 bg-slate-50 border-4 border-black rounded-lg flex items-center justify-center transition-all cursor-pointer select-none focus:outline-none focus:border-primary relative overflow-hidden"
                >
                  <AnimatePresence>
                    {acceptedTerms && (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        className="absolute inset-0 bg-emerald-500 flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 text-white stroke-[4px]" strokeLinecap="round" strokeLinejoin="round" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="4" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                <span className="text-xs font-bold text-slate-500 leading-tight">
                  Al registrarte en <span className="text-primary font-black">TU MANGAX</span> aceptas las{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline decoration-2">Políticas y Términos de uso</a>.
                </span>
              </div>
            )}

            <button type="submit" disabled={loading} className="toon-button bg-primary text-xl w-full py-4 mt-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex justify-center items-center gap-3">
              {loading && <div className="h-5 w-5 rounded-full border-4 border-white/20 border-t-white animate-spin" />}
              {loading ? 'DAME UN MOMENTO...' : isLogin ? 'ENTRAR' : '¡LISTO, UNIRME!'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-black uppercase text-slate-400 tracking-tighter">
            {isLogin ? '¿PRIMERA VEZ AQUÍ?' : '¿YA TIENES CUENTA?'}
            <button disabled={loading} onClick={() => { setIsLogin(!isLogin); setError(''); setAcceptedTerms(false); }} className="text-primary hover:text-primary-dark ml-2 underline decoration-black decoration-2 underline-offset-4 disabled:opacity-50 transition-all">
              {isLogin ? 'REGÍSTRATE GRATIS' : 'INICIA SESIÓN'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

