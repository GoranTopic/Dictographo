const unselectedNodeColor = '#3D3C3A'
const unselectedLinkColor = '#d3d3d3'
const selectedNodeColor = '#E41B17'
const selectedLinkColor = '#E41B17'
const pathNodeColor = '#17E0E3'
const pathLinkColor = '#17E0E3'
//const pathLinkColor = '#E41B17'

// function for getting random num
export const getRandomInt = (max) => {
		return Math.floor(Math.random() * Math.floor(max))+1 ;
}

// fuction for getting a random string
export const getRandomStr = (length) => {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) result += characters.charAt(Math.floor(Math.random() * charactersLength));
		return result;
}

//generate random link
export const getRandomLinks = (link_number, word, nodes) => {
		var seen_targets = [] 
		var links = [];
		for (var i = 0; i < link_number; i++ ){
				var target = nodes[getRandomInt(nodes.length-1)].id;
				if(!seen_targets.includes(target)){
						links.push({ source: word, target: target });
						seen_targets.push(target);
				}
		}
		return links;
}

// Generate a random node 
export const genRandomNode = (nodes) => {
		var title = getRandomStr(6);
		var links = getRandomLinks(getRandomInt(6), title, nodes);
		return { node:{ id: title }, links };
}


// generate a list of grapth recursibly
export const genGrapNodes = (word, depth=0, data=[]) =>{
		for(var i = 0; i < getRandomInt(3); i++){
				var adjacent_word = getRandomStr(8);
				data.push({  node:{id: adjacent_word }, links:[{ source: word, target: adjacent_word }] });
				if( depth > 0 ) genGrapNodes(adjacent_word, depth -1, data);
		}
		return data;
}

export const makeNewNode = (prevNode, newNode, path=false, selected=false) => {
		var nodeColor = (path)? pathNodeColor : (selected)? selectedNodeColor : unselectedNodeColor
		var linkColor = (path)? pathLinkColor : (selected)? selectedLinkColor : unselectedLinkColor
				return { 
						node:{ id: newNode, color: nodeColor}, 
						links:[{ source: prevNode, target: newNode, color: linkColor}] 
				}
		};

// Generate a Nodes path from  node to the other
export const genPath = (start, destination) =>{
		let distance  = getRandomInt(10) + 5;
		let currentNode = start;
		let data = [];
		data.push({node:{ id: start, color: pathNodeColor}, links:[] });
		for(var i = 0; i < distance; i++){
				var nextNode = getRandomStr(8);
				data.push(makeNewNode(currentNode, nextNode, true));
				for(var j = 0; j < getRandomInt(5); j++){
						var adjacentNode = getRandomStr(8);
						data.push(makeNewNode(nextNode, adjacentNode));
				}
				currentNode = nextNode;
		}
		data.push(makeNewNode(currentNode, destination, true));
		return data;
}


// generate a list of grapth recursibly sent them in lists 
export const genGrapDepth = (word, depth=0, data={ nodes:[], links:[] }) =>{
		// Add word to data nodes 
		data.nodes.push({ id: word });
		//for word get adjacent words into link data
		if( depth <= 0 ) return data;
		for(var i = 0; i < getRandomInt(6); i++){
				//gen a adjecent word
				var adjacent_word = getRandomStr(8);
				// Add link 
				data.links.push({ source: word, target: adjacent_word });
				// be a recursive bitch
				genGrapDepth(adjacent_word, depth -1, data);
		}
		return data;
}



