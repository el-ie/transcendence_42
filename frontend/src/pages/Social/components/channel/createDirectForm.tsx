import axios from "axios";
import { useState } from "react";
import "./form.css"


export default function CreateDirectForm({onClose, onCreateDirect, login}) {
    const [target, setTarget] = useState('');
    const [error, setError] = useState('');
    function handleClick() {
        const url_create_direct = "http://localhost:3001/channel/createDirect"
        const data = {
            starterLogin: login,
            targetLogin: target,
            type: 'DIRECT',
        }
        axios.post(url_create_direct, data, {withCredentials: true})
        .then((reponse) => {
            if (reponse.data.channel){
                onCreateDirect(reponse.data.channel)
                setError('');
            }
            else {
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
            <input type="text" placeholder="target" value={target} onChange={(e) => setTarget(e.target.value)} />
            <button onClick={handleClick}>Chat</button>
            {(error !== '')? <div>{error}</div> : null}
        </div>
    )
}