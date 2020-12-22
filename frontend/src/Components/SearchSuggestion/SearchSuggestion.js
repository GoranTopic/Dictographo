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
		const [suggestions, setSuggestions] = useState([])	
		const [selected, setSetselected] = useState(1)	

		useKeypress('ArrowDown', () => {
				setSetselected(selected - 1);
				console.log(selected);
		});

		useKeypress('ArrowUp', () => {
				setSetselected(selected + 1);
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
				//get the length
				let last = wordList[len-1]
				//fetch the last element 
				fetch(API_ENDPOINT + query_search + last)
						.then(result => result.json()) //unpack suggestions
						.then(result => {console.log(result); return result}) //unpack suggestions
						.then(suggestions => filterSuggestions(suggestions))
						.then(suggestions => setSuggestions(suggestions))
						.catch((err) => console.log(err));
		}, [state.searchTerm, dispatchState])

		const isWrittingWord = () =>{
				/* uses the state to see if
						* the user is in the middle of writting a word */
				let len = state.searchTerm.length;
				let last = state.searchTerm[state.searchTerm.length-1];
				if(len === 0){ return false;
				}else if (last === " "){ return false;
				}else return true; 
		}

		const SuggestionList = () =>
				<ul class="suggestions">
						{ suggestions.map(
								(suggestion, index) => {  
										return  <li 
												key={index} 
												className={index === selected? styles.selected: null}
												onClick={() => onClick(suggestion.word)}>
												{suggestion.word}
										</li>
								}
						)}
				</ul>

						return <div className="input">
								{props.children}
								{isWrittingWord()? <SuggestionList/>: <></> }
						</div>
}

export default SuggestionsContainer;
