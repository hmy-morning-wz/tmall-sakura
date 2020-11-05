import React from  'zebra-isv-base/libs/preact';
import {  crossImage } from 'zebra-isv-base'
import './style.less'
import {trackerClk,my} from '../../util/common'

const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'

export default class PopRule extends React.Component {
	state = {showPop:true}

	onClosePressed(e) {
		console.log('onClosePressed')
		e.preventDefault()	
		trackerClk("POPUP_CLOSE",{name:"活动规则弹框关闭"})
		this.setState({showPop:false},()=>{			
          my.hideRule() 
		})
	}
	onNonePressed(e){
		console.log('onNonePressed')
		e.stopPropagation()	
	}


	// gets called when this route is navigated to
	componentDidMount() {
	
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
	
	}

	render(props) {
		if(this.state.showPop && props.content)
		{
		const closeIcon = crossImage.getFitUrl('https://img.alicdn.com/tfs/TB1vxTTAHj1gK0jSZFOXXc7GpXa-38-38.png')
		let content = props.content.replace(/\\n/g,"\n")
		return (			
		<div class="popup-rule-mask popup-rule-show" onClick={this.onClosePressed.bind(this)}> 	
     		<div class="popup-rule-document ">
				<div class="popup-rule">
				<div class="title"> 活动规则</div>
				<div class="centent-body">   <div class="box"> 	{content}  </div>    	</div>	
				</div> 			
		</div> 	
		<div class="popup-rule-close"  style={{background: `url(${closeIcon}) no-repeat`,'background-size':'contain'}}  />	
		</div>);
		}
		else{ 
			return (
			<div class="popup-rule-hide" style={{display:'none'}}></div>
		)
		}
	}
}



my.showRule = function(){	
	trackerClk('RULR')
	const box = document.getElementById('box')
	React.render( <PopRule content={data.config.ruleText} />, box)
}

my.hideRule = function(){	
	const box = document.getElementById('box') 
	const mask = document.getElementsByClassName('popup-rule-hide')
	mask &&mask[0] && box.removeChild(mask[0])
}