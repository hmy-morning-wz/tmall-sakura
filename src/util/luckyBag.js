import React from  'zebra-isv-base/libs/preact';
import { like,simpleDraw ,localStorage,mtop} from 'zebra-isv-base'
import {isMember,isFollow,trackerClk,PromiseMap,my,luckDrawStart,store,urlParams,LOG_DEBUG} from "./common"  

import Bind from "../component/bind"
import Follow from "../component/follow"
import DrawResult2 from "../component/drawResult2"


var drawTimestamp = 0
export function getBagData({sellerId}){
  let {backClass} =  data.config 
  for(let i=0;i<backClass.length;i++){
    let t = backClass[i]
    if( t.sellerId===sellerId) return t
  }
  return {}
}


my.bind=function(data){
  my.hideBind()
  let bagData = getBagData(data)
  return new Promise((resolve, reject)=>{
    const box = document.getElementById('box')
    React.render( <Bind data={data} bagData={bagData}  resolve={resolve} reject={reject} />, box)
  })
 
}
my.hideBind=function(){
  LOG_DEBUG && console.log("hideBind")
  const box = document.getElementById('box') 
  const mask = document.getElementsByClassName('bind-mask')
  mask &&mask[0] && box.removeChild(mask[0])
}
my.follow=function(data){
  my.hideFollow()
  let bagData = getBagData(data)
  return new Promise((resolve, reject)=>{
    const box = document.getElementById('box')
    React.render( <Follow data={data} bagData={bagData} resolve={resolve}  reject={reject} />, box)
  })
 
}
my.hideFollow=function(){
  LOG_DEBUG && console.log("hideFollow")
  const box = document.getElementById('box') 
  const mask = document.getElementsByClassName('follow-mask')
  mask &&mask[0] && box.removeChild(mask[0])
}

my.showResult = function(data){
  drawTimestamp = 0
  const box = document.getElementById('box')
  React.render( <DrawResult2 data={data}  />, box)
}
my.hideResult=function(){
  const box = document.getElementById('box') 
  const mask = document.getElementsByClassName('drawresult2-mask')
  mask &&mask[0] && box.removeChild(mask[0])
  //openBagList()
}

