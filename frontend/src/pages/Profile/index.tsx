import { useParams } from "react-router-dom";

export default function Profile() {

    const {userId} = useParams();

    return (
        <div>
            userId: {userId};
        </div>
    )
}