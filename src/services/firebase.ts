import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, query, collection, where, getDocs, updateDoc, increment, addDoc, orderBy, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD4t6Tq1bAell9u6V8UcErv1Ee4gFo78y0",
  authDomain: "nexusapp-c0a21.firebaseapp.com",
  databaseURL: "https://nexusapp-c0a21-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nexusapp-c0a21",
  storageBucket: "nexusapp-c0a21.firebasestorage.app",
  messagingSenderId: "487113661451",
  appId: "1:487113661451:web:d8407d9235631b7fc6fb0e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        // Ensure user profile exists
        const userDocRef = doc(db, 'users', result.user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                email: result.user.email,
                role: result.user.email === 'richardalexanderdiaz0@gmail.com' ? 'admin' : 'user',
                displayName: result.user.displayName || 'Usuario',
                createdAt: new Date(),
            });
        }
    } catch (error) {
        console.error("Login failed:", error);
    }
}

export const logout = () => signOut(auth);