function checkDrawResult(res,resolve){
  // 抽奖成功
  //"benefitType": "dPromotion",
  //"benefitType":"physicalPrize"
  /*
  {"drawResult":{"msgCode":"LATOUR2-STRATEGY-09","msgMsg":"投放计划状态不可发放|自测验证未通过","win":"false"},"lotteryCount":{"addcount":"1","count":"3","leftCount":"98","maxAddCount":"100","maxCount":"100"}}
  */
  /*
  {"drawResult":{
      "data":{"benefitCode":"4c988a4139014a99a474ba777ebcd4e4",
      "benefitId":"127484786","benefitPoolId":"23792001","benefitTitle":
      "iphone11","benefitType":"physicalPrize","benefitTypeName":"虚拟奖品","extraData":{},
      "issueTime":"2019-10-10 16:30:30","lowestPriceStrategy":"INCLUDE","material":{},
      "outerInstanceId":"2004442407312","recordId":"2004442407312","subBenefitSendResultList":[],
      "trackingData":{},"userId":"791977274","userNick":"louis林新华","userType":"uic"},
      "win":"true"
  },
  "lotteryCount":{"addcount":"1","count":"4","leftCount":"97","maxAddCount":"100","maxCount":"100"}}
  
  */
 let {win,msgMsg} = res && res.drawResult || {}
 if(win===true || win==="true"){
 let drawResultData =(res && res.drawResult && res.drawResult.data) || {} 
 let {benefitType,benefitTitle,userId,userNick,displayStartFee,displayAmount,displayAmountUnit,extraData,recordId} =  drawResultData
 let {primaryContent,shopLogo,shopName,sellerId} = extraData||{}
 if(displayStartFee) {
  primaryContent = primaryContent || `满${displayStartFee}减${displayAmount}`
 }
 /*
  "IPHONE",
  "RED_PACKET",
  "COUPON",
  "NONE"
 */
/*fpRedEnvelope ("现金红包"）
interactCoupon ("店铺优惠券"）
interactItemCoupon ("商品优惠券"）
dPromotion("定向优惠", ）
mouCommonFpRedEnvelope("商家现金红包"） */
let type = 'NONE'
if(benefitType==='physicalPrize'){
 type = 'PHONE'
}else if(benefitType==='fpRedEnvelope'){//"现金红包"
 type = 'CASH_RED_PACKET'
}else if(benefitType==='interactCoupon' || benefitType==='interactItemCoupon'){//"商品优惠券" 
 type = 'GOODS_COUPON'
}else if(benefitType==='alipayCoupon'){ //支付宝红包       
 if(benefitTitle.indexOf('出行红包')!=-1 || benefitTitle.indexOf('乘车')!=-1 || benefitTitle.indexOf('公交地铁红包')!=-1)
   type = 'BUS_RED_PACKET'
 else if(benefitTitle.indexOf('现金红包')!=-1)
   type = 'CASH_RED_PACKET'         
 else  if(benefitTitle.indexOf('缴费红包')!=-1) {
   type = 'LIFE_PAY_RED_PACKET'
 }else  if(benefitTitle.indexOf('优惠券')!=-1) {
     type = 'GOODS_COUPON'
 }else {
     type = 'CASH_RED_PACKET'
 }
}
LOG_DEBUG && console.log("drawResult win",benefitTitle,benefitType)
 resolve({
   win:type!='NONE',
   msg:"SUCCESS", 
   lotteryCount:{},
   data:{
     coupon:{sellerId,displayAmount,displayAmountUnit,primaryContent,shopLogo,shopName},
     recordId,benefitTitle,userId,userNick,benefitType,type,money:displayAmount
    }
  }) //if 抽奖成功
 }else {
  LOG_DEBUG && console.log("drawResult none",msgMsg)           
     resolve({win:false,lotteryCount:{},msg:msgMsg,data:{type:"NONE",money:"0"}})
 }
}

function fetchStatus(contentId){  
 return new Promise((resolve, reject) => {  
   let checkLike = localStorage.getItem("like-"+contentId)     
    if(checkLike)  {
      console.log("checkLike localStorage ",contentId,checkLike)
      resolve({isLiked:true,localStorage:true})
    }else {
      let timerId = setTimeout(()=>{
        LOG_DEBUG && console.log('fetchStatus timeout default false') 
        if(timerId) {
        timerId=0
        resolve({count:0, isLiked:false}) 
        }       
       },5000)    
      like.fetchStatus(contentId).then(({ count, isLiked }) => {
        LOG_DEBUG && console.log('fetchStatus',{contentId,count,isLiked}) 
        if(timerId) {
          clearTimeout(timerId)
          timerId = 0
          if(isLiked) {
            localStorage.setItem("like-"+contentId,1)     
          }
          resolve({count, isLiked})
        }      
        
      })  
    }
})
}

