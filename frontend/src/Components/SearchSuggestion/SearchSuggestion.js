import React, { useState, useEffect } from 'react';
import { API_ENDPOINT }  from "../../myConfig";
import styles from './SearchSuggestion.css'; 

/*
 * =======================================
 *      Search suggestion componenet
 * =======================================
 * for predicting  what the user is going to type
 */

import Autosuggest from 'react-autosuggest';


const filterSuggestions = suggestions => {
		return suggestions.filter( suggestion => /\s/.test(suggestion))
};

const getSuggestionValue = suggestion => suggestion;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
		<div>
				{suggestion.w_id}
		</div>
);

class Example extends React.Component {
		constructor() {
				super();
				this.state = {
						value: '',
						suggestions: []
						    
				};
				  }

		onChange = (event, { newValue }) => {
				this.setState({
						value: newValue 
				})
		};
		
		onSuggestionsFetchRequested = async ({ value }) => {
				if(value.length > 2){
						console.log(value);
						fetch(API_ENDPOINT + query_search + value)
								.then(result => result.json()) //unpack suggestions
								.then(suggestions => { console.log(suggestions); return suggestions })
								.then(suggestions => filterSuggestions(suggestions))
								.then(suggestions => this.setState({
										suggestions: suggestions,
										value: value })
								).catch((err) => console.log(err));
				}
		};

		onSuggestionsClearRequested = () => {
				this.setState({
						      suggestions: []
				});
				  
		};

		render() {
				const { value, suggestions  } = this.state;

				// Autosuggest will pass through all these props to the input.
				const inputProps = {
						placeholder: 'dog cat',
						value,
						onChange: this.onChange
				};

				// Finally, render it!
				return (
						<Autosuggest
								suggestions={suggestions}
								onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
								onSuggestionsClearRequested={this.onSuggestionsClearRequested}
								getSuggestionValue={getSuggestionValue}
								renderSuggestion={renderSuggestion}
								inputProps={inputProps}
						/>
				);
		}
}

let query_search = 'querysearch/'

function SuggestionsContainer(props){
	/* tahek a child fro a input an add suggestions to it */
		// handle the change by seting the state variable to 
		let state = props.state
		let dispatchState = props.dispatchState;
		const activeSuggestion = 1;
		const  [suggestions, setSuggestions] = useState([])	
				
		const filterSuggestions = suggestions => 
				suggestions.filter( suggestion => /\s/.test(suggestion))

		useEffect(() => {
				/* query server for search suggestionsa
				 * and sets the  */
				console.log("I ran");
				fetch(API_ENDPOINT + query_search + state.searchTerm)
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
										if (index === activeSuggestion) 
												className = styles.active
										return  <li 
												key={index} 
												className={className}>
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

				//<Example/>


export default SuggestionsContainer;
