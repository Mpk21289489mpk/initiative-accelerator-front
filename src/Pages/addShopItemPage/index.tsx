import { Button } from "@mui/material";
import React, { useState } from "react";
import CheckModerator from "../../Modules/Check/CheckModerator";
import { useGlobalUserState } from "../../Modules/User/User";

export default function AddShopItemPage() {

    const [btnDisabled, setBtnDisabled] = useState(false);
    const user = useGlobalUserState();
    let costRef = React.createRef<HTMLInputElement>();
    let titleRef = React.createRef<HTMLInputElement>();
    let descriptionRef = React.createRef<HTMLInputElement>();
    let deadlineTakeDateRef = React.createRef<HTMLInputElement>();
    let deadlineTakeTimeRef = React.createRef<HTMLInputElement>();
    let usersLimitRef = React.createRef<HTMLInputElement>();

    function addNewShopItem() {



        let reqBody: any = { token: user.userParams.token }
        reqBody["cost"] = costRef.current!.value;
        reqBody["title"] = titleRef.current!.value;
        reqBody["description"] = descriptionRef.current!.value;
        console.log({0:deadlineTakeDateRef.current!.value.length>1,1:deadlineTakeTimeRef.current!.value.length>1})
        if (deadlineTakeDateRef.current!.value.length>1 && deadlineTakeTimeRef.current!.value.length>1) {
            reqBody["deadline_take"] = new Date(`${deadlineTakeDateRef.current!.value} ${deadlineTakeTimeRef.current!.value}`).getTime()
        }
        !!usersLimitRef.current!.value ? reqBody["users_limit"] = usersLimitRef.current!.value : console.log("users_limit is null");
        if (costRef.current!.value.length > 0 && titleRef.current!.value.length > 0 && descriptionRef.current!.value.length > 0) {
            fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/add_shop_item/`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",

                body: JSON.stringify(reqBody)
            }).then(resp => resp.json().then((response) => {
                alert("Добавлено!");
                document.location.reload();
            }))
        } else {
            setBtnDisabled(false);
            alert("Не выполнено! Проверьте правильность заполнения полей!");
            
        }

    }

    return <CheckModerator><div>
        <h3>Создание новой траты баллов</h3>
        <div className="row g-2">
            <div className="col-12">
                <label>Заголовок</label>
                <input name="title" type="text" className="w-100 p-2" placeholder="Заголовок" ref={titleRef}></input>
            </div>
            <div className="col-12">
                <label>Описание</label>
                <input name="description" type="text" className="w-100 p-2" placeholder="Описание" ref={descriptionRef}></input>
            </div>
            <div className="col-12">
                <label>Цена</label>
                <input name="cost" type="number" className="w-100 p-2" placeholder="Цена" ref={costRef}></input>
            </div>
            <div className="col-12">
                <label htmlFor="inputDate">Можно купить до:</label>
                <input type="date" className="form-control my-2" ref={deadlineTakeDateRef} />
                <input type="time" className="form-control my-2" ref={deadlineTakeTimeRef} />
            </div>
            <div className="col-12">
                <label htmlFor="inputDate">Ограничение по кол-ву покупок:</label>
                <input type="number" className="form-control my-2" ref={usersLimitRef} />
            </div>
            <div className="fs-6">
                *Поля "Можно купить до:" и "Ограничение по кол-ву покупок:" оставьте пустыми для снятия ограничений
            </div>
            <div className="col-12">
                <Button variant="contained" className="w-100" disabled={btnDisabled} onClick={()=>{setBtnDisabled(true);addNewShopItem();}}>
                    Создать
                </Button>
            </div>
        </div>
    </div></CheckModerator>
}