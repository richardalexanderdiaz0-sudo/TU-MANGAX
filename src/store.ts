import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AppState {
    user: User | null;
    userProfile: any | null;
    authLoading: boolean;
    setUser: (user: User | null, profile?: any | null) => void;
    setAuthLoading: (loading: boolean) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
    user: null,
    userProfile: null,
    authLoading: true,
    setUser: (user, profile = null) => set({ user, userProfile: profile }),
    setAuthLoading: (loading) => set({ authLoading: loading }),
    sidebarOpen: false,
    setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen })
}));
