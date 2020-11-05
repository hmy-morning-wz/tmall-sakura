import React from 'zebra-isv-base/libs/preact'
import { auth, navigation  ,crossImage } from 'zebra-isv-base'
import {trackerUser, trackerClk,trackerPageLoad, pushWindow ,Toast,Loading,my} from './util/common'
import './index.less'
import PopRule from './component/popRule'
import DrawResult from './component/drawResult'
import LuckDraw from './component/luckDraw'
import GoodsList from './component/goodsList'
import PreLoad from './component/preLoad'
import {findNextBackClass} from "./util/luckyBag" 
import ShopsList from './component/shopsList';

const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'
class App extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      user: null,
      toast:null,
      loading:null,
      showBag:true,
      // clH: 
    }
  }
  
	 showToast=(msg,duration,type)=>{
		console.log('toast',msg)
		this.setState({toast:msg})
		setTimeout(()=>{
		  this.setState({toast:null})
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
  checkUser() {
    auth.isLogin().then(user => {

      if (user) {
        console.log('L19 login',user)
        this.setState({
          user,
        })    
        trackerUser(user)       
       
        console.log('L19 login end')
      }
    },(err)=>{
      console.log('checkUser',err)
      auth.login().then(({ errorCode, errorMessage }) => {
        console.log('auth.login',errorCode,errorMessage)
        //this.checkUser()
      })
    })
  }
  componentDidMount() {
      this.content.oncomputed = (content) => {
        this.realContent = content
      }
      trackerPageLoad()
      console.log(__version__,data.config, navigation.getUrlParams())
      
      if(__isProduction__) {
        this.checkUser()
        findNextBackClass()
      }   
     
     setTimeout(()=>{
       this.setState({preLoadImages:['https://images.allcitygo.com/h5/task_bg.png?x-oss-process=image/format,webp']})
     },500)
  }

  goBackTop= (e) => {
    e.preventDefault()
    this.realContent.scrollTop = 0  
    trackerClk("GO_BACK_TOP")
  }

  render() {
    const { notice, bgcolor } = data.config
    const handleEntrance = (item) => {
      let param = {
        link: item.link,
        link_type: item.link_type
      }
      pushWindow(param)
    }
    let notice_list = []
    for (let key in notice) {
      if (key !== 'length') {
        notice_list.push(notice[key])
      }
    }
      return (
        <div class="outermostLayer" style={{backgroundColor: `${bgcolor || '#F2F3F4'}`}} ref={content => {
          this.content = content
        }} >
          <div class="secondLayer">
          <div  id="myRef" ref={myRef => {
            this.myRef = myRef
          }}>        
          </div>          
          <div class="luck-draw-box">  {  this.state.showBag? <LuckDraw />:<div class="luck-draw-box-hide"/> } </div>     
          <GoodsList />
          <ShopsList />
          <div id="popupBox"></div>
          <div class="goBackTop" onClick={this.goBackTop.bind(this)}>
            <img src={crossImage.getFitUrl(`https://img.alicdn.com/tfs/TB1DAzOAQL0gK0jSZFtXXXQCXXa-80-80.png`)}></img>
          </div>
          {/* 弹幕 */}
          {/* {
            (false) &&
            <div class="barrageAd">
              <div class="barrageSwiper smoothMoving">
                {
                  notice_list.map((item, idx) => {
                    return (
                      <div key={idx} class="barrageTxt">
                        {item.msg}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          } */}
          </div>
        <Toast content={this.state.toast}/>
			  <Loading content={this.state.loading}/>  
        <PreLoad images={this.state.preLoadImages}/>      
        </div>
      )
    }


  }


  const box = document.getElementById('box')
  React.render(<App />, box)


