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
		if (state.isError) {
				return(
						<Alert variant="danger" dismissible 
								onClose={() => dispatchState({type: 'DISSMISS_ERROR'})} >
								<Alert.Heading>Oh Snap!</Alert.Heading>
								{state.isWordNotFound? //if the there is not words found
								<p>Looks like <b>
										{ [...state.wordsNotFound].map(word => <i>{word}, </i> ) }
								</b>in our dictionary yet.</p> : <></>}
								{state.ispathnotfound? //if there is a path not found
								<p>looks like there is no path between:
										{ [...state.pathsnotfound].map(
												path => <i><b>{path.first}</b> and <b>{path.last}</b></i> ) }
								</p> : <></> }
								{state.isFetchFailed? //There is a problem with the network
								<p>Could not connect to server.</p> : <></> }
						</Alert>)
		}else{
				return <></>
		}
}

export default AlertContainer;

