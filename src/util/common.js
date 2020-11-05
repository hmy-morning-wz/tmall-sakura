import React from  'zebra-isv-base/libs/preact';
import { navigation,goldlog,localStorage,mtop,device } from 'zebra-isv-base'
import {TRACKER_ID} from '../constant'
import {Base64} from "./base64" 
export const DEBUG = data.config.debug==='ON'
//跳转
export const urlParams = navigation.getUrlParams()
export const LOG_DEBUG =  urlParams.debug
export const luckDrawStart = {}
var loadTime 
const TREACKE = data.config.tracker ==='ON' ||  !(data.config.tracker)
const  trackerData= {}
const LINK_TYPE=[
  {k:"${money}",v:"https://money.allcitygo.com"},
  {k:"${operation}",v:"https://operation.allcitygo.com"},
  {k:"${sit-operation}",v:"https://sit-operation.allcitygo.com"},
  {k:"${detail}",v:"https://detail.tmall.com"},
  {k:"${detail.m}",v:"https://detail.m.tmall.com"}
]

function replaceUrl(link,link_type){
  let url = link
  if(link && link.indexOf('http')!=0){
    if(link_type==='ALLCITYGO1'){
        url = "https://money.allcitygo.com"+link
    }
    else if(link_type==='ALLCITYGO2'){
        url = "https://operation.allcitygo.com"+link
    }else if(link_type==='ALLCITYGO3'){
        url = "https://sit-operation.allcitygo.com"+link
    }else if(link_type==='detail.tmall'){
        url = "https://detail.tmall.com"+link
    }else if(link_type==='detail.m.tmall'){
      url = "https://detail.m.tmall.com"+link
   } else if(link_type=='live') {
     url = 'https://images.allcitygo.com/miniapp/live.html?sellerId='+link
   }
   else {
      let replace = false
      LINK_TYPE.forEach((t)=>{
        if((!replace) && link.indexOf(t.k) >-1 ) {
          url =  link.replace(t.k,t.v)
          replace = true
        }
      })
      if((!replace) &&/^[A-Za-z\d+/]*([A-Za-z\d+/][A-Za-z\d+/=]|==)$/.test(link))
      {
        url = Base64.decode(link)
      }
     
    }
    //https://detail.tmall.com/item.htm?id=566446518116
}
  return url
}


export const pushWindow = ({link,link_type,name,id,tblink,tblink_type},showLoading=true) =>{
    console.log("pushWindow >"+(+Date.now()))
    let url = link
    if(tblink && tblink_type && (device.isTaobao || device.isTaobaoPad || device.isTmall  || device.isTmallPad   )) {
      url = replaceUrl(tblink,tblink_type)
    }else {
      url = replaceUrl(link,link_type)
    }  
    
    let stay_time = (+Date.now()) - loadTime
    let p = {url,stay_time,name,id}   
    trackerClk("PUSH_WINDOW",p)
    if(url) {
      //my.hideLoading()
      navigation.pushWindow(url)
      console.log("pushWindow <"+(+Date.now()))
      showLoading && my.showLoading && (my.showLoading({content:'跳转中'}),setTimeout(()=>{my.hideLoading() },1000))
      }
  }
  

