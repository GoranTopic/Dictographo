import React, { useCallback }  from 'react';
import { Graph } from "react-d3-graph";
import { onClickNode } from '../../node_functions';
import { colors, graphConfig }  from "../../myConfig";
//import d3Switcher from "./d3Switcher";
import ForceGraph2D from 'react-force-graph-2d';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
//import ForceGraphVR from 'react-force-graph-vr';
//import ForceGraphAR from 'react-force-graph-ar';

/*
 * =======================================
 *      Graph Componente for React 
 * =======================================
 */

function GraphContainer({state, dispatchState}){

		const handleClick = useCallback((nodeId) => {  //  handle click of node
				onClickNode(nodeId, state, dispatchState)
		}, [state, dispatchState]);

		const chosenGraph = (type) =>{ 
				switch(type) {
						case 'd3':
								return <Graph 
										id="graph-id" 
										// id is mandatory, 
										// if no id is defined rd3g will throw an error
										data={state.d3Data}
										onClickNode={handleClick}
										config={graphConfig}
								/>
						case '2D':
								return <ForceGraph2D
										graphData={state.forceData}
										onNodeClick={handleClick}
										nodeLabel="id"
										nodeRelSize={5}
										enableNodeDrag={true}
										linkDirectionalArrowLength={1}
										linkDirectionalArrowRelPos={1}
										linkDirectionalParticles={0.5}
										linkDirectionalParticleSpeed={0.005}
										linkDirectionalParticleWidth={3}
										linkWidth={1.8}
										onNodeDragEnd={node => {
												node.fx = node.x;
												node.fy = node.y;
												node.fz = node.z;
										}}
										nodeCanvasObject={(node, ctx, globalScale) => {
												const label = node.id;
												const fontSize = 15/(globalScale);
												ctx.font = `${fontSize}px Sans-Serif`;
												const textWidth = ctx.measureText(label).width;
												const bckgDimensions = [textWidth, fontSize].map(n => 
														n + fontSize * 0.3); // some padding
												ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
												ctx.fillRect(node.x - bckgDimensions[0]/2, node.y - bckgDimensions[1]/2, ...bckgDimensions);
												ctx.textAlign = 'center';
												ctx.textBaseline = 'middle';
												ctx.fillStyle = node.color;
												ctx.fillText(label, node.x, node.y);
												          
										}}
								/>;
						case '3D':
								return <ForceGraph3D
										graphData={state.forceData}
										onNodeClick={handleClick}
										nodeLabel="id"
										enableNodeDrag={true}
										linkDirectionalArrowRelPos={1}
										linkDirectionalArrowLength={1}
										backgroundColor={'black'}
										linkDirectionalParticles={2}
										linkDirectionalParticleSpeed={0.03}
										linkDirectionalParticleWidth={1}
										linkWidth={0.8}
										onNodeDragEnd={node => {
												node.fx = node.x;
												node.fy = node.y;
												node.fz = node.z;
										}}
										nodeThreeObject={node => {
												const sprite = new SpriteText(node.id);
												//sprite.color = (node.selected)? colors.node.selected : (node.color === colors.node.done)? colors.node.default : colors.node.done
												sprite.color = (node.color === colors.node.selected)? node.color : (node.color === colors.node.done)? colors.node.default : colors.node.done;
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
