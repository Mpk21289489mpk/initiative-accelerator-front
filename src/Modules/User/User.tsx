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
    token: '', // пустой вместо 'default' — это сразу отсекает лишние запросы
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
        const apiUrl = process.env.REACT_APP_API_URL;

        // Если переменная не задана — вообще не делаем запрос
        if (!apiUrl) {
            console.warn('REACT_APP_API_URL is not set. Skipping user fetch.');
            return;
        }

        // Не делаем запрос, если токена нет
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
                // При ошибке авторизации — сбрасываем состояние, но не ломаем рендер
                console.warn('Auth failed, clearing session');
                localStorage.clear();
                dispatch(defaultUserParams);
                return;
            }

            const user: IUser = await resp.json();
            dispatch(user);
            localStorage.setItem('userData', JSON.stringify(user));
        } catch (err) {
            // Сетевые ошибки (сервер недоступен) — просто логируем, не сбрасываем данные
            console.error('Failed to fetch user:', err);
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

