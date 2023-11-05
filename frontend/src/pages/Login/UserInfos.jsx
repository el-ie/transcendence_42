import React, { useState, useEffect } from 'react';

import axios from 'axios';

export default function UserInfos() {

	const [data, setData] = useState('');

    useEffect(() => {
        const getInformations = async () => {
            try {
                const response = await axios.get('http://localhost:3333/request/get_all', { withCredentials: true });
				setData(response.data);
            } catch (error) {
				//pourquoi la requete s envoi en double en cas d erreur, visible dans le terminal web
				console.log('Erreur dans l appel axios de get_all : ', error.response);
            }
        };
        getInformations();
    }, []);


	return ( 
		<div style={{ position: 'absolute', bottom: '100px', left: '100px' }}>
			<br/><br/><br/>
			<div style={{ textAlign: 'left'}}>
			<h4> Utilisateur connecte : </h4>
			<pre> <p> [{JSON.stringify(data, null, 2)}] </p> </pre>
			</div>
			</div>
	);
}
			//<pre> <h1> [{JSON.stringify(data, null, 2)}] </h1> </pre>
