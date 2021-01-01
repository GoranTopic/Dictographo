import { initial_state, stateReducer } from './Components/State';
import CarouselContainer from './Components/Carousel';
import SideBarContainer from './Components/SideBar';
import NavBarContainer from './Components/NavBar';
import GraphContainer from './Components/Graph/Graph';
import AlertContainer from './Components/Alert';
import React from 'react';
import './App.css';

function App() {
		/* define dispatcher for the Internal data */
		const [state, dispatchState] = React.useReducer( stateReducer, initial_state );
		return (
				<div className="App">
						<NavBarContainer 
								state={state}
								dispatchState={dispatchState} />
						{ state.isError?  // is ther is error mount Error
								<AlertContainer
										state={state}
										dispatchState={dispatchState} />
										:
										<></>
						}
						{ state.isEmpty? // if there is a word
								<CarouselContainer/>
								: 
								<div style={{display: 'inline',}}>
										<SideBarContainer 
												state={state}
												dispatchState={dispatchState} />
										<GraphContainer 
												state={state}
												dispatchState={dispatchState} />
								</div>
						}
				</div>
		);
}

export default App;
