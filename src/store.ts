import { create } from 'zustand';

interface AppState {
    user: any | null;
    userProfile: any | null;
    authLoading: boolean;
    setUser: (user: any | null, profile?: any | null) => void;
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
