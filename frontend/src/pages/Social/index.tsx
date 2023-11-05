import './social.css'
import Channels from './components/channel'
import Chat from './components/chat'
import Friends from './components/friends'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'


export default function Social() {
    const [currentChan, setCurrentChan] = useState(null);
    const [login, setLogin] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const [socket, setSocket] = useState(null);
    const [blockeds, setBlocked] = useState([]);


    useEffect(() => {
        const url_get_login = "http://localhost:3001/users/getLogin";
        axios.get(url_get_login, {withCredentials: true})
        .then((response) => {
            if (response.data) {
                console.log("je recup le login: ", response.data);
                setLogin(response.data);
            }
        })
        .catch(() => {
            console.log("erreur !");
        })
        const url_blocked = "http://localhost:3001/users/blocked?";
        axios.get(url_blocked, {withCredentials: true})
        .then((response) => {
            if (response.data.users) {
                console.log("blocked : ", response.data.users);
                setBlocked(response.data.users);
            }
            else
                console.log(response.data.error);
        })
        .catch(() => {
            console.log("erreur !");
        })
    }, []);

    function handleBlock(user: string) {
        const temp = [...blockeds];
        temp.push(user);
        console.log("je suis jusque la = je bloque :" , user);
        setBlocked(temp);
    }

    function handleUnblock(user: string) {
        const temp = [...blockeds];
        const temp2 = temp.filter((userLogin) => userLogin !== user);
        setBlocked(temp2);
    }

    function handleLogin (){
        console.log('je crée une co socket !');
        const newsocket = io('http://localhost:3001', {
            query: {
                login
            }
        });
        setSocket(newsocket);
        setIsLogin(true);
        // setLogin(input);
    }

    function handleLeave() {
        const url = "http://localhost:3001/channel/leave";
        const data = {
            login: login,
            name: currentChan.name,
        }
        axios.post(url, data, {withCredentials: true})
        .then(() => {
            setCurrentChan(null);
        })
        .catch(() => {
            console.log("erreur durant le leave");
        })
    }

    function handleDelete() {
        const url = "http://localhost:3001/channel/delete";
        const data = {
            name: currentChan.name,
        }
        axios.post(url, data, {withCredentials: true})
        .then(() => {
            setCurrentChan(null);
        })
        .catch(() => {
            console.log("erreur durant le delete");
        })
    }
    function selectChan(channel: any){
        setCurrentChan(channel);
    }
    return (
        <div>
            <button onClick={() => handleLogin()}>login</button>
            {isLogin && login !== '' && <div className="social">
                <Channels handleSelect={(channel: any) => selectChan(channel)} login={login} currentChan={currentChan} socket={socket}/>
                <Chat channel={currentChan} login={login} socket={socket} handleLeave={handleLeave} handleDelete={handleDelete} blockeds={blockeds}/>
                <Friends login={login} blockeds={blockeds} handleBlock={handleBlock} handleUnblock={handleUnblock}/>
            </div> }
            {login !== '' && <span>hello :{login}</span>}
        </div>
    )
}