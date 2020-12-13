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

// attemps to return true id node is not in state
const isNewNode = (nodeId, state) => state.nodes.every( node => node.id !== nodeId )

const onClickNode = (nodeId, state, dispatchState) => {
		// when user clicks on a node
		requestAdjecentNodes(getNode(nodeId, state), state, dispatchState)
		dispatchState({type:'SWITCH_SELECTED_NODE', payload: nodeId})  
};

const requestAdjecentNodes = (node, state, dispatchState) => {
		/* for every node request the adjecent node to it */


		/*
		node.synonyms.forEach(synonym => {
				if(isNewNode(synonym['synonym'], state)){
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
				*/
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

export { processNode, isWordNotFound, requestAdjecentNodes, onClickNode, onMouseOverNode }

