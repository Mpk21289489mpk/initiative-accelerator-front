import React, { useEffect, useState } from 'react';
import { userRoles } from '../../enums/userRoles';
import IUser from '../../interfaces/user';

export interface IUserProviderProps {
    children: React.ReactNode;
}

// Дефолтные параметры для гостя — никаких лишних запросов
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
    // Инициализация состояния из localStorage, с защитой от битого JSON
    const [state, dispatch] = useState<IUser>(() => {
        try {
            const stored = localStorage.getItem('userData');
            if (!stored) return defaultUserParams;
            return JSON.parse(stored);
        } catch (e) {
            console.error('[Auth] Error parsing localStorage data, resetting to defaults', e);
            return defaultUserParams;
        }
    });

    async function updateUserFromServer() {
        // ВАЖНО: используем process.env.API_URL (без префикса REACT_APP_)
        // Это значение должно быть задано в Vercel Dashboard → Settings → Environment Variables
        const apiUrl = process.env.API_URL;

        console.log('[Auth] API URL resolved to:', apiUrl);

        // Если переменная не подставилась (undefined) — вообще не делаем запрос.
        // Приложение останется в режиме гостя и НЕ станет белым.
        if (!apiUrl) {
            console.warn('[Auth] API_URL is missing. Running in safe guest mode.');
            return;
        }

        // Не делаем запрос, если токена нет
        if (!state.token) {
            return;
        }

        try {
            const resp = await fetch(`${apiUrl}/api/get_me/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            });

            // Обработка ошибок авторизации
            if (!resp.ok) {
                console.warn('[Auth] Server rejected token. Clearing session.');
                localStorage.clear();
                dispatch(defaultUserParams);
                return;
            }

            const user: IUser = await resp.json();
            dispatch(user);
            localStorage.setItem('userData', JSON.stringify(user));
        } catch (err) {
            // Сетевые ошибки (сервер недоступен, CORS и т.д.) — логируем, но НЕ ломаем рендер
            console.error('[Auth] Network error while fetching user, staying as guest', err);
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