//#### 是否福袋已开启（状态）
export  function hasOpenBag(data){
  // console.log('hasOpenBag',data) 
  let contentId = "BAG-"+data.sellerId
  return fetchStatus(contentId).then(({ isLiked }) => {
    LOG_DEBUG && console.log('hasOpenBag',contentId,isLiked) 
    if(my.DEBUG_TOAST) {
      getBackClassLog.push( {contentId, done:isLiked}) 
    } 
    return {done:isLiked}
  })  

}
//#### 更新福袋开启（状态）
export function updateLuckyBagStatus(data){
  let contentId = "BAG-"+data.sellerId
  localStorage.setItem("like-"+contentId,1) 
  return like.addLike(contentId).then(({  isLiked }) => {
    LOG_DEBUG && console.log('addLike',contentId,isLiked) 
    localStorage.setItem("like-"+contentId,1) 
    return {done:isLiked}
  })
}
//#### 是否任务已完成（状态）
export function getTaskStatus(data){
  // console.log('getTaskStatus',data) 
  let contentId = "TASK-"+data.taskType+'-'+data.sellerId
  if(data.taskType==='member') {
    let member
    let memberStateFrom
    return isMember(data)
    .then(({isMember,from})=>{
      member = isMember
      memberStateFrom  = from
      return fetchStatus(contentId)
    }).then(({  isLiked ,localStorage }) => {
      LOG_DEBUG && console.log('getTaskStatus',{contentId,isLiked,member}) 
      if(my.DEBUG_TOAST) {
        getBackClassLog.push( {contentId, done:isLiked,localStorage,isMember:member,memberStateFrom}) 
      } 
      return { done:isLiked,isMember:member}
    })  
  }else if(data.taskType==='follow') {
    let member
    let memberStateFrom
    return isFollow(data)
    .then(({isFollow,from})=>{
      member= isFollow
      memberStateFrom  = from
      return fetchStatus(contentId)    
    }).then(({  isLiked,localStorage }) => {
      LOG_DEBUG && console.log('getTaskStatus',{contentId,isLiked,member}) 
      if(my.DEBUG_TOAST) {
        getBackClassLog.push( {contentId, done:isLiked,localStorage,isMember:member,memberStateFrom}) 
      } 
      return { done:isLiked,isMember:member}
    })  
  }else {
  return fetchStatus(contentId).then(({  isLiked }) => {
    LOG_DEBUG && console.log('getTaskStatus',{contentId,isLiked}) 
    if(my.DEBUG_TOAST) {
      getBackClassLog.push( {contentId, done:isLiked,isMember:member}) 
    } 
    return { done:isLiked,isMember:false}
  })  
}
}
//#### 更新完成任务（状态）
export function completeTaskStatus(data){
  let contentId = "TASK-"+data.taskType+'-'+data.sellerId
  // 增加奖励
  let actId= data.actId
  if(actId) {
    simpleDraw.updateLotteryCount({
    actId: actId,
  }).then((res)=>{
    //{addcount: "4", count: "39", maxCount: "100", maxAddCount: "100", leftCount: "65"}    
    LOG_DEBUG && console.log("simpleDraw updateLotteryCount",res)
  },(err)=>{
    LOG_DEBUG && console.log("updateLotteryCount",err)       
  })
  }
  localStorage.setItem("like-"+contentId,1) 
  return like.addLike(contentId).then(({isLiked}) => {
    LOG_DEBUG &&  console.log('addLike',contentId,isLiked) 
    localStorage.setItem("like-"+contentId,1) 
    return {done:isLiked}
  })
}

function goSimpleDraw({actId}){
  return new Promise((resolve, reject)=>{
    simpleDraw.draw({
      actId: actId,
    }).then((res)=>{
      LOG_DEBUG &&  console.log("simpleDraw.draw",res)    
      checkDrawResult(res,resolve)
      if(my.DEBUG_TOAST) {
        my.showToastDebug({content:JSON.stringify(res)})
      }
    },(err)=>{
      LOG_DEBUG && console.log("simpleDraw.draw err",err)
      //resolve({win:false})
      if(__isProduction__){
        let {res,message} = err || {}
        let msg = (res.data && res.data.errorMsg) ||message ||"系统开小差了，请稍候重试"
        resolve({win:false,msg,lotteryCount:{},data:{ type:"NONE",money:"0"}})
        return
        //reject(err)            
    }else
      {
        let luck = +Date.now()%7
        let type ='NONE'
        if(luck===0){
            type = 'CASH_RED_PACKET'
        }
        else if(luck===1){
            type = 'NONE'
        } else if(luck===2){
            type = 'LIFE_PAY_RED_PACKET'
        } else if(luck===3){
            type = 'BUS_RED_PACKET'
        } else if(luck===4) {
          type = 'PHONE'
        }else {
            type = 'GOODS_COUPON'
        }    
        let coupon={
        "displayAmountUnit":"元",
        "displayAmount":"10",        
        "primaryContent":"[MOCK]满199减10元",
        "shopLogo":"//img.alicdn.com//65/da/TB1lWMVJXXXXXXSXpXXSutbFXXX.jpg",
        "shopName":"[MOCK]宝洁官方旗舰店"}         
        console.log("mock type",type,coupon)
        resolve({win:type!="NONE",msg:"SUCCESS",lotteryCount:{},data:{benefitTitle:"[MOCK]宝洁优惠券",coupon,userId:'test',userNick:'testNick',type,money:"1"}})
    } 

    if(my.DEBUG_TOAST) {
      my.showToastDebug({content:JSON.stringify(err)})
    }
    })
  })
}

