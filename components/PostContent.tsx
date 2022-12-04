import Link from "next/link";
import ReactMarkdown from "react-markdown";

import PostModel from "../models/PostModel";

type Props = {
    post: PostModel;
};

export default function PostContent({ post }: Props) {
    const createdAt = new Date(post.createdAt);

    return (
        <div className="card">
            <h1>{post?.title}</h1>
            <span className="text-sm">
                Written by{" "}
                <Link
                    href={`/${post.username}/`}
                    className="text-info"
                >
                    @{post.username}
                </Link>{" "}
                on {createdAt.toDateString()}
            </span>
            <ReactMarkdown>{post?.content}</ReactMarkdown>
        </div>
    );
}
