import React, { useState } from 'react';
import { useStore } from '../store';
import { api } from '../services/api';
import { loginWithEmail, registerWithEmail, resetPassword, signInWithGoogle } from '../services/firebase';
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

  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      await api.auth.syncUser();
      onClose();
    } catch (err: any) {
      console.error(err);
      let errorMsg = 'Error al iniciar sesión con Google';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Inicio de sesión cancelado por el usuario';
      } else if (err.code === 'auth/blocked-by-popup-killer') {
        errorMsg = 'El navegador bloqueó la ventana de Google. Por favor, actívela.';
      } else {
        errorMsg = err.message || errorMsg;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email) {
      setError('Por favor, ingresa tu correo antes de solicitar cambio de clave.');
      return;
    }
    setLoading(true);
    setError('');
    setResetMessage('');
    try {
      await resetPassword(email);
      setResetMessage('¡Link enviado! Revisa tu bandeja de entrada y la carpeta de SPAM (no deseado).');
    } catch (err: any) {
      let errorMsg = 'Error al enviar correo (¿pusiste tu correo bien?)';
      if (err.code === 'auth/user-not-found') {
        errorMsg = 'No hay usuario registrado con este correo.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Formato de correo inválido.';
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

            <div className="flex items-center gap-2 my-1 select-none">
              <div className="h-[2px] bg-black/10 flex-1"></div>
              <span className="text-[10px] font-black text-slate-400 tracking-widest">O TAMBIÉN</span>
              <div className="h-[2px] bg-black/10 flex-1"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="toon-button bg-white text-black font-black hover:bg-slate-50 transition-all text-xs w-full py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex justify-center items-center gap-3 active:translate-x-[2px] active:translate-y-[2px]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.83c.87-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335"/>
              </svg>
              <span>INICIAR CON GOOGLE</span>
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

