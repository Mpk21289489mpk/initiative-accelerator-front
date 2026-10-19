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
    token: '',
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
    const [state, dispatch] = useState<IUser>(defaultUserParams);

    // Упрощаем: вообще не трогаем localStorage и не делаем запросы, пока не увидим интерфейс
    useEffect(() => {
        console.log('[Auth] Minimal provider started. No API calls yet.');
    }, []);

    return (
        <globalUserContext.Provider value={{ userParams: state, UpdateUser: dispatch }}>
            {props.children}
        </globalUserContext.Provider>
    );
};

export const useGlobalUserState = () => {
    return React.useContext(globalUserContext);
};
