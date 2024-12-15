// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCr0L7zro2GvMl9zfxGeyOMsfDFqPfWk0E",
    authDomain: "broodle-44a48.firebaseapp.com",
    projectId: "broodle-44a48",
    storageBucket: "broodle-44a48.firebasestorage.app",
    messagingSenderId: "177519056347",
    appId: "1:177519056347:web:bffbec752cc847ce46c3fe",
    measurementId: "G-7MZ01RKP93"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };
