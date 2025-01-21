import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCXDoXNmOuPb6s4akXPmxc2YcsCfRdKbpc",
    authDomain: "dr-snap-4713d.firebaseapp.com",
    projectId: "dr-snap-4713d",
    storageBucket: "dr-snap-4713d.firebasestorage.app",
    messagingSenderId: "895357261382",
    appId: "1:895357261382:web:6f4fc03758d1d10303dc47",
    measurementId: "G-KWM9K7JE7C"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
