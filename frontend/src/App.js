import React from 'react';
import { colors }  from "./myConfig";
import { initial_state, stateReducer } from './Components/State';
import CarouselContainer from './Components/Carousel';
import SideBarContainer from './Components/SideBar';
import GraphContainer from './Components/Graph';
import NavBarContainer from './Components/NavBar';
import './App.css';
import { Nav, Navbar, NavDropdown, Form, FormControl, Button, Alert, InputGroup  } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome'
import { 
		//faAngleDoubleRight,
		//faAngleDoubleLeft,
		//faDotCircle,
		faSlidersH
} from '@fortawesome/free-solid-svg-icons'

const DEBUGGING = true

const API_ENDPOINT = DEBUGGING ? 
	'http://127.0.0.1:8000/api/' :  //debuging local
	'http://128.199.9.124:8080/api/' //production

function App() {
		/* define dispatcher for the Internal data */

		const [state, dispatchState] = React.useReducer( stateReducer, initial_state );

		const processNode = (node) =>{
				/* process a node from the api into one for the dispatcher
				 * it changes title for id, for instance */
				node['id'] = node.w_id;
				node['key'] = node.w_id;
				node['isSelected'] = false;
				node['color'] = colors.node.default;
				return node
		}


		// handle the change by seting the state variable to 
		const handleSearchChange = change => dispatchState({ type: 'SET_SEARCH_TERM', payload: change.target.value });

		// get node with given node id from state 
		const getNode = (nodeId) => state.nodes.filter( node => node.id === nodeId )[0]

		// attemps to return true id node is not in state
		const isNotInState = (nodeId) => state.nodes.every( node => node.id !== nodeId )

		const requestSynonymNodes = (node) => {
				/* for every node request the adjecent node to it */
				node.synonyms.forEach(synonym => {
						if(isNotInState(synonym['synonym'])){
								fetch(API_ENDPOINT + synonym["synonym"])
										.then(result => result.json())
										.then(result => processNode(result))
										.then(adjNode => {
												dispatchState({
														type: 'SET_NODE_LINK', 
														payload: { 
																node: adjNode,
																link: { 
																		source: node.id ,  
																		target: adjNode.id 
																}
														}
												})
										})
										.catch(() => dispatchState({type:'SET_FETCH_FAILED'}))
						}
				})
		}

		const isWordNotFound = (result) =>{
				if( result.detail === "Not found." ) {
						dispatchState({type: 'SET_WORD_NOT_FOUND'})
					throw new Error("word not found")
				}else{
						return result
				}
		}

		// handle submit search button
		const handleSearchSubmit = () =>  {
				// console.log(state.search) very conviente
				fetch(API_ENDPOINT + state.searchTerm)
						.then(result => result.json())
						.then(result => isWordNotFound(result))
						.then(result => processNode(result))
						.then(node => { dispatchState({type: 'SET_SEARCH_NODE', payload: node}); return node; })
						.then(node => requestSynonymNodes(node))
						.catch(() => dispatchState({type:'SET_FETCH_FAILED'}));
		}

		const onClickNode = function(nodeId) {
				// console.log(`clicked node ${nodeId}`);
				requestSynonymNodes(getNode(nodeId))
				dispatchState({type:'SWITCH_SELECTED_NODE', payload: nodeId})  
		};

		/*
		const onMouseOverNode = function(nodeId) {
				dispatchState({type:'SET_DEFINED_NODE', payload: nodeId})  
				// need to fund a way to also run the default fuction 
		};*/


		function AlertDismissibleExample() {
				if (state.isWordNotFound) {
						return (
								<Alert variant="danger" onClose={() => dispatchState({type: 'DISSMISS_NOT_FOUND'})} dismissible>
										<Alert.Heading>Oh snap!</Alert.Heading>
										<p>Looks like we don't have <b><i>"{state.searchTerm}"</i></b>, in our dictionary...yet.</p>
								</Alert>
						);
				}else{
						return <></>
				}
		}

		return (
				<div className="App">

					<NavBarContainer 
						/>
						<Navbar expand="lg" className="justify-content-center" variant="dark" style={{backgroundColor: colors.black}}>
								<a href="index.html">
										<img src="/logo.png" width="150"
												height="70"
												alt="React Bootstrap logo" />
								</a>
								<Navbar.Brand href="index.html" className="row"  >
										<h1>Dictographo</h1>
								</Navbar.Brand>
								<InputGroup  size='lg' md='auto' className="mx-3" style={{maxWidth: "600px"}} >
										<FormControl size="lg" as='input' type="text" placeholder="Search" 
												value={state.searchTerm} onChange={handleSearchChange} 
												onKeyPress={event => (event.key === "Enter") && handleSearchSubmit()}/>
										<InputGroup.Append>
												<Button size="lg" variant="outline-info" onClick={handleSearchSubmit}>Search</Button>
										</InputGroup.Append>
								</InputGroup>
								<Navbar.Collapse id="basic-navbar-nav">
										<Nav className="ml-auto mx-4">
												<NavDropdown variant="dark"
														size="lg" title="Options" 
														icon={<FontAwesomeIcon icon={faSlidersH}/>}
														id="basic-nav-dropdown">
														<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
														<NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
														<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
														<NavDropdown.Divider />
														<Form.Check type="switch" id="custom-switch" label="Deep Links"/>
												</NavDropdown>
										</Nav>
								</Navbar.Collapse>
						</Navbar>
						<AlertDismissibleExample />
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
