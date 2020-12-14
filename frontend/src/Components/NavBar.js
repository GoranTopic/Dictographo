import React  from 'react';
import { processNode, isWordNotFound, requestAdjecentNodes } from '../node_functions';
import { colors, API_ENDPOINT,  }  from "../myConfig";
import { Nav, Navbar, NavDropdown, Form, FormControl, Button, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome'
import { faSlidersH } from '@fortawesome/free-solid-svg-icons'

/*
 * =======================================
 *      NavBar Componente for React 
 * =======================================
 * 	 Using ReaactBootStrap to render the navbar
 */

function NavBarContainer({ state, dispatchState }){

		// handle the change by seting the state variable to 
		const handleSearchChange = change => dispatchState({ type: 'SET_SEARCH_TERM', payload: change.target.value });

		// handle submit search button
		const handleSearchSubmit = () =>  {
				// console.log(state.search) very conviente
				let searchTerm = state.searchTerm.toLowerCase();
				// set all serches to lowercase
				fetch(API_ENDPOINT + searchTerm)
				// unpack json
						.then(result => result.json())
						.then(result => isWordNotFound(result))
						.then(result => processNode(result))
						.then(node => { dispatchState({type: 'SET_SEARCH_NODE', payload: node}); return node; })
						.then(node => requestAdjecentNodes(node, state, dispatchState))
						.catch(() => dispatchState({type:'SET_FETCH_FAILED'}));
		}
		const handleToggleDeepLinks = () => {
				let selectedNode = state.selected;
				console.log(selectedNode)
				if(!state.isEmpty){
						fetch(API_ENDPOINT + selectedNode.id)
						// unpack json
								.then(result => result.json())
								.then(result => isWordNotFound(result))
								.then(result => processNode(result))
								.then(node => { dispatchState({type: 'SET_SEARCH_NODE', payload: node}); return node; })
								.then(node => requestAdjecentNodes(node, state, dispatchState))
								.catch(() => dispatchState({type:'SET_FETCH_FAILED'}));
				}
				dispatchState({type:'TOGGLE_DEEP_LINKS'});
		}

		return(
				<Navbar expand="lg" className="justify-content-center"
						variant="dark" style={{backgroundColor: colors.black}}>
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
												<Form.Check type="switch" id="custom-switch" label="Deep Links"
														value={state.isDeepLinks} 
														onChange={handleToggleDeepLinks}
												/>
										</NavDropdown>
								</Nav>
						</Navbar.Collapse>
				</Navbar>
		)
}

export default NavBarContainer;