function _draw({actId}){
  LOG_DEBUG && console.log("simpleDraw.draw",actId)
return new Promise((resolve, reject)=>{

  simpleDraw.updateLotteryCount({
    actId: actId,
  }).then((res)=>{
    //{addcount: "4", count: "39", maxCount: "100", maxAddCount: "100", leftCount: "65"}    
    LOG_DEBUG && console.log("simpleDraw updateLotteryCount",res)
    goSimpleDraw({actId}).then((res)=>{
      resolve(res)
    },(err)=>{
      reject(err)
    }).catch((err)=>{
      reject(err)
    })  


  },(err)=>{
      console.log("updateLotteryCount",err) 
      goSimpleDraw({actId}).then((res)=>{
        resolve(res)
      },(err)=>{
        reject(err)
      }).catch((err)=>{
        reject(err)
      })           
  })

 
})
}
export function  openBag(data) {
  return new Promise((resolve, reject)=>{
    ///////////////////////////
let sellerId=data.sellerId;
let task=[]
if(data.task1Type && data.task1Type!='none') {
  task.push({sellerId,taskType:data.task1Type,drawId:data.draw1Id})
}
/*
if(data.task2Type && data.task2Type!='none') {
  task.push({sellerId,taskType:data.task2Type,drawId:data.draw2Id})
}*/ //只有1个任务
if(task.length === 0 ) {
  return reject(new Error("没有任务"))
}
let drawResult={
  bag:data,
  result1:{data:{type:'NONE'}},
  result2:{data:{type:'NONE'}}
}
try{
 
  /*
getTaskStatus(task[0]) //1，判断任务1完成
.then((res)=>{
  if(!(res.done||res.isMember))  {
    //resolve({success:false,message:"任务1未完成"})
    throw new Error("任务1未完成")
  }
  res && (task[0].done = res.done,task[0].isMember = res.isMember)
  if(task.length>=2 && task[1]) {
    return getTaskStatus(task[1]) //1，判断任务2完成
  }else {
    return null //没有任务2
  }
}).then((res)=>{
  if(res && !(res.done||res.isMember)) {
    //resolve({success:false,message:"任务2未完成"})
    throw new Error("任务2未完成")
  } 
  res && (task[1].done = res.done,task[1].isMember = res.isMember)
  return hasOpenBag(data)//2，判断是否开启 
}).then((res)=>{
  if(res.done) {
    //resolve({success:false,message:"福袋已开启"})
    //my.showToast({content:"亲，你已经已开启过了"})
    data.openBagStatus=true
    throw new Error("福袋已开启")
  }
  if(task[0].done){
    my.showLoading({content:'加载中',delay:500})
  return _draw({ //3，抽奖1
    actId: task[0].drawId,
  })
  } else {
    LOG_DEBUG && console.log("任务1未完成，不抽奖1",task[0])
  return {win:false}
 }
}).then((res)=>{
  drawResult.result1=res || {}
 
  if(task.length>=2 && task[1]  && task[1].done){
  return _draw({ //3，抽奖2
    actId:  task[1].drawId,
  })
  }else {
    LOG_DEBUG &&  console.log("任务2未完成或没有任务2，不抽奖2",task[1])
    return {win:false}
  }
}).*/
   luckDrawStart.drawStart()//开始老虎机转圈
   let timeerId = setTimeout(()=>{
    timeerId = 0
    console.log('openBag timeout')
    my.hideLoading()
    store.update("openBag",drawResult)//data.id)
   },5000)
   //throw new Error('test')
  //my.showLoading({content:'加载中',delay:500})
  _draw({  
    actId:  task[0].drawId,
  }).then((res=>{ 
  clearTimeout(timeerId)
  
  drawResult.result1=res|| {data:{type:'NONE'}}
  drawResult.success = true //福袋开启成功
  updateLuckyBagStatus(data).then((res)=>{
    findNextBackClass()
  })
  
  trackerClk("UPDATE_BAG",data)
  // my.showResult(drawResult) == > 老虎机转圈后显示结果页面
  data.openBagStatus=true
  timeerId && store.update("openBag",drawResult)//data.id)
  timeerId = 0
  my.hideLoading()  
  return resolve(drawResult)
})).catch((err)=>{
  clearTimeout(timeerId)
  
  console.log('openBag break',err)
  my.hideLoading()
  timeerId &&  store.update("openBag",drawResult)//data.id)
  timeerId = 0
  reject(err)//异常
})
}catch(err){
  clearTimeout(timeerId)
  console.log('openBag error',err)
  my.hideLoading()
  timeerId && store.update("openBag",drawResult)//data.id)
  timeerId = 0
  reject(err)//异常
}
///////////////////////////
})
}

