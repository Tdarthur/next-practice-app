import { useState, useEffect } from "react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, firestore } from "../lib/firebase";

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // turn off realtime subscription
        let unsubscribe;

        if (user) {
            const ref = doc(firestore, "users", user.uid);
            unsubscribe = onSnapshot(ref, (userDocument) => {
                setUsername(userDocument.data()?.username);
            });
        } else {
            setUsername(null);
        }

        return unsubscribe;
    }, [user]);

    return { user, username };
}
