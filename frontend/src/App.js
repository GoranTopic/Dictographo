import { initial_state, stateReducer } from './Components/State';
import CarouselContainer from './Components/Carousel';
import SideBarContainer from './Components/SideBar';
import NavBarContainer from './Components/NavBar';
import GraphContainer from './Components/Graph';
import AlertContainer from './Components/Alert';
import React from 'react';
import './App.css';
import { Form, }from 'react-bootstrap';

function App() {
		/* define dispatcher for the Internal data */
		const [state, dispatchState] = React.useReducer( stateReducer, initial_state );
		return (
				<div className="App">
						<NavBarContainer 
								state={state}
								dispatchState={dispatchState} />
						<AlertContainer
								state={state}
								dispatchState={dispatchState} />
						{ state.isEmpty? 
								<CarouselContainer/>
								: <div style={{display: 'inline',}}>
										<SideBarContainer 
												state={state}
												dispatchState={dispatchState} />
										<GraphContainer 
												state={state}
												dispatchState={dispatchState} />
								</div>
						}
						<Form>
								<Form.Group id="formGridCheckbox">
										<Form.Check type="checkbox" label="Check me out" />
										<Form.Check type={'checkbox'} >
												<Form.Check.Input className="checkbox style-2 pull-left" type={'checkbox'} isValid />
												<Form.Check.Label>this is a label</Form.Check.Label>
												<Form.Control.Feedback type="valid">You did it!</Form.Control.Feedback>
										</Form.Check>
								</Form.Group>
						</Form>
				</div>
		);
}

export default App;
