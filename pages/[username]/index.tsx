import { GetServerSideProps } from "next";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";

import { getUserWithUsername, postToJSON } from "../../lib/firebase";

import UserModel from "../../models/UserModel";
import PostModel from "../../models/PostModel";

import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import Metatags from "../../components/Metatags";

/**
 * Max posts to query per page
 */
const POST_LIMIT = 5;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { username } = context.query;

    const userDocument = await getUserWithUsername(username as string);

    if (!userDocument) {
        return { notFound: true };
    }

    let user: UserModel | null = null;
    let posts: PostModel[] | null = null;

    if (userDocument) {
        user = userDocument.data();

        const postsQuery = query(
            collection(userDocument.ref, "posts"),
            where("published", "==", true),
            orderBy("createdAt", "desc"),
            limit(POST_LIMIT)
        );

        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }

    return {
        props: { user, posts }
    };
};

type Props = {
    user: UserModel;
    posts: Array<PostModel>;
};

export default function UserProfilePage({ user, posts }: Props) {
    return (
        <main>
            <Metatags
                title={`${user.username}`}
                description={`profile of ${user.username}`}
                image={user.photoURL || undefined}
            />
            {user ? (
                <>
                    <UserProfile user={user} />
                    <PostFeed
                        posts={posts}
                        admin={false}
                    />
                </>
            ) : (
                <h1 className="text-danger">
                    User <i>{user}</i> not found
                </h1>
            )}
        </main>
    );
}
