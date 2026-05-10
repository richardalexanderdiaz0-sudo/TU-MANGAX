import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AppState {
    user: User | null;
    userProfile: any | null;
    setUser: (user: User | null, profile?: any | null) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
    user: null,
    userProfile: null,
    setUser: (user, profile = null) => set({ user, userProfile: profile }),
    sidebarOpen: false,
    setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen })
}));
