import React, { useState, useEffect } from 'react';
import { API_ENDPOINT }  from "../../myConfig";
import useKeypress from '../../hooks/useKeypress';
import './SearchSuggestion.css'; 
import { queryNewWord, queryPath } from '../../node_functions';

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
		const [selected, setSelected] = useState(0)	
		

		useKeypress('ArrowDown', () =>
				(selected < 0)?
				setSelected(suggestions.length-1)
				: setSelected(selected + 1)
		);

		useKeypress('ArrowUp', () => 
				(selected > suggestions.length-1)?
				setSelected(0)
				:setSelected(selected - 1)
		);


		const getmultipleWords = (string) => {
				/* determines qhereteher a string 
				 * is compossed of multiple words */
				//remove multiple spaces
				//trim, remove multiple and seperate by spaces
				return string.replace(/  +/g, ' ').trim().split(' ') 
		}

		useKeypress('Enter', () => {
				if(isWrittingWord()){
						if(suggestions.length > 0){
								addToSearchTerm(suggestions[selected].word);
						}
				}else{
						let words = getmultipleWords(state.searchTerm.toLowerCase());
						// set all serches to lowercase
						if(words.length > 1){
								//if it has more that two words
								queryPath(words, state, dispatchState);
						}else{ 
								// if there is only one word
								queryNewWord(words[0], state, dispatchState);
						}
				}
		})

		const isWrittingWord = () =>{
				/* uses the state to see if
						* the user is in the middle of writting a word */
				let len = state.searchTerm.length;
				let last = state.searchTerm[state.searchTerm.length-1];
				if(len === 0){ return false;
				}else if (last === " "){ return false;
				}else return true; 
		}

		const filterSuggestions = suggestions => 
				/* filter out all words which have spaces */
				suggestions.filter( suggestion => /\s/.test(suggestion))

		
		const addToSearchTerm = (word) => {
				/* append a given word to the seate searchTerm */
				let wordList = state.searchTerm.split(" ");
				let len = wordList.length 
				wordList[len-1] = word // set the last word as clicke word
				dispatchState({ 
						type: 'SET_SEARCH_TERM',
						payload: wordList.join(" ") + " ",
				});	
				setSuggestions([]); // reset suggestions
				setSelected(0); // reset selected
		}


		const onClick = (word) => addToSearchTerm(word);
		

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


		const SuggestionList = () =>
				<ul class="suggestions">
						{ suggestions.map(
								(suggestion, index) => {  
										return  <li 
												key={index} 
												className={index === selected? "selected": null}
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
