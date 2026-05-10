/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { auth, db } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useStore } from './store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Directory from './pages/Directory';
import ComicDetail from './pages/ComicDetail';
import ReadingView from './pages/ReadingView';
import AdminStudio from './pages/AdminStudio';
import Library from './pages/Library';

export default function App() {
  const { setUser } = useStore();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Subscribe to profile changes
        const unsubProfile = onSnapshot(doc(db, 'users', currentUser.uid), (userDoc) => {
          setUser(currentUser, userDoc.exists() ? userDoc.data() : null);
        });
        return () => unsubProfile();
      } else {
        setUser(null, null);
      }
    });
    return () => unsubAuth();
  }, [setUser]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/comic/:id" element={<ComicDetail />} />
            <Route path="/read/:storyId/:chapterId" element={<ReadingView />} />
            <Route path="/admin/*" element={<AdminStudio />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
