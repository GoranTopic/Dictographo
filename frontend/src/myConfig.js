// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
// Also misc. settings

const DEBUGGING = true

const API_ENDPOINT = DEBUGGING ? 
	'http://127.0.0.1:8000/api/' :  //debuging local
	'http://128.199.9.124:8080/api/' //production

function getWindowDimensions() {
		const { innerWidth: width, innerHeight: height  } = window;
		return { width : width - 15, height: height - 87 };
}

const {width, height} = getWindowDimensions();

const colors = {
		red: '#800517', // firerick
		black: '#1d1d1d', // some shade of black 
		blue: '#17a2b8', // bootstrap info blue
		node: {  
				default: '#3D3C3A', // oil black
				done: '#B6B6B4', // gray cloud
				stroke: '#8bb5bc', // bootstrap info blue
				highlight: '#E41B17', // red
				highlightStroke: '#27332F', 
				selected: '#800517', // firerick
				onPath: '#990012', // red wine
		},
		link:{
				default: 'rgba(23,162,184,50%)', //bootstrap faded info blue
				gray: '#D1D0CE', // gray goose
				onPath: 'rgba(153,0,18, 70%)', // faded Red wine
				highlight: '#E41B17', // red
				antonim: '',
		},
		font: {
				default: "black",
		}
}

const  graphConfig = {
		"automaticRearrangeAfterDropNode": false,
		"collapsible": false,
		"directed": true,
		"focusAnimationDuration": 0.75,
		"backgroundColor": "white",
		"focusZoom": 1,
		"height": height,
		"width": width,
		"highlightDegree": 100,
		"highlightOpacity": 0.5,
		"linkHighlightBehavior": true,
		"maxZoom": 10,
		"minZoom": 0.1,
		"nodeHighlightBehavior": true,
		"panAndZoom": false,
		"staticGraph": false,
		"staticGraphWithDragAndDrop": false,
		"d3": {
				"alphaTarget": 0.3,
				"gravity": -140,
				"linkLength": 3,
				"linkStrength": 1,
				"disableLinkForce": false
		},
		"node": {
				"color": colors.node.default,
				"fontColor": colors.font.default,
				"fontSize": 8,
				"fontWeight": "bold",
				"highlightColor": colors.node.highlight,
				"highlightFontSize": 14,
				"highlightFontWeight": "bold",
				"highlightStrokeColor": colors.node.highlightStroke,
				"highlightStrokeWidth": 2,
				"labelProperty": "id",
				"mouseCursor": "pointer",
				"opacity": 1,
				"renderLabel": true,
				"size": 210,
				"strokeColor": colors.node.stroke,
				"strokeWidth": "1.6",
				"svg": "",
				"symbolType": "circle"
		},
		"link": {
				"color": colors.link.default,
				"fontColor": "black",
				"fontSize": 8,
				"fontWeight": "normal",
				"highlightColor": colors.link.highlight,
				"highlightFontSize": 8,
				"highlightFontWeight": "normal",
				"labelProperty": "label",
				"mouseCursor": "pointer",
				"opacity": 0.7,
				"renderLabel": true,
				"semanticStrokeWidth": false,
				"strokeWidth": 1.5,
				"markerHeight": 3,
				"markerWidth": 20,
		}
};

export { DEBUGGING, API_ENDPOINT, graphConfig, colors, getWindowDimensions };
