import { create } from 'zustand';

export type Lang = 'es' | 'en' | 'fr' | 'ko' | 'zh' | 'th';

interface AppState {
    user: any | null;
    userProfile: any | null;
    authLoading: boolean;
    setUser: (user: any | null, profile?: any | null) => void;
    setAuthLoading: (loading: boolean) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
    language: Lang;
    setLanguage: (lang: Lang) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const savedLang = (localStorage.getItem('app_language') as Lang) || 'es';
const savedTheme = (localStorage.getItem('app_theme') as 'light' | 'dark') || 'dark';

// Also initialize theme on body loads
if (typeof document !== 'undefined') {
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    }
}

export const useStore = create<AppState>((set) => ({
    user: null,
    userProfile: null,
    authLoading: true,
    setUser: (user, profile = null) => set({ user, userProfile: profile }),
    setAuthLoading: (loading) => set({ authLoading: loading }),
    sidebarOpen: false,
    setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
    language: savedLang,
    setLanguage: (lang) => {
        localStorage.setItem('app_language', lang);
        set({ language: lang });
    },
    theme: savedTheme,
    setTheme: (theme) => {
        localStorage.setItem('app_theme', theme);
        if (typeof document !== 'undefined') {
            if (theme === 'light') {
                document.documentElement.classList.add('light');
                document.documentElement.classList.remove('dark');
            } else {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
            }
        }
        set({ theme });
    }
}));
