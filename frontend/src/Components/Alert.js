import React, { useState, useEffect } from 'react';
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
		// set timer ro dismiss with hook
		const [ percentage, setPercentange ] = useState(0)
		// use effect to set the interval to make a contant preogress
		
		useEffect(() => { // run queh component mounted
				let interval = null; 
				if (percentage < 100) { // while percentage is not complete
						interval = setInterval(() => 
								setPercentange(percentage => percentage + 1), 100);
				} else{ // if it has reached 100 percent
						setPercentange(0); // set percentage back to 0
						dispatchState({type: 'DISSMISS_ERROR' }); // unmount itself
				}
				return () => {
						clearInterval(interval);
				}
		}, [ percentage, dispatchState]);

		return(
				<Alert variant="danger" dismissible 
						onClose={() => dispatchState({type: 'DISSMISS_ERROR'})} >
						<ProgressBar 
								style={{
										maxHeight: 5, 
										backgroundColor: 'pink'
								}}
								variant='danger'
								now={percentage} 
						/>
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
}

export default AlertContainer;

