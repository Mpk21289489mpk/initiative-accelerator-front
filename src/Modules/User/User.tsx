import React, { useEffect, useState } from 'react';
import { userRoles } from '../../enums/userRoles';
import IUser from '../../interfaces/user';

export interface IUserProviderProps {
    children: React.ReactNode;
}

export const defaultUserParams: IUser = {
    name: 'default',
    surname: 'default',
    email: 'default',
    id: 'default',
    token: 'default',
    role: userRoles.default,
    birth: new Date('2000-01-01'),
    edu_group: null,
    avatarURI: null,
    score: 0,
    email_verified: 0,
    notifs_checked: 1
};

export interface IUserContext {
    userParams: IUser;
    UpdateUser: React.Dispatch<React.SetStateAction<IUser>>;
}

export const globalUserContext = React.createContext<IUserContext>({
    userParams: defaultUserParams,
    UpdateUser: () => {}
});

export const GlobalUserStateContextProvider = (props: IUserProviderProps) => {
    const [state, dispatch] = useState<IUser>(() => {
        try {
            const stored = localStorage.getItem('userData');
            return stored ? JSON.parse(stored) : defaultUserParams;
        } catch (e) {
            return defaultUserParams;
        }
    });

    async function updateUserFromServer() {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
            console.warn('REACT_APP_API_URL is not set');
            return;
        }

        try {
            const resp = await fetch(
                `${apiUrl}/api/get_me/`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                }
            );

            if (!resp.ok) {
                localStorage.clear();
                return;
            }

            const user: IUser = await resp.json();
            dispatch(user);
            localStorage.setItem('userData', JSON.stringify(user));
        } catch (err) {
            console.error('Failed to fetch user:', err);
            localStorage.clear();
        }
    }

    useEffect(() => {
        if (state.token && state.token !== 'default') {
            updateUserFromServer();
        }
    }, [state.token]);

    return (
        <globalUserContext.Provider value={{ userParams: state, UpdateUser: dispatch }}>
            {props.children}
        </globalUserContext.Provider>
    );
};

export const useGlobalUserState = () => {
    return React.useContext(globalUserContext);
};
