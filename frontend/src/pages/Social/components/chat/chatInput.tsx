import axios from "axios";
import { useState } from "react";

export default function ChatInput({socket, channel, login}) {
    const [input, setInput] = useState('');

    function handleClick(){

        const url = "http://localhost:3001/channel/users?name=" + channel.name
        axios.get(url, {withCredentials: true}).then((reponse) => {
            if (reponse.data.users)
            {
                const payload = {
                    channelName: channel.name,
                    senderLogin: login,
                    content: input,
                    userList: reponse.data.users,
                }
                socket.emit('message', payload);
                setInput('');
            }
        })
    }

    return (
        <div>
            <input type="text" placeholder="message" value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={handleClick}>Send</button>
        </div>
    )

}