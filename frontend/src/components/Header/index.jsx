import { Link } from "react-router-dom";
import "./header.css"
import { useEffect, useState } from "react";
import axios from "axios";

function Settings({me}) {
    const [changeAvatar, setChangeAvatar] = useState(false);
    const [file, setFile] = useState(null);

    const urlAvatar = "http://localhost:3001/users/" + me.id + "/avatar";

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
            
            console.log("tout c'est bien passé")
        })
        .catch(() => {
            console.log("erreur durant l'upload")
        })
    }


    return (
        <div className="popup">
            <button>Disconect</button>
            <div className="row">
                <span>login: {me.login}</span>
                <button>change</button>
            </div>
            <div className="row">
                <img className="avatar" src={urlAvatar} alt="avatar" />
                <button onClick={() => setChangeAvatar(!changeAvatar)}>Change</button>
            </div>
            {changeAvatar && 
            <div>
                <input type="file" onChange={(event) => setFile(event.target.files[0])}/>
                <button onClick={() => handleClickUpload()}>Upload</button>
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

    // console.log("params: ", params);

    return(
        <nav>
            <Link to="/Home">Home</Link>
            <Link to="/Game">Game</Link>
            <Link to="/Social">Social</Link>
            {me && <Link to={`/Profile/${me.id}`}>Profile</Link>}
            <button onClick={() => setParams(!params)}>🛠️</button>
            {me && params && <Settings me={me}/>}

        </nav>
    )
}