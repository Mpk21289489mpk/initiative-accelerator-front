import React, { Children, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { userRoles } from '../../enums/userRoles';
import IUser from '../../interfaces/user';

export interface IUserProviderProps {
    children: React.ReactNode;
}

export let defaultUserParams: IUser = {
    name: "default",
    surname: "default",
    email: "default",
    id: "default",
    token: "default",
    role: userRoles.default,
    birth: new Date("2000-01-01"),
    edu_group: null,
    avatarURI: null,
    score: 0,
    email_verified: 0,
    notifs_checked: 1
};

export interface IUserContext {
    userParams: IUser;
    UpdateUser: Dispatch<SetStateAction<IUser>>;
}

export const globalUserContext = React.createContext<IUserContext>({
    userParams: defaultUserParams,
    UpdateUser: () => {}
});

export const GlobalUserStateContextProvider = (props: IUserProviderProps) => {
    if (!!localStorage.getItem("userData")) {
        defaultUserParams = JSON.parse(localStorage.getItem("userData")!);
    }

    const [state, dispatch] = useState<IUser>(defaultUserParams);

    async function updateUserFromServer() {
        try {
            const resp = await fetch(
                `\${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_me/`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer \${state.token}`
                    }
                }
            );

            if (!resp.ok) {
                localStorage.clear();
                return;
            }

            const user: IUser = await resp.json();
            if (JSON.stringify(state) !== JSON.stringify(user)) {
                dispatch(user);
                localStorage.setItem("userData", JSON.stringify(user));
            }
        } catch (err) {
            localStorage.clear();
        }
    }

    useEffect(() => {
        updateUserFromServer();
    }, );

    return (
        <globalUserContext.Provider value={{ userParams: state, UpdateUser: dispatch }}>
            {props.children}
        </globalUserContext.Provider>
    );
};

export const useGlobalUserState = () => {
    return React.useContext(globalUserContext);
};
