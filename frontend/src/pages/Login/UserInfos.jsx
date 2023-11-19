import React, { useState, useEffect } from 'react';

import axios from 'axios';

export default function UserInfos() {

	const [data, setData] = useState('');

    useEffect(() => {
        const getInformations = async () => {
            try {
                const response = await axios.get(`http://${process.env.REACT_APP_CURRENT_HOST}:3333/request/get_all`, { withCredentials: true });
				setData(response.data);
            } catch (error) {
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
