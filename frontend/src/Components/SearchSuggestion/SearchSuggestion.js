import React, { useState, useEffect } from 'react';
import { API_ENDPOINT }  from "../../myConfig";
import useKeypress from '../../hooks/useKeypress';
import styles from './SearchSuggestion.css'; 

/*
 * =======================================
 *      Search suggestion componenet
 * =======================================
 * for predicting  what the user is going to type
 */

let query_search = 'querysearch/' //add this to myconfig

function SuggestionsContainer(props){
		/* tahek a child fro a input an add suggestions to it */
		// handle the change by seting the state variable to 
		let state = props.state
		let dispatchState = props.dispatchState;
		const activeSuggestion = 1;
		const [suggestions, setSuggestions] = useState([])	
		const [selected, setSetselected] = useState(0)	
	


		useKeypress('ArrowDown', () => {
				setSetselected(setSetselected - 1);
				console.log(selected);
		});

		useKeypress('ArrowUp', () => {
				setSetselected(setSetselected + 1);
				console.log(selected);
		});



		useKeypress('Enter', () => console.log("key pressed"));


		const filterSuggestions = suggestions => 
				suggestions.filter( suggestion => /\s/.test(suggestion))

		const onClick = (word) => {
				/* append a given word to the seate searchTerm */
				let wList = state.searchTerm.split(" ");
				let len = wList.length 
				wList[len-1] = word // set the last word as clicke word
				dispatchState({ 
						type: 'SET_SEARCH_TERM',
						payload: wList.join(" ") + " ",
				});	
				setSuggestions([]); // reset suggestions
		}

		useEffect(() => {
				/* query server for search suggestionsa
				 * and sets the  */
				let wordList = state.searchTerm.split(" ");
				//split the search into words
				let len = wordList.length;
				//get te lenght
				let last = wordList[len-1]
				//fetch the last element 
				fetch(API_ENDPOINT + query_search + last)
						.then(result => result.json()) //unpack suggestions
						.then(result => {console.log(result); return result}) //unpack suggestions
						.then(suggestions => filterSuggestions(suggestions))
						.then(suggestions => setSuggestions(suggestions))
						.catch((err) => console.log(err));
		}, [state.searchTerm, dispatchState])


		const SuggestionList = () =>
				<ul class="suggestions">
						{ suggestions.map(
								(suggestion, index) => {  
										let className;
										if (index === selected) 
												className = styles.active
										return  <li 
												key={index} 
												className={className}
												onClick={() => onClick(suggestion.word)}>
												{suggestion.word}
										</li>
								}
						)}
				</ul>

						return <div className="input">
								{props.children}
								{state.searchTerm.length > 2? <SuggestionList/>: <></> }
						</div>
}

export default SuggestionsContainer;
