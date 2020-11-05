import React from  'zebra-isv-base/libs/preact';
import './style.less'
const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'
import { mtop,navigation,crossImage ,simpleDraw,localStorage } from 'zebra-isv-base'
import {trackerClk,my} from '../../util/common'
//import {draw,drawDialog,updateTaskCount} from '../../util/draw'
const urlParams = navigation.getUrlParams()
//followImg.png	https://img.alicdn.com/tfs/TB12M_UAG61gK0jSZFlXXXDKFXa-804-345.png
const bgImage = 'https://img.alicdn.com/tfs/TB12M_UAG61gK0jSZFlXXXDKFXa-804-345.png'// `${assets}image/followImg.png`
export function Toast (props){
	return (<div class={props.content?"am-toast text":"hide"}>
	<div class="am-toast-text">
	{props.content}
	</div>
</div>)
}

export  function Loading (props){
	return (<div class={props.content?"am-toast":"hide"} >
	<div class="am-toast-text">
		<div class="am-loading-indicator white">
			<div class="am-loading-item"></div>
			<div class="am-loading-item"></div>
			<div class="am-loading-item"></div>
		</div>
		{props.content}
	</div>
</div>)
}


export default class Follow extends React.Component {
	state = {
		loading:null,
		showPop:true,
		sellerId:null,
		joinDisplay:false,
		ready:false,
		inputEnable:false,
		toast:null,
	}


	

	showToast(msg,duration,cb){
		console.log('toast',msg)
		this.setState({toast:msg})
		setTimeout(()=>{
			this.setState({toast:null})
			cb&&cb()
		 }, duration ||2000)
		  
	  }
	  
	  showLoading= (msg) => {
		console.log("showLoading",msg)
		this.setState({loading:msg})
		}
		hideLoading= () => {
		console.log("hideLoading")
		this.setState({loading:null})
		}

	componentDidMount() {
	 
		my.showLoading({content:"加载中...",delay:500}) 
    this.pressedTime=0
  
		
    let {sellerId} = this.props.data// || '1603022934'//'1603022933'
		this.setState({sellerId}) 
		trackerClk("POPUP_SHOW_FOLLOW",{sellerId})
   if(sellerId) {
  
      mtop('mtop.tmall.retail.storefollow.info.get', {query:`type=tb&id=${sellerId}&r=false&img=&back=null&pts=1564979196718&hash=A9674CCC6694A869FCC522F2B1941FBD&spm=a21123.12268209.1.d1`}, { needSignIn: true }).then((result) => {
        console.log('storefollow.info.get',result)  
				my.hideLoading()
        let data1 = result && result.data && result.data.result 
        if(data1){
					let banner  =data1.banner
        let isMember =data1.items[0].status=='true'  
				trackerClk("FOLLOW_INFO",{sellerId,isMember})
  
         if(isMember){
          this.setState({
						ready:true,
            joinDisplay: !isMember,        
						banner,
       
          });
					try{          
						this.showToast("已经关注了",2000,()=>{
							this.setState({
								showPop:false					 
							},()=>{
								let reject = this.props.reject
								reject && reject({success:false})
							});
					
					}) 		
				}catch(error){
				}
 
        }else {          
          this.setState({
					ready:true,			
					banner,			
         
          joinDisplay: !isMember
        });        
      }}else {
        this.showToast("系统开小差了，请稍候重试") 
      }
      
      }, (err)=> {
        console.log('sync inventory error', err)  
        let {res,message} = err || {}
        let msg = (res.data && res.data.errorMsg) ||message ||"系统开小差了，请稍候重试"
        this.showToast(msg)
				my.hideLoading()
    })
  }else {   
    
		my.hideLoading()
     
  }

	}

	componentWillUnmount() {
	
	}
	onBack(e){
		trackerClk("POPUP_CLOSE",{name:'关注页面'})
		this.setState({showPop:false},()=>{
			let reject = this.props.reject
			reject && reject({success:false})
		})
	}
	
