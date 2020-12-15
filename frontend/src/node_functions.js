import { colors, API_ENDPOINT }  from "./myConfig";

/*
 * ==================================================
 *      Functions Definnitions for handeling changes
 * ==================================================
 * 
 */


const processNode = (node) =>{
		/* process a node from the api into one for the dispatcher
		 * it changes title for id, for instance */
		node['id'] = node.w_id;
		node['key'] = node.w_id;
		node['isSelected'] = false;
		node['color'] = colors.node.default;
		return node
}

// retrive node with given node id from state 
const getNode = (nodeId, state) => state.nodes.filter( node => node.id === nodeId )[0]

// attemps to return true id node is not in state, 
// maybe make a dic so that is it not n time
const isNewNode = (nodeId, state) => state.nodes.every( node => node.id !== nodeId )

const onClickNode = (nodeId, state, dispatchState) => {
		// when user clicks on a node
		queryAdjecentNodes(getNode(nodeId, state), state, dispatchState)
		dispatchState({type:'SWITCH_SELECTED_NODE', payload: nodeId})  
};

const timelyDispatch = (dispatchFunc , waitTime=150) => {
	/* takes a dispachState functions and dispaches it in a 
	 * random timply fashion this is usefulf for node not to 
	 * appear all at once in the graph and make it easier on 
	 * the browser. Returns nothing*/
		setTimeout(dispatchFunc, waitTime);
}

const queryNewWord = (word, state, dispatchState) => {
				/* reset the graph state and start a new query into a word, 
				 * sometime this stymes when it is called a second time,
				 * this might be because of dispatchState being called twice
				 * must investigate.  */
				fetch(API_ENDPOINT + word)
				// unpack json
						.then(result => result.json()) //unpack word
						.then(result => isWordNotFound(result)) //check if word was found
						.then(result => processNode(result)) //process node
						.then(node => { //dispatch word
								dispatchState({type: 'SET_NEW_NODE', payload: node}); 
								return node; })
						// get the surrounding words
						.then(node => queryAdjecentNodes(node, state, dispatchState))
						.catch(() => dispatchState({type:'SET_FETCH_FAILED'}));
		}

const queryAdjecentNodes = (node, state, dispatchState) => {
		/* for every node request the adjecent node to it */
		let linkAll = state.isDeepLinks;
		// define whether we should link te deeper
		let graph_type = 'synonyms/';
		// define which type of graph we are requesting
		fetch(API_ENDPOINT + graph_type + node.id )
		// request the synonyms
				.then(result => result.json())
				.then(result => isWordNotFound(result))
				.then(adjNodes => adjNodes.forEach( 
						// for every node in the array
						adjNode => timelyDispatch(() => {  
								//for each of the nodes in the list 		
								adjNode = processNode(adjNode); //process node 
								if(linkAll || isNewNode(adjNode.id, state)){
										// proces is it is new node, or deep link set
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
								}
						})
						
				))
				.catch(() => dispatchState({type:'SET_FETCH_FAILED'}))
}

const isWordNotFound = (response, dispatchState) =>{
		/* Set error to state when user search a word not found */
		if( response.detail === "Not found." ) {
				dispatchState({type: 'SET_WORD_NOT_FOUND'})
				throw new Error("word not found")
		}else{
				return response
		}
}

const onMouseOverNode = function(nodeId, dispatchState) {
		dispatchState({type:'SET_DEFINED_NODE', payload: nodeId})  
		// need to fund a way to also run the default fuction 
};

export { processNode, isWordNotFound, queryNewWord, queryAdjecentNodes, onClickNode, onMouseOverNode }

