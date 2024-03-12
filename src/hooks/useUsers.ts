import { useState,  } from "react";
import {  setUserToLs } from "../utils/storage";

export type User = {
    name: string;
    password: string;
    auth: number;
}

export const useUser = () => {
    const [user, setUser] = useState<User>({ name: "visitor", password: "000000", auth: 0 });



    const updateUser = (newUser: User) => {
        setUserToLs(newUser);
        setUser(newUser);
    };

    return { user, updateUser };
};
