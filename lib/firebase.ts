import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
    getFirestore,
    getDocs,
    collection,
    query,
    where,
    limit,
    QueryDocumentSnapshot,
    DocumentSnapshot,
    Timestamp
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

import UserModel from "../models/UserModel";
import PostModel from "../models/PostModel";

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

// #region helper functions

/**
 * Queries the user collection for a user with the specified username.
 *
 * @param username the username used to query the user
 * @returns a document snapshot of the user associated with the specified username
 */
export async function getUserWithUsername(username: string) {
    const usersRef = collection(firestore, "users");
    const usernameQuery = query(usersRef, where("username", "==", username), limit(1));
    const userDocument = (await getDocs(usernameQuery)).docs[0];

    return userDocument as QueryDocumentSnapshot<UserModel>;
}

/**
 * Converts a post snapshot into a usable PostModel object.
 *
 * @param snapshot a snapshot of a document containing a post
 * @returns the document containing the post
 */
export function postToJSON(snapshot: DocumentSnapshot) {
    const data = snapshot.data() as { createdAt: Timestamp; updatedAt: Timestamp };

    return {
        ...data,
        createdAt: data?.createdAt.toMillis(),
        updatedAt: data?.updatedAt.toMillis()
    } as PostModel;
}

// #endregion
