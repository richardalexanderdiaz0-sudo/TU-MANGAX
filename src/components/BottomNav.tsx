import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { Home, Compass, Library, User, PlusSquare, Heart } from 'lucide-react';

export default function BottomNav() {
    const { userProfile } = useStore();
    const location = useLocation();

    // Las rutas donde no queremos que aparezca ya están manejadas en App.tsx (ej. /read)
    
    const navItems = [
        { path: '/', label: 'INICIO', icon: Home },
        { path: '/directory', label: 'DESCUBRE', icon: Compass },
        { path: '/donate', label: 'DONANTE', icon: Heart },
        { path: '/library', label: 'BIBLIOTECA', icon: Library },
        { path: '/profile', label: 'PERFIL', icon: User },
    ];

    if (userProfile?.role === 'admin') {
        navItems.push({ path: '/admin', label: 'ESTUDIO', icon: PlusSquare });
    }

    return (
        <div className="fixed bottom-0 inset-x-0 bg-[#06070d]/95 backdrop-blur-xl border-t border-white/5 z-40 flex justify-around items-center h-20 pb-safe text-slate-400 md:hidden">
            {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname.startsWith('/admin'));
                
                return (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`flex flex-col items-center justify-center w-full h-full transition-all ${isActive ? 'text-rose-500 scale-110' : 'hover:text-slate-200 hover:scale-105'}`}
                    >
                        <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-rose-500/10' : ''}`}>
                            <Icon className={`h-5 w-5 ${isActive ? 'stroke-[3px]' : 'stroke-[2px]'}`} />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isActive ? 'text-rose-500' : ''}`}>{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