export function goTask(data,bag){//{taskId:'xxx',taskType:'member',sellerId:xxxxx,url:xxx}
LOG_DEBUG && console.log("goTask",data)
   let {taskId,taskType,sellerId,url} = data || {}
   if( (!sellerId) || !(taskId)) {
    LOG_DEBUG && console.log("goTask param need sellerId and taskId")
    my.showToast({         
          content: '系统开小差了，请稍后再试'
        })
    return
   }
  if(taskType==='goshop') {   
    if(url){
      
  //`&taskType=${taskType}&sellerId=${sellerId}&taskId=${taskId}`
  completeTaskStatus(data).then(({done})=>{
    trackerClk("UPDATE_SHOP_TASK",data)
    if(!done){
      my.showToast({         
      content: '系统开小差了，请稍后再试'
    })
   }  else {
    store.update('completeTask',data)
    my.navigateTo({
      url: url
    });  
    }   
   })
    
    }else {
        console.log("goshop need url",url)
         my.showToast({         
          content: '系统开小差了，请稍后再试'
        })
    }
  } else if(taskType==='follow') //TMALL_FOLLOW_URL
  {
  // let url = common.makeUrl(TMALL_FOLLOW_URL[app.env],{followId:sellerId,userId:app.alipayId,taskType:taskType})
  // let url_path = '/pages/webview/webview?url=' + encodeURIComponent(url) + `&taskType=${taskType}&sellerId=${sellerId}&taskId=${taskId}`
   my.follow(data)
   .then((res)=>{  
    completeTaskStatus(data).then(()=>{  
      trackerClk("UPDATE_FOLLOW_TASK",data)      
      //openBag(bag||getBagData(data))
      store.update('completeTask',data)
     })
     openBag(bag||getBagData(data))
     my.hideFollow()
   }).catch((err)=>{
    console.log("follow catch",err)
    my.hideFollow()
   })
  
  }else  if(taskType==='member')
   {
  // let url = common.makeUrl(TMALL_MEMBER_URL[app.env],{taskId,sellerId,userId:app.alipayId,taskType:taskType})
  // let url_path = '/pages/webview/webview?url=' + encodeURIComponent(url) + `&taskType=${taskType}&sellerId=${sellerId}&taskId=${taskId}`
    my.bind(data)
    .then((res)=>{  
      completeTaskStatus(data).then(()=>{   
        trackerClk("UPDATE_MEMBER_TASK",data)       
        //openBag(bag||getBagData(data))
        store.update('completeTask',data)
       }) 
       openBag(bag||getBagData(data))
       my.hideBind()
    }).catch((err)=>{
      console.log("bind catch",err)
      my.hideBind()
     })
  }else {
    console.log("不支持的任务类型 （taskType 不是 goshop,follow,member）",taskType)
     my.showToast({         
          content: '系统开小差了，请稍后再试'
        })
  }
}
const openList = []
export function openBagList(){
    if(openList.length){
      let bag = openList.pop()
      bag && openBag(bag)
    }
}



