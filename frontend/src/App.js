import React from 'react';
import './App.css';
import { Graph } from "react-d3-graph";
import { myConfig, colors }  from "./myConfig";
import Modal from 'react-modal';
import {ProSidebar, SidebarHeader, SidebarContent, Menu, MenuItem, SubMenu  } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Nav, Navbar, NavDropdown, Form, FormControl, Button, Alert, Carousel, InputGroup  } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome'
import { 
		faLandmark, 
		faStickyNote, 
		faAlignLeft, 
		//faAngleDoubleRight,
		//faAngleDoubleLeft,
		faBook,
		faBookOpen,
		//faDotCircle,
		faCircle,
		faProjectDiagram,
		faScroll,
		faSlidersH
} from '@fortawesome/free-solid-svg-icons'



const customStyles = {
		content : {
				top          : '50%',
				left         : '50%',
				right        : 'auto',
				bottom       : 'auto',
				marginRight  : '-50%',
				transform    : 'translate(-50%, -50%)'
		}
};


//const API_ENDPOINT = 'http://128.199.9.124:8080/api/v1/' //production
const API_ENDPOINT = 'http://127.0.0.1:8000/api/v1/' //debuging local

// graph payload (with minimalist structure)
const initial_state = {
		nodes: [],
		links: [],
		selected:{},
		definedNode:{},
		isError: false,
		isWordNotFound: false,
		isEmpty: true,
		isLoading: true,
		searchTerm: '',
		DestinationTerm: '',
		isDeepLinks: false,
		showModal: false,
		isSideBar: true,
		
};

