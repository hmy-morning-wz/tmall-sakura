import React from  'zebra-isv-base/libs/preact';
import {  crossImage   } from 'zebra-isv-base'
import './style.less'
import {trackerClk,BUS_RED_PACKET,LIFE_PAY_RED_PACKET,CASH_RED_PACKET,GOODS_COUPON,PHONE,pushWindow,my} from '../../util/common'

const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'
const busBagLogo = 'https://img.alicdn.com/tfs/TB14LYQASf2gK0jSZFPXXXsopXa-320-320.jpg'//`${assets}image/bus_bag.jpg`
const couponLogo =`${assets}image/coupon2.png`// 'https://images.allcitygo.com/h5/coupon2.png?x-oss-process=image/format,webp'//`${assets}image/coupon2.png`
export default class DrawResult extends React.Component {
	state = {showPop:true}


	onBannerPressed(e){
		console.log('onButtonPressed')
		e.preventDefault()
		let {sellerId} = this.props.data.bag
		trackerClk("POPUP_GO_BANNER", {sellerId})
		this.setState({showPop:false},()=>{
			let bag =  this.props.data.bag	
			pushWindow({link:bag.bannnerUrl})
		})
		my.getChange()	
	}
	onGoShopPressed(e) {
		console.log('onButtonPressed')
		e.preventDefault()
		let {sellerId} = this.props.data.bag
		trackerClk("POPUP_GO_SHOP", {sellerId} )
		this.setState({showPop:false},()=>{
			let bag =  this.props.data.bag	
			pushWindow({link:bag.shopUrl})
			my.hideResult()
		})
		my.getChange()	
	}
	onButton2Pressed(e) {
		console.log('onButtonPressed')
		e.preventDefault()
		let {sellerId} = this.props.data.bag
		trackerClk("POPUP_MORE_DRAW", {sellerId} )
		this.setState({showPop:false},()=>{
			my.hideResult()
		})	
		my.getChange()	
	}
	onClosePressed(e) {
		console.log('onClosePressed')
		e.preventDefault()	
		trackerClk("POPUP_CLOSE",{name:"抽奖结果弹框关闭"})
		this.setState({showPop:false},()=>{
			my.hideResult()
		})	
		my.getChange()	
	}
	onNonePressed(e){
		console.log('onNonePressed')
		e.stopPropagation()	
	}


	// gets called when this route is navigated to
	componentDidMount() {		
		let res = this.props.data
		let win  = res.success && (res.result1.win || res.result2.win) 
		let {sellerId} = this.props.data.bag
		if(win) {
			let {type,userId,userNick,benefitTitle,coupon,recordId} = res.result1.data			
			let {shopName,shopLogo,displayAmount,displayAmountUnit} =coupon ||  {}
			trackerClk("POPUP_SHOW_DRAW_RESULT",{sellerId,type,userId,userNick,benefitTitle,shopName,shopLogo,displayAmount,displayAmountUnit,recordId})
		}else {
			trackerClk("POPUP_SHOW_NO_DRAW",{sellerId} )
		}
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
	
	}

