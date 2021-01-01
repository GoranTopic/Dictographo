import { colors }  from "../myConfig";

const initial_state = {
		/* graph payload (with minimalist structure) */
		nodes: [],
		links: [],
		selected:{},
		definedNode:{},
		graphType: '2D',
		prevGraphType:  'd3',
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
				case 'SET_NEW_LINK':
						return { 
								...state, 
								links: [ ...state.links, action.payload ]
						};
				case 'SET_NODE_LINK':
						return { 
								...state, 
								nodes: [ ...state.nodes, action.payload.node ],
								links: [ ...state.links, action.payload.link ]
						};
				case 'CLEAR_LINKS':
						return { 
								...state, 
								links: [],
						};
				case 'CLEAR_NODES':
						return { 
								...state, 
								nodes: [],
						};
				case 'SET_STATE':
						return { 
								...state, 
								nodes: [ ...state.nodes, ...action.payload.nodes ],
								links: [ ...state.links, ...action.payload.links ]
						};
				case 'SET_NEW_NODE':
						return {
								...state,
								nodes: [ { ...action.payload, selected: true, color: colors.node.selected  } ],
								links: [],
								selected: action.payload, // save as selected
								definedNode: action.payload, // save as a definietion 
								isEmpty: false,
						};
				case 'SET_PATH_NODE':
						return {
								...state,
								nodes: [ ...state.nodes, { ...action.payload.node, selected: true, }],
								links: [ ...state.links, { ...action.payload.link, color: colors.link.onPath } ],
								selected: action.payload.node, // save as selected
								definedNode: action.payload.node, // save as a definietion 
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
								...state,// I have the feeling that this i adding oter nodes to te state
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
				case 'CHANGE_D3_STATE':
						return {
								...state,
								links: [],
						}
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

