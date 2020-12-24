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

		const { useState, useEffect, useCallback  } = React;

		const DynamicGraph = () => {
				      const [data, setData] = useState({ nodes: [{ id: 0  }], links: []  });

				useEffect(() => {
						setInterval(() => {
								// Add a new connected node every second
								setData(({ nodes, links  }) => {
										const id = nodes.length;
										return {
												nodes: [...nodes, { id  }],
												links: [...links, { source: id, target: Math.round(Math.random() * (id-1))  }]
										};
								});
						}, 1000);
				}, []);
				const handleClick = useCallback(node => {
						const { nodes, links  } = data;
						// Remove node on click
						const newLinks = links.filter(l => l.source !== node && l.target !== node); // Remove links attached to node
						const newNodes = nodes.slice();
						newNodes.splice(node.id, 1); // Remove node
						newNodes.forEach((n, idx) => { n.id = idx;  }); // Reset node ids to array index
						setData({ nodes: newNodes, links: newLinks  });
				}, [data, setData]);
								
				return <ForceGraph3D
						enableNodeDrag={false}
						onNodeClick={handleClick}
						graphData={data}
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
