import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { logout } from '../services/firebase';
import { LogOut, User as UserIcon, BookOpen, UploadCloud, Library } from 'lucide-react';
import LoginModal from './LoginModal';

export default function Navbar() {
  const { user, userProfile } = useStore();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
    <nav className="sticky top-0 z-50 w-full bg-white border-b-4 border-black text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1 rounded-2xl border-2 border-black rotate-[-3deg] group-hover:rotate-0 transition-transform overflow-hidden w-12 h-12 flex items-center justify-center bg-white">
                <img src="/TU-MANGAX/logo.svg" className="w-full h-full object-contain" alt="Logo" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-primary-dark">TU MANGAX</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/directory" className="hidden md:block text-sm font-bold hover:text-primary transition-colors">
              Explorar
            </Link>
            
            {user ? (
              <>
                <Link to="/library" className="hidden md:flex items-center gap-2 hover:text-primary transition-colors text-sm font-bold">
                  <Library className="h-4 w-4" />
                  <span className="hidden sm:inline">Biblioteca</span>
                </Link>

                {userProfile?.role === 'admin' && (
                  <Link to="/admin" className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <UploadCloud className="h-4 w-4" />
                    <span className="hidden sm:inline">Estudio</span>
                  </Link>
                )}

                <div className="flex items-center gap-3 ml-2">
                  <div className="h-10 w-10 border-2 border-black rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <button onClick={logout} className="text-slate-400 hover:text-primary-dark transition-colors" title="Cerrar sesión">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-primary text-white hover:bg-primary-dark px-6 py-2 rounded-xl text-sm font-bold transition-all border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                Ingresar
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
    {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
