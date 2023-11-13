import { Link } from "react-router-dom";
import "./header.css"
import { useEffect, useState } from "react";
import axios from "axios";

function Settings({me, onClose}) {
    const [changeAvatar, setChangeAvatar] = useState(false);
    const [changeLogin, setChangeLogin] = useState(false);
    const [myLogin, setMyLogin] = useState(me.login);
    const [file, setFile] = useState(null);
    const [login, setLogin] = useState("");
    const [retour1, setRetour1] = useState("");
    const [retour2, setRetour2] = useState("");
    const [timestamp, setTimestamp] = useState(Date.now());
    const urlAvatar = `http://localhost:3001/users/${me.id}/avatar?timestamp=${timestamp}`;

    function handleClickUpload() {
        const formdata = new FormData();
        formdata.append('avatar', file);
        // console.log(file);
        axios.post("http://localhost:3001/users/uploadAvatar", formdata, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then((response) =>{
           if (response.data.error)
                setRetour2("Error during uploading your avatar");
            else
            {
                setRetour2("");
                setTimestamp(Date.now());
                setChangeAvatar(false);
            }
        })
        .catch(() => {
            console.log("erreur durant l'upload")
        })
    }

    function handleClickChange() {

        const url = "http://localhost:3001/users/changeLogin";
        const data = {
            newLogin: login,
        }
        axios.post(url, data, {withCredentials: true})
        .then((response) =>{
           if (response.data.error)
                setRetour1("Error changing the login");
            else
            {
                setRetour1("");
                setMyLogin(login);
                me.login = login;
                setChangeLogin(false);
                console.log("login changed");
            }
        })
        .catch(() => {
            console.log("erreur durant l'upload")
        })
    }


    return (
        <div className="popup">
            <button className="closeButton" onClick={onClose}>x</button>
            <button>Disconect</button>
            <div className="row">
                <span>Nickname: {myLogin}</span>
                <button onClick={() => setChangeLogin(!changeLogin)}>change</button>
            </div>
            {changeLogin && 
            <div>
                <input type="text" onChange={(event) => setLogin(event.target.value)}/>
                <button onClick={() => handleClickChange()}>change</button><br/>
                {retour1 !== "" && <span>{retour1}</span>}
                
            </div>
            }
            <div className="row">
                <img className="avatar" src={urlAvatar} alt="avatar" />
                <button onClick={() => setChangeAvatar(!changeAvatar)}>Change</button><br />
            </div>
            {changeAvatar && 
            <div>
                <input type="file" onChange={(event) => setFile(event.target.files[0])}/>
                <button onClick={() => handleClickUpload()}>Upload</button><br/>
                {retour2 !== "" && <span>{retour2}</span>}
                
            </div>
            }
        </div>
    )
}

export default function Header() {
    const [me, setMe] = useState(null);
    const [params, setParams] = useState(false);

    useEffect(() => {
        const url_get_user = "http://localhost:3001/users/me"
        axios.get(url_get_user, {withCredentials: true})
        .then((response) => {
            setMe(response.data);
        })
    }, [])

    function handleClose() {
        setParams(false);
    }
    // console.log("params: ", params);

    return(
        <nav>
            <Link to="/Home">Home</Link>
            <Link to="/Game">Game</Link>
            <Link to="/Social">Social</Link>
            {me && <Link to={`/Profile/${me.id}`}>Profile</Link>}
            <button onClick={() => setParams(!params)}>🛠️</button>
            {me && params && <Settings me={me} onClose={handleClose}/>}

        </nav>
    )
}