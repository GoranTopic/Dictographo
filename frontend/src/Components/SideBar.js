import React  from 'react';
import { ProSidebar, SidebarHeader, SidebarContent, Menu, MenuItem, SubMenu  } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { onClickNode } from '../node_functions';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome'
import { 
		faLandmark, 
		faStickyNote, 
		faAlignLeft, 
		faBook,
		faBookOpen,
		faCircle,
		faProjectDiagram,
		faScroll,
} from '@fortawesome/free-solid-svg-icons'


/*
 * =======================================
 *      SideBar Componente for React 
 * =======================================
 *     Using proSideBar 
 */

function SideBarContainer({state, dispatchState}){

		const renderDefinitions = (node) => {
				let syntaxes = new Set();
				node.definitions.forEach( def => syntaxes.add(def.syntax));
				return <Menu>
						{(!state.isSideBar)? <h1>Definitions:</h1>: <></> }
						{ [...syntaxes].map( (syntax, i) => 
								(i===0)?
										<SubMenu key={i} title={syntax} open={true} icon={<FontAwesomeIcon icon={faCircle}/>}>
												{ node.definitions.map( (definition, i) => 
														(syntax === definition.syntax)?
																<div key={i}>
																		<SidebarContent>
																				<br />
																				<span style={{paddingRight: 2}}>{definition.definition}</span>
																		</SidebarContent> 
																</div>: null
												)}
										</SubMenu> 
										:
										<SubMenu key={i} title={syntax} icon={<FontAwesomeIcon icon={faCircle}/>} >
												{ node.definitions.map( (definition, i) => 
														(syntax === definition.syntax)?
																<div key={i}>
																		<SidebarContent>
																				<br />
																				<span style={{paddingRight: 2}}>{definition.definition}</span>
																		</SidebarContent> 
																</div>: null
												)}
										</SubMenu> 
						) }
				</Menu>
		}

		const renderExamples = (node) => {
				return <>
						{(node.examples.length !== 0)? 
								<Menu popperArrow={true}>
										<SubMenu title="Examples:" icon={<FontAwesomeIcon icon={faAlignLeft}/>} style={{fontSize:'20px'}}>
												{ node.examples.map( (example, i) => 
												<SidebarContent key={i}>
														<p>{example['example']}</p>
												</SidebarContent> 
												) }
										</SubMenu>
								</Menu> : null
						}
				</>
		}

		const renderEtymology = (node) => {
				return <>
						{(node.etymology !== "")? 
								<Menu popperArrow={true} >
										<SubMenu title="Etymology:" icon={<FontAwesomeIcon icon={faLandmark}/>} style={{fontSize:'20px'}}>
												<SidebarContent>
														<p>{node.etymology}</p>
												</SidebarContent> 
										</SubMenu>
								</Menu> : null
						}
				</>
		}

		const renderNodes = (node) => {
				return <>
						{(node.notes !== "")? 
								<Menu popperArrow={true}>
										<SubMenu title="Anotations:"
												icon={<FontAwesomeIcon icon={faStickyNote}/>}
												style={{fontSize:'20px'}}>
												<SidebarContent>
														<p>{node.Notes}</p>
												</SidebarContent> 
										</SubMenu>
								</Menu> : null
						}
				</>
		}

		const renderSynonyms = (node) => {
				return <>
						{(node.synonyms.length !== 0)? 
								<Menu popperArrow={true}>
										<SubMenu title="Synonyms:" icon={<FontAwesomeIcon icon={faProjectDiagram}/>} style={{fontSize:'20px'}}>
												{ node.synonyms.map( (synonym, i) => 
												<MenuItem key={i} active={true}
														onClick={() => onClickNode(synonym['synonym'], state, dispatchState)} >
														{synonym['synonym']}
												</MenuItem> 
												) }
										</SubMenu>
								</Menu> : null
						}
				</>
		}

		const toogleSideBar = () => dispatchState({type:'TOGGLE_SIDE_BAR'})

		return(
				<div style={{ float:'left', position: 'absolute', height:'91%'}}>
						<ProSidebar collapsed={state.isSideBar} >
								{(state.isSideBar)?
										<MenuItem onClick={toogleSideBar} icon={
												<FontAwesomeIcon 
														style={{
																marginLeft:'1.7rem', marginTop:'1rem',
																height:'25px', width:'25px'}}
														icon={faBook}/>}
										/>
										:<MenuItem onClick={toogleSideBar} icon={
												<FontAwesomeIcon 
														style={{ 
																marginLeft:'6.5rem', marginTop:'1rem',
																height:'55px', width:'55px'}}
														icon={faBookOpen}/>}
										/>
								}
								<Menu iconShape="square">
										{(!state.isSideBar)?
												<SidebarHeader style={{textAlign:'center'}}>
														<h1>{state.definedNode.word}</h1>
														<i>{(state.definedNode.definitions[0])?
																		state.definedNode.definitions[0].syntax
																		: null
																}</i>
												</SidebarHeader> 
												: <SubMenu icon={<FontAwesomeIcon icon={faScroll}/>}>
														<MenuItem active={true} >
																<h1>{state.definedNode.word}</h1>
																<i>{(state.definedNode.definitions[0])?
																				state.definedNode.definitions[0].syntax
																				: null
																		}</i>
														</MenuItem>
												</SubMenu>
										}
										{renderDefinitions(state.definedNode)}
										{renderExamples(state.definedNode)}
										{renderEtymology(state.definedNode)}
										{renderSynonyms(state.definedNode)}
										{renderNodes(state.definedNode)}
								</Menu>
						</ProSidebar>
				</div>
		)
}

export default SideBarContainer;
