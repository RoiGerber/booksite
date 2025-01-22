// src/hooks/useUserRole.js
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user role from Firestore using email as the document ID
        const userDoc = await getDoc(doc(db, 'usersDB', user.email));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role); // Set the user's role
        } else {
          console.log('User role not found in Firestore');
        }
      } else {
        setUserRole(null); // No user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return userRole;
};

export default useUserRole;