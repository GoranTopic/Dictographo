import React  from 'react';
import { Graph } from "react-d3-graph";
import { onClickNode } from '../node_functions';
import { graphConfig }  from "../myConfig";
import ForceGraph2D from 'react-force-graph-2d';
import ForceGraph3D from 'react-force-graph-3d';
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


		const handleClick = useCallback( // handle click of node
				(nodeId) => onClickNode(nodeId, state, dispatchState)
				, [state, dispatchState]);
								
				
		const chosenGraph = (type) =>{ 
				switch(type) {
						case '3d':
								dispatchState({type: 'CLEAR_LINKS'});
								console.log(state)
								return <Graph 
										id="graph-id" 
										// id is mandatory, 
										// if no id is defined rd3g will throw an error
										data={state}
										config={graphConfig}
										onClickNode={handleClick}
										backgroundColor="black"
								/>
						case '2D':
								console.log(state)
								return <ForceGraph2D
										enableNodeDrag={true}
										onNodeClick={handleClick}
										graphData={state}
								/>;
						case '3D':
								console.log(state)
								return <ForceGraph3D
										enableNodeDrag={true}
										onNodeClick={handleClick}
										graphData={state}
								/>;
						default:
								console.log(state)
								return <Graph 
										id="graph-id" 
										// id is mandatory, 
										// if no id is defined rd3g will throw an error
										data={state}
										config={graphConfig}
										onClickNode={handleClick}
										backgroundColor="black"
								/>
				} 
		}


		return <div style={{backgroundImage: 'url(./grid.png)'}} >
				{chosenGraph(state.graphType)}
		</div>
		
}

export default GraphContainer;
