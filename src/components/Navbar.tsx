import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { api, getImageUrl } from '../services/api';
import { logout } from '../services/firebase';
import { LogOut, User as UserIcon, BookOpen, UploadCloud, Library, Bell } from 'lucide-react';
import LoginModal from './LoginModal';

export default function Navbar() {
  const { user, userProfile } = useStore();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [hasReadNews, setHasReadNews] = useState(localStorage.getItem('hasReadAndroidNews') === 'true');

  useEffect(() => {
    const handleNewsRead = () => {
      setHasReadNews(localStorage.getItem('hasReadAndroidNews') === 'true');
    };
    window.addEventListener('androidNewsRead', handleNewsRead);
    return () => window.removeEventListener('androidNewsRead', handleNewsRead);
  }, []);

  return (
    <>
    <nav className="sticky top-0 z-50 w-full bg-white border-b-4 border-black text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1 rounded-2xl border-2 border-black rotate-[-3deg] group-hover:rotate-0 transition-transform overflow-hidden w-12 h-12 flex items-center justify-center bg-white">
                <img src={`${import.meta.env.BASE_URL}logo.svg`} className="w-full h-full object-contain" alt="Logo" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-primary-dark">TU MANGAX</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/android-announcement" className="relative p-2 text-slate-800 hover:text-primary transition-all hover:scale-105" title="Novedades">
                <Bell className="h-6 w-6 stroke-[2.5px]" />
                {!hasReadNews && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
            </Link>

            <Link to="/directory" className="hidden md:block text-sm font-black uppercase text-slate-800 hover:text-primary transition-colors tracking-tighter">
              DESCUBRE
            </Link>
            
            <Link to="/library" className="hidden md:flex items-center gap-2 hover:text-primary transition-colors text-sm font-black uppercase tracking-tighter">
              <Library className="h-4 w-4" />
              <span className="hidden sm:inline">BIBLIOTECA</span>
            </Link>

            {user && userProfile?.role === 'admin' && (
              <Link to="/admin" className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <UploadCloud className="h-4 w-4" />
                <span className="hidden sm:inline">Estudio</span>
              </Link>
            )}

            <div className="flex items-center gap-3 ml-2">
              <Link 
                to="/profile" 
                className="h-10 w-10 border-4 border-black rounded-full bg-slate-50 flex items-center justify-center overflow-hidden hover:scale-105 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]" 
                title="Mi Perfil"
              >
                {user && (user.avatar || user.photoURL) ? (
                  <img src={user.photoURL || getImageUrl(user.avatar)} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-5 w-5 text-slate-800 stroke-[2.5px]" />
                )}
              </Link>
              
              {user ? (
                <button 
                  onClick={() => logout()} 
                  className="text-slate-800 hover:text-red-500 transition-colors p-1" 
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5 stroke-[2.5px]" />
                </button>
              ) : (
                <button 
                  onClick={() => setShowLogin(true)} 
                  className="text-slate-800 hover:text-primary transition-colors p-1" 
                  title="Ingresar"
                >
                  <LogOut className="h-5 w-5 stroke-[2.5px] rotate-180" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
    {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
