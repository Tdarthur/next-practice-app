import { createContext } from "react";
import { User } from "firebase/auth";

export const UserContext = createContext<UserContextData>({
    user: null,
    username: null
});

interface UserContextData {
    user: User | null | undefined;
    username: string | null;
}
