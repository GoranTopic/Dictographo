import React from 'react';
import './App.css';
import { Graph } from "react-d3-graph";
import  myConfig  from "./myConfig";
const API_ENDPOINT = 'http://127.0.0.1:8000/api/v1/'

/* graph payload (with minimalist structure)
const state_guide = {
		nodes: [{ id: "zine", }, { id: "cool" }, { id: "world" }],
		links: [
				{ source: "zine", target: "cool"  },
				{ source: "zine", target: "world" },
		],
		isError: false,
		isLoading: true,
		searchTerm: '',
		DestinationTerm: '',
};
*/

// graph payload (with minimalist structure)
const initial_state = {
		nodes: [{ id: "zine", synonyms:[ {synonym: 'anxious'}, ] }, { id: "cool", synonyms:[ {synonym: 'anxious'}, ]}, { id: "world", synonyms:[]}],
		links: [
				{ source: "zine", target: "cool" },
				{ source: "zine", target: "world"},
		],
		isError: false,
		isLoading: true,
		searchTerm: '',
		DestinationTerm: '',
};

function App() {
		// make reducer for the words data and internal state 
		const stateReducer = (state, action) =>{
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
						case 'SET_STATE':
								return { 
										...state, 
										nodes: [ ...state.nodes, ...action.payload.nodes ],
										links: [ ...state.links, ...action.payload.links ]
								};
						case 'SET_SEARCH_NODE':
								return {
										...state,
										nodes: [ action.payload ],
										links: [],
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
						case 'SET_FETCH_FAILED':
								return {
										...state,
										isError: true,
								};
						default:
								throw new Error();
				}
		}

		const [state, dispatchState] = React.useReducer( stateReducer, initial_state );
		/* define dispatcher for the Internal data */

		const processNode = (node) =>{
				/* process a node from the api into one for the dispatcher
				 * it changes title for id, for instance */
				node['id'] = node.title
				return node
		}

		const createShallowLinks = (node) => 
				node.synonyms.map( synonym => ({ source: synonym['synonym'], target: node.id }))

		const createDeepLinks = (newNode) => {
				/* This is pornography, but it basically check if a new word is a synonym of one already 
					or if the new word has synonyms one of the words already in state */
				let newLinks = [];
				// look if state nodes are synonym of new word
				state.nodes.forEach( 
						node => node.synonyms.forEach( 
								synonym => synonym["synonym"] === newNode.id && newLinks.push({ source:node.id, target:newNode.id })
						)
				)
				// look if new word has a synonym to to state word
				newNode.synonyms.forEach( 
					synonym => 
						state.nodes.forEach( 
								node => node.id === synonym["synonym"] && newLinks.push({source:node.id, target:newNode.id})
						)
				)
				return newLinks
		} 

		// get surrounding nodes
		//const getSurroundingNodes( )

		const  loadNodesCallBack = (nodes, withLinks=true) => {
				/* append array of nodes with a waiting time in between them so that they flow
				 * also create new links and append them to state */
				let links;
				if(!(nodes instanceof Array)) nodes = [nodes,]  // if a single node was passed
				nodes.forEach( (node) => { // if passed is an array
						node = processNode(node);
						(withLinks)? links = createDeepLinks(node) : links = false
						dispatchState({ type: 'SET_NEW_NODES', payload: [node,]});
						links && dispatchState({ type: 'SET_NEW_LINKS', payload: links });
				})
		}
		
		const  newSearchCallback = (node) => {
				/* call back for creating a new node */
				node = processNode(node);
				let links;

				node.synonyms.forEach( (synonym) => {
						fetch(API_ENDPOINT + synonym['synonym']) 
								.then( result => result.json())
								.then( result => processNode(result))
								.then( result => callback(result))
								.catch( () => dispatchState({ type: 'SET_FETCH_FAILED' }) );
						requestNode(synonym['synonym']); 
						links.push({ source: node.id, target: synonym['synonym'] })
				});
				dispatchState({ type: 'SET_STATE', payload: {node: node, links: links }});
				
		}

		const  ShallowCallBack = (nodes, withLinks=true) => {
				/* append array of nodes with a waiting time in between them so that they flow
				 * also create new links and append them to state */
				let links;
				if(!(nodes instanceof Array)) nodes = [nodes,]  // if a single node was passed
				nodes.forEach( (node) => { // if passed is an array
						node = processNode(node);
						(withLinks)? links = createDeepLinks(node) : links = false
						dispatchState({ type: 'SET_NEW_NODES', payload: [node,]});
						links && dispatchState({ type: 'SET_NEW_LINKS', payload: links });
				})
		}

		const getNode = (nodeId) => state.nodes.filter( node => node.id === nodeId )[0]
		/* get node with given node id from state */
		
		const requestNode = (word, srcWord=null, callback=(result)=>loadNodesCallBack(result, true)) => { 
				/* request a single node to the api and dispatch to state */
				fetch(API_ENDPOINT + word) 
						.then( result => result.json())
						.then( result => processNode(result))
						.then( result => callback(result))
						.catch( () => dispatchState({ type: 'SET_FETCH_FAILED' }) );
		}
		
		const requestSurroundingNodes = (nodeId) =>{
				// can be optimised by having a sorted list and using binary search
				let node = getNode(nodeId);
				node.synonyms.forEach( (synonym) => requestNode(synonym['synonym']) );
		}	

		// handle the change by seting the state variable to 
		const handleSearchChange = change => dispatchState({ type: 'SET_SEARCH_TERM', payload: change.target.value });
		// handle the change by seting the state variable to 
		const handleDestinationChange = change => dispatchState({ type: 'SET_DEST_TERM', payload: change.target.value });

		// handle submit search button
		const handleSearchSubmit = () =>  {
				requestNode(state.searchTerm, newSearchCallback)
		}
		// get node info
		// handle path button
		const handlePathSubmit = () => { 
				dispatchState({ type: 'RESET_NODE' });
		};

		const onClickNode = function(nodeId) {
				console.log(`clicked node ${nodeId}`);
				requestSurroundingNodes(nodeId);
		};

		const onRightClickNode = function(event, nodeId) {
				window.alert(`Right clicked node ${nodeId}`);
		};

		const onClickLink = function(source, target) {
				window.alert(`Clicked link between ${source} and ${target}`);
		};

		const onRightClickLink = function(event, source, target) {
				window.alert(`Right clicked link between ${source} and ${target}`);
		};

		return (
				<div className="App">
						<div>
								<InputWithLabel id="search" type="text" isFocuse value={state.searchTerm} onInputChange={handleSearchChange}>
										<strong>Search:</strong>
								</InputWithLabel>
								<button type="button" disable={!state.searchTerm} onClick={handleSearchSubmit}>
										Search
								</button>
								<button type="button" onClick={ () => requestNode("anxious") }>
										Add random Nodes
								</button>
						</div>
						<div>
								<InputWithLabel id="destination" type="text" value={state.destinationTerm} onInputChange={handleDestinationChange}>
										<strong>Destination:</strong>
								</InputWithLabel>
								<button type="button" disable={!state.destinationTerm} onClick={handlePathSubmit}>
										Get path
								</button>
						</div>
						<Graph
								id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
								data={state}
								config={myConfig}
								onClickNode={onClickNode}
								onRightClickNode={onRightClickNode}
								onClickLink={onClickLink}
								onRightClickLink={onRightClickLink}
								backgroundColor={"black"}
						/>
				</div>
		);
}

const InputWithLabel = ({ id, type, value, onInputChange, isFocused, children }) => {
		/* A component with the Input and a Label */
		// Define an input ref for passing to input component
		const inputRef = React.useRef()
		// set up a side effect it is updates if the focus changes
		React.useEffect(() => { if(isFocused && inputRef.current) inputRef.current.focused(); }, [isFocused])
		return <>
				<label htmlFor={id}> {children} </label>
				&nbsp;
				<input id={id} ref={inputRef} type={type} value={value} onChange={onInputChange}/>
		</>
}

export default App;
