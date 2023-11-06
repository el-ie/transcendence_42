import { useEffect, useState } from "react";
import UserProfile from "./userProfile";
import axios from "axios";

function FriendList({list, handleSelect}) {
    return (
        <div>
            <h2>Friends</h2>
            <ul className="FriendList">
                {list.map((user: any) => (
                    <li key={user.id + "a"} onClick={() => handleSelect(user)}>{user.login}</li>
                ))}
            </ul>
        </div>
    )
}

export default function Friends({login, blockeds, handleBlock, handleUnblock}) {
    const [user, setUser] = useState(null); //maintenant, user sera l'utilisateur complet
    const [friends, setFriends] = useState([]);


    useEffect (() => {
        const url_friends = "http://localhost:3001/users/friends";
        axios.get(url_friends, {withCredentials: true})
        .then((response) => {
            if (response.data.users) {//changer back pour renvoyer des objets users
                setFriends(response.data.users);
            }
            else
                console.log(response.data.error);
        })
    }, [login])

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


    return (
        <div>
            <UserProfile user={user} setUser={setUser} handleDel={handleDel} handleUnblock={handleUnblock}  handleAdd={handleAdd} handleBlock={handleBlock} login={login} friends={friends} blockeds={blockeds}/>
            <FriendList list={friends} handleSelect={setUser} />
        </div>
    )
}