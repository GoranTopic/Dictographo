import React  from 'react';
import { Graph } from "react-d3-graph";
import { onClickNode } from '../node_functions';
import { graphConfig }  from "../myConfig";

/*
 * =======================================
 *      Graph Componente for React 
 * =======================================
 */

function GraphContainer({state, dispatchState}){
		
		// redifine the function inside this context 
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
}

export default GraphContainer;
