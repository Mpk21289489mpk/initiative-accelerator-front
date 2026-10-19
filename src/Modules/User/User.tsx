import React, { useEffect, useState } from 'react';
import { userRoles } from '../../enums/userRoles';
import IUser from '../../interfaces/user';

export interface IUserProviderProps {
    children: React.ReactNode;
}

export const defaultUserParams: IUser = {
    name: 'guest',
    surname: '',
    email: '',
    id: '',
    token: '', // Пустая строка — гарантия, что не полетит запрос с мусором
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
            console.error('Error parsing localStorage', e);
            return defaultUserParams;
        }
    });

    async function updateUserFromServer() {
        // ВАЖНО: используем API_URL (без префикса REACT_APP_) — это то, что ты задашь в Vercel
        const apiUrl = process.env.API_URL;

        console.log('[Auth] API URL resolved to:', apiUrl);

        if (!apiUrl) {
            console.warn('[Auth] API_URL is missing. Skipping user fetch.');
            return;
        }

        if (!state.token) {
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
                console.warn('[Auth] Auth failed, clearing session.');
                localStorage.clear();
                dispatch(defaultUserParams);
                return;
            }

            const user: IUser = await resp.json();
            dispatch(user);
            localStorage.setItem('userData', JSON.stringify(user));
        } catch (err) {
            console.error('[Auth] Failed to fetch user:', err);
        }
    }

    useEffect(() => {
        updateUserFromServer();
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
