import Image from "next/image";

import UserModel from "../models/UserModel";

export default function UserProfile({ user }: { user: UserModel }) {
    return (
        <div className="box-center">
            <span className="card-img-center profile-img">
                <Image
                    src={user.photoURL && user.photoURL.trim() !== "" ? user.photoURL : "/anonymous.png"}
                    alt="user profile photo"
                    fill
                />
            </span>

            <p>
                <i>@{user.username}</i>
            </p>

            <h1>{user.displayName}</h1>
        </div>
    );
}
