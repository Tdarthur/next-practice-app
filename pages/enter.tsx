import { useContext, useEffect, useState, useMemo, ChangeEvent, FormEvent } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import Image from "next/image";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";

import { auth, googleAuthProvider, firestore } from "../lib/firebase";
import { UserContext } from "../lib/context";

export default function EnterPage() {
    const { user, username } = useContext(UserContext);

    return <main>{!user ? <SignInButton /> : <>{!username ? <UsernameForm /> : <SignOutButton />}</>}</main>;
}

function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    };

    return (
        <button
            className="btn-google"
            onClick={signInWithGoogle}
        >
            <Image
                src="/google.png"
                alt="Google logo"
                width={32}
                height={32}
            />{" "}
            Sign in with Google
        </button>
    );
}

function SignOutButton() {
    return <button onClick={() => signOut(auth)}>Sign Out</button>;
}

function UsernameForm() {
    const [formValue, setFormValue] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        setFormValue(val);

        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    // hit the database for username match after each debounced changed
    const checkUsername = useMemo(
        () =>
            debounce(async (username: string) => {
                if (username.length >= 3) {
                    const ref = doc(firestore, "usernames", username);
                    const documentSnapshot = await getDoc(ref);

                    console.log("Firestore read executed");

                    setIsValid(!documentSnapshot || !documentSnapshot.exists());
                    setLoading(false);
                }
            }, 500),
        []
    );

    useEffect(() => {
        checkUsername(formValue);
    }, [checkUsername, formValue]);

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const userDoc = doc(firestore, "users", user ? user.uid : "");
        const usernamesDoc = doc(firestore, "usernames", formValue);

        const batch = writeBatch(firestore);
        batch.set(userDoc, {
            username: formValue,
            photoURL: user?.photoURL,
            displayName: user?.displayName
        });
        batch.set(usernamesDoc, { uid: user?.uid });

        try {
            batch.commit();
        } catch (error) {
            console.error("Failed to register username", error);
            toast.error("Failed to register username, try again");
        }
    }

    return !username ? (
        <section>
            <h3>Choose Username</h3>
            <form onSubmit={onSubmit}>
                <input
                    name="username"
                    placeholder="username"
                    value={formValue}
                    onChange={onChange}
                />

                <UsernameMessage
                    username={formValue}
                    isValid={isValid}
                    loading={loading}
                />

                <button
                    type="submit"
                    className="btn-green"
                    disabled={!isValid}
                >
                    Choose
                </button>

                <h3>Debug State</h3>
                <div>
                    Username: {formValue}
                    <br />
                    Loading: {loading.toString()}
                    <br />
                    Username Valid: {isValid.toString()}
                </div>
            </form>
        </section>
    ) : (
        <></>
    );
}

function UsernameMessage({ username, isValid, loading }: { username: string; isValid: boolean; loading: boolean }) {
    if (username.length === 0) {
        return <></>;
    }

    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username.length < 3) {
        return <p className="text-info">Username must be longer than 3 characters.</p>;
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>;
    }

    console.error("unexpected username condition");
    return null;
}
