import axios from "axios";
import "./form.css"
import { useState } from "react";

export default function JoinForm({onClose, onJoin, login}) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    function handleClick() {
        const url_join_chan = "http://localhost:3001/channel/join"
        const data = {
            name: name,
            password: password,
            login: login,
        }
        axios.post(url_join_chan, data, {withCredentials: true})
        .then((reponse) => {
            if (reponse.data.channel)
            {
                onJoin(reponse.data.channel)
                setError('');
            }
            else
            {
                setError(reponse.data.error);
            }
        })
        .catch(function(error) {
            console.error(error);
        });
    }
    return (
        <div className="form">
            <button className="closeButton" onClick={onClose}>x</button>
            <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleClick}>Join</button>
            {error !== '' ? <div>{error}</div> : null}
        </div>
    )
}