import React, { useState, createContext, useEffect, PropsWithChildren } from "react";
import axios from "axios";
import { UserInterface } from "./Interfaces/Interfaces";

export const myContext = createContext<Partial<UserInterface>>({});

export default function Context(props: PropsWithChildren<any>) {
    const [user, setUser] = useState<UserInterface>();

    useEffect(() => {
       axios.get("http://localhost:4200/user", {withCredentials: true}).then(res => {
        if(res.data) {
            setUser(res.data)
        }
       }).catch(err => console.log(err))
    }, []);
    return <myContext.Provider value={user!}>{props.children}</myContext.Provider>
}
