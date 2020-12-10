import React  from 'react';
import { Carousel  } from 'react-bootstrap';

/*
 * =======================================
 *      Carousel Componente for React 
 * =======================================
 */

function CoruselContainer(){
		return(
				<Carousel>
						<Carousel.Item>
								<img
										className="d-block w-100"
										src="graph_scaled_down.jpg"
										alt="First slide"
								/>
								<Carousel.Caption>
										<h3>First slide label</h3>
										<p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
								</Carousel.Caption>
						</Carousel.Item>
						<Carousel.Item>
								<img
										className="d-block h-100 w-100"
										src="graph1.jpg"
										alt="Third slide"
								/>
								<Carousel.Caption>
										<h3>Second slide label</h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
								</Carousel.Caption>
						</Carousel.Item>
						<Carousel.Item>
								<img
										className="d-block h-100 w-100"
										src="graph2.jpg"
										alt="Third slide"
								/>
								<Carousel.Caption>
										<h3>Third slide label</h3>
										<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
								</Carousel.Caption>
						</Carousel.Item>
						<Carousel.Item>
								<img
										className="d-block h-100 w-100"
										src="graph3.jpg"
										alt="Third slide"
								/>
								<Carousel.Caption>
										<h3>Third slide label</h3>
										<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
								</Carousel.Caption>
						</Carousel.Item>
				</Carousel>
		)
}

export default CoruselContainer;
