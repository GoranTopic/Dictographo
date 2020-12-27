import { colors, API_ENDPOINT }  from "./myConfig";
import { getRandomInt }  from "./Components/RandomGenerator";

/*
 * ==================================================
 *      Functions Definnitions for handeling changes
 * ==================================================
 * 
 */

/* 
 * Functions for processing single node search and adjacent nodes 
 * */

const processNode = (node) =>{
		/* process a node from the api into one for the dispatcher
		 * it changes title for id, for instance */
		node['id'] = node.w_id;
		node['key'] = node.w_id;
		node['isSelected'] = false;
		node['color'] = colors.node.default;
		return node
}

/* retrive node with given node id from state */
const getNode = (nodeId, state) => 
		state.nodes.filter( node => 
				node.id === nodeId )[0]

/* returns true id node is not in state in state, 
 * could import time complexity by using a hash table */
const isNewNode = (nodeId, state) => 
		state.nodes.every( node => node.id !== nodeId )

/* when user clicks on a node, query adjacent nodes
 * and set node as selected */
const onClickNode = (nodeId, state, dispatchState) => {
		queryAdjecentNodes(getNode(nodeId, state), state, dispatchState)
		dispatchState({type:'SWITCH_SELECTED_NODE', payload: nodeId})};

/* takes a dispachState functions and dispaches it in a 
	 * random timply fashion this is usefulf for node not to 
	 * appear all at once in the graph and make it easier on 
	 * the browser. Returns nothing*/
const timelyDispatch = (dispatchFunc , waitTime=0.5, random=0) => 
		setTimeout(dispatchFunc, waitTime + getRandomInt(random));

/* reset the graph state and start a new query into a word, 
 * sometime this stymes when it is called a second time,
 * this might be because of dispatchState being called twice
 * must investigate.  */
const queryNewWord = (word, state, dispatchState) => {
		fetch(API_ENDPOINT + word) // fetch word
				.then(result => //unpack node
						result.json())
						.then(result => //check if word was found
								catchError(result, state, dispatchState)) 
						.then(result => //process node
								processNode(result)) 
						.then(node => { //dispatch as new word
								dispatchState({
										type: 'SET_NEW_NODE', 
										payload: node
								}); 
								return node; })
				.then(node => // get the surrounding words
						queryAdjecentNodes(node, state, dispatchState))
						.catch(() => 
								dispatchState({type:'SET_FETCH_FAILED'}));
}

