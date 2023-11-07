import { Link } from "react-router-dom";
import "./header.css"
import { useEffect, useState } from "react";
import axios from "axios";

export default function Header() {
    const [me, setMe] = useState(null);

    useEffect(() => {
        const url_get_user = "http://localhost:3001/users/me"
        axios.get(url_get_user, {withCredentials: true})
        .then((response) => {
            setMe(response.data);
            console.log("dans header: me: ", response.data);
        })
    }, [])

    return(
        <nav>
            <Link to="/Home">Home</Link>
            <Link to="/Game">Game</Link>
            <Link to="/Social">Social</Link>
            <Link to={`/Profile/${me.id}`}>Profile</Link>
        </nav>
    )
}