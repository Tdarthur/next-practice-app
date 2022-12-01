import { useState } from "react";
import { GetServerSideProps } from "next";
import { collectionGroup, getDocs, query, where, orderBy, limit, startAfter, Timestamp } from "firebase/firestore";

import { firestore, postToJSON } from "../lib/firebase";

import PostModel from "../models/PostModel";
import PostFeed from "../components/PostFeed";
import Loader from "../components/Loader";

/**
 * Max posts to query per page
 */
const POST_LIMIT = 10;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const postsQuery = query(
        collectionGroup(firestore, "posts"),
        where("published", "==", true),
        orderBy("createdAt", "desc"),
        limit(POST_LIMIT)
    );

    const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

    return { props: { originalPosts: posts } };
};

type Props = {
    originalPosts: PostModel[];
};

export default function Home({ originalPosts }: Props) {
    const [posts, setPosts] = useState(originalPosts);
    const [loading, setLoading] = useState(false);

    const [postsEnd, setPostsEnd] = useState(false);

    const getMorePosts = async () => {
        setLoading(true);

        const last = posts[posts.length - 1];

        const postsQuery = query(
            collectionGroup(firestore, "posts"),
            where("published", "==", true),
            orderBy("createdAt", "desc"),
            startAfter(Timestamp.fromMillis(last.createdAt)),
            limit(POST_LIMIT)
        );

        const newPosts = (await getDocs(postsQuery)).docs.map(postToJSON);

        setPosts([...posts, ...newPosts]);
        setLoading(false);

        if (newPosts.length < POST_LIMIT) {
            setPostsEnd(true);
        }
    };

    return (
        <main>
            <PostFeed
                posts={posts}
                admin={false}
            />

            {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

            <Loader show={loading} />

            {postsEnd && "You have reached the end!"}
        </main>
    );
}
