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

		/* functions that return an error mesage depending onthe state */
		const errorMsg = () =>  
				<Alert variant="danger" dismissible 
						onClose={() => dispatchState({type: 'DISSMISS_ERROR'})} >
						<Alert.Heading>Oh Snap!</Alert.Heading>
						{state.isWordNotFound? //if the there is not words found
						<p>Looks like <b>
								{ state.wordsNotFound.map(word => <i>"{word},"</i> ) }
						</b>in our dictionary yet.</p> : <></>}
						{state.isPathNotFound? //if there is a path not found
						<p>Looks like there is no path between: <b> 
								{ state.pathsNotFound.map(
										path => <i>"{path.first}, {path.last}"</i> ) }
						</b></p> : <></> }
						}
				</Alert>


		if (state.isError) {
				return errorMsg();
		}else{
				return <></>
		}
}

export default AlertContainer;

