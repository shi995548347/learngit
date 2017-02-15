/* * *
 * 1、组件拆分原则：按照页面格局进行拆分，按照功能进行拆分
 * 2、如何进行嵌套
 * 3、不嵌套如何放进页面中
 * 		在页面中声明div，作为组件存放空间
 * 		依次将两个组件渲染进去
 */
var StyleSheets = {
	header:{
		width:"100%",height:"0.8rem",textAlign:"center",lineHeight:"0.8rem",overflow:'hidden',background:"gray",fontSize:'0.32rem'
	},
	footer:{
		width:"100%",height:"0.8rem",lineHeight:"0.8rem",overflow:'hidden',background:"green",fontSize:'0.32rem',
		display:'flex',justifyContent:'center',alignItmes:"center",position:'fixed',bottom:'0%',left:'0%'
	},
	div:{
		width:"33.3333%",height:'100%',lineHeight:'0.8rem',color:'#fff',textAlign:'center'
	}
}
//头部组件的开始
var ComponentHeader = React.createClass({
	render:function(){
		return(
			<header style={StyleSheets.header}>头部</header>
		);
	}
});

//尾部组件的开始
var ComponentFooter = React.createClass({
	render:function(){
		return(
			<footer style={StyleSheets.footer}>
				<div style={StyleSheets.div}>首页</div>
				<div style={StyleSheets.div}>我的</div>
				<div style={StyleSheets.div}>更多</div>
			</footer>
		);
	}
});
var list = {
	div:{
		width:'100%',height:'2rem',overflow:'hidden',borderBottom:'1px solid #000',display:'flex',justifyContent:'space-around',
		alignItems:'center'
	},
	img:{
		width:"1.6rem",height:"1.6rem"
	},
	span:{
		fontSize:"0.26rem",color:"#999"
	}
}
//列表组件开始
var ComponentList = React.createClass({
	render:function(){
		var _img = "http://img0.imgtn.bdimg.com/it/u=3270983221,2929827525&fm=21&gp=0.jpg";
		var _span = "渲指年华";
		return(
			<div style={list.div}>
				<img src={_img} style={list.img} />
				<span style={list.span}>{_span}</span>
			</div>
		)
	}
})

var ComponentLayout = React.createClass({
	render:function(){
		return(
			<div>
				<ComponentHeader/>
				<ComponentList></ComponentList>
				<ComponentFooter></ComponentFooter>
			</div>
		)
	}
})
ReactDOM.render(<ComponentLayout/>,document.body)
/*ReactDOM.render(<ComponentHeader/>,document.getElementById("header"));
ReactDOM.render(<ComponentFooter/>,document.getElementById("footer"));
ReactDOM.render(<ComponentList/>,document.getElementById("list"));*/
/* 1、如何创建一个组件：
 * React.createClass({render:function(){
 * 	return(返回jsx)
 * }})
 * 2、jsxtransformer.js -- jsx --js 去执行
 * 3、inner css使用方式三种
 * 4、inner js使用方式
 * 5、组件嵌套
 * 6、组件逻辑
 * 
 * state， props，数据载体
 */