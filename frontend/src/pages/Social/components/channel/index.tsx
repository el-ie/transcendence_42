import { useEffect, useState } from "react"
import ChanZone from "./chanZone";
import DirectZone from "./directZone";
import "/app/src/css/channel.css";

function Button({value, handleClick}) {
    return (
        <button onClick={handleClick}>{value}</button>
    )
}

export default function Channels({handleSelect, login, currentChan, socket}){
    const [chanBool, setChanBool] = useState(true);
    const [kicked, setKicked] = useState(false);

    useEffect(() => {
        const kickHandler = () => {
            console.log("je me suis fait kicked !!!!");
            setKicked(!kicked);
            handleSelect(null);
          }

        socket.on('kicked', kickHandler);

        return () => {
          socket.off('message', kickHandler);
        };
      }, [socket, handleSelect, kicked]);

    return (
        <div className="chanZone">
            <Button value="Channels" handleClick={() => setChanBool(true)}/>
            <Button value="Direct chat" handleClick={() => setChanBool(false)} />
            {chanBool? <ChanZone handleSelect={handleSelect} kicked={kicked} login={login} currentChan={currentChan}/> : <DirectZone handleSelect={handleSelect} login={login}/>}
        </div>
    )
}