export function dateFormat(t, format) {
  var fmt = format || 'yyyy-MM-dd hh:mm:ss.S'
  if (typeof t !== 'object') {
    t = new Date(t)
  }
  var o = {
    'M+': t.getMonth() + 1, //月份
    'd+': t.getDate(), //日
    'h+': t.getHours(), //小时
    'm+': t.getMinutes(), //分
    's+': t.getSeconds(), //秒
    'q+': Math.floor((t.getMonth() + 3) / 3), //季度
    S: t.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (t.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}




export const trackerUser= (user)=>{
  Object.assign(trackerData,user) //{nick: "louis林新华", userNumId: "791977274"}
  let {userNumId,nick} = user || {}
  localStorage.setItem('userNumId',userNumId) 
  localStorage.setItem('userNick',nick) 
  my.DEBUG_TOAST = DEBUG && data.config.debugTostList  &&  (data.config.debugTostList.indexOf(nick)>-1)

}
const GOLDLOG_KEY = '/alipay-lscxr.lscxr2003.'// '/alipay-huichang.lscxr2003.'+ "SAKURA-"
//isFirst，bizScenario，shellerId，countOfAllDraw，countOfDayDraw，countOfTaskFinished
export const trackerClk =(seed,param1 = {})=>{
    let param = {}
    Object.assign(param,param1)
    Object.assign(param,trackerData)
    Object.assign(param,urlParams)
    param.seedName=TRACKER_ID[seed] || param1.name
    let p =  qs.stringify(param)
    let seed1 = seed
    let seed2 = seed+'-sellerId-'+(param.sellerId)
    let seed3 = seed+'-bizScenario-'+(param.bizScenario)
    if(TREACKE){
    goldlog.record(GOLDLOG_KEY+seed1, 'CLK',p )
    param.sellerId && goldlog.record(GOLDLOG_KEY+seed2, 'CLK',p )
    goldlog.record(GOLDLOG_KEY+seed3, 'CLK',p )
    }else {
      console.log('TREACKE OFF') 
    }
    DEBUG && console.log('trackerCLK.'+param.seedName,GOLDLOG_KEY+seed,param,p) 
}

export const trackerExp =(seed,param1 = {})=>{
    let param = {}
    Object.assign(param,param1)
    Object.assign(param,trackerData)
    Object.assign(param,urlParams)
    param.seedName=TRACKER_ID[seed] || seed
    let p =  qs.stringify(param) 
    let seed1 = seed
    let seed2 = seed+'-sellerId-'+(param.sellerId)
    let seed3 = seed+'-bizScenario-'+(param.bizScenario)
    if(TREACKE){
    goldlog.record(GOLDLOG_KEY+seed1, 'EXP',p )
    param.sellerId && goldlog.record(GOLDLOG_KEY+seed2, 'EXP',p )
    goldlog.record(GOLDLOG_KEY+seed3, 'EXP',p )
    }else {
      console.log('TREACKE OFF') 
    }
    DEBUG && console.log('trackerEXP.'+param.seedName,GOLDLOG_KEY+seed,param,p)
}

export const trackerPageLoad =()=>{
    loadTime = +Date.now()
    if(!trackerData.userNumId) {
    let userNumId =  localStorage.getItem('userNumId')  || 0
    userNumId && (trackerData.userNumId = userNumId)
    }
    trackerClk('LOAD',{version:__version__,loadTime})  
}


export const qs = {
    parse: function(str) {
      if (!str || str.length == 0) return {}
      let list = str.split('&')
      if (!list || list.length == 0) return {}
      let out = {}
      for (let index = 0; index < list.length; index++) {
        let set = list[index].split('=')
        set && set.length > 1 && (out[set[0]] = decodeURIComponent(set[1]))
      }
      return out
    },
    stringify: function(data) {
      if (!data) return ''
      let list = []
      for (let key in data) {
        if (data[key] instanceof Array && data[key].length) {
          data[key].forEach(t => {
            list.push(key + '=' + encodeURIComponent(t))
          })
        }
        else {
          list.push(key + '=' + encodeURIComponent(data[key]))
        }
      }
      return list.join('&')
    }
  }
  export function makeUrl(url, data){
    let index = url && url.indexOf('?')
    return index && index > -1 ? url + "&" + qs.stringify(data) : url + "?" + qs.stringify(data)
  }
//iPhone、乘车红包、生活缴费红包、现金红包、商品优惠券
export const PHONE =  "PHONE"
export const BUS_RED_PACKET = "BUS_RED_PACKET"
export const LIFE_PAY_RED_PACKET = "LIFE_PAY_RED_PACKET"
export const CASH_RED_PACKET = "CASH_RED_PACKET"
export const GOODS_COUPON = "GOODS_COUPON"
export const NONE =  "NONE"



export function DebugToast (props){
  return (<div class={props.content?"am-toast-debug text":"hide"}>
  <div class="am-toast-text">
  {props.content}
  </div>
</div>)
}


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
const app = {
  $events:{},
  Tracker:{
    click:trackerClk
  }
}
export const my = {
  DEBUG_TOAST : DEBUG && LOG_DEBUG,
  loadingEvent:{},
  showToast:function({content,delay}){
  console.log("my.showToast",content,+Date.now())
  const box = document.getElementById('box') 
  const toast = document.getElementsByClassName('am-toast')
  toast &&toast[0] && box.removeChild(toast[0])
  React.render( <Toast content={content}  />, box)
  //am-toast
  setTimeout(()=>{
    const toast = document.getElementsByClassName('am-toast')
    toast &&toast[0] && box.removeChild(toast[0])
  },delay||3000)


 
 
},

showToastDebug:function({content,delay}){
  console.log("my.showToast",content,+Date.now())
  const box = document.getElementById('box') 
  const toast = document.getElementsByClassName('am-toast-debug')
  toast &&toast[0] && box.removeChild(toast[0])
  React.render( <DebugToast content={content}  />, box)
  //am-toast
  setTimeout(()=>{
    const toast = document.getElementsByClassName('am-toast-debug')
    toast &&toast[0] && box.removeChild(toast[0])
  },delay||30000) 
},

showLoading:function({content,delay}){
  console.log("my.showLoading",content,+Date.now())
  my.isShowLoading = true
  if(delay) {
    my.showLoadingTimerId =  setTimeout(()=>{
      if( my.showLoadingTimerId) {
      console.log("showLoading delay")
      const box = document.getElementById('box')
      const toast = document.getElementsByClassName('am-toast')
      toast &&toast[0] && box.removeChild(toast[0])
      React.render( <Loading content={content}  />, box)
      }
    },delay)
  }else {
  const box = document.getElementById('box')
  const toast = document.getElementsByClassName('am-toast')
  toast &&toast[0] && box.removeChild(toast[0])
  React.render( <Loading content={content}  />, box)
  }
 
},
hideLoading:function(){
  console.log("my.hideLoading",+Date.now())
  const box = document.getElementById('box') 
  const toast = document.getElementsByClassName('am-toast')
  toast &&toast[0] && box.removeChild(toast[0])
  my.isShowLoading = false
  my.showLoadingTimerId && clearTimeout( my.showLoadingTimerId)
  my.showLoadingTimerId = 0
},
navigateTo:function({url}){//url
  console.log("my.navigateTo")
  pushWindow({link:url})
},
follow:function(){
  return new Promise((resolve, reject)=>{reject(new Error("not implement"))})
},
bind:function(){
  return new Promise((resolve, reject)=>{reject(new Error("not implement"))})
}

}
export function PromiseMap(array) {
  return  new Promise((resolve, reject) => {
    if(array && array.length==0 || array===undefined) {
       reject( {success:false,data: {msg:"array length == 0"}} )
       return 
    }
    let result=new Array(array.length);
    let count = 0;  
    array.forEach((p,index)=>{
      //console.log("PromiseMap each",index)
      let timerId = setTimeout(()=>{ 
        result[index] = {success:false,data: {msg:"timeout"}}  
        count ++
        if(count==array.length) {
          console.log("PromiseMap resolve timeout",index)
          resolve(result)
        }
      },10000)
      p.then((res)=>{
        clearTimeout(timerId)
        result[index] = {success:true,data: res}
        count ++
        if(count==array.length) {
          //console.log("PromiseMap resolve",index)
          resolve(result)
        }
      }).catch((err)=>{  
        clearTimeout(timerId)    
        result[index] = {success:false,data: err}  
        count ++
        if(count==array.length) {
          console.log("PromiseMap resolve err",index)
          resolve(result)
        }
      })
    }) 

  })
}
export function isMember ({sellerId}){
  return  new Promise((resolve, reject) => {
   let checkMember = localStorage.getItem('isMember'+sellerId) 
   let bindError = +(localStorage.getItem('bindError'+sellerId)  || 0)
   if(checkMember) {
      console.log("isMember localStorage true",sellerId)
      return  resolve({isMember:true,bindError,sellerId,from:'localStorage'})
   }
   mtop('mtop.taobao.seattle.memberinfo.get', {sellerId}, { needSignIn: true }).then((result) => {
       console.log('memberinfo.get '+sellerId,result)  
       let data = result && result.data && result.data.result &&  result.data.result
       let status =data.isMember=='true'
       let buyerNick =data.buyerNick
       //let cardCover =data.cardCover
       let mobile =data.mobile
       if(status){
           localStorage.setItem('isMember'+sellerId,1) 
       }
       resolve({isMember:status,bindError,mobile,buyerNick,sellerId,from:'mtop'})
   },(err)=>{
       console.log("mtop memberinfo.get err",err)
       resolve({isMember:true,mobile:null,buyerNick:null,sellerId,bindError,from:'Error'})
      // reject(err)
   })
   })
}


export function isFollow ({sellerId}){
  return  new Promise((resolve, reject) => {
   let checkMember = localStorage.getItem('isFollow'+sellerId) 
   let bindError = +(localStorage.getItem('followError'+sellerId)  || 0)
   if(checkMember) {
      console.log("isFollow localStorage true",sellerId)
      return  resolve({isFollow:true,bindError,sellerId,from:'localStorage'})
   }
   mtop('mtop.tmall.retail.storefollow.info.get',  {query:`type=tb&id=${sellerId}&r=false&img=&back=null&pts=1564979196718&hash=A9674CCC6694A869FCC522F2B1941FBD&spm=a21123.12268209.1.d1`}, { needSignIn: true }).then((result) => {
       console.log('storefollow.info.get '+sellerId,result)  
       let data1 = result && result.data && result.data.result      
       let status =data1.items[0].status=='true'          
       if(status){
           localStorage.setItem('isFollow'+sellerId,1) 
       }
       resolve({isFollow:status,bindError,sellerId,from:'mtop'})
   },(err)=>{
       console.log("mtop memberinfo.get err",err)
       resolve({isFollow:true,mobile:null,buyerNick:null,sellerId,bindError,from:'Error'})
      // reject(err)
   })
   })
}

export function getApp() {
    return app
}

export const store = {
  on:function on(key,fn){
    app.$events[key]=fn
  },
  update:function update(key ,data){
   let fn =  app.$events[key]
   if(fn) {
    fn(data)
   }
  },
}
export const image= {
'down.png':	'https://img.alicdn.com/tfs/TB1hU_RAO_1gK0jSZFqXXcpaXXa-16-16.png',
'mainButton1.png':	'https://img.alicdn.com/tfs/TB11c_PANz1gK0jSZSgXXavwpXa-426-270.png',
'mainButton.png':	'https://img.alicdn.com/tfs/TB1mvjLAGL7gK0jSZFBXXXZZpXa-426-270.png',
'rightButton.png':	'https://img.alicdn.com/tfs/TB17H2OAFT7gK0jSZFpXXaTkpXa-123-76.png',
'titHeader.png':	'https://img.alicdn.com/tfs/TB1G3_UAG61gK0jSZFlXXXDKFXa-702-48.png',
'upper.png':	'https://img.alicdn.com/tfs/TB1eYzSAQL0gK0jSZFxXXXWHVXa-16-16.png',
'shadow.png':	'https://img.alicdn.com/tfs/TB1JqrOALb2gK0jSZK9XXaEgFXa-500-300.png',
'bindImg.jpg':	'https://img.alicdn.com/tfs/TB1vi2TAHY1gK0jSZTEXXXDQVXa-1125-510.jpg',
'bt_bind.png':	'https://img.alicdn.com/tfs/TB1pYzSAQL0gK0jSZFxXXXWHVXa-616-122.png',
'bus_bag.jpg':	'https://img.alicdn.com/tfs/TB14LYQASf2gK0jSZFPXXXsopXa-320-320.jpg',
'close.png':	'https://img.alicdn.com/tfs/TB1vxTTAHj1gK0jSZFOXXc7GpXa-38-38.png',
'buzhou.png':	'https://img.alicdn.com/tfs/TB1whTTAHj1gK0jSZFOXXc7GpXa-544-82.png',
'coupon.png':	'https://img.alicdn.com/tfs/TB1uZHTAQT2gK0jSZPcXXcKkpXa-206-242.png',
'coupon_bg2.jpg':	'https://img.alicdn.com/tfs/TB1Z0zTAUY1gK0jSZFCXXcwqXXa-933-390.jpg',
'area_title.png':	'https://img.alicdn.com/tfs/TB1ooDPAHr1gK0jSZR0XXbP8XXa-488-68.png',
'goBack.png':	'https://img.alicdn.com/tfs/TB1DAzOAQL0gK0jSZFtXXXQCXXa-80-80.png',
'leftButton.png':	'https://img.alicdn.com/tfs/TB1mJbPANz1gK0jSZSgXXavwpXa-123-76.png',
'followImg.png':	'https://img.alicdn.com/tfs/TB12M_UAG61gK0jSZFlXXXDKFXa-804-345.png',
'redbag1.png':	'https://img.alicdn.com/tfs/TB1TonQAUT1gK0jSZFhXXaAtVXa-96-96.png',
'redbag2.png':	'https://img.alicdn.com/tfs/TB1yhYUAKH2gK0jSZJnXXaT1FXa-96-96.png',
'redbag3.png':	'https://img.alicdn.com/tfs/TB1XZrUAQT2gK0jSZFkXXcIQFXa-96-96.png',
'rice.png':	'https://img.alicdn.com/tfs/TB1RhTTAHj1gK0jSZFOXXc7GpXa-121-120.png',
'redEnvelope.png':	'https://img.alicdn.com/tfs/TB1lL2QASf2gK0jSZFPXXXsopXa-240-240.png',
'wtClose.png':	'https://img.alicdn.com/tfs/TB1ZvjLAGL7gK0jSZFBXXXZZpXa-40-40.png',
//'task_bg.png':	'https://img.alicdn.com/tfs/TB1FxHPANn1gK0jSZKPXXXvUXXa-912-1434.png',

}