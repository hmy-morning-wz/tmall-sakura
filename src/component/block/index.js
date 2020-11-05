
import React from  'zebra-isv-base/libs/preact';
/**
 * import Block from "./component/block"
    <Block order="GoodsList,ShopsList">
          <GoodsList name="GoodsList" />
          <ShopsList name="ShopsList"/>
          </Block>
 * 
 */
export default class Block extends React.Component {
		state = {}

		componentDidMount() {
			//console.log('componentDidMount',this.props)
		}

		componentWillUnmount() {
     
		}

		render(props) {
		
			let {order,children} = props
			
			let children2 = children.map((t)=>{			
				if(typeof t =='object')
				 { 
					 if( t.attributes ) {
						t._order = order.indexOf(t.attributes.name) 
					 }else {
						t._order = -1
					 }
					 
				 }
				 //console.log('map',t)
				return t
			}).filter((t)=>{ return t._order>-1 }).sort((t1,t2)=>{
				return t1._order - t2._order
			}).map((t)=>{
				delete t._order
				return t})
			console.log('render',order,children,children2)
				
			return (<div> {children2}</div>)
			
			//return  (<div></div>)
		}
}