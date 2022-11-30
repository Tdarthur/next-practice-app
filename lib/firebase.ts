import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC38S5YbLgRR-kbhp2pFXK9tgASvJo6myU",
    authDomain: "tyler-next.firebaseapp.com",
    projectId: "tyler-next",
    storageBucket: "tyler-next.appspot.com",
    messagingSenderId: "492124925591",
    appId: "1:492124925591:web:38b35045d83faf35b183d2",
    measurementId: "G-489D3HDCML"
};

if (!getApps().length) {
    initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore();
export const storage = getStorage();
