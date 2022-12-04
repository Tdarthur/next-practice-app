import { GetStaticPaths, GetStaticProps } from "next";
import { doc, getDoc, getDocs, collectionGroup } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";

import PostModel from "../../models/PostModel";

import PostContent from "../../components/PostContent";
import Metatags from "../../components/Metatags";

const REVALIDATE_INTERVAL = 6000;

export const getStaticProps: GetStaticProps = async (context) => {
    const { username, slug } = context.params!;
    const userDocument = await getUserWithUsername(username as string);

    let serverPost = null;
    let path;

    if (userDocument) {
        const postRef = doc(firestore, userDocument.ref.path, "posts", slug as string);
        const postDocument = await getDoc(postRef);

        if (!postDocument.exists()) {
            return { notFound: true };
        }

        serverPost = postToJSON(postDocument);

        path = postRef.path;
    } else {
        return { notFound: true };
    }

    return { props: { serverPost, path }, revalidate: REVALIDATE_INTERVAL };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getDocs(collectionGroup(firestore, "posts"));

    const paths = posts.docs.map((post) => {
        const { slug, username } = post.data();
        return { params: { username, slug } };
    });

    return {
        paths,
        fallback: "blocking"
    };
};

type Props = {
    serverPost: PostModel;
    path: string;
    paths: { username: string; slug: string }[];
};

export default function Post({ serverPost, path, paths }: Props) {
    const postRef = doc(firestore, path);
    const [realtimePost] = useDocumentData(postRef);

    let post: PostModel | null = serverPost;
    if (realtimePost) {
        realtimePost.createdAt = realtimePost.createdAt.toMillis();
        post = realtimePost as PostModel;
    }

    return post ? (
        <main className="post-container">
            <Metatags
                title={serverPost.title}
                description={`post by ${serverPost.username}`}
            />

            <section>
                <PostContent post={post} />
            </section>

            <aside className="card">
                <p>
                    <strong>{post.heartCount || 0} ❤️</strong>
                </p>
            </aside>
        </main>
    ) : (
        <h1>Failed to load</h1>
    );
}
