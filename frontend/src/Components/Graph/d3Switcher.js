import { Graph } from "react-d3-graph";
import { onClickNode } from '../../node_functions';
import { graphConfig }  from "../../myConfig";

/*
 * ==================================================================
 *      Graph d3 Componente to make switching from 2d to d3 possible 
 * ==================================================================
 */


function d3Switcher({state, dispatchState}){

		// it it is switching from graphs
		const isSwitching =  state.graphType === state.prevGraphType ;

		if(isSwitching){
				console.log("isSwitching: " + isSwitching);
		}
		/*	

		useEffect(() => {  
				console.log('isSwitching: ' + isSwitching);
				//if(isSwitching){
						//dispatchState({type: 'SET_LINKS', payload: })
				//}
			}, [])
			*/


		return <Graph  
				id="graph-id" 
				// id is mandatory, 
				// if no id is defined rd3g will throw an error
				data={{...state, links:[]}}
				config={graphConfig}
				onClickNode={onClickNode}
				backgroundColor="black"
		/>
}

export default d3Switcher;
