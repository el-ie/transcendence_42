import { useParams } from "react-router-dom";

export default function Profile() {

    const {userId} = useParams();

    return (
        <div>
            <span>userId: {userId}</span>
        </div>
    )
}