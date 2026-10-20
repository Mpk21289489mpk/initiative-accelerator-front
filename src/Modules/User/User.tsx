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
    loading: boolean;
    error: string | null;
}

export const globalUserContext = React.createContext<IUserContext>({
    userParams: defaultUserParams,
    UpdateUser: () => {},
    loading: true,
    error: null
});

export const GlobalUserStateContextProvider = (props: IUserProviderProps) => {
    const [state, setState] = useState<IUser>(defaultUserParams);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchUser = async () => {
            setLoading(true);
            setError(null);

            // 1. Берём базовый URL из переменной окружения.
            // Если её нет (локально без .env), используем твой домен по умолчанию.
            const baseUrl = process.env.REACT_APP_API_URL || 'https://initiative-accelerator-server-black.vercel.app';
            
            // 2. ВАЖНО: Это тот самый путь, который соответствует файлу api/get_me.ts
            const endpoint = '/api/get_me'; 
            const url = `${baseUrl}${endpoint}`;

            try {
                const controller = new AbortController();
                // Таймаут: если сеть на телефоне медленная, запрос принудительно оборвётся через 8 сек
                const timeoutId = setTimeout(() => controller.abort(), 8000); 

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Раскомментируй, если у тебя токен лежит в localStorage:
                        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    credentials: 'include', // Важно для куки-авторизации
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data: IUser = await response.json();

                if (isMounted) {
                    setState(data);
                }
            } catch (err) {
                console.error('[Auth] Ошибка загрузки пользователя:', err);
                if (isMounted) {
                    // ГЛАВНОЕ: даже при ошибке мы снимаем лоадер, чтобы не было белого экрана
                    setError('Не удалось загрузить профиль. Проверьте соединение или попробуйте позже.');
                    setLoading(false);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <globalUserContext.Provider value={{
            userParams: state,
            UpdateUser: setState,
            loading,
            error
        }}>
            {props.children}
        </globalUserContext.Provider>
    );
};

export const useGlobalUserState = () => {
    return React.useContext(globalUserContext);
};
