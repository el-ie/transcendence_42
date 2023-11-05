import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserInfos from './UserInfos';


export default function LoginForm() {

	const [qrCode, setQrCode] = useState (null);

	const [twoFaSecret, setTwoFaSecret] = useState("");

	const [twoFaActivation, setTwoFaActivation] = useState(false);

	const [twoFaCookieState, setTwoFaCookieState] = useState(false);

	const [isSigned, setIsSigned] = useState(false);

	const [refreshPage, setRefreshPage] = useState(0);

	function handleSignup() {
		//let page = await axios.get('http://localhost:3001', { withCredentials: true });
		window.location.href = 'http://localhost:3001/auth/login42';
	};

    useEffect(() => {

		console.log('Checks au seins de LoginForm :');

        const checkIsSigned = async () => {
            try {
                const response = await axios.get('http://localhost:3001/auth/check_is_signed', { withCredentials: true });
				setIsSigned(true);
				return true; //utile ?
            } catch (error) {
				setIsSigned(false);
				console.log('echec" appel de check_is_signed [LoginForm]', error.response.data);
				throw new Error('checkIsSigned');
            }
        };

        const getTwoFaActivationState = async () => {
            try {
                const response = await axios.get('http://localhost:3001/auth/check_2fa_activation', { withCredentials: true });
				setTwoFaActivation(true); //utile ?
            } catch (error) {
				setTwoFaActivation(false);
				console.log('echec: appel de check_2fa_activation [LoginForm]', error.response.data);
				throw new Error('getTwoFaActivationState');
            }
        };

        const getTwoFaCookieState = async () => {
            try {
                const response = await axios.get('http://localhost:3001/auth/check_2fa_cookie', { withCredentials: true });
				setTwoFaCookieState(true);
            } catch (error) {
				setTwoFaCookieState(false); 
				console.log('echec: appel de check_2fa_cookie [LoginForm]', error.response.data);
				throw new Error('getTwoFaCookieState');
            }
        };

		checkIsSigned()
		.then( () => getTwoFaActivationState())
		.then( () => getTwoFaCookieState())
		.catch((error) => {});

    }, [refreshPage]);
	// bien laisser le , [] sinon le rechargement se fait 2 fois

	async function handleLaunchTwoFa() {

		try {
			const response = await axios.get('http://localhost:3001/auth/2fa_getqr', { withCredentials: true });
			setQrCode(response.data);
		} catch (error) {
			setQrCode('QR code error (catched)');
			//pourquoi la requete s envoi en double en cas d erreur, visible dans le terminal web
			console.log('echec: appelle de 2fa_getqr pour lancer le 2FA [LoginForm]', error.response.data);
		}
	}

	const handleChangeText = (event) => {
		setTwoFaSecret(event.target.value);
	};

	const handleSubmitActivation = async (event) => {
		event.preventDefault(); // Prévient le rechargement de la page lors de la soumission du formulaire

		try {
			const response = await axios.post('http://localhost:3001/auth/2fa_activate',{ twoFactorCode: twoFaSecret } ,{ withCredentials: true });
			setTwoFaActivation(true);
			setRefreshPage(42); //permet de relancer le useEffect pour mettre les check a jour
		} catch (error) {
			console.log('handleSubmit', error.response.data.message, error.response.data);
		}

	};

	const handleSubmitAuthentication = async (event) => {
		event.preventDefault(); // Prévient le rechargement de la page lors de la soumission du formulaire

		try {
			const response = await axios.post('http://localhost:3001/auth/2fa_authenticate',{ twoFactorCode: twoFaSecret } ,{ withCredentials: true });
			setRefreshPage(42);//permet de relancer le useEffect pour mettre les check a jour
			// normalement si le cookie est bien envoye par la route il n y a pas besoin de faire plus
		} catch (error) {
			console.log('handleSubmit', error.response.data.message, error.response.data);
		}

	};

		//{twoFaActivation ? <h2 style={{ position: 'relative', left: '200px', top: '-150px' }}> 2FA status : < span style={{ color: 'green' }} > ACTIVATED </span>  </h2>  : <p> 2FA status : INACTIVE </p> }
// authenticate 2fa://<div style={{ position: 'absolute', right: '500px', top: '400px', border: '2px solid black', padding: '10px', borderRadius: '10px' }}>
	return (
		<div style={{ whiteSpace: 'pre' }} >

		<div style={{ textAlign: 'center' }}>


		<div style={{ position: 'absolute', right: '4%', top: '6%', border: '2px solid black', padding: '10px', borderRadius: '10px' }}>
		<h2> user status : </h2>
		{ isSigned ?
				<h2 style={{ color: 'green', display: 'inline-block' }} > SIGNED IN </h2> 
				: <h2 style={{ color: 'red', display: 'inline-block' }} > UNSIGNED </h2>
		}
		</div>

		<div style={{ position: 'absolute', right: '100px', top: '250px', border: '2px solid black', padding: '10px', borderRadius: '10px' }}>
		<h2> 2FA activation : </h2>
		{ twoFaActivation ?
				<h2 style={{ color: 'blue' }} > ACTIVATED </h2> 
				: <h2 style={{ color: 'red' }} > INACTIVE </h2>
		}
		</div>

		<div style={{ position: 'absolute', right: '100px', top: '450px', border: '2px solid black', padding: '10px', borderRadius: '10px' }}>
		<h2> 2FA Cookie : </h2>
		{ twoFaCookieState ?
				<h2 style={{ color: 'green' }} > VALID </h2> 
				: <h2 style={{ color: 'red' }} > INVALID <br />/ ABSENT </h2>
		}
		</div>

		{ twoFaActivation && !twoFaCookieState &&
		<div style={{ position: 'absolute', right: '800px', top: '400px', border: '2px solid black', padding: '10px', borderRadius: '10px' }}>
		<h2> PLEAS AUTHENTICATE 2FA </h2>
			<form onSubmit={handleSubmitAuthentication}>
			<input type="text" value={twoFaSecret} onChange={handleChangeText} />
			<button type="submit">Submit</button>
			</form>
		</div>
		}

		<br />

		{ !isSigned &&
		<button onClick={handleSignup} style={{ padding: '3px 20px', borderRadius: '4px', position:'relative', left:'-86px', width: '10%', height: '40px', fontSize: '17px' }}>  Signup  </button>
		}

		{isSigned && !twoFaActivation &&
		<button onClick={handleLaunchTwoFa} style={{ padding: '15px 25px', borderRadius: '4px', position:'relative', left:'-20px' }}> active 2FA with QR-code  </button>
		}

		{ qrCode && !twoFaActivation &&
			<div style={{ position:'relative', left: '0px', top: '50px' }}>
			<br />
			<h3> Veuillez entrer le code fournit par google authenticator </h3>
			<form onSubmit={handleSubmitActivation}>
			<input type="text" value={twoFaSecret} onChange={handleChangeText} />
			<button type="submit">Soumettre</button>
			</form>
			<br />
			<img src={qrCode} />
			</div>
		}

		{isSigned &&
				<UserInfos />
		}

		{isSigned && twoFaActivation && twoFaCookieState &&
				<h2 style={{ position: 'absolute', right: '50%', bottom: '4%', color: 'green'  }} > 2FA Authentication successfull </h2>
		}

		</div>

		</div>
	);
}
//{qrCode? <img src={qrCode} /> : <p> 2FA inactive </p>}
