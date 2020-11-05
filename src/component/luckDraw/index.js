import React from 'zebra-isv-base/libs/preact';
// import { goMyDrawPage, goRulePage } from '../../util/task'
import { trackerClk, pushWindow, my ,image,luckDrawStart} from '../../util/common'
import { draw, drawDialog } from '../../util/luckyBag'
import { localStorage, crossImage } from 'zebra-isv-base'
import './style.less'

const nextRound = requestAnimationFrame;
const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'

export default class luckDraw extends React.Component {
	state = {
		countOfTask: localStorage.getItem('countOfTask') || 0,
		shadowState: true,
		isScale: true,
		istip: false,
		myPrizeTip: false,
		mainIcon: false,
		isFirst: true,
		popupParams: '',
		result: '1',// 指定结果
		slotsData: [// 抽奖数据
			{ name: '出行红包', isActived: 0, img: `${crossImage.getFitUrl(image['redEnvelope.png']|| `${assets}image/redEnvelope.png`)}` },
			{ name: '蚂蚁森林黑米', isActived: 0, img: `${crossImage.getFitUrl(image['rice.png']||`${assets}image/rice.png`)}` },
			{ name: '品牌优惠券', isActived: 0, img: `${crossImage.getFitUrl(image['coupon.png']||`${assets}image/coupon.png`)}` },
		],
		slots: [// 抽奖数据分组
			{
				title: "组1", trans: 0, items: []
			},
			{
				title: "组2", trans: 0, items: []
			},
			{
				title: "组3", trans: 0, items: []
			}
		],
		slotsIndex: [-1, -1, -1],// 中奖索引值
		slotsOpts: null,// 抽奖临时内存区
		slotsStartedAt: null,// 动画内存区
	}
	componentDidMount() {
		this.slotsResult();
		const that = this;
		const interval = setInterval(function () {
			if(that.state.isFirst){
				that.setState({
					mainIcon: !that.state.mainIcon,
				})
			}
		}, 200);
		if(!this.state.isFirst)clearInterval(interval)
		setInterval(() => {
			this.setState({
				shadowState: !this.state.shadowState,
			})
		}, 2000)
		my.getChange=this.getRefreshCount
		luckDrawStart.drawStart = this.slotsStart
	}
	componentWillUnmount() {

	}
	render(user) {
		return (
			<div class="luckDraw">
				<div class="luckDraw-bg">
				<img class="upper" src={`${crossImage.getFitUrl(image['upper.jpg']||`${assets}image/upper.jpg`)}`} />
				<img class="down" src={`${crossImage.getFitUrl(image['down.jpg']||`${assets}image/down.jpg`)}`} />
					{
						this.state.shadowState ? <img class="shadow fadein" src={crossImage.getFitUrl(image['shadow.png']||`${assets}image/shadow.png`)} /> : <img class="shadow fadeout" src={crossImage.getFitUrl(image['shadow.png']||`${assets}image/shadow.png`)} />
					}
					<div class="game-title"></div>
					<div class="luckDraw-title" onClick={() => this.handleTips()}>
						<span class="luck-number">{data.config.activityDate}</span>
					</div>
					<div class="middle-content">
					 <img class="game-shadow" src={crossImage.getFitUrl(image['shadow-bg.png']||`${assets}image/shadow-bg.png`)} /> 
						{
							this.state.slots.map((slot, index) => {
								return <div class={index == 1 ? 'slot-box-inner ml13 mr13' : 'slot-box-inner'} key={index}>
									<div class="slot-items" style={'transform: translateY(' + slot.trans + 'px)'}>
										{
											slot.items.map((item, index2) => {
												return <div class="kuang" key={index2}>
													<img src={item.img} />
													<div>{item.name}</div>
												</div>
											})
										}
									</div>
								</div>
							})
						}
					</div>
					<div class="bottom-content">
						<div class="bottom">
							<div class="left" onClick={() => this.handleMyPrize()}><img src={`${crossImage.getFitUrl(image['leftButton.png']||`${assets}image/leftButton.png`)}`} /></div>
							<div class="middle" onClick={() => this.handleDraw()}>
							    <img  class={this.state.mainIcon? 'hide' : 'mainButton'} src={`${crossImage.getFitUrl(image['mainButton.png'] ||`${assets}image/mainButton.png`)}`}  /> 
								<img  class={!this.state.mainIcon? 'hide' : 'mainButton'} src={`${crossImage.getFitUrl(image['mainButton1.png'] ||`${assets}image/mainButton1.png`)}`} />
							</div>
							<div class="right" onClick={() => this.handleRule()}><img src={`${crossImage.getFitUrl(image['rightButton.png'] || `${assets}image/rightButton.png`)}`} /></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	handleRule() {
		my.showRule()
	}
	//我的奖品toast
	handleMyPrize() {
		this.setState({
			myPrizeTip: true,
		})
		setTimeout(() => {
			this.setState({
				myPrizeTip: false,
			})
		}, 1500);
		trackerClk("RECORD")
		pushWindow(data.config.my_draw)
	}
	handleDraw() {
		this.setState({
			isFirst: false,
		})
		if (this.state.slotsOpts) {
			return false;
		}
		// trackerClk('DRAW_CLK')
		this.getResult()
	}
	handleTips() {
		this.setState({
			istip: true,
		})
		setTimeout(() => {
			this.setState({
				istip: false,
			})
		}, 1500);
	}
	//抽奖完毕给外部调用
	getRefreshCount = () => {
		this.setState({
			isScale: true,
		})
		this.state.slots.forEach((item) => {
			item.trans = 0;
		})
	}
	getPopup() {
		const data = this.state.popupParams;
		drawDialog(data)
	}
	getResult() {
		draw().then((res) => {
			console.log(res,111111)
			this.setState({
				isScale: false,
				popupParams: res,
			})
			if (res.data.type === 'GOODS_COUPON') {
				this.setState({
					result: 3,
				})
			} else if (res.data.type === 'PHONE') {
				this.setState({
					result: 2,
				})
			} else if (res.data.type === 'NONE') {
				this.setState({
					result: 0,
				})
			} else {
				this.setState({
					result: 1,
				})
			}
			this.slotsStart2()
		}, (res) => {
			console.log("结果页面catch", res)
		})
	}
	slotsResult = () => {
		let array = this.state.slotsData
		if (this.state.result) {
			for (let i = 0; i < array.length; i++) {
				array[i].isActived = 0;
			}
			array[this.state.result - 1].isActived = 1;
		} else {
			for (let i = 0; i < array.length; i++) {
				array[i].isActived = 1;
			}
		}
		this.setState({
			slotsData: array
		})
		let middleArray = []
		this.state.slotsData.forEach((item, index) => {
			if (item.name === '蚂蚁森林黑米') {
				middleArray.unshift(item)
			} else {
				middleArray.push(item)
			}
		})
		let rightArray = []
		this.state.slotsData.forEach((item, index) => {
			if (item.name === '品牌优惠券') {
				rightArray.unshift(item)
			} else {
				rightArray.push(item)
			}
		})

		// this.state.slots[0].items = this.state.slotsData;
		// this.state.slots[1].items = middleArray;
		// this.state.slots[2].items = rightArray;
		let slotsArray = [];
		slotsArray = JSON.parse(JSON.stringify(this.state.slots))
		slotsArray[0].items = this.state.slotsData;
		slotsArray[1].items = middleArray;
		slotsArray[2].items = rightArray;
		this.setState({
			slots: slotsArray
		})
		let sl = this.state.slots;
		let si = [];
		for (let i = 0; i < sl.length; i++) {
			si.push(sl[i].items.findIndex(k => k.isActived === 1));
		}
		this.state.slotsIndex = si;// 得到序列，没有则返回 -1
	}
	slotsStart = () => {
		// 如果在抽奖中...不能点击
		//if (this.state.slotsOpts) {
		//	return false;
		//}
		this.slotsResult();
		// 每一个奖品标签的高度，根据实际高度变化(注意 margin 和 padding)
		const itemHeight = document.querySelector(".kuang").offsetHeight;
		this.state.slotsOpts = this.state.slots.map((data, i) => {
			let choice = this.state.slotsIndex[i];// 中奖了，根据序列返回结果
			if (this.state.slotsIndex[0] === -1) {
				choice = Math.floor(Math.random() * data.items.length);// 没中奖，随机返回结果
			}
			// 初始化定义动画动作结果
			const opts = {
				finalPos: choice * itemHeight,// 最终转动位置
				startOffset: 3000 + Math.random() * 500 + i * 1600,// 影响转的圈数
				height: (data.items.length) * itemHeight,// 总长度
				duration: 5000 + i * 2000, // 持续时间，每一个奖品持续4秒，以此累加
				isFinished: false// 是否完成了
			};
			return opts;
		});
		nextRound(this.slotsAnimate);// 开启抽奖动画
	}
	slotsStart2 = () => {
		this.slotsResult();
		// 每一个奖品标签的高度，根据实际高度变化(注意 margin 和 padding)
		const itemHeight = document.querySelector(".kuang").offsetHeight;
		this.state.slotsOpts = this.state.slots.map((data, i) => {
			let choice = this.state.slotsIndex[i];// 中奖了，根据序列返回结果
			if (this.state.slotsIndex[0] === -1) {
				choice = Math.floor(Math.random() * data.items.length);// 没中奖，随机返回结果
			}
			// 初始化定义动画动作结果
			const opts = {
				finalPos: choice * itemHeight,// 最终转动位置
				startOffset: 3000 + Math.random() * 500 + i * 1600,// 影响转的圈数
				height: (data.items.length) * itemHeight,// 总长度
				duration: 5000 + i * 2000, // 持续时间，每一个奖品持续4秒，以此累加
				isFinished: false// 是否完成了
			};
			return opts;
		});
		// nextRound(this.slotsAnimate);// 开启抽奖动画
	}
	slotsAnimate = (timestamp) => {
		// 是否已经在转动了
		if (this.state.slotsStartedAt === null) {
			//this.state.slotsStartedAt = timestamp;// 动画初始时间
			this.setState({ slotsStartedAt: timestamp })
		}
		const timeDiff = timestamp - this.state.slotsStartedAt;// 动画持续的时间
		this.state.slotsOpts.forEach((opt, i) => {
			// 完成后停止转动
			if (opt.isFinished) {
				return false;
			}
			const timeRemaining = Math.max(opt.duration - timeDiff, 0);// 总的持续时间 - 动画持续时间 = 剩下的时间,0表示结束
			const power = 2.5;// 动画转动的力度
			const offset = (Math.pow(timeRemaining, power) / Math.pow(opt.duration, power)) * opt.startOffset;// 偏移量
			const pos = -1 * Math.floor((offset + opt.finalPos) % opt.height);// 转动值
			//console.log(opt)

			// 如果持续时间大于总持续时间，则该项表示完成
			if (timeDiff > opt.duration) {
				opt.isFinished = true;
			}
			// 得到转动数据
			let slots = this.state.slots
			slots[i].trans = pos;
			this.setState({ slots: slots })
		});
		// 当所有项已经完成，则停止转动，回归初始状态
		if (this.state.slotsOpts.every(o => o.isFinished)) {
			// this.state.slotsOpts = null;
			// this.state.slotsStartedAt = null;
			this.getPopup()
			this.setState({
				slotsOpts: null,
				slotsStartedAt: null,
			})

		} else {
			// 否则继续转动
			nextRound(this.slotsAnimate);
		}

	}
}
