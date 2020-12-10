import React  from 'react';
import { Graph } from "react-d3-graph";
import { myConfig }  from "../myConfig";

/*
 * =======================================
 *      Graph Componente for React 
 * =======================================
 */

function GraphContainer({state, onClickNode}){

		return(
				<div style={{backgroundImage: 'url(./grid.png)'}} >
						<Graph 
								id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
								data={state}
								config={myConfig}
								onClickNode={onClickNode}
								backgroundColor="black"
						/>
				</div>



		)
}

export default GraphContainer;
