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
                                <button className="btn-blue">Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <button onClick={() => signOut(auth)}>Sign Out</button>
                        </li>
                        <li className="display-content">
                            {/* TODO: FIX THE FORMATTING ON THIS (why does the content hit the top of window??) */}
                            <Link
                                href={`/${username}`}
                                className="profile-img display-content"
                            >
                                <Image
                                    src={user && user.photoURL ? user.photoURL : "/anonymous.png"}
                                    alt="user profile picture"
                                    width={48}
                                    height={48}
                                    style={{ margin: "0.5rem 0" }}
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
