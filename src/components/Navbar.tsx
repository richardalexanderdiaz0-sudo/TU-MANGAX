import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { api, getImageUrl } from '../services/api';
import { logout } from '../services/firebase';
import { LogOut, User as UserIcon, BookOpen, UploadCloud, Library, Bell, Compass, FileText } from 'lucide-react';
import LoginModal from './LoginModal';

export default function Navbar() {
  const { user, userProfile } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [hasReadNews, setHasReadNews] = useState(true);

  useEffect(() => {
    const checkNewsStatus = async () => {
      try {
        const news = await api.announcements.getAll();
        if (news && news.length > 0) {
          const latestId = String(news[0].id || news[0].created_at || 'initial');
          const storedId = localStorage.getItem('last_seen_announcement_id');
          if (storedId === latestId) {
            setHasReadNews(true);
          } else {
            setHasReadNews(false);
          }
        } else {
          setHasReadNews(true);
        }
      } catch (err) {
        setHasReadNews(true);
      }
    };

    checkNewsStatus();

    const handleNewsRead = () => {
      checkNewsStatus();
    };
    
    window.addEventListener('androidNewsRead', handleNewsRead);
    return () => window.removeEventListener('androidNewsRead', handleNewsRead);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
    <nav className="sticky top-0 z-50 w-full bg-[#05060c]/90 backdrop-blur-xl border-b border-white/5 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-rose-600 p-2 rounded-xl border border-white/10 overflow-hidden w-10 h-10 flex items-center justify-center shadow-lg shadow-rose-600/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain" viewBox="0 0 512 512">
                  <path d="M128 160C128 142.3 142.3 128 160 128H352C369.7 128 384 142.3 384 160V352C384 369.7 369.7 384 352 384H160C142.3 384 128 369.7 128 352V160Z" fill="white" />
                  <path d="M180 180H332V332H180V180Z" fill="#e11d48" />
                  <path d="M256 180V332" stroke="white" strokeWidth="8"/>
                  <circle cx="210" cy="220" r="10" fill="white"/>
                  <circle cx="302" cy="220" r="10" fill="white"/>
                </svg>
              </div>
              <div className="flex flex-col select-none">
                <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-white leading-none">MangaVerse</span>
                <span className="text-[8px] tracking-[0.14em] font-black uppercase text-rose-500 leading-none mt-1">STUDIO & READER</span>
              </div>
            </Link>

            {/* Main Navigation Tabs */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  isActive('/') 
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Inicio
              </Link>
              <Link
                to="/directory"
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  isActive('/directory') && !location.search.includes('NOVELA')
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                Explorar
              </Link>
              <Link
                to="/library"
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  isActive('/library') 
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Library className="h-3.5 w-3.5" />
                Mi Biblioteca
              </Link>
              <Link
                to="/directory?format=NOVELA LIGERA"
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  location.search.includes('NOVELA')
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Novelas
              </Link>
              {user && userProfile?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 bg-red-950/40 text-red-400 border border-red-500/20 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 hover:bg-red-950/60`}
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  Estudio Creador
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/android-announcement" className="relative p-2 text-slate-300 hover:text-rose-400 transition-all hover:scale-105" title="Novedades">
                <Bell className="h-5 w-5 stroke-[2.5px]" />
                {!hasReadNews && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-950 animate-pulse"></span>
                )}
            </Link>

            <div className="flex items-center gap-3 ml-1">
              <Link 
                to="/profile" 
                className="h-9 w-9 border border-white/10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden hover:scale-105 transition-all shadow-md" 
                title="Mi Perfil"
              >
                {user && (user.avatar || user.photoURL) ? (
                  <img src={user.photoURL || getImageUrl(user.avatar)} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="bg-rose-600 h-full w-full flex items-center justify-center font-black text-xs text-white">
                    {userProfile?.display_name ? userProfile.display_name.substring(0, 2).toUpperCase() : 'RI'}
                  </div>
                )}
              </Link>
              
              {user ? (
                <button 
                  onClick={() => logout()} 
                  className="text-slate-300 hover:text-red-500 transition-colors p-1" 
                  title="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4 stroke-[2.5px]" />
                </button>
              ) : (
                <button 
                  onClick={() => setShowLogin(true)} 
                  className="text-slate-300 hover:text-rose-400 transition-colors p-1" 
                  title="Ingresar"
                >
                  <LogOut className="h-4 w-4 stroke-[2.5px] rotate-180" />
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
