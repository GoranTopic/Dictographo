import React  from 'react';
import { Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

/*
 * =======================================
 *      Alert Component for React 
 * =======================================
 * 	Using ReaactBootStrap to render the the alert
 */

function AlertContainer({state, dispatchState}) {
		if (state.isWordNotFound) {
				return (
						<Alert variant="danger" dismissible onClose={() => dispatchState({type: 'DISSMISS_NOT_FOUND'})} >
								<Alert.Heading>Oh snap!</Alert.Heading>
								<p>Looks like we don't have <b><i>"{state.searchTerm}"</i></b>, in our dictionary...yet.</p>
						</Alert>
				);
		}else{
				return <></>
		}
}

export default AlertContainer;

