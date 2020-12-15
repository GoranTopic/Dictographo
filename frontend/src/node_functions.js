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
		requestAdjecentNodes(getNode(nodeId, state), state, dispatchState)
		dispatchState({type:'SWITCH_SELECTED_NODE', payload: nodeId})  
};

const queryNewWord = (word, state, dispatchState) => {
				/* reset the graph state and start a new query into a word, 
				 * sometime this stymes when it is called a second time,
				 * this might be because of dispatchState being called twice
				 * must investigate.  */
				fetch(API_ENDPOINT + word)
				// unpack json
						.then(result => result.json())
						.then(result => isWordNotFound(result))
						.then(result => processNode(result))
						.then(node => { 
								dispatchState({type: 'SET_NEW_NODE', payload: node}); 
								return node; })
						.then(node => requestAdjecentNodes(node, state, dispatchState))
						.catch(() => dispatchState({type:'SET_FETCH_FAILED'}));
		}

const requestAdjecentNodes = (node, state, dispatchState) => {
		/* for every node request the adjecent node to it */
		let linkAll = state.isDeepLinks;
		// define whether we should link te deeper
		let graph_type = 'synonyms/';
		// define which type of graph we are requesting
		let timeoutWait = 2000;
		fetch(API_ENDPOINT + graph_type + node.id )
		// request the synonyms
				.then(result => result.json())
				.then(result => isWordNotFound(result))
				.then(adjNodes => adjNodes.forEach(adjNode => {  
						//for each of the nodes in the list 		
								adjNode = processNode(adjNode); //process node 
								setTimeout(timeoutWait); //wait ofr some time 
								console.log(timeoutWait);
								if(linkAll || isNewNode(adjNode.id, state)){
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
						timeoutWait = timeoutWait * 40000;
						})
				)
				.catch(() => dispatchState({type:'SET_FETCH_FAILED'}))
}

const isWordNotFound = (response, dispatchState) =>{
		// Set error to state when user search a word not found
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

export { processNode, isWordNotFound, queryNewWord, requestAdjecentNodes, onClickNode, onMouseOverNode }

