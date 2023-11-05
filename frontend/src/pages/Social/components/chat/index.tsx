import axios from "axios";
import { useEffect, useState } from "react";
import Chatbox from "./chatBox";
import ChatInput from "./chatInput";
import SettingForm from "./settingForm";


function getName(name:string, login:string) {
    if (!name.includes("-"))
        return (name)
    const logins = name.split("-")
    if (logins[0] === login)
        return (logins[1])
    return (logins[0]);
}

export default function Chat({channel, login, socket, handleLeave, handleDelete, blockeds}) {
    const [messages, setMessages] = useState([]);
    const [role, setRole] = useState('');
    const [setting, setSetting] = useState(false);

    useEffect(() => {
        if (channel) {
            const url_get_message = "http://localhost:3001/channel/messages?name=" + channel.name;
            axios.get(url_get_message, {withCredentials: true})
            .then((response) => {
                if (response.data.messages)
                    setMessages(response.data.messages);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des messages : ", error);
            });

            const url_get_role = "http://localhost:3001/channel/role?name=" + channel.name + "&login=" + login;
            axios.get(url_get_role, {withCredentials: true})
            .then((reponse) => {
                if (reponse.data.role)
                    setRole(reponse.data.role);
            })
            .catch(() => {
                console.error("error de recup du role");
            })
        }
    }, [channel, login])

    useEffect(() => {
        const messageHandler = (newmessage: any) => {
          if (newmessage.channelId === channel.id) {
            const temp = [...messages];
            temp.push(newmessage);
            setMessages(temp);
          }
        };
      
        socket.on('message', messageHandler);
      
        return () => {
          socket.off('message', messageHandler);
        };
      }, [channel, messages, socket]);

    if (!channel)
    {
        return (
            <div>
                ici, se trouvera la liste des chats dans lesquels ce trouve le user, et le chat en lui même.
            </div>
        )
    }
    else
    {
        return (
            <div>
                <h2>{getName(channel.name, login)}</h2>
                {channel.type !== 'DIRECT' && 
                <div className="settingsdiv">
                    <span>{role}</span>
                    <button onClick={() => setSetting(!setting)}>⚙️</button>
                </div>
                }
                {setting && channel.type !== 'DIRECT'? (<SettingForm role={role} handleLeave={handleLeave} handleDelete={handleDelete} channel={channel}/>) : null}
                <Chatbox messages={messages} login={login} blockeds={blockeds}/>
                <ChatInput socket={socket} channel={channel} login={login} />
            </div>
        )
    }
}