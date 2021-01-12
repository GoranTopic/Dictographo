import { colors }  from "../myConfig";

const initial_state = {
		/* graph payload (with minimalist structure) */
		nodes: [], // the master node information 
		links: [],  //the master links information
		d3Data:{ // the copy of data for the d3 graph
				nodes: [],
				links: [],
		},
		forceData:{ // th copy of data for the force graphs
				nodes: [],
				links: [],
		},
		selected:{},
		definedNode:{},
		graphType: 'd3',
		isError: false,
		errorMsg: "",
		isFetchFailed: false,
		isWordNotFound: false,
		wordsNotFound: [],
		isPathNotFound: false,
		pathsNotFound: [],
		isEmpty: true,
		isLoading: true,
		searchTerm: '',
		DestinationTerm: '',
		isDeepLinks: false,
		showModal: false,
		isSideBar: true,
};

const stateReducer = (state, action) =>{
		/* make reducer for the words data and internal state */
		let node;
		let stringLink 

		/* finds a node with a given string and colors the node */
		const findIdNcolor = (selectedNode, color) =>
				(node) => node.id === selectedNode? {...node, color: color }: node; 
		/* reomeves the duplicate node or link in a array */
		const removeDuplicateWithSet = ( array ) =>{
				let jsonObject = array.map(JSON.stringify); 
				let uniqueSet = new Set(jsonObject); 
				let uniqueArray = Array.from(uniqueSet).map(JSON.parse); 
				return uniqueArray
		}

		const removeDuplicateNodes = ( nodes ) => {
				let keys = new Set();
				let uniqueArray = [];
				nodes.forEach( node => { 
						if( !keys.has(node.id)){ 
								// if it is not in unique keys
								uniqueArray.push(node);
								keys.add(node.id);
						} 
				})
				return uniqueArray;
		}

		const removeDuplicateLinks = ( links ) => {
				let keys = new Set();
				let uniqueArray = [];
				links.forEach( link => {
						// if it is an link
						let id = link.source + ',' + link.target;
						if( !keys.has(id) ){ 
								// if it is not in unique keys
								uniqueArray.push(link);
								keys.add(id);
						}
				})
				return uniqueArray;
		}

		switch (action.type){
				case 'SET_NEW_NODES':
						return { 
								...state, 
								nodes: [ ...state.nodes, ...action.payload ],
								d3Data: {
										...state.d3Data, 
										nodes: [ ...state.d3Data.nodes, ...action.payload ],
								},
								forceData: {
										...state.forceData, 
										nodes: [ ...state.forceData.nodes, ...action.payload ],
								},
						};
				case 'SET_NEW_LINKS':
						return { 
								...state, 
								links: [ ...state.links, ...action.payload ],
								d3Data: {
										...state.d3Data, 
										links: [ ...state.d3Data.links, ...action.payload ],
								},
								forceData: {
										...state.forceData, 
										links: [ ...state.forceData.links, ...action.payload ],
								},
						};
				case 'SET_NEW_LINK':
						stringLink = { 
								...action.payload, 
								source:action.payload.source.id,
								target:action.payload.target.id,
								color: colors.link.default,
						}
						return { 
								...state, 
								links: [ ...state.links, stringLink ],
								d3Data: {
										...state.d3Data, 
										links: removeDuplicateWithSet([ ...state.d3Data.links, stringLink ]),
								},
								forceData: {
										...state.forceData, 
										links: [ ...state.forceData.links, action.payload ],
								},
						};
				case 'SET_NODE_LINK':
						stringLink = { 
								...action.payload.link, 
								source:action.payload.link.source.id,
								target:action.payload.link.target.id,
								color: colors.link.default,
						}
						return { 
								...state, 
								nodes: removeDuplicateNodes([ ...state.nodes, action.payload.node ]),
								links: removeDuplicateLinks([ ...state.links, stringLink ]),
								d3Data: {
										...state.d3Data, 
										nodes: removeDuplicateNodes([ ...state.d3Data.nodes, { ...action.payload.node } ]),
										links: removeDuplicateWithSet([ ...state.d3Data.links, stringLink ]),
								},
								forceData: {
										...state.forceData, 
										nodes: [ ...state.forceData.nodes, action.payload.node ],
										links: [ ...state.forceData.links, stringLink ],
								},
						};
				case 'CLEAR_LINKS':
						return { 
								...state, 
								links: [],
								d3Data: {
										...state.d3Data, 
										links: [],
								},
								forceData: {
										...state.forceData, 
										links: [],
								},
						};
				case 'CLEAR_NODES':
						return { 
								...state, 
								nodes: [],
								d3Data: {
										...state.d3Data, 
										nodes: [],
								},
								forceData: {
										...state.forceData, 
										nodes: [],
								},
						};
				case 'SET_STATE':
						return { 
								...state, 
								nodes: [ ...state.nodes, ...action.payload.nodes ],
								links: [ ...state.links, ...action.payload.links ],
								d3Data: {
										...state.d3Data, 
										nodes: [ ...state.d3Data.nodes, ...action.payload.nodes ],
										links: [ ...state.d3Data.links, ...action.payload.links ],
								},
								forceData: {
										...state.forceData, 
										nodes: [ ...state.forceData.nodes, ...action.payload.nodes ],
										links: [ ...state.forceData.links, ...action.payload.links ],
								},
						};
				case 'SET_NEW_NODE':
						return {
								...state,
								nodes: [ { ...action.payload} ],
								links: [],
								d3Data: {
										...state.d3Data, 
										nodes: [{ ...action.payload, selected: true, color: colors.node.selected  }],
										links: [],
								},
								forceData: {
										...state.forceData, 
										nodes: [ action.payload  ],
										links: [],
								},
								selected: action.payload, // save as selected
								definedNode: action.payload, // save as a definietion 
								isEmpty: false,
						};
				case 'SET_PATH_NODE':
						return {
								...state,
								nodes: [ ...state.nodes, { ...action.payload.node, selected: true, }],
								links: [ ...state.links, { ...action.payload.link, color: colors.link.onPath } ],
								d3Data: {
										...state.d3Data, 
										nodes: [ ...state.d3Data.nodes, { ...action.payload.node, selected: true, }],
										links: [ ...state.d3Data.links, { ...action.payload.link, color: colors.link.onPath } ],
								},
								forceData: {
										...state.forceData, 
										nodes: [ ...state.forceData.nodes, { ...action.payload.node, selected: true, }],
										links: [ ...state.forceData.links, { ...action.payload.link, color: colors.link.onPath } ],
								},
								selected: action.payload.node, // save as selected
								definedNode: action.payload.node, // save as a definietion 
								isEmpty: false,
						};
				case 'SET_NODE_DONE':
						return {
								...state,
								d3Data: {
										...state.d3Data, 
										nodes: state.d3Data.nodes.map(findIdNcolor(action.payload.id, colors.node.done)), 
								},
								isEmpty: false,
						};
				case 'SET_DEFINED_NODE':
						node = state.nodes.filter( node => node.id === action.payload )[0];
						return {
								...state,
								definedNode: node,
						};
				case 'SET_NODE_SELECTED':
						return {
								...state,
								d3Data: {
										...state.d3Data, 
										nodes: state.d3Data.nodes.map(findIdNcolor(action.payload.id, colors.node.selected)), 
								},
								selected: action.payload,
						};
				case 'SWITCH_SELECTED_NODE':
						return { 
								...state,
								d3Data: {
										...state.d3Data, 
										nodes: state.d3Data.nodes.map(findIdNcolor(action.payload.id, colors.node.selected)), 
								},
								selected: action.payload,
								definedNode: action.payload,
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
								isError: true,
								isWordNotFound: true,
								// add not found wors to list
								wordsNotFound: new Set([ ...state.wordsNotFound, action.payload]),
						};
				case 'SET_PATH_NOT_FOUND':
						return {
								...state,
								isError: true,
								isPathNotFound: true,
								pathsNotFound: new Set([ ...state.pathsNotFound, { ...action.payload}]),
						};
				case 'DISSMISS_ERROR':
						return {
								...state,
								isError: false,
								errorMsg: "",
								isWordNotFound: false,
								wordsNotFound: [],
								isPathNotFound: false,
								pathsNotFound:  [],
						};
				case 'TOGGLE_DEEP_LINKS':
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
								isFetchFailed: true,
						};
				case 'SET_GRAPH_TYPE':
						return {
								...state,
								// save the previous graph type
								prevGraphType : state.graphType,
								// set changed graph type
								graphType: action.payload,
						};
				case 'SET_ERROR':
						return {
								...state,
								isError: true,
								errorMsg: action.payload,
						};
				default:
						throw new Error();
		}
}

export { initial_state, stateReducer };

