import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { Home, Compass, Library, User, PlusSquare, Heart } from 'lucide-react';

export default function BottomNav() {
    const { userProfile } = useStore();
    const location = useLocation();

    // Las rutas donde no queremos que aparezca ya están manejadas en App.tsx (ej. /read)
    
    const navItems = [
        { path: '/', label: 'Inicio', icon: Home },
        { path: '/directory', label: 'Descubre', icon: Compass },
        { path: '/donate', label: 'Donar', icon: Heart },
        { path: '/library', label: 'Biblioteca', icon: Library },
        { path: '/profile', label: 'Perfil', icon: User },
    ];

    if (userProfile?.role === 'admin') {
        navItems.push({ path: '/admin', label: 'Estudio', icon: PlusSquare });
    }

    return (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t-4 border-black z-50 flex justify-around items-center h-20 pb-safe text-slate-500">
            {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname.startsWith('/admin'));
                
                return (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`flex flex-col items-center justify-center w-full h-full transition-all ${isActive ? 'text-primary scale-110' : 'hover:text-primary-dark hover:scale-105'}`}
                    >
                        <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-primary-light/30' : ''}`}>
                            <Icon className={`h-6 w-6 mb-0.5 ${isActive ? 'stroke-[3px]' : 'stroke-[2px]'}`} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-primary' : ''}`}>{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
