import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Profile() {

    const {userId} = useParams();
    const [user, setUser] = useState(null);

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

    return (
        <div>
            <span>userId: {userId}</span>
            {user && <div>
            </div>}
        </div>
    )
}