var backClassList = []
var backClassLength =  data.config.backClass.length
var getBackClassLog = []
export function getBackClass(start,end){  
  let {backClass} =  data.config 
  let all = []
  start = start || 0
  end  = end || backClass.length
  if(end>backClass.length)  {end = backClass.length}
  LOG_DEBUG && console.log("getBackClass",start,end)
  for(let i=start;i<end;i++){
    let p1=  new Promise((resolve, reject)=>{
    let t = backClass[i]
    let p=[]
    p.push(hasOpenBag(t) )  
    let {sellerId} = t
    if(t.task1Type && t.task1Type!='none') {
      p.push( getTaskStatus({sellerId,taskType:t.task1Type}))
    }
    if(t.task2Type&& t.task1Type!='none') {
      p.push(getTaskStatus({sellerId,taskType:t.task2Type}))
    }
    PromiseMap(p).then((res)=>{
      LOG_DEBUG && console.log("PromiseMap",res)     
      resolve({...t,
        openBagStatus:res[0].success ?res[0].data.done:false,
        task1:res[1] &&res[1].success ? res[1].data:{none:true},
        task2:res[2] &&res[2].success ? res[2].data:{none:true},
      })
    }).catch((err)=>{
      reject(err)
    })
    })
    all.push(p1)
   
  }
  return PromiseMap(all).then((res)=>{    
    let ret = res.filter((t)=>{
       return (!t.data.openBagStatus )&&  t.success && (((!t.data.task1.none) || (!t.data.task2.none) ) &&(!(t.data.task1.isMember && !t.data.task1.done) && !(t.data.task2.isMember&&!t.data.task2.done)))
    }).map((t)=>{
      trackerClk("BAG-"+t.data.sellerId,{name:'活动任务曝光-'+t.data.name})
      let {openBagStatus,task1,task2} = t.data
      if(!openBagStatus){                
        if( (task2.done && task1.done ) 
        ||(task1.done && task2.none ) 
        ||(task2.done && task1.none)){     
          openList.push(t.data)
        }
      }
      return t.data
    }) 
    LOG_DEBUG &&  console.log("PromiseMap result ",res,ret,openList.length)  
    //my.hideLoading()
    if(openList.length) {
      LOG_DEBUG &&   console.log("openList",openList)  
      //openBagList()
    }
    backClassList = ret
    return ret
  })
} 

my.goBag = function(bag){
  let {id,task1Type,sellerId,task1Url} = bag
  if(bag.task1.done) {
     openBag(bag)
  }
  else {
    goTask( {taskId:id,taskType:task1Type,sellerId,url:task1Url},bag)
  } 
}
let start = 0
/*
start = (+localStorage.getItem("getBackClass-start")) || 0       
if(start>=backClassLength) {
  start = 0
}
*/