	render(props) {
		if(this.state.showPop)
		{
		 let res = props.data
		 /**
		  *  let coupon={
            "displayAmountUnit":"元",
            "displayAmount":"10",
            "benefitTitle":"宝洁优惠券",
            "primaryContent":"满199减10元",
            "shopLogo":"//img.alicdn.com//65/da/TB1lWMVJXXXXXXSXpXXSutbFXXX.jpg",
            "shopName":"宝洁官方旗舰店"}   
		  * 
		  */
		 let  {draw_result}  = data.config
		 /*
		  "draw_result": {
			"image": null,
			"buttomText1": "进店逛逛",
			"kefu": "支付宝客服电话：95188",
			"buttomText2": "更多福袋"
		  },
		  */	
		 let bag =  props.data.bag || {}
		 let win  = res.success && (res.result1.win || res.result2.win) 
		 let primaryContent=''
		 let shopLogo1 =  bag.icon_img
		 let shopName1 =  bag.name
		 let message=''
		 let goShop = false
		 let showCouponLogo=''
		if(win) {				 
		let  coupon
		if( res.result1.win){
			coupon =  res.result1.data.coupon
			let {type,userId,userNick,benefitTitle,recordId} = res.result1.data
			let {shopName,shopLogo,displayAmount,displayAmountUnit} =coupon ||  {}
			shopLogo1 = shopLogo1 ||shopLogo
			shopName1 = shopName1 ||shopName
		    if(type===LIFE_PAY_RED_PACKET) { //BUS_RED_PACKET,LIFE_PAY_RED_PACKET,CASH_RED_PACKET,GOODS_COUPON
				message = displayAmount && displayAmountUnit && `${displayAmount}${displayAmountUnit}生活缴费红包`
				showCouponLogo =busBagLogo 
		 	} 
		 	else if(type===CASH_RED_PACKET) {
				message = displayAmount && displayAmountUnit && `${displayAmount}${displayAmountUnit}出行红包`
				showCouponLogo =busBagLogo 
			} else if(type===BUS_RED_PACKET) {
				message = displayAmount && displayAmountUnit && `${displayAmount}${displayAmountUnit}出行红包`
				showCouponLogo =busBagLogo 
		 	}else if(type===GOODS_COUPON) {
				message = displayAmount && displayAmountUnit && `${displayAmount}${displayAmountUnit}优惠券`
				primaryContent = coupon.primaryContent
				showCouponLogo =couponLogo 
				goShop = true
			} else if(type===PHONE){            
				trackerClk("PHONE",{type,userId,userNick,benefitTitle,recordId})
				let {link,link_type} = data.config.submit_address
				let link1 = `${link}?userId=${userId}&userNick=${userNick}&goodsName=${benefitTitle}&recordId=${recordId}`
				console.log("drawDialog PHONE",link1)
				pushWindow({link:link1,link_type})
				this.setState({showPop:false})
				setTimeout(()=>{
					my.getChange()	
				},1000)
				
			}
		}
		if( res.result2.win){
			coupon =  res.result2.data.coupon
			let {type,userId,userNick,benefitTitle,recordId} = res.result2.data
			let {shopName,shopLogo,displayAmount,displayAmountUnit} =coupon ||  {}
			shopLogo1 = shopLogo1 || shopLogo
			shopName1 = shopName1 || shopName
		  	if(type===LIFE_PAY_RED_PACKET) {
			message = (message?(message+'\n+'):'') + displayAmount && displayAmountUnit && `${displayAmount}${displayAmountUnit}生活缴费红包`
			showCouponLogo =busBagLogo 
	 		} 
	 		else if(type===CASH_RED_PACKET) {
			message =(message?(message+'\n+'):'') + displayAmount && displayAmountUnit && `${displayAmount}${displayAmountUnit}出行红包`
			showCouponLogo =busBagLogo 
	 		} else if(type===BUS_RED_PACKET) {
			message =(message?(message+'\n+'):'') + displayAmount && displayAmountUnit && `${displayAmount}${displayAmountUnit}出行红包`
			showCouponLogo =busBagLogo 
	 		}else if(type===GOODS_COUPON) {
			message =(message?(message+'\n+'):'') + displayAmount && displayAmountUnit && `${displayAmount}${displayAmountUnit}优惠券`
			showCouponLogo =couponLogo 
			primaryContent = coupon.primaryContent
			goShop = true
	 		} else if(type===PHONE){            
				trackerClk("PHONE",{type,userId,userNick,benefitTitle,recordId})
				let {link,link_type} = data.config.submit_address
				let link1 = `${link}?userId=${userId}&userNick=${userNick}&goodsName=${benefitTitle}&recordId=${recordId}`
				console.log("drawDialog PHONE",link1)
				pushWindow({link:link1,link_type})
				this.setState({showPop:false})
				setTimeout(()=>{
					my.getChange()	
				},1000)
			}
		}

	}else {
		my.showToast({ content:"抱歉未中奖"})
		return (<div></div>)
	}
	   const closeIcon = crossImage.getFitUrl('https://img.alicdn.com/tfs/TB1vxTTAHj1gK0jSZFOXXc7GpXa-38-38.png')
		 //
		 let bgImage  = draw_result.image 
		 if( (!bgImage) || bgImage.indexOf('//')==-1) bgImage = 'https://img.alicdn.com/tfs/TB1Z0zTAUY1gK0jSZFCXXcwqXXa-933-390.jpg'//`${assets}image/coupon_bg2.jpg`
		
		 
		 let banner  = bag.image //|| `${assets}image/banner.png`		 
		 let logo= shopLogo1 &&(shopLogo1.indexOf('//')==-1?  'https://gw.alicdn.com'+shopLogo1 : shopLogo1) 
		return (			
		<div class="drawresult2-mask" onClick={this.onClosePressed.bind(this)}> 	
		<div class="drawresult2-content"  onClick={this.onNonePressed.bind(this)}>  
		<img class="pop-bg" src={crossImage.getFitUrl(bgImage)}> </img>
		<div class='logo-box1'> </div>
		<div class='logo-box'> 
		{ logo && <img  class="logo" src={crossImage.getFitUrl(logo,64,64)}> </img>	}	  
		{ (!logo) && <img  class="logo"> </img>	}	
		 <div class="shopName">{shopName1}赞助</div>  
		</div>		
	
		{ showCouponLogo && <img  class="coupon-logo" src={crossImage.getFitUrl(showCouponLogo,120,120)}> </img> }
		
		{ (win && message) && (<div class="msg-box"> 
		<div class="text1">您已获得</div>  
		<div class="text2">{message}</div> 
		<div class="text5">{primaryContent}</div> 	
		 </div>) }
		{ (!win) && (<div class="msg-box"> <div class="text1">抱歉，已经发完</div>  </div>) }       		
		<div class="text4">(同支付宝账号、手机号、身份证、设备皆视为同一账号)</div>

         <div class='button-box'>
        { (win && goShop) && <div  class="button2 small" onClick={this.onGoShopPressed.bind(this)} >
          <div class="button-text" >{draw_result.buttonText1 || '去使用'}></div>
		</div>	
		}	
		<div  class={goShop?"button1 small":"button1 large"} onClick={this.onButton2Pressed.bind(this)} >
          <div class="button-text" >{draw_result.buttonText2||'更多福利'}></div>
		</div>	
		</div>
		
		{ (win&&banner)&& (<div  class="banner" onClick={this.onBannerPressed.bind(this)}> <img   src={crossImage.getFitUrl(banner)}    > </img></div> )}
		{ win && (<div class="text-kf">{draw_result.kefu}</div>  )}
        
		<div class="drawresult2-close" style={{background: `url(${closeIcon}) no-repeat`,'background-size':'contain'}} onClick={this.onClosePressed.bind(this)} ></div>
	 
		</div>
	 	
	
		
		</div>);
		}
		else{ return (
			<div class="drawresult2-mask hide" ></div>
		)
		}
	}
}
