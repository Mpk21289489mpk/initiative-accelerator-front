import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import IUser from "../../interfaces/user";
import CheckModerator from "../../Modules/Check/CheckModerator";
import { useGlobalUserState } from "../../Modules/User/User";

interface Option {
    label: string;
    value: string;
}

function AddPrivateInitiativePage() {
    const currentUser = useGlobalUserState();
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [countOfUsers, setCountOfUsers] = useState(1);

    // Исправлено: явно указываем, что это массивы
    const [usersOptions, setUsersOptions] = useState<Option[] | null>(null);
    const [selectedValues, setSelectedValues] = useState<(Option | null)[]>([]);

    const titleRef = useRef<HTMLInputElement | null>(null);
    const incomeRef = useRef<HTMLInputElement | null>(null);
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    const completeDayRef = useRef<HTMLInputElement | null>(null);
    const completeTimeRef = useRef<HTMLInputElement | null>(null);
    const categoryRef = useRef<HTMLSelectElement | null>(null);

    useEffect(() => {
        if (!currentUser.userParams.token || currentUser.userParams.token === "default") {
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL}/api/get_all_users/`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ token: currentUser.userParams.token })
        })
            .then((res) => res.json())
            // ИСПРАВЛЕНО: response — это массив пользователей
            .then((response: IUser[]) => {
                const options: Option[] = response.map((user) => ({
                    label: `${user.name} ${user.surname} (${user.email})`,
                    value: JSON.stringify(user)
                }));
                setUsersOptions(options);

                // При загрузке данных инициализируем selectedValues пустыми значениями
                setSelectedValues(Array(countOfUsers).fill(null));
            })
            .catch((err) => {
                console.error("Ошибка загрузки пользователей:", err);
                setUsersOptions([]);
                setSelectedValues(Array(countOfUsers).fill(null));
            });
    }, [currentUser.userParams.token, countOfUsers]);

    // Пересоздаём массив selectedValues при изменении countOfUsers
    useEffect(() => {
        setSelectedValues((prev) => {
            const newValues = [...prev];
            if (newValues.length < countOfUsers) {
                return [...newValues, ...Array(countOfUsers - newValues.length).fill(null)];
            } else if (newValues.length > countOfUsers) {
                return newValues.slice(0, countOfUsers);
            }
            return newValues;
        });
    }, [countOfUsers]);

    const handleSelectChange = (value: Option | null, index: number) => {
        const newValues = [...selectedValues];
        newValues[index] = value;
        setSelectedValues(newValues);
    };

    const createInitiative = () => {
        const validUsers = selectedValues.filter((v) => v && v.value !== "");

        if (!titleRef.current?.value || validUsers.length === 0) {
            alert("Не выполнено, проверьте корректность заполнения полей!");
            setBtnDisabled(false);
            return;
        }

        const initiativeData = {
            token: currentUser.userParams.token,
            title: titleRef.current.value,
            income: incomeRef.current?.value,
            take_deadline: Date.now() - 1000,
            complete_deadline: new Date(
                `${completeDayRef.current?.value} ${completeTimeRef.current?.value}`
            ).getTime(),
            content: contentRef.current?.value,
            category: categoryRef.current?.value,
            isPrivate: true,
            users_limit: validUsers.length
        };

        fetch(`${process.env.REACT_APP_API_URL}/api/add_initiative/`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(initiativeData)
        })
            .then((res) => res.json())
            .then((response: any) => {
                const initiativeId = response.id;
                const promises = validUsers.map((selectedUser) => {
                    const user = JSON.parse(selectedUser.value);
                    return fetch(`${process.env.REACT_APP_API_URL}/api/start_initiative/`, {
                        headers: { "Content-Type": "application/json" },
                        method: "POST",
                        body: JSON.stringify({ token: user.token, initiative_id: initiativeId })
                    });
                });

                return Promise.all(promises);
            })
            .then(() => {
                alert("Создано и назначено пользователям!");
                window.location.reload();
            })
            .catch((err) => {
                console.error(err);
                alert("Ошибка при создании инициативы");
                setBtnDisabled(false);
            });
    };

    return (
        <CheckModerator>
            <div className="py-3">
                <div className="row g-2">
                    <div className="col-md-6 col-12">
                        <div className="row g-2">
                            <div className="col-12 col-md-6">
                                <div className="form-floating mb-3 text-dark">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="floatingInput"
                                        placeholder="Заголовок"
                                        ref={titleRef}
                                    />
                                    <label htmlFor="floatingInput">Заголовок</label>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="form-floating mb-3 text-dark">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="floatingInput"
                                        placeholder="Баллов за выполнение"
                                        ref={incomeRef}
                                    />
                                    <label htmlFor="floatingInput">Баллов за выполнение</label>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="inputDate">Нужно выполнить до:</label>
                                    <input
                                        type="date"
                                        className="form-control my-2"
                                        ref={completeDayRef}
                                    />
                                    <input
                                        type="time"
                                        className="form-control my-2"
                                        ref={completeTimeRef}
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-floating mb-3 text-dark">
                                    <input
                                        type="number"
                                        value={countOfUsers}
                                        onChange={(e) =>
                                            setCountOfUsers(Math.max(1, parseInt(e.target.value) || 1))
                                        }
                                        className="form-control"
                                        id="floatingInput"
                                        placeholder="Кол-во пользователей"
                                    />
                                    <label htmlFor="floatingInput">Ограничение по кол-ву пользователей</label>
                                </div>
                            </div>

                            <div className="col-12">
                                <label>Категория:</label>
                                <select className="form-select" aria-label="" ref={categoryRef}>
                                    <option value="Ответственность" selected>Ответственность</option>
                                    <option value="Целеустремлённость">Целеустремлённость</option>
                                    <option value="Конкурентоспособность">Конкурентоспособность</option>
                                    <option value="Грамотность">Грамотность</option>
                                    <option value="Инициативность">Инициативность</option>
                                    <option value="Креативность">Креативность</option>
                                </select>
                            </div>

                            <div className="col-12">
                                <label>Пользователь:</label>
                                {usersOptions === null ? (
                                    <p>Загрузка списка пользователей...</p>
                                ) : (
                                    Array.from({ length: countOfUsers }, (_, index) => (
                                        <div key={index} className="mb-2">
                                            <Select
                                                options={usersOptions}
                                                value={selectedValues[index]}
                                                onChange={(val) => handleSelectChange(val, index)}
                                                placeholder="Выберите пользователя"
                                            />
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="col-6">
                                <div
                                    className="btn btn-outline-info rounded-4 p-2 w-100"
                                    onClick={() => setCountOfUsers((prev) => prev + 1)}
                                >
                                    Добавить
                                </div>
                            </div>
                            <div className="col-6">
                                <div
                                    className="btn btn-outline-info rounded-4 p-2 w-100"
                                    onClick={() => setCountOfUsers((prev) => (prev < 2 ? 1 : prev - 1))}
                                >
                                    Убрать
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-floating text-dark">
                            <textarea
                                className="form-control"
                                placeholder="Описание"
                                id="floatingTextarea2"
                                style={{ height: "490px" }}
                                ref={contentRef}
                            ></textarea>
                            <label htmlFor="floatingTextarea2">Описание</label>
                        </div>
                    </div>

                    <div className="col-12 fs-6">
                        *Укажите ограничение по кол-ву пользователей = 0 для снятия ограничения.
                    </div>

                    <div className="col-12">
                        <Button
                            variant="outlined"
                            className="w-100"
                            disabled={btnDisabled}
                            onClick={() => {
                                setBtnDisabled(true);
                                createInitiative();
                            }}
                        >
                            Создать
                        </Button>
                    </div>
                </div>
            </div>
        </CheckModerator>
    );
}

export default AddPrivateInitiativePage;