export function findNextBackClass() {
  let checkBag = false
  if(backClassList && backClassList.length) {
    for(let i=0;i<backClassList.length;i++){
      if(!backClassList[i].openBagStatus){      
        checkBag=true;
        break;
      }
    }
  }
  if(checkBag) {
    return
  }
  getBackClass(start,start+1).then((res)=>{    
    if(res && res.length ){
      for(let i=0;i<res.length;i++){
        if(!res[i].openBagStatus){        
          checkBag=true;
          break;
        }
      }
    }
    if(checkBag) {      
      return
    } 
    start++ 
    LOG_DEBUG &&  console.log("getBackClass then",start)
    if(start<backClassLength) {
      findNextBackClass()
    }else {
      start = 0  
      my.hideLoading()   
      backClassList=[]
      LOG_DEBUG &&  console.log("findNextBackClass none")
    }
  })

}

my.checkBag = function(){
 
  let checkBag = false
  if(backClassList && backClassList.length) {
    for(let i=0;i<backClassList.length;i++){
      if(!backClassList[i].openBagStatus){
        trackerClk('CHECK_BAG',{sellerId:backClassList[i].sellerId})
        my.showDrawResult({bag:backClassList[i]})
        checkBag=true;
        break;
      }
    }
  }
  if(checkBag) {
    return
  }
  if(!my.isShowLoading)my.showLoading({content:"加载中...",delay:500}) 

  getBackClass(start,start+1).then((res)=>{    
    if(res && res.length ){
      for(let i=0;i<res.length;i++){
        if(!res[i].openBagStatus){
          trackerClk('CHECK_BAG',{sellerId:res[i].sellerId})
          my.showDrawResult({bag:res[i]})
          checkBag=true;
          break;
        }
      }
    }
    if(checkBag) {
      my.hideLoading() 
      return
    } 
    start++
    //localStorage.setItem("getBackClass-start",start)      
    LOG_DEBUG && console.log("getBackClass then",start)
    if(start<backClassLength) {
      my.checkBag()
    }else {
      start = 0 
      //localStorage.setItem("getBackClass-start",start)     
      my.hideLoading() 
      my.showToast({content:"今日抽奖机会已用完"})
      if(my.DEBUG_TOAST) {
        my.showToastDebug({content:JSON.stringify(getBackClassLog)})
        getBackClassLog = []
      }
      backClassList=[]
    }
  })
}

let drawTimerId = 0

export function drawDialog(res){
  if(drawTimerId){
  clearTimeout(drawTimerId)
  drawTimerId= 0
  my.showResult({success:res.success,bag:res.bag,result1:res,result2:{}})
  LOG_DEBUG && console.log("drawDialog",Date.now())
  }
}

export function draw(){
  let now = +Date.now()
  if(now-drawTimestamp<1000) {
    return new Promise((r,v)=>{})
  }
  drawTimestamp = now
  getBackClassLog = []
  return new Promise((r,v)=>{
    my.checkBag() 
    store.on("openBag",(res)=>{
        let result = res.result1
        result.success = res.success
        result.bag = res.bag
        r( result)
        drawTimestamp=0
        LOG_DEBUG && console.log("openBag",Date.now())       
        drawTimerId = setTimeout(()=>{
          LOG_DEBUG &&  console.log("openBag setTimeout",Date.now())
          drawDialog(result)
        },10000)        
    })
   // r( {lotteryCount:{isFirst:false}, data:{type:'GOODS_COUPON'}})
  })
  
}

