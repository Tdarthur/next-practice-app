import Link from "next/link";

import Loader from "../../components/Loader";

export default function User({}) {
    return (
        <main>
            <Loader show />
            <Link
                prefetch
                href={{
                    pathname: "/[username]",
                    query: { username: "tyler" }
                }}
            >
                {"Tyler's Profile"}
            </Link>
        </main>
    );
}
