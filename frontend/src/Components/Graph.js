import React  from 'react';
//import { Graph } from "react-d3-graph";
import { onClickNode } from '../node_functions';
//import { graphConfig }  from "../myConfig";
import ForceGraph2D from 'react-force-graph-2d';
//import ForceGraph3D from 'react-force-graph-3d';
//import ForceGraphVR from 'react-force-graph-vr';
//import ForceGraphAR from 'react-force-graph-ar';

/*
 * =======================================
 *      Graph Componente for React 
 * =======================================
 */

function GraphContainer({state, dispatchState}){

		const { 
				//useState,
				//useEffect, 
				useCallback
		} = React;

		const DynamicGraph = () => {


				const handleClick = useCallback(
						(nodeId) => onClickNode(nodeId, state, dispatchState)
						, []);
								
				return <ForceGraph2D
						enableNodeDrag={true}
						onNodeClick={handleClick}
						graphData={state}
				/>;
		};
		return (
				<div style={{backgroundImage: 'url(./grid.png)'}} >
						<DynamicGraph />,
				</div>
		)
}
export default GraphContainer;

		// redifine the function inside this context 
		/*
		let onClickNode_func =
				(nodeId) => onClickNode(nodeId, state, dispatchState);
		return(
				<div style={{backgroundImage: 'url(./grid.png)'}} >
						<Graph 
								id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
								data={state}
								config={graphConfig}
								onClickNode={onClickNode_func}
								backgroundColor="black"
						/>
				</div>
		)
		*/
