import Link from "next/link";
import PostModel from "../models/PostModel";

export default function PostFeed({ posts, admin }: { posts: Array<PostModel>; admin: boolean }) {
    return posts ? (
        <>
            {posts.map((post) => (
                <PostItem
                    post={post}
                    key={post.slug}
                    admin={admin}
                />
            ))}
        </>
    ) : null;
}

function PostItem({ post, admin = false }: { post: PostModel; admin: boolean }) {
    const wordCount = post.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);

    return (
        <div className="card">
            <Link href={`/${post.username}`}>
                <strong>By @{post.username}</strong>
            </Link>

            <br />

            <div className="post-title">
                <Link href={`/${post.username}/${post.slug}`}>
                    <strong>{post.title}</strong>
                </Link>
            </div>

            <footer>
                <span>
                    {wordCount} words. {minutesToRead} min read
                </span>
                <span className="push-left">❤️ {post.heartCount} Hearts</span>
            </footer>
        </div>
    );
}
