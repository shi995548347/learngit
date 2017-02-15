// var DOMAIN='https://59.110.12.97:18080/v1/';
var DOMAIN='https://172.16.100.134:18080/v1/';
//var DOMAIN='/v1/';
var VERSION='1.0';
if(localStorage.version!==VERSION){
	for(var i in localStorage)localStorage.removeItem(i);
}
localStorage.version=VERSION;
var API={
	quit:function(){
		sessionStorage.removeItem('userinfo');
		sessionStorage.removeItem('Authorization');
		if(window.top.getPathName()!=='index')window.top.location='index.html';
	}
	,login:function(o){

		delete(USERINFO);
		localStorage.lastuser=o.data.username;
		sessionStorage.Authorization='Basic '+window.btoa(o.data.username+':'+o.data.password);
		API.system_user.get({
			success:function(json){
				sessionStorage.userinfo=JSON.stringify(json);
				window.location='main.html';
			}
		});
	}
};

if(sessionStorage.userinfo){
	var USERINFO=JSON.parse(sessionStorage.userinfo);
}else{
	API.quit();
}

var SCHEMA={
	'factory':{
		api:{
			device:{
				url:'data'
				,method:'GET'
			}
			,devices:{
				url:'data/dir'
				,method:'GET'
			}
			,statistics:{
				url:'dir/devices/statistics'
				,method:'GET'
				,dataFilter:function(data,type){
					var data=JSON.parse(data);
					var json={DeviceTotal:0,DeviceRunning:0,DeviceIdle:0,DeviceAlarmed:0,DeviceVital:0,data:data};
					for(var i in data){
						var I=data[i];
						json.DeviceTotal+=I.DeviceTotal;
						json.DeviceRunning+=I.DeviceRunning;
						json.DeviceIdle+=I.DeviceIdle;
						json.DeviceAlarmed+=I.DeviceAlarmed;
						json.DeviceVital+=I.DeviceVital;
					}
					return JSON.stringify(json);
				}
			}
			,kpi:{
				url:'/kpi/daily/all'
				,method:'GET'
			}
		}
	}
	,'device':{
		param:[
			{field:'id',caption:'ID',key:true,required:true,listable:true,addable:true,size:50}
			,{field:'name',caption:'name',type:'text',required:true,listable:true,addable:true,editable:true,size:100}
			,{field:'nodes',caption:'domain',type:'json',required:true,uitype:'domaintree',listable:true,addable:true,editable:true,size:300}
			,{field:'position',caption:'position',type:'text',desc:"device_positiong",required:true,listable:true,addable:true,editable:true,size:100}
			,{field:'rt',caption:'rt',type:'json',required:true,uitype:'select',options:{source:{api:'API.device_type.get',param:{get:{},data:{active:true}}},name:'name',value:'value',multiple:true},listable:true,addable:true,size:100}
			]
		,api:{
			get:{
				url:'device'
				,method:'GET'
			}
			,add:{
				url:'device'
				,method:'POST'
			}
			,edit:{
				url:'device'
				,method:'PUT'
			}
			,del:{
				url:'device'
				,method:'DELETE'
			}
		}
	}
	,'device_alarm':{
		param:[
			{field:'id',caption:'ID',type:'text',key:true}
			,{field:'device_id',caption:'device_id',type:'text',size:100}
			,{field:'level',caption:'level',type:'text',listable:true,size:100}
			,{field:'code',caption:'code',type:'text',listable:true,size:200}
			,{field:'message',caption:'message',type:'text',listable:true,size:200}
			,{field:'c_time',caption:'c_time',type:'text',listable:true,size:200}
			,{field:'acked',caption:'acked',type:'text',listable:true,size:50}
			,{field:'ack_message',caption:'ack_message',type:'text',listable:false,editable:true,size:50}
			]
		,api:{
			get:{
				url:'alarm/all/'
				,method:'GET'
			}
			,edit:{
				url:'alarm/'
				,method:'PUT'
			}
		}
	}
	,'device_alarm_history':{
		param:[
			{field:'id',caption:'ID',type:'text',key:true,listable:false}
			,{field:'device_id',caption:'device_id',type:'text',listable:false}
			,{field:'level',caption:'level',type:'text',listable:true,size:50}
			,{field:'message',caption:'message',type:'text',listable:true,size:200}
			,{field:'code',caption:'code',type:'text',listable:true,size:100}
			,{field:'acked',caption:'acked',type:'text',listable:true,size:50}
			,{field:'ack_username',caption:'ack_username',type:'text',listable:true,size:100}
			,{field:'ack_time',caption:'ack_time',type:'text',listable:true,size:200}
			,{field:'ack_message',caption:'ack_message',type:'text',listable:true,size:200}
			]
		,api:{
			get:{
				url:'alarm/all/?acked=true'
				,method:'GET'
			}
			,edit:{
				url:'alarm/'
				,method:'PUT'
			}
		}
	}
	,'device_alarm_rule':{
		param:[
			{field:'id',caption:'ID',type:'text',key:true}
			,{field:'active',caption:'active',type:'boolean',required:true,uitype:'checkbox',listable:true,addable:true,editable:true,size:200 }
			,{field:'name',caption:'name',type:'text',required:true,listable:true,addable:true,editable:true,size:100}
			,{field:'level',caption:'level',type:'text',required:true,uitype:'select',options:{list:[{name:$.l10n.__('level0'),value:'0'},{name:$.l10n.__('level1'),value:'1'},{name:$.l10n.__('level2'),value:'2'},{name:$.l10n.__('level3'),value:'3'},{name:$.l10n.__('level4'),value:'4'}]},listable:true,addable:true,editable:true,size:200}
			,{field:'msg',caption:'message',type:'text',required:true,listable:true,addable:true,editable:true,size:200}
			,{field:'interval',caption:'interval',desc:'device_alarm_rule_interval',type:'number',required:true,listable:true,addable:true,editable:true,size:200}
			,{field:'rt',caption:'device_type',type:'text',uitype:'select',required:true,options:{source:{api:'API.device.get',param:{}},name:'name',value:'id',multiple:true},listable:true,addable:true,editable:true,size:100}
			//,{field:'nodes',caption:'domain',desc:'device_alarm_rule_nodes',type:'json',required:true,uitype:'domaintree',listable:true,addable:true,editable:true,size:300}
			,{field:'rule',caption:'rule',type:'text',uitype:'textarea',required:true,listable:true,addable:true,editable:true,size:200}
			]
		,api:{
			get:{
				url:'user/'
				,method:'GET'
			}
			,add:{
				url:'rule/'
				,method:'POST'
			}
			,edit:{
				url:'rule/'
				,method:'PUT'
			}
			,del:{
				url:'rule/'
				,method:'DELETE'
			}
		}
	}
	,'device_type':{
		param:[
			// {field:'id',caption:'ID',type:'text',key:true}
			,{field:'name',caption:'name',type:'text',listable:true,editable:true,size:100}
			// ,{field:'vendor',caption:'vendor',type:'text',listable:true,searchable:true,addable:true,editable:true,size:200}
			// ,{field:'parameters',caption:'parameters',type:'text',listable:true,searchable:true,addable:true,editable:true,size:200}
			]
		,api:{
			get:{
				url:'rt/devices/'
				,method:'GET'
				,dataFilter:function(data,type){
					var d=[];
					var data=JSON.parse(data);
					for(var i in data){
						d[i] = {'name':data[i],'value':'["'+data[i]+'"]'}
					}
					return JSON.stringify(d);
				}
			}
			,add:{
				url:'user/'
				,method:'POST'
			}
			,edit:{
				url:'user/'
				,method:'POST'
			}
			// ,del:{
			// 	url:'user/'
			// 	,method:'POST'
			// }
		}
	}
	,'domain':{
		param:[
			{field:'id',type:'text',key:true}
			,{field:'name',type:'text',addable:true,editable:true}
			,{field:'parent',type:'parent',addable:true}
			//,{field:'alarm_rule',caption:'alarm_rule',type:'text',uitype:'select',options:{source:{api:'API.device.get',param:{get:{nodes:'id'},data:{active:true}}},name:'name',value:'id',multiple:true},listable:true,editable:true,size:100}
			,{
				group:'factory'
				,items:[
					{field:'geojson',type:'text',uitype:'geojson',addable:true,editable:true}
					,{field:'graphic',type:'text',addable:true,editable:true,desc:'v_graphic'}
				]
			}
			,{
				group:'localdms'
				,items:[
					{field:'db_ip',type:'text',addable:true,editable:true,desc:'Local Server IP'}
					,{field:'db_name',type:'text',addable:true,editable:true,placeholder:'localdms_1'}
					,{field:'db_port',type:'number',addable:true,editable:true,placeholder:'9042'}
					,{field:'license',type:'text',addable:true,editable:true}
					,{field:'license_request',type:'text',addable:true,editable:true}
					,{field:'presence',type:'text',addable:true,editable:true}
				]
			}
		]
		,api:{
			get:{
				url:'dir/'
				,method:'GET'
			}
			,add:{
				url:'dir/'
				,method:'POST'
			}
			,edit:{
				url:'dir/'
				,method:'PUT'
			}
			,del:{
				url:'dir/'
				,method:'DELETE'
			}
		}
	}
	,'system_alarm':{
		param:[
			{field:'id',caption:'ID',type:'text',key:true}
			,{field:'name',caption:'name',type:'text',listable:true,searchable:true,addable:true,editable:true,size:100}
			,{field:'desc',caption:'desc',type:'text',listable:true,searchable:true,addable:true,editable:true,size:200}
			,{field:'detail',caption:'detail',type:'text',listable:true,searchable:true,addable:true,editable:true,size:200}
			,{field:'time',caption:'time',type:'text',listable:true,searchable:true,addable:true,editable:true,size:200}
			]
		,api:{
			get:{
				url:'user/all/'
				,method:'GET'
			}
			,add:{
				url:'user/all/'
				,method:'POST'
			}
			,edit:{
				url:'user/all/'
				,method:'POST'
			}
			,del:{
				url:'user/all/'
				,method:'POST'
			}
		}
	}
	,'system_log':{
		param:[
			{field:'id',caption:'ID',type:'text',key:true}
			,{field:'name',caption:'name',type:'text',listable:true,searchable:true,addable:true,editable:true,size:100}
			,{field:'desc',caption:'desc',type:'text',listable:true,searchable:true,addable:true,editable:true,size:200}
			,{field:'time',caption:'time',type:'text',listable:true,searchable:true,addable:true,editable:true,size:200}
			]
		,api:{
			get:{
				url:'user/all/'
				,method:'GET'
			}
			,add:{
				url:'user/all/'
				,method:'POST'
			}
			,edit:{
				url:'user/all/'
				,method:'POST'
			}
			,del:{
				url:'user/all/'
				,method:'POST'
			}
		}
	}
	,'system_user':{
		param:[
			{field:'id',caption:'ID',type:'text',key:true,required:true}
			//,{field:'name',caption:'name',type:'text',required:true,listable:true,searchable:true,addable:true,editable:true,size:100}
			,{field:'password',caption:'password',type:'password',uitype:'password',required:true,listable:true,addable:true,editable:true,size:100}
			,{field:'email',caption:'email',type:'email',uitype:'text',listable:true,searchable:true,addable:true,editable:true,size:200}
			,{field:'phone',caption:'phone',type:'text',listable:true,searchable:true,addable:true,editable:true,size:200}
			]
		,api:{
			get:{
				url:'user/'
				,method:'GET'
			}
			,edit:{
				url:'user/'
				,method:'PUT'
			}
		}
	}
	,'system_users':{
		param:[
			{field:'id',caption:'ID',type:'text',key:true,required:true}
			,{field:'name',caption:'name',type:'text',required:true,listable:true,desc:'v_name',addable:true,editable:true,size:100,min:5}
			,{field:'password',caption:'password',type:'text',uitype:'password',required:true,desc:'v_password',listable:true,addable:true,editable:true,size:100,min:8}
			,{field:'email',caption:'email',type:'email',uitype:'text',required:true,desc:'_____@__.__',listable:true,addable:true,editable:true,size:200}
			,{field:'phone',caption:'phone',type:'text',desc:'v_phone',listable:true,addable:true,editable:true,size:200}
			,{field:'nodes',caption:'domain',type:'json',uitype:'domaintree',required:true,listable:true,addable:true,editable:true,size:200}
			]
		,api:{
			get:{
				url:'user/all/'
				,method:'GET'
			}
			,add:{
				url:'user/'
				,method:'POST'
			}
			,edit:{
				url:'user/'
				,method:'PUT'
			}
			,del:{
				url:'user/'
				,method:'DELETE'
			}
		}
	}
	,'resource_type':{
		api:{
			distinct:{
				url:'rt/devices/'
				,method:'GET'
			}
		}
	}
};


