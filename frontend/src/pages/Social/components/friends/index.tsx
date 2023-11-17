import { useEffect, useState } from "react";
import UserProfile from "./userProfile";
import "./style.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FriendList({list, handleSelect}) {
    return (
        <div>
            <h2>Friend List</h2>
            <ul className="FriendList">
                {list.map((user: any) => (
                    <li key={user.id + "a"} onClick={() => handleSelect(user)}>
                    {user.isConnected ? <span className="green">¤£</span> : <span className="gray">££</span>}
                    {user.login}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function InviteList({list, handleAccept, handleDecline}) {
    return (
        <div>
            <h2>Game Invite List</h2>
            <ul className="gameInviteList">
                {list.map((username: string) => (
                    <li key={username + "a"}>
                    {username} 
                    <button onClick={() => handleAccept(username)}>Accept</button>
                    <button onClick={handleDecline}>Coward</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default function Friends({login, blockeds, handleBlock, handleUnblock, socket}) {
    const [user, setUser] = useState(null); //maintenant, user sera l'utilisateur complet
    const [friends, setFriends] = useState([]);
    const [inviteList, setInviteList] = useState([]);
    const navigate = useNavigate();


    useEffect (() => {
        const url_friends = "http://localhost:3001/users/friends";
        axios.get(url_friends, {withCredentials: true})
        .then((response) => {
            if (response.data.users) {
                setFriends(response.data.users);
            }
            else
                console.log(response.data.error);
        })
        
    }, [login, socket])

    useEffect (() => {
        const url = "http://localhost:3001/users/invite";
        axios.get(url, {withCredentials: true})
        .then((response) => {
            const temp = [...inviteList];
            if (response.data.invites)
            {
                response.data.invites.map((invite: any) => {
                    temp.push(invite.inviterUN);
                    return true;
                })
                setInviteList(temp);
            }
        })
    }, [])

    useEffect(() => {
        const handleConnect = () => {
            const url_friends = "http://localhost:3001/users/friends";
            axios.get(url_friends, {withCredentials: true})
            .then((response) => {
            if (response.data.users) {
                setFriends(response.data.users);
            }
            else
                console.log(response.data.error);
            })
        };

        const handleInvited = (by: string) => {
            const temp = [...inviteList];
            temp.push(by);
            setInviteList(temp);
        }

        const handleCancel = (by: string) => {
        console.log("je suis dans cancelinvite");
        const url = "http://localhost:3001/users/invite";
        axios.get(url, {withCredentials: true})
        .then((response) => {
            const temp = [];
            if (response.data.invites)
            {
                response.data.invites.map((invite: any) => {
                    temp.push(invite.inviterUN);
                    return true;
                })
                setInviteList(temp);
            }
        })
        }
      
        socket.on('connection', handleConnect);
        socket.on('INVITED', handleInvited);
        socket.on('CANCEL_INVITE', handleCancel);
      
        return () => {
          socket.off('message', handleConnect);
        };
      }, [socket]);
    
    function handleAdd(user: any) {
        const temp = [...friends];
        temp.push(user);
        setFriends(temp);
    }

    function handleDel(user: any) {
        const temp = [...friends];
        const temp2 = temp.filter((userl) => userl.id !== user.id);
        setFriends(temp2);
    }

    function handleAccept(username: string)
    {
        navigate('/game/1');

        if (socket) {
            const payload = {
                inviter: username
            }
            socket.emit("ACCEPT_INVITATION", payload);
        }
    }


    return (
        <div>
            <UserProfile user={user} setUser={setUser} handleDel={handleDel} handleUnblock={handleUnblock}  handleAdd={handleAdd} handleBlock={handleBlock} login={login} friends={friends} blockeds={blockeds} socket={socket}/>
            <FriendList list={friends} handleSelect={setUser} />
            <InviteList list={inviteList} handleAccept={handleAccept} handleDecline={null} />

        </div>
    )
}