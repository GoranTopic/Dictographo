import React  from 'react';
import { Alert, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

/*
 * =======================================
 *      Alert Component for React 
 * =======================================
 * 	Using ReaactBootStrap to render the the alert
 */

function AlertContainer({state, dispatchState}) {
		/* functions that return an error mesage depending onthe state */
		// set counter ro dismiss with hook


		if (state.isError) {
				return(
						<Alert variant="danger" dismissible 
								onClose={() => dispatchState({type: 'DISSMISS_ERROR'})} >
								<ProgressBar variant="danger" now={80} />
								<Alert.Heading>Oh Snap!</Alert.Heading>
								{state.isWordNotFound? //if the there is not words found
								<p>Looks like <b>
										{ [...state.wordsNotFound].map(word => <i>{word}, </i> ) }
								</b>in no our dictionary yet.</p> : <></>}
								{state.isPathNotFound? //if there is a path not found
								<p>looks like there is no path between: 
										{[...state.pathsNotFound].map(
												path => <i><b> {path.first}</b> and <b>{path.last},</b></i> )}
								</p> : <></> }
								{state.isFetchFailed? //There is a problem with the network
								<p>Could not connect to server.</p> : <></> }
								<p>{state.errorMsg}</p>
						</Alert>)
		}else{
				return <></>
		}
}

export default AlertContainer;

