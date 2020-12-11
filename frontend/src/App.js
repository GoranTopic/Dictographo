import { onClickNode } from './node_functions';
import { initial_state, stateReducer } from './Components/State';
import CarouselContainer from './Components/Carousel';
import SideBarContainer from './Components/SideBar';
import NavBarContainer from './Components/NavBar';
import GraphContainer from './Components/Graph';
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
						<AlertContainer
								state={state}
								dispatchState={dispatchState} />
						{ state.isEmpty? 
								<CarouselContainer/>
								:
								<div style={{display: 'inline',}}>
										<SideBarContainer 
												state={state}
												dispatchState={dispatchState}
												onClickNode={onClickNode}/>
										<GraphContainer 
												state={state}
												onClickNode={onClickNode}/>
								</div>
						}
				</div>
		);
}

export default App;
