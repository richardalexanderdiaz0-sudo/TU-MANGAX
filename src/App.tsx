/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from './store';
import { api } from './services/api';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { initializeRealtimeNotifications } from './services/notifications';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Directory from './pages/Directory';
import ComicDetail from './pages/ComicDetail';
import ReadingView from './pages/ReadingView';
import AdminStudio from './pages/AdminStudio';
import Library from './pages/Library';
import Profile from './pages/Profile';
import AuthorProfile from './pages/AuthorProfile';
import AndroidAnnouncement from './pages/AndroidAnnouncement';
import SocialsAnnouncement from './pages/SocialsAnnouncement';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';
import Donate from './pages/Donate';
import Footer from './components/Footer';
import JuanCarlosVIPModal from './components/JuanCarlosVIPModal';
import PreferencesModal from './components/PreferencesModal';
import { supabase } from './services/supabase';

function Layout() {
  const location = useLocation();
  const isReadingView = location.pathname.startsWith('/read/');

  useEffect(() => {
    // Lift suspension for all users
    const unSuspendAll = async () => {
      try {
        await supabase
          .from('users')
          .update({ is_suspended: false })
          .eq('is_suspended', true);
      } catch (err) {}
    };
    unSuspendAll();
  }, []);

  return (
    <div className="min-h-screen bg-background text-slate-800 font-sans flex flex-col">
      {!isReadingView && <Navbar />}
      <main className={`flex-1 flex flex-col ${!isReadingView ? 'pb-16 md:pb-0' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/comic/:id" element={<ComicDetail />} />
          <Route path="/read/:storyId/:chapterId" element={<ReadingView />} />
          <Route path="/author/:name" element={<AuthorProfile />} />
          <Route path="/android-announcement" element={<AndroidAnnouncement />} />
          <Route path="/socials" element={<SocialsAnnouncement />} />
          <Route path="/admin/*" element={<AdminStudio />} />
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/donate" element={<Donate />} />
        </Routes>
      </main>
      {!isReadingView && <Footer />}
      {!isReadingView && <BottomNav />}
      
      <JuanCarlosVIPModal />
      <PreferencesModal />
    </div>
  );
}

export default function App() {
  const { setUser, setAuthLoading } = useStore();

  useEffect(() => {
    setAuthLoading(true);
    let channel: any = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Unsubscribe existing registration on status switch
      if (channel) {
        channel.unsubscribe();
        channel = null;
      }

      if (firebaseUser) {
        const mappedUser = {
          uid: firebaseUser.uid,
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          avatar: firebaseUser.photoURL, // mapear para que user.avatar obtenga la foto de google
        };

        let profileData = null;
        try {
          // Ensure they exist in supabase so we can get their roles and suspension status
          await api.auth.me(); 
          profileData = await api.auth.getUserProfile(firebaseUser.uid);
        } catch (e) {
          console.error("Error fetching user profile", e);
        }

        const mappedProfile = {
          ...profileData,
          display_name: profileData?.display_name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
          displayName: firebaseUser.displayName,
          role: firebaseUser.email === 'richardalexanderdiaz0@gmail.com' ? 'admin' : (profileData?.role || 'user'),
          is_suspended: profileData?.is_suspended || false
        };

        setUser(mappedUser, mappedProfile);

        // Iniciar suscripción para notificaciones sobre nuevos capítulos
        setTimeout(() => {
          channel = initializeRealtimeNotifications();
        }, 1200);
      } else {
        setUser(null, null);
      }
      setAuthLoading(false);
    });

    return () => {
      unsubscribe();
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [setUser, setAuthLoading]);

  return (
    <Router>
      <Layout />
    </Router>
  );
}

