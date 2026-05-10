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
    <nav className="sticky top-0 z-50 w-full bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-indigo-500" />
              <span className="font-bold text-xl tracking-tight">Nexus Manga</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/directory" className="text-sm font-medium hover:text-indigo-400 transition-colors">
              Explorar
            </Link>
            
            {user ? (
              <>
                <Link to="/library" className="flex items-center gap-2 hover:text-indigo-400 transition-colors text-sm font-medium">
                  <Library className="h-4 w-4" />
                  <span className="hidden sm:inline">Biblioteca</span>
                </Link>

                {userProfile?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                    <UploadCloud className="h-4 w-4" />
                    <span className="hidden sm:inline">Estudio</span>
                  </Link>
                )}

                <div className="flex items-center gap-3 ml-2">
                  <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <button onClick={logout} className="text-slate-400 hover:text-white" title="Cerrar sesión">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-md text-sm font-bold transition-colors border border-slate-200 shadow-sm ml-2"
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
