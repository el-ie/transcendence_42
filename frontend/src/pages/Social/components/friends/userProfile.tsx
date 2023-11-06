import axios from "axios";
import { useState } from "react"

function Profile({user, login, handleAdd, handleDel, handleBlock, handleUnblock, blockeds, friends}) {

    function handleClickAdd () {
        const url = "http://localhost:3001/users/addFriend";
        const data = {
            login: login,
            target: user.login,
        }
        axios.post(url, data, {withCredentials: true})
        .then((response) => {
            if (response.data.added)
                handleAdd(response.data.added);
            else
                console.log(response.data.error);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function handleClickDell () {
        const url = "http://localhost:3001/users/DelFriend";
        const data = {
            login: login,
            target: user.login,
        }
        axios.post(url, data, {withCredentials: true})
        .then((response) => {
            if (response.data.deleted)
                handleDel(response.data.deleted);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function handleClickBlock () {
        const url = "http://localhost:3001/users/blockUser";
        const data = {
            login: login,
            target: user.login,
        }
        axios.post(url, data, {withCredentials: true})
        .then((response) => {
            if (response.data.blocked)
            handleBlock(response.data.blocked.id);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function handleClickUnblock () {
        const url = "http://localhost:3001/users/unblockUser";
        const data = {
            login: login,
            target: user.login,
        }
        axios.post(url, data, {withCredentials: true})
        .then((response) => {
            if (response.data.unblocked)
            handleUnblock(response.data.unblocked.id);
        })
        .catch((error) => {
            console.log(error);
        })
    }



    return (
        <div>
            <h3>{user.login}</h3>
            {!friends.includes(user) ? <button onClick={() => handleClickAdd()}>+</button> : <button onClick={() => handleClickDell()}>-</button>}
            {!blockeds.includes(user.id) ? <button onClick={() => handleClickBlock()}>Block</button> : <button onClick={() => handleClickUnblock()}>unblock</button>}
        </div>
    )
}

export default function UserProfile({user, setUser, handleAdd, handleUnblock, handleDel, handleBlock, login, blockeds, friends}) {
    const [input, setInput] = useState('');

    function handleSearch() {
        if (input === login) {
            setInput("");
            return
        }
        const url = "http://localhost:3001/users/other?login=" + input;
        console.log(url);
        axios.get(url, {withCredentials: true})
        .then((response) => {
            if (response.data.user){
                setUser(response.data.user)
                setInput("");
            }
            else
                console.log(response.data.error);
        })
        .catch(() => {
            console.log("erreur");
        })
    }
    return (
        <div>
            <h3>Search for a player</h3>
            <input type="text" placeholder="Username" value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={() => handleSearch()}>Search</button>
            {user && <Profile handleBlock={handleBlock} handleUnblock={handleUnblock} handleDel={handleDel} user={user} login={login} handleAdd={handleAdd} blockeds={blockeds} friends={friends}/>}
        </div>
    )
}