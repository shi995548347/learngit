/*var Father = React.createClass({
	getDefaultProps:function(){
		console.log("11111 default props");
		return{
			
		}//return必须写
	},
	getInitialState:function(){
		console.log("22222initial state")
		return{
			text:"haha"
		}
	},
	//3.组件载入之前  willMount最后修改组件状态，组件不会发生二次更新 ，发送ajax
	componentWillMount:function(){
		console.log("33333will mount");
		this.setState({
			text:"hello"//可以修改getInitialState里面的text
		});
		var _this = this;
		//延时之后会发生二次渲染
		setTimeout(function(){
			_this.setState({
				text:"hello world"
			})
		},2000)
	},
	//4.mount函；
	render:function(){
		console.log("44444 render");
		return(
			<div>Hello React life {this.state.text}</div>
		);
	},
	//组件加载完毕----真实dom节点，这个方法里面操作真实dom节点
	componentDidMount:function(){
		console.log("55555 did mount");
		document.getElementsByTagName("div")[0].style.color="red";
		//原生可以jq也行
	},
//、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、
	//1、组件即将接收到最新props
	componentWillReceiveProps:function(nextProps,nextState){
		console.log("-----1.update reveive props")
	},
	//2、组件是否渲染,对固定的数据进行判断，返回true或false结果
	shouldComponentUpdate:function(nextProps,nextState){
		console.log("-----2.update should update");
		console.log(nextState)
		//return false;//false 后面的不在加载，可用于优化性能
		if(nextState == "hello"){
			return false;
		}else{
			return true;
		}
	},
	//3、组件即将更新
	componentWillUpdate:function(){
		console.log("-----3.update will update")
	},
	//4、更新完毕后 进行真实dom操作
	componentDidUpdate:function(){
		console.log("-----4.update did update")
	}
});
*/

var Fathers = React.createClass({
	getInitialState:function(){
		return{
			text:''
		}
	},
	handleChange:function(event){
		this.setState({text:event.target.value})
	},
	render:function(){
		return(
			<div>
				this is fathers:
				<input type="text" onChange={this.handleChange} />
				<Child name={this.state.text}></Child>
			</div>
		)
	}
});
//update阶段声明周期函数触发组件修改了自身状态，父组件修改了子组件属性的时候
var Child = React.createClass({
	//1.组件即将接收到最新props
	componentWillReceiveProps:function(nextProps,nextState){
		 console.log('********1.update receive props');
	},
	//2.组件是否渲染 可用于优化性能 可以对固定数据进行判断---返回true,false结果,
	//返回true render方法执行，返回false,render,willupdate,didupdate都不执行了
	shouldComponentUpdate:function(nextProps,nextState){
		console.log('********2.update should component update');
		if(nextProps.name=='snn'){
			return true;
		}else{
			return false;
		}
		
	},
	//3.组件即将更新
	componentWillUpdate:function(){
		console.log('********3.update will update');
	},
	//4.二次更新阶段

	render:function(){
		console.log('********4.render')
		return(
			<div>this is get fathers value:{this.props.name}</div>
			
		);
	},
	//4.更新完毕以后 进行操作真实dom节点
	componentDidUpdate:function(){
		console.log('********5.update did update');
	}

})
//ReactDOM.render(<Father/>,document.body);
ReactDOM.render(<Fathers/>,document.body);
/*
11111 default props
22222initial state
33333will mount
44444 render
55555 did mount
-----2.update should update
----3.update will update
44444 render
-----4.update did update
 * */