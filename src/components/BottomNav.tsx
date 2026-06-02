import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';
import { Home, Compass, Library, User, PlusSquare, Heart } from 'lucide-react';

export default function BottomNav() {
    const { userProfile } = useStore();
    const { t } = useTranslation();
    const location = useLocation();

    // Las rutas donde no queremos que aparezca ya están manejadas en App.tsx (ej. /read)
    
    const navItems = [
        { path: '/', label: t('nav.home', 'INICIO'), icon: Home },
        { path: '/directory', label: t('nav.directory', 'EXPLORAR'), icon: Compass },
        { path: '/donate', label: t('nav.donate', 'DONAR'), icon: Heart },
        { path: '/library', label: t('nav.library', 'BIBLIOTECA'), icon: Library },
        { path: '/profile', label: t('nav.profile', 'PERFIL'), icon: User },
    ];

    if (userProfile?.role === 'admin') {
        navItems.push({ path: '/admin', label: t('nav.admin', 'ESTUDIO'), icon: PlusSquare });
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
