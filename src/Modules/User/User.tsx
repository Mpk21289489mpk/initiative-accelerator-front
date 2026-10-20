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

            // Берём URL из переменной окружения (обязательно с префиксом REACT_APP_)
            const baseUrl = process.env.REACT_APP_API_URL;
            const fallbackUrl = 'https://initiative-accelerator-server-black.vercel.app';
            const finalUrl = baseUrl || fallbackUrl;

            const endpoint = '/api/get_me'; 
            const url = `${finalUrl}${endpoint}`;

            try {
                const controller = new AbortController();
                // Таймаут: если сеть медленная, запрос принудительно оборвётся через 8 сек
                const timeoutId = setTimeout(() => controller.abort(), 8000); 

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Раскомментируй, когда будешь готов передавать реальный токен:
                        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    credentials: 'include',
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