function App() {
		// make reducer for the words data and internal state 
		const stateReducer = (state, action) =>{
				let node;
				switch (action.type){
						case 'SET_NEW_NODES':
								return { 
										...state, 
										nodes: [ ...state.nodes, ...action.payload ],
								};
						case 'SET_NEW_LINKS':
								return { 
										...state, 
										links: [ ...state.links, ...action.payload ]
								};
						case 'SET_NODE_LINK':
								return { 
										...state, 
										nodes: [ ...state.nodes, action.payload.node ],
										links: [ ...state.links, action.payload.link ]
								};
						case 'SET_STATE':
								return { 
										...state, 
										nodes: [ ...state.nodes, ...action.payload.nodes ],
										links: [ ...state.links, ...action.payload.links ]
								};
						case 'SET_SEARCH_NODE':
								return {
										...state,
										nodes: [ { ...action.payload, selected: true, color: colors.node.selected  } ],
										links: [],
										selected: action.payload, // save as selected
										definedNode: action.payload, // save as a definietion 
										isEmpty: false,
								};
						case 'SET_NODE_DONE':
								node = state.nodes.filter( node => node.id === action.payload )[0];
								return {
										...state,
										nodes: [ ...state.nodes, { ...node, color: colors.node.done }], 
										isEmpty: false,
								};
						case 'SET_DEFINED_NODE':
								node = state.nodes.filter( node => node.id === action.payload )[0];
								return {
										...state,
										definedNode: node,
								};
						case 'ERASE_NODES':
								return {
										...state,
										nodes: [],
										links: [],
								};
						case 'SET_SEARCH_TERM':
								return {
										...state,
										searchTerm: action.payload,				
								};
						case 'SET_DEST_TERM':
								return {
										...state,
										destinationTerm: action.payload,
								};
						case 'SET_NODE_SELECTED':
								return {
										...state,
										nodes: [ ...state.nodes, { ...action.payload, color: colors.node.selected }], // change color
										selected: action.payload,
								};
						case 'SWITCH_SELECTED_NODE':
								node = state.nodes.filter( node => node.id === action.payload )[0];
								return {
										...state,
										nodes: [ 
												...state.nodes, 
												{ ...state.selected, color: colors.node.done, }, 
												{ ...node, color: colors.node.selected },
										],
										selected: node,
										definedNode: node,
								};
						case 'TOGGEL_MODAL':
								return {
										...state,
										showModal: !state.showModal,
								};
						case 'SET_SHOW_MODAL':
								return {
										...state,
										showModal: action.payload,
								};
						case 'SET_WORD_NOT_FOUND':
								return {
										...state,
										isWordNotFound: true,
								};
						case 'DISSMISS_NOT_FOUND':
								return {
										...state,
										isWordNotFound: false,
								};
						case 'SET_DEEP_LINKS':
								return {
										...state,
										isDeepLinks: !state.isDeepLinks,
								};
						case 'TOGGLE_SIDE_BAR':
								return {
										...state,
										isSideBar: !state.isSideBar,
								};
						case 'SET_FETCH_FAILED':
								return {
										...state,
										isError: true,
								};
						default:
								throw new Error();
				}
		}

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
										.then(result => {
												console.log('processing node:')
												console.log(API_ENDPOINT + synonym["synonym"])
												console.log(synonym);
												console.log(result)
												return processNode(result)
										})
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

		const closeModal = () => {
				dispatchState({type: 'SET_SHOW_MODAL', payload: false})
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

		const toogleSideBar = () => dispatchState({type:'TOGGLE_SIDE_BAR'})

		const renderDefinitions = (node) => {
				let syntaxes = new Set();
				node.definitions.forEach( def => syntaxes.add(def.syntax));
				return <Menu>
						{(!state.isSideBar)? <h1>Definitions:</h1>: <>< /> }
						{ [...syntaxes].map( (syntax, i) => 
								(i===0)?
										<SubMenu key={i} title={syntax} open={true} icon={<FontAwesomeIcon icon={faCircle}/>}>
												{ node.definitions.map( (definition, i) => 
														(syntax === definition.syntax)?
																<div key={i}>
																		<SidebarContent>
																				<br />
																				<span style={{paddingRight: 2}}>{definition.definition}</span>
																		</SidebarContent> 
																</div>: null
												)}
										</SubMenu> 
										:
										<SubMenu key={i} title={syntax} icon={<FontAwesomeIcon icon={faCircle}/>} >
												{ node.definitions.map( (definition, i) => 
														(syntax === definition.syntax)?
																<div key={i}>
																		<SidebarContent>
																				<br />
																				<span style={{paddingRight: 2}}>{definition.definition}</span>
																		</SidebarContent> 
																</div>: null
												)}
										</SubMenu> 
						) }
				</Menu>
		}

		const renderExamples = (node) => {
				return <>
						{(node.examples.length !== 0)? 
								<Menu popperArrow={true}>
										<SubMenu title="Examples:" icon={<FontAwesomeIcon icon={faAlignLeft}/>} style={{fontSize:'20px'}}>
												{ node.examples.map( (example, i) => 
												<SidebarContent key={i}>
														<p>{example['example']}</p>
												</SidebarContent> 
												) }
										</SubMenu>
								</Menu> : null
						}
				</>
		}

		const renderEtymology = (node) => {
				return <>
						{(node.etymology !== "")? 
								<Menu popperArrow={true} >
										<SubMenu title="Etymology:" icon={<FontAwesomeIcon icon={faLandmark}/>} style={{fontSize:'20px'}}>
												<SidebarContent>
														<p>{node.etymology}</p>
												</SidebarContent> 
										</SubMenu>
								</Menu> : null
						}
				</>
		}

		const renderNodes = (node) => {
				return <>
						{(node.notes !== "")? 
								<Menu popperArrow={true}>
										<SubMenu title="Anotations:"
												icon={<FontAwesomeIcon icon={faStickyNote}/>}
												style={{fontSize:'20px'}}>
												<SidebarContent>
														<p>{node.Notes}</p>
												</SidebarContent> 
										</SubMenu>
								</Menu> : null
						}
				</>
		}
		const renderSynonyms = (node) => {
				return <>
						{(node.synonyms.length !== 0)? 
								<Menu popperArrow={true}>
										<SubMenu title="Synonyms:" icon={<FontAwesomeIcon icon={faProjectDiagram}/>} style={{fontSize:'20px'}}>
												{ node.synonyms.map( (synonym, i) => 
												<MenuItem key={i} active={true}
														onClick={()=> onClickNode(synonym['synonym'])} >
														{synonym['synonym']}
												</MenuItem> 
												) }
										</SubMenu>
								</Menu> : null
						}
				</>
		}


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
						<Navbar expand="lg" className="justify-content-center"  variant="dark" style={{backgroundColor: colors.black}}>
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
								<Carousel>
										<Carousel.Item>
												<img
														className="d-block w-100"
														src="graph_scaled_down.jpg"
														alt="First slide"
												/>
												<Carousel.Caption style={{color:colors.black}}>
														<h3>Graphing the English Language </h3>
														<p></p>
												</Carousel.Caption>
										</Carousel.Item>
										<Carousel.Item>
												<img
														className="d-block h-100 w-100"
														src="graph1.jpg"
														alt="Third slide"
												/>
												<Carousel.Caption style={{color:colors.black}}>
														<h3>Over 400 thousand nodes!!</h3>
														<p></p>
												</Carousel.Caption>
										</Carousel.Item>
										<Carousel.Item>
												<img
														className="d-block h-100 w-100"
														src="graph2.jpg"
														alt="Third slide"
												/>
												<Carousel.Caption style={{color:colors.black}}>
														<h3>Over 600 thousand edges!!</h3>
														<p></p>
												</Carousel.Caption>
										</Carousel.Item>
										<Carousel.Item>
												<img
														className="d-block h-100 w-100"
														src="graph3.jpg"
														alt="Third slide"
												/>
												<Carousel.Caption>
														<h3>Third slide label</h3>
														<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
												</Carousel.Caption>
										</Carousel.Item>
								</Carousel>
								:
								<div style={{display: 'inline',}}>
										<div style={{ float:'left', position: 'absolute', height:'91%'}}>
												<ProSidebar collapsed={state.isSideBar} >
														{(state.isSideBar)?
																<MenuItem onClick={toogleSideBar} icon={
																		<FontAwesomeIcon 
																				style={{
																						marginLeft:'1.7rem', marginTop:'1rem',
																						height:'25px', width:'25px'}}
																				icon={faBook}/>}
																/>
																:<MenuItem onClick={toogleSideBar} icon={
																		<FontAwesomeIcon 
																				style={{ 
																						marginLeft:'6.5rem', marginTop:'1rem',
																						height:'55px', width:'55px'}}
																				icon={faBookOpen}/>}
																/>
														}
														<Menu iconShape="square">
																{(!state.isSideBar)?
																		<SidebarHeader style={{textAlign:'center'}}>
																				<h1>{state.definedNode.word}</h1>
																				<i>{(state.definedNode.definitions[0])?
																								state.definedNode.definitions[0].syntax
																								: null
																						}</i>
																		</SidebarHeader> 
																		: <SubMenu icon={<FontAwesomeIcon icon={faScroll}/>}>
																				<MenuItem active={true} >
																						<h1>{state.definedNode.word}</h1>
																						<i>{(state.definedNode.definitions[0])?
																										state.definedNode.definitions[0].syntax
																										: null
																								}</i>
																				</MenuItem>
																		</SubMenu>
																}
																{renderDefinitions(state.definedNode)}
																{renderExamples(state.definedNode)}
																{renderEtymology(state.definedNode)}
																{renderSynonyms(state.definedNode)}
																{renderNodes(state.definedNode)}
														</Menu>
												</ProSidebar>
										</div>
										<div style={{backgroundImage: 'url(./grid.png)'}} >
												<Graph 
														id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
														data={state}
														config={myConfig}
														onClickNode={onClickNode}
														backgroundColor="black"
												/>
										</div>
								</div>
						}
						<div>
								<Modal
										isOpen={state.showModal}
										onAfterOpen={() => console.log("models was opend")}
										onRequestClose={closeModal}
										style={customStyles}
										contentLabel="Example Modal"
								>
										<div>I am a modal</div>
								</Modal>
						</div>
				</div>
		);
}

export default App;
