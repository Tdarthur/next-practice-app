import Link from "next/link";
import Image from "next/image";

export default function Navbar({}) {
    const user: { username: string | null; photoURL: string | null } = {
        username: "billy",
        photoURL: null
    };

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">FEED</button>
                    </Link>
                </li>

                {/* user is sign in and has a username */}
                {user.username && (
                    <>
                        <li className="push-left">
                            <Link href="/admin">
                                <button className="btn-blue">
                                    Write Posts
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${user.username}`}>
                                <Image
                                    src={
                                        user.photoURL !== null
                                            ? user.photoURL
                                            : ""
                                    }
                                    alt="user profile picture"
                                />
                            </Link>
                        </li>
                    </>
                )}

                {/* user is not signed is OR has not created a username */}
                {!user.username && (
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
