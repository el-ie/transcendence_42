import { Link } from "react-router-dom";
import "./header.css"
import { useEffect, useState } from "react";
import axios from "axios";

function Settings({me, onClose}) {
    const [changeAvatar, setChangeAvatar] = useState(false);
    const [changeLogin, setChangeLogin] = useState(false);
    const [myLogin, setMyLogin] = useState(me.login);
    const [file, setFile] = useState(null);
    const [login, setLogin] = useState("");
    const [retour1, setRetour1] = useState("");
    const [retour2, setRetour2] = useState("");
    const [timestamp, setTimestamp] = useState(Date.now());
    const urlAvatar = `http://localhost:3001/users/${me.id}/avatar?timestamp=${timestamp}`;

    const [loginTooLong, setLoginTooLong] = useState(false);
    const [photoTooHeavy, setPhotoTooHeavy] = useState(false);
    const [validFileExtension, setValidFileExtension] = useState(true);

    function handleClickUpload() {

		const allowedExtensions = ['jpg', 'jpeg', 'png'];

		const fileExtension = file.name.split('.').pop().toLowerCase();

		if (!allowedExtensions.includes(fileExtension)) {
			setValidFileExtension(false);
			return;
		}
		else {
			setValidFileExtension(true);
		}
		//50 Mo maximum
		if (file.size > 50 * 1024 * 1024) {
			setPhotoTooHeavy(true);
			return;
		}
		else {
			setPhotoTooHeavy(false);
		}

        const formdata = new FormData();
        formdata.append('avatar', file);
        // console.log(file);
        axios.post("http://localhost:3001/users/uploadAvatar", formdata, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then((response) =>{
           if (response.data.error)
                setRetour2("Error during uploading your avatar");
            else
            {
                setRetour2("");
                setTimestamp(Date.now());
                setChangeAvatar(false);
            }
        })
        .catch(() => {
            console.log("erreur durant l'upload")
        })
    }

    function handleClickChange() {

		//CHECK
		if (login.length > 20)
		{
			setLoginTooLong(true);
			return;
		}
		else
			setLoginTooLong(false);

        const url = "http://localhost:3001/users/changeLogin";
        const data = {
            newLogin: login,
        }
        axios.post(url, data, {withCredentials: true})
        .then((response) =>{
           if (response.data.error)
                setRetour1("Error changing the login");
            else
            {
                setRetour1("");
                setMyLogin(login);
                me.login = login;
                setChangeLogin(false);
                console.log("login changed");
            }
        })
        .catch(() => {
            console.log("erreur durant l'upload")
        })
    }

	async function handleDisconnect() {
		try {
		await axios.get('http://localhost:3001/auth/delete_all_cookies', { withCredentials: true });
		} catch {
			console.log('disconnection problem')
		}
		window.location.reload();
	}

	// AJOUTS ELIE 2FA

	const [qrCode, setQrCode] = useState (null);

	const [twoFaActivation, setTwoFaActivation] = useState(false); // VA CHERCHER L ETAT 2FA DANS LA DATABASE

	const [twoFaSecret, setTwoFaSecret] = useState("");

	
    useEffect(() => {
        const getTwoFaActivationState = async () => {
            try {
                const response = await axios.get('http://localhost:3001/auth/check_2fa_activation', { withCredentials: true });
				setTwoFaActivation(true); //utile ?
            } catch (error) {
				setTwoFaActivation(false);
				console.log('getTwoFaActivationState : twoFa inactive');
            }
        };

		try {
			getTwoFaActivationState();
		} catch {
			console.log('Error useEffect getTwoFaActivationState');
			//retirer le log
		}

    }, []);

	async function handleLaunchTwoFa() {

		try {
			const response = await axios.get('http://localhost:3001/auth/2fa_getqr', { withCredentials: true });
			setQrCode(response.data);
		} catch (error) {
			setQrCode('QR code error (catched)');
			//pourquoi la requete s envoi en double en cas d erreur, visible dans le terminal web
			console.log('echec: appelle de 2fa_getqr pour lancer le 2FA [LoginForm]', error.response.data);
			//retirer le log
		}
	}

	const handleSubmitActivation = async (event) => {
		event.preventDefault(); // Prévient le rechargement de la page lors de la soumission du formulaire
		try {
			const response = await axios.post('http://localhost:3001/auth/2fa_activate',{ twoFactorCode: twoFaSecret } ,{ withCredentials: true });
			setTwoFaActivation(true);
			//REVOIR ICI//setRefreshPage(42); //permet de relancer le useEffect pour mettre les check a jour
		} catch (error) {
			console.log('handleSubmit', error.response.data.message, error.response.data);
			//retirer le log
		}
	};

	const handleChangeText = (event) => {
		setTwoFaSecret(event.target.value);
	};

	const handleRemoveTwoFa = async (event) => {

		try {
			const response = await axios.get('http://localhost:3001/auth/2fa_remove', { withCredentials: true });
			setTwoFaActivation(false);
			window.location.reload();
		} catch (error) {
			console.log('Remove 2fa error');
		}
	}

	return (

		<div className="popup" refresh={twoFaActivation}>
		<button className="closeButton" onClick={onClose}>x</button>
		<button onClick={handleDisconnect}>Disconect</button>
		<div className="row">
		<span>Nickname: {myLogin}</span>
		<button onClick={() => setChangeLogin(!changeLogin)}>change</button>
		</div>
		{changeLogin && 
			<div>
			<input type="text" onChange={(event) => setLogin(event.target.value)}/>
			<button onClick={() => handleClickChange()}>send</button><br/>
			{retour1 !== "" && <span>{retour1}</span>}
			{loginTooLong && <p style={{color: 'red', fontSize: '17px'}}>maximum login size is 20 characters </p>}

			</div>
		}
		<div className="row">
		<img className="avatar" src={urlAvatar} alt="avatar" />
		<button onClick={() => setChangeAvatar(!changeAvatar)}>Change</button><br />
		</div>
		{changeAvatar && 
			<div>
			<input type="file" onChange={(event) => setFile(event.target.files[0])}/>
			<button onClick={() => handleClickUpload()}>Upload</button><br/>
			{retour2 !== "" && <span>{retour2}</span>}

			{photoTooHeavy && <p style={{color: 'red', fontSize: '17px', textAlign: 'center'}}>maximum photo size is 20MB </p>}
			{!validFileExtension && <p style={{color: 'red', fontSize: '17px', textAlign: 'center'}}>Accepted image types are jpg, jpeg and png</p>}
			</div>
		}


		<div className="column">


		{!twoFaActivation &&
		<button onClick={handleLaunchTwoFa} style={{ padding: '15px 25px', borderRadius: '4px', position:'relative', left:'-20px', color: 'black' }}> active 2FA with QR-code  </button>
		}

		{ qrCode && !twoFaActivation &&
			<div className = "popup" style={{color: 'black', backgroundColor: 'yellow'}}>
			<br />
			<h3 style={{color: 'black', alignItems: 'center'}}> Veuillez entrer le code fournit par google authenticator </h3>
			<form onSubmit={handleSubmitActivation}>
			<input type="text" value={twoFaSecret} onChange={handleChangeText} style={{color: 'black'}}/>
			<button type="submit" style={{color: 'black'}}>Soumettre</button>
			</form>
			<br />
			<img src={qrCode} />
			</div>
		}

		<h2 style={{color: 'black'}}> 2FA activation : </h2>
		{ twoFaActivation ?
				<h2 style={{ color: 'blue' }} > ACTIVATED </h2> 
				: <h2 style={{ color: 'red' }} > INACTIVE </h2>
		}


		{ twoFaActivation &&
				<button onClick={handleRemoveTwoFa}>Remove 2fa</button>
		}

		</div>


		</div>

	)
}

export default function Header() {
	const [me, setMe] = useState(null);
	const [params, setParams] = useState(false);

	useEffect(() => {
		const url_get_user = "http://localhost:3001/users/me"
		axios.get(url_get_user, {withCredentials: true})
			.then((response) => {
				setMe(response.data);
			})
	}, [])

	function handleClose() {
		setParams(false);
	}
	// console.log("params: ", params);


	async function handleClickProtection()
	{
		try {
			await axios.get('http://localhost:3001/auth/check_authorized', { withCredentials: true });
		} catch {
			window.location.reload();
		}
	}

	return(
		<nav>
		<Link to="/Home" onClick={handleClickProtection}>Home</Link>
		<Link to="/Game" onClick={handleClickProtection}>Game</Link>
		<Link to="/Social" onClick={handleClickProtection}>Social</Link>
		{me && <Link to={`/Profile/${me.id}`} onClick={handleClickProtection}>Profile</Link>}
		<button onClick={() => {
			handleClickProtection();
			setParams(!params);
		}}>🛠️</button>
		{me && params && <Settings me={me} onClose={handleClose}/>}

		</nav>
	)
}
