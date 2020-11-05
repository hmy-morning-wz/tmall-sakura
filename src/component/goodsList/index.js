import React from 'zebra-isv-base/libs/preact';
import { crossImage } from 'zebra-isv-base'
import './style.less'
import { pushWindow ,trackerClk, image} from '../../util/common'
const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'

export default class goodsList extends React.Component {
	state = {
		showMore: false
	}
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	seeMore() {
		this.setState(
			{
				showMore: !this.state.showMore
			}
		)
	}

	render() {
		const { showHaijingfang, showZhibo, haijingfangName,
			zhiboName, haijingfangList, zhiboList } = data.config
		// 解析数组
		const createArray = (arr) => {
			let arrar = arr || []
			let result = []
			for(let i=0; i<arrar.length; i++){
				result.push(arr[i])
			}
			return result
		}

		let haijingfang = createArray(haijingfangList)
		let zhibo = createArray(zhiboList)

		console.log(haijingfang, zhibo,'jyuyuyyyyyyyyyyyyyyyyyy',haijingfang.length)


		const handleJump = (item,seed) => {
			let {sellerId,goodsName,brandName,link,name,shopName}= item
			trackerClk(seed,{sellerId,name:goodsName||brandName||shopName||name,url:link})
			let param = {
				link: item.link,
				link_type: item.link_type,
				tblink: item.tblink,
				tblink_type: item.tblink_type,
				name: goodsName||brandName||shopName ||name,
				id:sellerId
			}
			pushWindow(param)
		}

		return (
			<div class="containDiv">
				{
					(showZhibo === "true" || showZhibo === true) &&
					<div class="zhibo">
						<img class="titHeader" src={crossImage.getFitUrl(image['titHeader.png'] || `${assets}image/titHeader.png`)} />
						<div class="zhiboList">
							<div class="zhuanquTit">
								{zhiboName}
							</div>
							{
								zhibo.map((item, idx) => {
									return (
										<div>
											{
												(idx == 0 || this.state.showMore) &&
												<div key={idx} class="eachOne" onClick={() => handleJump(item,'LIVE_SELLER')}>
													<div class="left">
														{
															(item.beginStatus === "true" || item.beginStatus === true) &&
															<div class="zhiboIng">
																<div class="dot"></div>
															直播中</div>
														}
														<img src={crossImage.getFitUrl(item.image)} />
													</div>
													<div class="right">
														<div class="adTxtt">{item.adTxt}</div>
														<div class="zhiboTime">直播时间：{item.beginTime}</div>
														<div class="goodsArea">
															<div class="firstGoods">
																<img src={crossImage.getFitUrl(item.goodsImg)} />
																{
																	item.goodsPrice &&
																	<div class="price">¥{item.goodsPrice}</div>
																}
															</div>
															<div class="secondGoods">
																<div class="mask">{item.goodsNum}<br></br>宝贝</div>
																<img src={crossImage.getFitUrl(item.otherGoodsImg)} />
															</div>
														</div>
														<div class="logoArea">
															<img src={crossImage.getFitUrl(item.logo)} />
															<div class="shopName">{item.shopName}</div>
														</div>
													</div>
												</div>
											}
										</div>
									)
								})
							}
							{
								zhibo.length > 1 &&
								<div onClick={() => this.seeMore()}>									
									{
										this.state.showMore ?
										<div class="seeMore">收起<img src={crossImage.getFitUrl(image['upper.png'] || `${assets}image/upper.png`)} /></div>
										:
										<div class="seeMore">更多直播<img src={crossImage.getFitUrl(image['down.png'] || `${assets}image/down.png`)} /></div>
									}
								</div>
							}
						</div>
					</div>
				}		
				{
					(showHaijingfang === "true" || showHaijingfang === true) &&
					<div class="haijingfang">
						<div class="zhuanquTit">
							{ haijingfangName }
						</div>
						<div class="haijingfangList">
							{
								haijingfang.map((item, idx) => {
									return (
										<div key={idx} class="eachOne" onClick={() => handleJump(item,'GOODS_SALE')}>
											{
												idx < 6 &&
												<img src={crossImage.getFitUrl(item.image)} />
											}
										</div>
									)
								})
							}
						</div>
					</div>
				}
				{/* {
					footMarker &&
					<div class="footMarker">{footMarker}</div>
				} */}
			</div>);
	}
}
