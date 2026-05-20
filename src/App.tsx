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
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';
import Donate from './pages/Donate';
import Footer from './components/Footer';

function Layout() {
  const location = useLocation();
  const isReadingView = location.pathname.startsWith('/read/');

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
    </div>
  );
}

export default function App() {
  const { setUser, setAuthLoading } = useStore();

  useEffect(() => {
    setAuthLoading(true);
    let channel: any = null;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
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
        const mappedProfile = {
          display_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
          displayName: firebaseUser.displayName,
          role: firebaseUser.email === 'richardalexanderdiaz0@gmail.com' ? 'admin' : 'user',
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

