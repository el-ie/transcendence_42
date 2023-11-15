import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./profile.css"

function History({list, user}) {
    return (
        <div>
            <h2>History</h2>
            <ul className="history_list">
                {list.map((game: any) => {
                    return (
                        <li className="game_results">
                            <span>{game.login1}</span> <span>{game.score1} - {game.score2}</span> <span>{game.login2}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default function Profile() {

    const {userId} = useParams();
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [timestamp, setTimestamp] = useState(Date.now());
    const urlAvatar = user ? `http://localhost:3001/users/${user.id}/avatar?timestamp=${timestamp}` : "";

    useEffect(() => {
        const url = "http://localhost:3001/users/otherById?id=" + userId;
        axios.get(url, {withCredentials: true})
        .then((response) => {
            if (response.data.user) {
                setUser(response.data.user);
            }
            else {
                console.log(response.data.error);
            }
        })
    }, [userId])

    useEffect(() => {
        if (user){
            const url = "http://localhost:3001/history?login=" + user.login;
        
            axios.get(url, {withCredentials: true})
            .then ((response) => {
                if (response.data.history)
                    {
                        console.log(response.data.history);
                        setHistory(response.data.history);
                    }
                else {
                    console.log(response.data.error);

                }
            })
            .catch(() => {
                console.log("impossible de parler au serveur");
            })
        }
    }, [user])

    return (
        (user && <div className="profile">
            <div className="infos">
                <div className="user">
                    <img className="avatar" src={urlAvatar} alt="avatar" />
                    <span>{user.login}</span>
                </div>
                <History list={history} user={user} />
            </div>
        </div> )
    )
}

// const urlAvatar = `http://localhost:3001/users/${me.id}/avatar?timestamp=${timestamp}`;
