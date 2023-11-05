import { Link } from "react-router-dom";
import "./header.css"

export default function Header() {
    return(
        <nav>
            <Link to="/Home">Home</Link>
            <Link to="/Game">Game</Link>
            <Link to="/Social">Social</Link>
        </nav>
    )
}