import { useEffect, useState } from "react";
import UserProfile from "./userProfile";
import axios from "axios";

function FriendList({list, handleSelect}) {
    return (
        <div>
            <h2>Friends</h2>
            <ul className="FriendList">
                {list.map((userLogin: string) => (
                    <li key={userLogin + "a"} onClick={() => handleSelect(userLogin)}>{userLogin}</li>
                ))}
            </ul>
        </div>
    )
}

export default function Friends({login, blockeds, handleBlock, handleUnblock}) {
    const [user, setUser] = useState("");
    const [friends, setFriends] = useState([]);


    useEffect (() => {
        const url_friends = "http://localhost:3001/users/friends?login=" + login;
        axios.get(url_friends, {withCredentials: true})
        .then((response) => {
            if (response.data.users) {
                // console.log("friends : ", response.data.users);
                setFriends(response.data.users);
            }
            else
                console.log(response.data.error);
        })
    }, [login])

    function handleAdd(user: string) {
        const temp = [...friends];
        temp.push(user);
        setFriends(temp);
    }

    function handleDel(user: string) {
        const temp = [...friends];
        const temp2 = temp.filter((userLogin) => userLogin !== user);
        setFriends(temp2);
    }


    return (
        <div>
            <UserProfile userLogin={user} handleDel={handleDel} handleUnblock={handleUnblock} setUser={setUser} handleAdd={handleAdd} handleBlock={handleBlock} login={login} friends={friends} blockeds={blockeds}/>
            <FriendList list={friends} handleSelect={setUser} />
        </div>
    )
}