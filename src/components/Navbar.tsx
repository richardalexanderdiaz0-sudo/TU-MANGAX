import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { api, getImageUrl } from '../services/api';
import { logout } from '../services/firebase';
import { LogOut, User as UserIcon, BookOpen, UploadCloud, Library, Bell, Compass, FileText, Heart } from 'lucide-react';
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
              <div className="bg-rose-600 px-2.5 py-2.5 rounded-xl border border-white/10 w-11 h-11 flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 group-hover:shadow-rose-600/40 transition-all">
                <BookOpen className="w-6 h-6 text-white stroke-[2.5]" />
              </div>
              <div className="flex flex-col select-none">
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white leading-none group-hover:text-rose-400 transition-colors">TU MANGAX</span>
                <span className="text-[8px] tracking-[0.14em] font-black uppercase text-rose-500 leading-none mt-1">LECTURA & COMUNIDAD</span>
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
              <Link
                to="/donate"
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  isActive('/donate') 
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                Donante
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
            <Link 
              to="/donate" 
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all border ${
                isActive('/donate')
                  ? 'bg-rose-500/25 text-rose-400 border-rose-500/30'
                  : 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-600 hover:text-white hover:border-transparent'
              }`}
            >
              <Heart className="h-3.5 w-3.5 fill-rose-500 animate-pulse" />
              <span>Dona 💖</span>
            </Link>

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
