import React, { useCallback }  from 'react';
import { Graph } from "react-d3-graph";
import { onClickNode } from '../../node_functions';
import { graphConfig }  from "../../myConfig";
//import d3Switcher from "./d3Switcher";
import ForceGraph2D from 'react-force-graph-2d';
import ForceGraph3D from 'react-force-graph-3d';
import _ from "lodash";
import SpriteText from 'three-spritetext';
//import ForceGraphVR from 'react-force-graph-vr';
//import ForceGraphAR from 'react-force-graph-ar';

/*
 * =======================================
 *      Graph Componente for React 
 * =======================================
 */

function GraphContainer({state, dispatchState}){

		const stateCopy = (state) => {
				//console.log("normal state")
				//console.log(state)
				let d3State = _.cloneDeep(state);
				return d3State;
		}

		const handleClick = useCallback((nodeId) => {  //  handle click of node
				onClickNode(nodeId, state, dispatchState)
		}, [state, dispatchState]);

		const chosenGraph = (type) =>{ 
				switch(type) {
						case 'd3':
								//console.log("checking the state")
								//console.log(state)
								//console.log({...state, links:[]})
								//console.log("d3 data:")
								//console.log(state.d3Data)
								return <Graph 
										id="graph-id" 
										// id is mandatory, 
										// if no id is defined rd3g will throw an error
										data={state.d3Data}
										onClickNode={handleClick}
										config={graphConfig}
								/>
						case '2D':
								//console.log("checking the state")
								//console.log(state)
								//console.log("2D data:")
								//console.log(state.forceData)
								return <ForceGraph2D
										graphData={state.forceData}
										onNodeClick={handleClick}
										//nodeLabel="id"
										enableNodeDrag={true}
										linkDirectionalArrowLength={3.5}
										linkDirectionalArrowRelPos={1}
										onNodeDragEnd={node => {
												node.fx = node.x;
												node.fy = node.y;
												node.fz = node.z;
										}}
										nodeColor={node => {
												console.log(node.id)
												console.log(state.selected.id)
												return (node.id === state.selected.id)? 'red' :  node.isDone ? 'gray' : 'back'

										}
										}
										nodeCanvasObject={(node, ctx, globalScale) => {
												const label = node.id;
												const fontSize = 12/globalScale;
												ctx.font = `${fontSize}px Sans-Serif`;
												const textWidth = ctx.measureText(label).width;
												const bckgDimensions = [textWidth, fontSize].map(n => 
														n + fontSize * 0.2); // some padding
												ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
												ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
												ctx.textAlign = 'center';
												ctx.textBaseline = 'middle';
												ctx.fillStyle = node.color;
												ctx.fillText(label, node.x, node.y);
												          
										}}
								/>;
						case '3D':
								//console.log(state)
								return <ForceGraph3D
										graphData={state.forceData}
										onNodeClick={handleClick}
										nodeLabel="id"
										enableNodeDrag={true}
										linkDirectionalArrowLength={3.5}
										linkDirectionalArrowRelPos={1}
										onNodeDragEnd={node => {
												node.fx = node.x;
												node.fy = node.y;
												node.fz = node.z;
										}}
										nodeColor={node => 
										node.id === state.selected.id ? 'red' :  node.isDone ? 'gray' : 'back'}
										nodeThreeObject={node => {
												const sprite = new SpriteText(node.id);
												sprite.color = node.color;
												sprite.textHeight = 8;
												return sprite;
										}}
								/>;
						default:
								//console.log(state)
								return <Graph 
										id="graph-id" 
										// id is mandatory, 
										// if no id is defined rd3g will throw an error
										data={state}
										config={graphConfig}
										onClickNode={handleClick}
								/>
				} 
		}


		return <div style={{backgroundImage: 'url(./grid.png)'}} >
				{chosenGraph(state.graphType)}
		</div>
		
}

export default GraphContainer;
