import React from  'zebra-isv-base/libs/preact';
import './style.less'
import {trackerClk,image,my} from '../../util/common'
import {  crossImage   } from 'zebra-isv-base'
import PreLoad from '../../component/preLoad'
const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'

export default class DrawResult extends React.Component {
	state = {showPop:true}


	onButton1Pressed(e) {
		console.log('onButtonPressed')
		e.preventDefault()		
		this.setState({showPop:false},()=>{
			let {bag} =  this.props.data || {}
			trackerClk('OPEN_BAG',{sellerId:bag.sellerId})		
			my.goBag(bag)
			my.hideDrawResult()
		})


	}
	onClosePressed(e) {
		console.log('onClosePressed')
		e.preventDefault()	
		trackerClk("POPUP_CLOSE",{name:"抽奖结果弹框关闭"})
		this.setState({showPop:false},()=>{
			my.hideDrawResult()
		})
	}
	onNonePressed(e){
		console.log('onNonePressed')
		e.stopPropagation()	
	}


	// gets called when this route is navigated to
	componentDidMount() {
		console.log('DrawResult componentDidMount',this.props)
		let {bag} =  this.props.data || {}
		//image
		//icon_img
		//bgImage
		//followImage
		let preLoadImages = []
		preLoadImages.push(crossImage.getFitUrl(data.config.draw_result.image || 'https://img.alicdn.com/tfs/TB1Z0zTAUY1gK0jSZFCXXcwqXXa-933-390.jpg'))
		preLoadImages.push('https://img.alicdn.com/tfs/TB12M_UAG61gK0jSZFlXXXDKFXa-804-345.png')
		bag.image && preLoadImages.push(crossImage.getFitUrl(bag.image) )
		bag.icon_img && preLoadImages.push(bag.icon_img)
		bag.bgImage && preLoadImages.push(bag.bgImage)
		bag.followImage && preLoadImages.push(bag.followImage)
		this.setState({preLoadImages})

	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
	
	}

	render(props) {
		if(this.state.showPop)
		{
		const couponLogo = image['bus_bag.jpg'] ||  `${assets}image/bus_bag.jpg`
        const taskBg = 'https://images.allcitygo.com/h5/task_bg.png?x-oss-process=image/format,webp'// crossImage.getFitUrl(`${assets}image/task_bg.png`,612,977)		 	
		const closeIcon = crossImage.getFitUrl('https://img.alicdn.com/tfs/TB1vxTTAHj1gK0jSZFOXXc7GpXa-38-38.png')
		 let {bag} =  props.data || {}
		// let shopName1 =bag && bag.name
		// let message1 = `${shopName1}`
		 let message2 =bag &&bag.couponPrize
		 let message3 = bag &&bag.notice
		
		// let logo = bag && bag.icon_img
		 let win = true
	
		return (			
		<div class="drawresult-mask" onClick={this.onNonePressed.bind(this)}> 	
		<div class="drawresult-content"  style={{background: `url(${taskBg}) no-repeat`,'background-size':'contain'}}  onClick={this.onNonePressed.bind(this)}>  
		{ <img  class="logo1" src={crossImage.getFitUrl(couponLogo,120,120)}> </img>	}
		{ /* (!logo) && <img  class="logo" > </img>	 */}		  
		{/* { (win && shopName1 && message1) && (<div class="msg-box1"> <div class="text1" style='color:rgba(51,51,51,1);' >以下商品由</div>  <div class="text1"  style='color:rgba(255,84,62,1);' >{message1}</div>  <div class="text1"  style='color:rgba(51,51,51,1);' >赞助</div> </div>) } */}
		<div class="coupon-box">		
		{ (win && message2 && message3) && (<div class="msg-box2">  <div class="text2" >{message2}</div> <div > <div class="text3 inline " style="color:rgba(151,160,175,1);">获得条件：</div>  <div class="text3 inline">{message3}</div>  </div>  </div>) }	
	   
		</div>
		<div  class="button1" onClick={this.onButton1Pressed.bind(this)} >
          <div class="button-text" >立即前往></div>
        </div>	
		<div class="drawresult-close" style={{background: `url(${closeIcon}) no-repeat`,'background-size':'contain'}}   onClick={this.onClosePressed.bind(this)}></div>
	
		</div>
		<PreLoad images={this.state.preLoadImages}/>  
		</div>);
		}
		else{ return (
			<div class="drawresult-mask hide"></div>
		)
		}
	}
}



my.showDrawResult = function(data){	
	my.hideDrawResult()
	const box = document.getElementById('box')
	React.render( <DrawResult data={data} />, box)
}

my.hideDrawResult = function(){	
	const box = document.getElementById('box') 
	const mask = document.getElementsByClassName('drawresult-mask')
	mask &&mask[0] && box.removeChild(mask[0])
}