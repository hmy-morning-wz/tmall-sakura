import React from 'zebra-isv-base/libs/preact';
import { crossImage } from 'zebra-isv-base'
import './style.less'
import { pushWindow ,trackerClk} from '../../util/common'
//const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'

export default class ShopsList extends React.Component {
	state = {
		showShopArea:'true',
		shopAreaTitle:'',
		shopAreaList:[],
	}
	componentDidMount() {

		const { showShopArea, shopAreaTitle, shopAreaList,shopAreaItemList } = data.config
		console.log('shopAreaTitle====',shopAreaTitle)
		console.log('shopAreaItemList====',shopAreaItemList)

		let listOne = this.createArray(shopAreaList)
		let listTwo = this.createArray(shopAreaItemList)
		console.log('listOne====',listOne);
		// let shopGoodList = [{
		// 	logo:'https://gw.alicdn.com/tfs/TB1Az7iXG5s3KVjSZFNXXcD3FXa-350-150.png'
		// },{
		// 	logo:'https://gw.alicdn.com/tfs/TB1Az7iXG5s3KVjSZFNXXcD3FXa-350-150.png'
		// },{
		// 	logo:'https://gw.alicdn.com/tfs/TB1Az7iXG5s3KVjSZFNXXcD3FXa-350-150.png'
		// },{
		// 	logo:'https://gw.alicdn.com/tfs/TB1Az7iXG5s3KVjSZFNXXcD3FXa-350-150.png'
		// }]
		
		for (let index = 0; index < listOne.length; index++) {
			const element = listOne[index];
			element.shopItemList = []
			let shopItemList = []
			for (let idx = 0; idx < listTwo.length; idx++) {
				const ele = listTwo[idx];
				if (ele.brandName  === element.brandName) {
					shopItemList.push(ele)
				}
			}
			element.shopItemList = shopItemList || []
		}
	
		console.log('listOne1====',listOne);

		this.setState({
			showShopArea:showShopArea,
			shopAreaTitle:shopAreaTitle,
			shopAreaList:listOne,
		})
		console.log('shopAreaList====',this.state.shopAreaList);
		// console.log(listOne, listTwo, listThree,'jyuyuyyyyyyyyyyyyyyyyyy')

	}
	componentWillUnmount() {
	}
// 解析数组
	createArray = (arr) => {
		let result = []
		for(let i=0; i<arr.length; i++){
			result.push(arr[i])
		}
		return result
	}

	handleJump = (item,seed) => {
		let {sellerId,goodsName,brandName,link,name,shopName}= item
		trackerClk(seed,{sellerId,name:goodsName||brandName||shopName||name,url:link})
		let param = {
			link: item.link,
			link_type: item.link_type,
			name: goodsName||brandName||shopName ||name,
			id:sellerId
		}
		pushWindow(param)
	}

	render() {
		

		return (
			<div class="containShopDiv">
				{
					(this.state.showShopArea === "true" || this.state.showShopArea === true) &&
					<div class="shopArea">
						{/* <img class="areaTitle" src={`${assets}image/area_title.png`}>
						</img> */}
						<div class="areaTextTitle">{this.state.shopAreaTitle}</div>

						<div class="shopList">
							{
								this.state.shopAreaList.map((item, idx) => {
									return (
										<div key={idx} class="shopItem flex" >
											<div class="shopLogo" onClick={() => this.handleJump(item,'SHOP_GOODS_ADD')}>
												<img class="shopLogoImg" src={crossImage.getFitUrl(item.image)}></img>
												{/* <div class="btnAddBuy">抢先加购 ></div> */}
											</div>
											<div class="shopGoods flex">
												{
													item.shopItemList?this.createArray(item.shopItemList).map((itemGood,index) => {
														return (
															<div class="goodItem" onClick={() => this.handleJump(itemGood,'SHOP_GOODS_ITEM')}>
																<div class="goodItemTitle">{itemGood.goodsName}</div>
																<div class="goodItemAdDesc">{itemGood.goodAdDesc}</div>
																<img class="goodItemLogo" src={crossImage.getFitUrl(itemGood.image)}></img>
															</div>
														)
													}):null
												}
												<div class="line1"></div>
												<div class="line2"></div>
											</div>
										</div>
									)
								})
							}
						</div>
					</div>
				}
			</div>);
	}
}