function doTask(bag,task){
  let {done, isMember} = task
  let {sellerId ,task1Type} = bag
  let type = task1Type
  if(done || isMember) {
    console.log("doAllTask done return",{sellerId,type})
    return 
  }
  LOG_DEBUG && console.log("doAllTask task",{sellerId,type})
  if(type=='member') {
    trackerClk("POPUP_GO_BIND",{sellerId})
		mtop('mtop.taobao.seattle.member.bind', {
		  sellerId
		}, { needSignIn: true , v: '2.0',}).then((result) => {
		  LOG_DEBUG && console.log(result)  
		  if(result.data.errorCode==='0'){
			trackerClk("MEMBER_BIND_SUCCESS",{sellerId})
		  }else {
			this.showToast("入会失败") 
			trackerClk("MEMBER_BIND_FAIL",{sellerId})
			let bindError = +(localStorage.getItem('bindError'+sellerId)  || 0)
			localStorage.setItem('bindError'+sellerId,bindError+1)
      }
      bag.openBagStatus = true
		}, (err)=> {
		  let {res,message} = err || {}
		  let msg = (res.data && res.data.errorMsg) ||message ||"系统开小差了，请稍候重试"
			trackerClk("MEMBER_BIND_ERROR",{sellerId,msg})
			let bindError = +(localStorage.getItem('bindError'+sellerId)  || 0)
			localStorage.setItem('bindError'+sellerId,bindError+1)
      LOG_DEBUG &&  console.log('member.bind error', err)    
	  })
  }else if(type=='follow') {
    trackerClk("POPUP_GO_FOLLOW",{sellerId})
		mtop('mtop.taobao.social.follow.weitao.add.h5', {
			"type":1,"followedId":sellerId,"originBiz":"paiyangji","originPage":"https://h5.m.taobao.com/smart-interaction/follow.html?_wvUseWKWebView=YES&type=tb&id=424353450&r=false&img=&back=http%3a%2f%2ftest.tamll.com%3a6501%3ffollowedId%3d92686194&pts=1564979196718&hash=A9674CCC6694A869FCC522F2B1941FBD&spm=a21123.12268209.1.d1","originFlag":""
		}, { needSignIn: true }).then((result) => {
		  LOG_DEBUG && console.log(result)  
		  if(result.data.followAccount==='true'){
			trackerClk("FOLLOW_SUCCESS",{sellerId})	
		  }else {
			let followError = +(localStorage.getItem('followError'+sellerId)  || 0)
			localStorage.setItem('followError'+sellerId,followError+1)
      }
      bag.openBagStatus = true
		}, (err)=> {
		  let {res,message} = err || {}
		  let msg = (res.data && res.data.errorMsg) ||message ||"系统开小差了，请稍候重试"
			trackerClk("FOLLOW_ERROR",{sellerId,msg})
			let followError = +(localStorage.getItem('followError'+sellerId)  || 0)
			localStorage.setItem('followError'+sellerId,followError+1)
			LOG_DEBUG && console.log('follow.add.h5 error', err) 	
	  })
  }

}

my.doAllTask = function(){
  if(data.config.doAllTask && data.config.doAllTask==='ON') {
    LOG_DEBUG && console.log("doAllTask")
  getBackClass().then((res)=>{   
    LOG_DEBUG && console.log("doAllTask then",res.length )
    if(res && res.length ){ 
     for(let i=0;i<backClassList.length;i++){
      if(!res[i].openBagStatus){
         doTask(res[i],res[i].task1)       
      }
    }
    backClassList=[]
    
    }
   })
  }
}

function removAllLike(){
  console.log("removAllLike")
  let {backClass} =  data.config 
  for(let i=0;i<backClass.length;i++){
    let t = backClass[i]
  
    let {sellerId} = t
    let contentId = "BAG-"+sellerId
    like.removeLike(contentId)
    localStorage.setItem("like-"+contentId,'')      
    localStorage.setItem('isFollow'+sellerId,'')
    localStorage.setItem('isMember'+sellerId,'')    
    if(t.task1Type) {
      let contentId = "TASK-"+t.task1Type+'-'+sellerId   
      like.removeLike(contentId)
      localStorage.setItem("like-"+contentId,'')      
    }
    if(t.task2Type) {
      let contentId = "TASK-"+t.task2Type+'-'+sellerId 
      like.removeLike(contentId)
      localStorage.setItem("like-"+contentId,'') 
    }
   
  }
}

if(urlParams.remove  && data.config.debug==='ON') { 
   removAllLike()
}


