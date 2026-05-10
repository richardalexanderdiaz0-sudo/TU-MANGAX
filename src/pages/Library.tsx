import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function Library() {
    const { user } = useStore();
    const navigate = useNavigate();
    const [savedStories, setSavedStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchLibrary = async () => {
            const libRef = collection(db, `users/${user.uid}/library`);
            const snap = await getDocs(libRef);
            
            const storyPromises = snap.docs.map(async (d) => {
                const sDoc = await getDoc(doc(db, 'stories', d.data().storyId));
                return sDoc.exists() ? { id: sDoc.id, ...sDoc.data() } : null;
            });
            
            const stories = await Promise.all(storyPromises);
            setSavedStories(stories.filter(Boolean));
            setLoading(false);
        };

        fetchLibrary();
    }, [user, navigate]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
            <h1 className="text-3xl font-bold mb-8">Mi Biblioteca</h1>
            
            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div></div>
            ) : savedStories.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <p className="text-xl mb-4">Aún no tienes historias guardadas.</p>
                    <Link to="/directory" className="text-indigo-400 hover:text-indigo-300 font-medium">Explorar Historias</Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {savedStories.map(story => (
                        <Link 
                            key={story.id}
                            to={`/comic/${story.id}`} 
                            className="flex flex-col gap-2 group relative"
                        >
                            <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-slate-800 border border-slate-700">
                                <img 
                                    src={story.coverUrl || 'https://via.placeholder.com/300x450'} 
                                    alt={story.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{story.title}</h3>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
