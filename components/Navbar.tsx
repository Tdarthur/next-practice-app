import { useContext } from "react";
import { signOut } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";

import { auth } from "../lib/firebase";
import { UserContext } from "../lib/context";

export default function Navbar() {
    const { user, username } = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">FEED</button>
                    </Link>
                </li>

                {/* user is signed in and has a username */}
                {username && (
                    <>
                        <li className="push-left">
                            <Link href="/admin">
                                <button className="btn-blue">
                                    Write Posts
                                </button>
                            </Link>
                        </li>
                        <li>
                            <button onClick={() => signOut(auth)}>
                                Sign Out
                            </button>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <Image
                                    src={
                                        user && user.photoURL
                                            ? "/anonymous.png"
                                            : "/anonymous.png"
                                    }
                                    alt="user profile picture"
                                    width={64}
                                    height={64}
                                />
                            </Link>
                        </li>
                    </>
                )}

                {/* user is not signed is OR has not created a username */}
                {!username && (
                    <li>
                        <Link href={`/enter`}>
                            <button className="btn-blue">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
