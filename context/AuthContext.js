// 'use client'
// import { auth, db } from '@/firebase'
// import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
// import { doc, getDoc, setDoc } from 'firebase/firestore'
// import React, { useContext, useState, useEffect } from 'react'


// const AuthContext = React.createContext()

// export function useAuth() {
//     return useContext(AuthContext)
// }

// export function AuthProvider({ children }) {
//     const [currentUser, setCurrentUser] = useState(null)
//     const [userDataObj, setUserDataObj] = useState(null)
//     const [loading, setLoading] = useState(true)

//     // AUTH HANDLERS
//     async function signup(email, password) {

//         const userCredential =  await createUserWithEmailAndPassword(auth, email, password)
//         const user = userCredential.user;

//         await setDoc(doc(db, 'users', user.uid), {
//             email: user.email,
//             createdAt: new Date(),
//             uid: user.uid,
//         });
//         return userCredential;
//     }

//     function login(email, password) {
//         return signInWithEmailAndPassword(auth, email, password)
//     }

//     function logout() {
//         setUserDataObj(null)
//         setCurrentUser(null)
//         return signOut(auth)
//     }

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async user => {
//             try {
//                 // Set the user to our local context state
//                 setLoading(true)
//                 setCurrentUser(user)
//                 if (!user) {
//                     console.log('No User Found')
//                     return
//                 }

//                 // if user exists, fetch data from firestore database
//                 console.log('Fetching User Data')
//                 const docRef = doc(db, 'users', user.uid);
//                 const docSnap = await getDoc(docRef);
//                 let firebaseData = {}
//                 if (docSnap.exists()) {
//                     console.log('Found User Data')
//                     firebaseData = docSnap.data()
//                 }
//                 setUserDataObj(firebaseData)
//             } catch (err) {
//                 console.log(err.message)
//             } finally {
//                 setLoading(false)
//             }
//         })
//         return unsubscribe
//     }, [])

//     const value = {
//         currentUser,
//         userDataObj,
//         setUserDataObj,
//         signup,
//         logout,
//         login,
//         loading
//     }

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

'use client';

import { auth, db } from '@/firebase';
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import React, { useContext, useState, useEffect } from 'react';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDataObj, setUserDataObj] = useState(null);
  const [loading, setLoading] = useState(true);

  // AUTH HANDLERS
  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore after signup
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
        uid: user.uid,
      });

      return userCredential;
    } catch (error) {
      console.error("Error during signup:", error.message);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error during login:", error.message);
      throw error;
    }
  }

  async function logout() {
    try {
      setUserDataObj(null);
      setCurrentUser(null);
      return await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error.message);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        setCurrentUser(user);

        if (!user) {
          console.log('No User Found');
          setUserDataObj(null);
          return;
        }

        console.log('Fetching User Data...');
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log('User Data Found:', docSnap.data());
          setUserDataObj(docSnap.data());
        } else {
          console.log('No User Data Found in Firestore');
          setUserDataObj(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userDataObj,
    setUserDataObj,
    signup,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}