for(var i in SCHEMA){
	API[i]={};
	var S=SCHEMA[i].api;
	for(var j in S){
		var a=S[j];
		(function(A,I,J){
			API[I][J]=function(o){
				var o=$.extend(o,A);
				AJAX(o);
			}
		})(a,i,j);
	}
}

function AJAX(o){
	$(o.waiting).show();
	var op=$.extend({
		method:'GET'
		,dataType:'JSON'
		,cache:false
		,data:{}
	},o);
	op.headers=$.extend(o.headers,{
		'Authorization':sessionStorage.Authorization
		,'content-type':'application/json'
	});
	op.url=DOMAIN+o.url;
	if(op.method.toLowerCase()==='delete'){
		var u=[];
		for(var i in o.data){
			u.push(i+'='+o.data[i]);
		}
		op.url+='?'+u.join('&');
		o.data={};
	}
	op.complete=function(h){
		$(o.waiting).hide();
		if(o.complete)o.complete();
	};
	op.error=function(h){
		var message ="Wrong";
		switch(h.status){
			case 408:case 401:
				var json=JSON.parse(h.responseText);
				if(o.error)o.error(json);
				else {
					if(json.message.split(":").length>1){
						message = json.message.split(":")[1];
						if(message.split("=").length>1){
							message = message.split("=")[0];
						}
					}
					msgAlert('warning',$.l10n.__($.trim(message)));
				}
				API.quit();
			break;
			case 500:
				alert(h.responseText);
			break;
			default:
				var json=JSON.parse(h.responseText);
				if(o.error)o.error(json);
				else {
					message =json.message;
					if(json.message.indexOf('already exists') >= 0)
						message ="already exists";
					alert($.l10n.__($.trim(message)));
				}
			break;
		}
	}
	op.success=function(data){
		if(op.dataType==='text'){
			try{
				var json=JSON.parse(data);
				if(json.status){
					if(o.error)o.error(json.message);
					else alert(json.message);
					return;
				}
			}catch(e){}
		}else{
			if(data.status==-1){
				if(o.error)o.error(data.message);
				else alert(data.message);
				return;
			}
		}
		if(o.success)o.success(data);
	}
	if(op.data.request){
		op.data=JSON.parse(op.data.request);
		switch(op.data.cmd){
			case 'get':
				//op.data.page_size=op.data.limit;
				//op.data.page_no=op.data.offset/op.data.limit;
				delete(op.data.limit);
				delete(op.data.offset);
				delete(op.data.selected);
				delete(op.data.cmd);
			break;
			case 'save':
				op.data=op.data.record;
			break;
		}
	}else{
		op.data=o.data;
	}
	return $.ajax(op);
}
