/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { supabase } from './services/supabase';
import { useStore } from './store';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Directory from './pages/Directory';
import ComicDetail from './pages/ComicDetail';
import ReadingView from './pages/ReadingView';
import AdminStudio from './pages/AdminStudio';
import Library from './pages/Library';
import Profile from './pages/Profile';
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
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setAuthLoading(true);

        try {
          // Obtener el perfil del usuario desde Supabase
          const { data: userDoc, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.uid)
            .single();

          if (userDoc && !error) {
            setUser(currentUser, userDoc);
          } else {
            // Si el documento no existe (aún), damos un perfil básico temporal basado en el correo
            setUser(currentUser, {
              email: currentUser.email,
              role: currentUser.email === 'richardalexanderdiaz0@gmail.com' ? 'admin' : 'user',
              display_name: currentUser.displayName || currentUser.email?.split('@')[0],
              created_at: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.error("Excepción al obtener perfil de Supabase:", e);
          setUser(currentUser, {
              email: currentUser.email,
              role: currentUser.email === 'richardalexanderdiaz0@gmail.com' ? 'admin' : 'user',
              display_name: currentUser.displayName || currentUser.email?.split('@')[0],
              created_at: new Date().toISOString(),
          });
        }
        setAuthLoading(false);
      } else {
        setUser(null, null);
        setAuthLoading(false);
      }
    });

    return () => {
      unsubAuth();
    };
  }, [setUser, setAuthLoading]);

  return (
    <Router>
      <Layout />
    </Router>
  );
}
