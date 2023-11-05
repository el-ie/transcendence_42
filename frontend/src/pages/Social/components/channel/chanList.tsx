import "./chanList.css"

function getName(name:string, login:string) {
    if (!name.includes("-"))
        return (name)
    const logins = name.split("-")
    if (logins[0] === login)
        return (logins[1])
    return (logins[0]);
}
export default function ChanList({list, handleSelect, login}) {
        return (
            <ul className="chanList">
                {list.map((channel: any) => (
                    <li key={channel.id + "a"} onClick={() => handleSelect(channel)}>{getName(channel.name, login)}</li>
                ))}
            </ul>
        )
}