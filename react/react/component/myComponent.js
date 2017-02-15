var StyleSheets = {
	container:{
		width:'100px',
		height:'100px',
		background:'red',
		borderRadius:'5px'
	},
	div:{
		width:'40px',height:'40px',background:'blue'
	}
}
//定义为全局对象
var Action = {
	handleClick:function(){
		alert("oooooooooo");
	},
	handleTouch:function(){
		alert("ttttttttttt");
	}
}

var MyComponent = React.createClass({
	/*handleClick:function(){
		alert("oooooooooo");
	},
	handleTouch:function(){
		alert("ttttttttttt");
	},*/
	render:function(){
		//方法三调用
		var _css = this.CSS;
		var _js = this.JS;
		var s ={ i:{width:'400px',height:'400px',background:'red'}}
		return(
			<div style={StyleSheets.container}>
				<div style={StyleSheets.div}></div>
				<input style={_css.input} />
				
				{/**注释
				<button onClick={this.handleClick}>点击</button>
				<button onTouchEnd={this.handleTouch}>点击</button>
				**/}
				<button onTouchEnd={Action.handleTouch}>点击</button>
				
				<input onChange={_js.handleChange}></input>
				<div style={s.i}></div>
			</div>
			
			
		)
	}
})
MyComponent.prototype.CSS = {
	input:{
		border:'2px solid red'
	}
}
MyComponent.prototype.JS = {
	//监听文本框数据变化	
	handleChange:function(){
		console.log('jsjsjsjsjs')
	}
}
//1、css集成：
//1、如何使用react  支持inner css，提倡写行内样式
//行内样式和html整合在一起
//行内样式：要使用对象的方式去写
//{属性:"属性值"}
//注意：遇见css里面有-属性，将-去掉后面的字母大写\n
/* 第一种写css样式的方法:render函数里面return上面去写json变量
 * 第二种：去写全局js对象来实现
 * 第三种：通过原型链进行挂载--在组件原型链上面挂载一些css属性，在渲染的时候，再从原型链取出来
 */
/* 2、js集成：
 * 如何将js整合在jsx中
 * react根据w3c标准自己定义了一套事件机制，并且优先支持移动端
 * 点击事件onClick	开始touch事件 onTouchStart
 * 1、行内通过事件去调用， onClick={this.函数名}
 * 2、全局对象将事件处理----------Action
 * 3、集成js第三种方法---MyComponent.prototype.JS 
 */
//	3、注释
//	{/**  **/}
 
 /* 4、开发中如何使用组件 头部组件，搜索框组件，banner组件，footer组件
  * 组件的嵌套
  */
ReactDOM.render(<MyComponent/>,document.body)