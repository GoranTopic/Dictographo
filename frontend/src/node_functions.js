import { colors, API_ENDPOINT }  from "./myConfig";
import { getRandomInt }  from "./Components/RandomGenerator";

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

const timelyDispatch = (dispatchFunc , waitTime=0, random=10) => {
	/* takes a dispachState functions and dispaches it in a 
	 * random timply fashion this is usefulf for node not to 
	 * appear all at once in the graph and make it easier on 
	 * the browser. Returns nothing*/
		setTimeout(dispatchFunc, waitTime + getRandomInt(random));
}

const queryNewWord = (word, state, dispatchState) => {
		/* reset the graph state and start a new query into a word, 
		 * sometime this stymes when it is called a second time,
		 * this might be because of dispatchState being called twice
		 * must investigate.  */
		fetch(API_ENDPOINT + word)
		// unpack json
				.then(result => result.json()) //unpack word
				.then(result => catchError(result, state, dispatchState))//check if word was found
				.then(result => processNode(result)) //process node
				.then(node => { //dispatch word
						dispatchState({
								type: 'SET_NEW_NODE', 
								payload: node
						}); 
						return node; })
		// get the surrounding words
				.then(node => queryAdjecentNodes(node, state, dispatchState))
				.catch(() => dispatchState({type:'SET_FETCH_FAILED'}));
}

const queryPath = async (words, state, dispatchState) => {
		/* gets passesed a set of two words, 
		 * queries the server for the path and 
		 * dispateches the result to state */
		//split words into arrays
		//let path;
		try {
				let first;
				let second;
				for( var i = 0; i+1 <= words.length-1; i++){
						first = words[i];
						second = words[i+1];
						//for every node in the array get two by two
						let request = await fetch(API_ENDPOINT+'path/'+ first +"/"+second)
								.catch(err => { dispatchState({type:'SET_FETCH_FAILED'}); });
						let result = await request.json(); // unpack json
						result = catchError(result, state, dispatchState);

				}
		} catch (error) {
				console.error(error);
		}
				
		/*
		console.log("this ran")
		let prevNode = null;
		let first;
		let second;

		for( var i = 0; i+1 <= words.length-1; i++){
				first = words[i];
				second = words[i + 1];
				//console.log(words)
				//console.log(i)
				console.log(first);
				console.log(second);
				fetch(API_ENDPOINT + 'path/' +  first  + "/" + second) 
						.then(result => result.json()) // unpack json
						.then(nodes => {console.log(nodes); return nodes })
						.then(nodes => catchError(nodes, state, dispatchState)) 
							//check if words not found
						.then(pathNodes => {
								//console.log(pathNodes)
								pathNodes.forEach((node, index) => 
										timelyDispatch(() => {  
												node = processNode(node);
												if (prevNode === null){ 
														// if this is the first node
														dispatchState({
																type: 'SET_NEW_NODE', 
																payload: node,
														})
												}else{
														console.log(prevNode.id)
														console.log(" --> ")
														console.log(node.id)
														console.log("\n")
														//if there is already other nodes
														dispatchState({
																type: 'SET_PATH_NODE', 
																payload: { 
																		node: node,
																		link: { 
																				source: prevNode.id, 
																				target: node.id 
																		}
																}
														})
												}
												prevNode = node;
										}, 25,0)
								) //se the time as 25 and the random to 0
						})
						.catch(() => dispatchState({type:'SET_FETCH_FAILED'}));
		}
		*/
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
				.then(result => catchError(result, state, dispatchState))
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



const catchError = (response, state, dispatchState) =>{
		/* Set error to state when user search a word not found */
		//console.log("got to cath error:")
		//console.log(response)
		if(response.detail === "Not found.") {
				dispatchState({ // if reponce is not found
						type: 'SET_WORD_NOT_FOUND', 
						payload: state.searchTerm});
				throw new Error("word not found");
		}else if(response.detail === "Path not found."){
				// if the error is path not found
				//console.log("path was not found")
				dispatchState({ 
						type: 'SET_PATH_NOT_FOUND', 
						payload: { 
								'first': response.first,
								'last': response.last,
						}
				})
				throw new Error("path not found");
		}
}

const onMouseOverNode = function(nodeId, dispatchState) {
		dispatchState({type:'SET_DEFINED_NODE', payload: nodeId})  
		// need to fund a way to also run the default fuction 
};

export { processNode, catchError, queryNewWord, queryAdjecentNodes, queryPath, onClickNode, onMouseOverNode }