	render (props) {
		if(this.state.showPop){
		//let d = props.data
		let bagData = props.bagData
		const closeIcon = crossImage.getFitUrl('https://img.alicdn.com/tfs/TB1vxTTAHj1gK0jSZFOXXc7GpXa-38-38.png')
	
		//let max_tilte = bagData.couponPrize
		let logo = bagData.icon_img
		let banner = bagData.followImage || this.state.banner
		//let name = bagData.name || ''
  	//let joinCod = (bagData.notice&&(`获得条件：${bagData.notice}`) )||  (name && `获得条件：完成${name}店铺关注`)  || ''
		//let bj = beijing
		return (	
			<div class="follow-mask">
		  <div class ="follow-content">   
			<img  class="bgimg" src={crossImage.getFitUrl(bgImage)}/>  
				<div class="act-bg">				
					<img  class="logo" src={crossImage.getFitUrl(logo)} /> 
				</div>
			<div class="act-box"   style={{display: this.state.ready ? '': 'none'}}>			 	
				<div class="banner-bg" style={{background: `url(${crossImage.getFitUrl(banner)}) no-repeat`,'background-size':'100% 100%'}}> </div>
			
		  </div>
			<div  class="join-button-box"  style={{display: this.state.joinDisplay? '': 'none'}}>
					<div  class="join-button"  onClick={this.onJoinPressed.bind(this)}>
			 	    <div class="text">关注赢取好礼> </div>  
					</div>		
				</div>
		  
			<div class="close" style={{background: `url(${closeIcon}) no-repeat`,'background-size':'contain'}}   onClick={this.onBack.bind(this)}></div>
	
			<Toast content={this.state.toast}/>
			<Loading content={this.state.loading}/>
		  </div>
			</div>
		)
			}else {
				(
					<div  class="follow-mask hide"></div>
				)
			}
	  }



		
		afterJoined(){
			this.pressedTime=0
  		this.showToast("关注成功")
			this.setState({showPop:false},()=>{
				let resolve = this.props.resolve
				resolve && resolve({success:true})
  		})				
			my.doAllTask() 
		}
	
	  onJoinPressed (e) {
		e.preventDefault()	
		let n =  +Date.now()
		if(n-this.pressedTime<3000) {
			console.log("onJoinPressed点击太快")
			return
		}	
		this.pressedTime = n
	
		if(urlParams.noBind && data.config.debug==='ON'){ 
		this.afterJoined()
		return
		}

		console.log("onJoinPressed") 
		 my.showLoading({content:"请稍等...",delay:500}) 
		let {sellerId} = this.state    
		trackerClk("POPUP_GO_FOLLOW",{sellerId})
		mtop('mtop.taobao.social.follow.weitao.add.h5', {
			"type":1,"followedId":sellerId,"originBiz":"paiyangji","originPage":"https://h5.m.taobao.com/smart-interaction/follow.html?_wvUseWKWebView=YES&type=tb&id=424353450&r=false&img=&back=http%3a%2f%2ftest.tamll.com%3a6501%3ffollowedId%3d92686194&pts=1564979196718&hash=A9674CCC6694A869FCC522F2B1941FBD&spm=a21123.12268209.1.d1","originFlag":""
		}, { needSignIn: true }).then((result) => {
		  console.log(result)  
			my.hideLoading()
		  if(result.data.followAccount==='true'){
			this.setState({
			       
			  joinDisplay:false
			});
			this.showToast("关注成功")
			trackerClk("FOLLOW_SUCCESS",{sellerId})	
			localStorage.setItem('isFollow'+sellerId,1) 
			this.afterJoined()
		  }else {
			this.showToast("关注失败") 
			trackerClk("FOLLOW_FAIL",{sellerId})
			let followError = +(localStorage.getItem('followError'+sellerId)  || 0)
			localStorage.setItem('followError'+sellerId,followError+1)
			}
			this.pressedTime=0
		}, (err)=> {
			this.pressedTime=0
			my.hideLoading()
		  let {res,message} = err || {}
		  let msg = (res.data && res.data.errorMsg) ||message ||"系统开小差了，请稍候重试"
		  this.showToast(msg)
			trackerClk("FOLLOW_ERROR",{sellerId,msg})
			let followError = +(localStorage.getItem('followError'+sellerId)  || 0)
			localStorage.setItem('followError'+sellerId,followError+1)
			console.log('follow.add.h5 error', err) 
	
	  })
	
	  }
}
