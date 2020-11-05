import React from 'zebra-isv-base/libs/preact';
import {crossImage} from 'zebra-isv-base'

const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'

export default class PreLoad extends React.Component {
		state = {}



		// gets called when this route is navigated to
		componentDidMount() {

		}

		// gets called just before navigating away from the route
		componentWillUnmount() {

		}

		render(props) {
			let images = props.images
			if(images&& images.length){
				return ( <div class = "preload-box" > 
				{images.map((t, index) => {
				  return ( <div> <img  style={{background: `url(${crossImage.getFitUrl(t)}) no-repeat`,'background-size':'contain'}} > </img> </div>	)
				})
				} 
				</div>);
			
			}else return (<div class = "hide" ></div>)
		}
		}