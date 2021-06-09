<div align="center"  styles="text-align:center; vertical-align:left;">
  <img src="assets/logo.png" width="200" height="100">
   <h1>Dictographo</h1>
</div>

## About 
Disctographo is a graph dictionary. It steams from the fact that all words in the english language are connected together. Either by a relationship as synonyms of antonyms. 
With Dictographo I wanted to let the user be able to explore the language as a graph. 
To grand the the ability explore and discover words thourght their relationships. 

Have you ever wanted to know all the words related to a word? 

Have you ever wanted to know how close are two words in meaning? 

## Usage

Simply go to www.dictographo.com and write a word or two. 

![big-search](assets/gifs/big-search.gif)


You can also enable deep linking to reconnect all the new word together. 


![big-deeplink](assets/gifs/big-deeplinks.gif)

You can also view the path, or how are they are far apart the are related to each other.

Simply write two or more words:

![red-blue-path](assets/gifs/red-blue-path.gif)


![red-purple-green-yellow](assets/gifs/red-purple-green-yellow.gif)


## Techinal details 

### Back-end
  The back end was written in Python using the Django rest framework. 
  
  It holds in memory a graph off all the word in the english language and their relationships. It take about 7GB of RAM, this is nessasy to be able to provide an fast responce and a fluid feeling the end user. 
  
  When it come to finding the sorst path between two words I implemented Dijkstra's algorithm which is called every time the API is queried two word.
  
  ususally the API is queries only one word, which it returns, with it data and it's neigboring words.
  
### Front-end
  Front-end was challenging beicause I had to find a way to render all the words in the graph effiently and pleasing to the user. At the end I choose to use D3 to create render the nodes.
 I also added the ability to view the same graph in a more efficint engine, or in 3D.
 
 I use reactjs to make all the components and 

 I feel I could still improve upon the front page
 
 ### Scrapper
 In order to be able to make a dictonary API and render the graph of words on the front-end, I need first a database of words. This is where the scrapper came in. Using python Scrappy framework, I created a Web-Scrapper to mine the date of major online dictionaries. Thi includes Merrian-Webster, dictionary.com, etc...


  