/* Fetch all the adjancent node of a given node and dispatch */
const queryAdjecentNodes = (node, state, dispatchState) => {
		// define whether we should link te deeper
		let linkAll = state.isDeepLinks;
		// define which type of graph we are requesting
		let graph_type = 'synonyms/';
		// fetch nodes
		fetch(API_ENDPOINT + graph_type + node.id )
				.then(result =>// request the synonyms
						result.json())
						.then(result =>// catch erros if there are any
								catchError(result, state, dispatchState))
						.then(adjNodes =>  
								adjNodes.forEach(// for every node in the fetched array
										adjNode => timelyDispatch(() => {// dispacth timely
												// for each of the nodes in the list 		
												adjNode = processNode(adjNode); //process node 
												// proces is it is new node, or deep link set
												if(linkAll || isNewNode(adjNode.id, state)){
														dispatchState({//dispatch node with link node
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


/* 
 * Functions for processing paths of nodes 
 *
 * */

/* takes a list of inputs 
 * and divied it into pairs */
const pairUp = (list) => {
		let pairs = [];
		for(let i = 0; i+1 <= list.length - 1; i++)
				pairs.push({'first': list[i], 'last':list[i+1]});
		return pairs
}

/* gets a list of word and removes the ones which 
 * do not checkout in the api.
 * This seemly simple task becomes complex to do 
 * with promises*/
const removeNotFoundWords = async (words, dispatchState) => {
		var foundWords = new Array(words.lenght)
		// make a empty array of as long as
		// the origial to mantain the same order
		await Promise.all( words.map( (word, index) => 
				// for every word check the api, 
				// await untill all promises are returned
				fetch(API_ENDPOINT+'check/'+ word +"/")
				.then( response => response.json())
				.then( response => { 
						if(response.detail === "Found."){ 
								foundWords[index] = word 
						}else{
								dispatchState({
										type:'SET_WORD_NOT_FOUND', 
										payload: word})
						}
				})
				.catch(err => console.log(err))
		))
		return foundWords.filter( Boolean )
}

/* add foreach node in the path where it comming from,
		* also adds the color to be graphed */
const processPath = (path, request) =>{
		let prevNode = null; //declare prev node
		if(path instanceof Array){ // only if it is a list 
				path.forEach((node) => { 
						node = processNode(node); //might as well process node 
						// set the previous node if there was a previous one
						node['prevNode'] = (prevNode)? prevNode : node.id;
						// colo if it is reuested
						if(node.word === request.first || node.word === request.last)
								node['color'] = colors.node.selected // color as selected
						// if it is start of path set first previous to itself
						prevNode = node.id;
				})
		}
		return path
}


/* gets a list of pair request for paths an queryes the api 
 * then is saves those paths in a order list and returns*/
const fetchPathsParts = async (pathRequests, dispatchState) => {
		// make an empty array of the same length as request paths
		var paths = new Array(pathRequests.length)
		await Promise.all( //wait for all promises to return 
				pathRequests.map((request, index) =>
						fetch(API_ENDPOINT+'path/'+request.first+"/"+request.last)
						.then( response => response.json())
						.then( response => processPath(response, request))
						.then( response => { 
								if(response.detail === "Path not found."){ 
										dispatchState({
												type:'SET_PATH_NOT_FOUND', 
												payload: request});
										paths[index] = null;
								}else{
										paths[index] = response;
								}
						})
						.catch(err => console.log(err))
				))
		return paths;
}

const amendPath = async (paths) => {
		/* takes a list of paths and is there
		 * is a gap tries to find a connecting path*/
		const getGaps = (paths) => {
				/* takes a list of paths retusn a list of 
				 * indexes where the gaps are*/
				let gaps = [];
				let gap = {start:null, end:null}
				let wasPath = false;
				let wasGap = false;
				paths.forEach((path, index) => { // fi found gap
						if(path === null){// or is frist index
								if(wasPath || index === 0){  // comes from gap
										gap.start = index //save start
								}
								// and comes from path
								wasGap = true; // switch to gap
								wasPath = false 
						}else{ //if is path
								if(wasGap){   // and comes from gap
										gap.end = index; // record end
										gaps.push({...gap}); //save gap
								} 
								wasPath = true; // switch to path 
								wasGap = false;
						}
				}) 
				return gaps;
		}

		function* nextNodeGenerator(start, end, paths) {
				/* makes a generator to go thought the nodes
				 * which must try to find a bridge*/
				// for every path left in paths
				for(let pathIndex = end; pathIndex < paths.length; pathIndex++){
						let curPath = paths[pathIndex]
						if(paths[pathIndex] !== null){ // if it is not a null path
								// 	if gap is one length, start at 1, else 0
								//let index = (end-start > 1)? 0 : 1; 
								// for every node in the current path
								for(let nodeIndex = 0; nodeIndex < curPath.length; nodeIndex++){
										let stop = yield curPath[nodeIndex]; // return the current path 
										if(stop === true) // if the messeage send back is to stop
												return null; // stop generation
								}
						}
				}
				return null; // reached the end
		}


		const bridgeGap = async (start, end, paths) => {
				/* gets a set of indexes indicating the gap, 
				 * make fetch request to attempt to find a 
				 * conncetion */
				/* generator fuction for trying node to  find a bridge*/
				if(start === 0 ) return paths; // if it is the last node do nothing
				// ge the previous path 
				let leftPath = paths[start-1];
				// last word in the left side path
				let lastWord = leftPath[leftPath.length-1].word; 
				// if there exacly one gap, dont bother chechi
				//let index = (end-start > 1)? 0 : 1; 
				let gen = nextNodeGenerator(start, end, paths);
				let curIter = gen.next();
				const foundBridge = (response) =>{
						if(response.detail === "Path not found."){ 
								curIter = gen.next(); // get the next node
						}else{
								//response.pop() // pop last input so that there are no inputs
								//paths[start-1].pop() // avid diplucates
								paths[start] = response; //set the bridge
								curIter = gen.next(true); //break loop
						}
				}
						 
				while(!curIter.done){ // while the bridge is not been found
						await fetch(API_ENDPOINT+'path/'+lastWord+"/"+ curIter.value.word)
								.then(response => response.json())
								.then(response => processPath(response))
								.then(foundBridge )
								.catch(err => console.log(err))
				}
		}
		let gaps = getGaps(paths);
		await Promise.all(gaps.map( gap => bridgeGap(gap.start, gap.end, paths)))
		return paths;
}


/* get a list of paths of words, joins them together 
 * and dipatches it to state*/
const dispatchPath = (paths, state, dispatchState) => {
		let finalPath = []; // declare final array
		//if( paths isIntanceof Array) return null;
				paths = paths.filter( Boolean ); // filter any null chars
		// add all paths together
		paths.forEach(path => finalPath.push(...path)) 
		//console.log(finalPath)
		finalPath.forEach((node, index) =>//for every node in final path
				timelyDispatch(() => { // dispath in a timely order
						//console.log(state.isEmpty)
						if(index === 0){ // if this is the first node
								dispatchState({ //dipatch as new node
										type: 'SET_NEW_NODE', 
										payload: node, })
						}else{ // is not first node
								dispatchState({ //if append a node list
										type: 'SET_PATH_NODE', 
										payload: { 
												node: node,
												link: { 
														target: node.id,
														source: node.prevNode, 
												}
										}
								})
						}
				})
		)
}

/* gets passesed a set of two words, 
 * queries the server for the path and 
 * dispateches the result to state */
const queryPath = async (words, state, dispatchState) => {
		//first remove all words from the input which are not in api
		words = await removeNotFoundWords(words, dispatchState)
				.catch(err =>  //catch error is could not fetch
						dispatchState({
								type:'SET_ERROR', 
								payload:"Could not get words"}));
		// get the list of words and return them in pair
		// w1, w2, w3, w4 => (w1, w2), (w2, w3), (w3, w4)
		let pathRequests = pairUp(words);
		// for every pair of words query the api for a path between them
		let pathParts = await fetchPathsParts(pathRequests, dispatchState)
				.catch(err => 
						dispatchState({
								type:'SET_ERROR', //catch error is could not fetch
								payload: "could not get paths"}));
		// get the final path and attempt to cannect them together
		// to form one cohesive path
		let finalPath = await amendPath(pathParts)
		.catch(err => 
				dispatchState({
						type:'SET_ERROR', 
						payload: "Could not amend path"}))
		dispatchPath(finalPath, state, dispatchState)
		// dispatch the ammedned path to state to be graphed
}


/* Set error to state when user search a word not found */
const catchError = (response, state, dispatchState) => {
		//console.log("got to cath error:")
		//console.log(response)
		if(response instanceof Array){
				let foundWords = []
				//console.log("words was not found")
				// if it has the response for many words
				response.forEach((word, index, words) => {
						if(word.detail === "Not Found."){
								dispatchState({
										type: 'SET_WORD_NOT_FOUND', 
										payload: word.w_id});
						}else{
								foundWords.push(word);
						}
				})
				return foundWords;
		}else{ // if it only one elment
				if(response.detail === "Not found.") {
						dispatchState({
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
										'last': response.last, }})
						throw new Error("path not found");
				}else{
						return response
				}
		}
}

const onMouseOverNode = function(nodeId, dispatchState) {
		dispatchState({type:'SET_DEFINED_NODE', payload: nodeId})  
		// need to fund a way to also run the default fuction 
};

export { processNode, catchError, queryNewWord, queryAdjecentNodes, queryPath, onClickNode, onMouseOverNode }

