var FACTORY_ID=window.parent.FACTORY_ID;
var DIRS=[];
var DEVICES={};
var TIMEOUT=30000;

$(function(){
});

$(function(){
	bindEvent();
	loadDevices(0);
})

function bindEvent(){
	$('body').on('dblclick','.device', showDevice);
	$('body').on('click','h3', showNode);
}

function loadDevices(n){
	API.factory.devices({
		data:{dir_id:FACTORY_ID}
		,success:function(json){
			if(n===0)parseDevices(json);
			else _parseDevices(json);
		}
	});
}

function parseDevices(json){
	_parseDevices(json);
	loadDomain();
}

function _parseDevices(json){
	for(var i in json){
		var I=json[i];
		var o={data:{mt_data:{mt_status:0,mt_operation_time:0,part_current_cunt:0,spindle_speed_actual_:0}},kpi:{availability:0}}
		if(!I.data)I.data=o.data;
		if(!I.kpi)I.kpi=o.kpi;
		I.DATA={
			id:I.id
			,'name':I.device.name
			,'rt':I.device.rt?I.device.rt[0]:'default'
			,'mt_status':I.data.mt_data.mt_status
			,'operation_time':I.data.mt_data.mt_operation_time
			,'part_current_cunt':I.data.mt_data.part_current_cunt
			,'spindle_speed_actual_':I.data.mt_data.spindle_speed_actual_
			,'availability':I.kpi.availability
		};
		DEVICES[I.id]=I;
	}
	updateDevice();
	window.setTimeout(loadDevices,TIMEOUT);
}

function loadDomain(){
	API.domain.get({
		data:{id:FACTORY_ID,recursive:true}
		,success:parseDomain
	});
}

function parseDomain(json){
	_parseDomain(json);
	loadStatistics();
}

function _parseDomain(json,ul){
	if(!$.isArray(json))json=[json];
	if(!ul){
		var ul=document.createElement('ul');
		$('body').append(ul);
	}
	for(var i in json){
		var I=json[i];
		var li=document.createElement('li');
		var h3=document.createElement('h3');
		var div=document.createElement('div');
		var h4=document.createElement('h4');
		h3.innerHTML=I.name;
		li.id=I.id;
		DIRS.push(I.id);
		$(div).append(h4);
		$(li).append([h3,div]).appendTo(ul);
		if(I.devices&&I.devices.length>0){
			insertDevice(I.devices,div);
		}
		if(I.children_node&&I.children_node.length>0){
			var sul=document.createElement('ul');
			$(sul).appendTo(div);
			_parseDomain(I.children_node,sul);
		}
	}
}

function insertDevice(json,li){
	for(var i in json){
		var I=DEVICES[json[i]];
		var div=document.createElement('div');
		var span=document.createElement('span');
		var h5=document.createElement('h5');
		div.id=I.id;
		div.title=I.device.name;
		div.className='device';
		$(div).append([span,h5]).appendTo(li);
		for(var j in I.DATA){
			var J=I.DATA[j];
			var d=document.createElement('div');
			d.innerHTML='<span class="j">'+$.l10n.__(j)+'</span>：<label>'+J+'</label>';
			$(div).append(d);
		}
		updateDevice(I.id);
	}
}

function updateDevice(id){
	var $d=$('#'+id);
	if(!$d[0])return;
	var I=DEVICES[id];
	$('>span',$d).css({backgroundImage:'url(images/device/'+I.DATA.rt+'.png)'});
	$('h5',$d).innerHTML=I.DATA.name;
	for(var j in I.DATA){
		var J=I.DATA[j];
		$('.'+j+' label').html(J);
	}
}

function showDevice(e){
	var t=e.currentTarget;
	window.top.addTag({title:t.title,url:'device_detail.html?id='+t.id});
}

function showNode(e){
	e.stopPropagation();
	var t=e.currentTarget;
	$(t).toggleClass('close');
}

function loadStatistics(){
	for(var i=0,l=DIRS.length;i<l;i++){
		var id=DIRS[i];
		_loadStatistics(id);
	};
}

function _loadStatistics(id){
	API.factory.statistics({
		data:{id:id}
		,success:function(json){
			parseStatistics(json,id)
		}
	});
}

function parseStatistics(json,id){
	var $d=$('#'+id+' > div > h4');
	var html='<span class="DeviceTotal">'+$.l10n.__('DeviceTotal')+': '+json.DeviceTotal+'</span> | '
		+'<span class="DeviceRunning">'+$.l10n.__('DeviceRunning')+': '+json.DeviceRunning+'</span> | '
		+'<span class="DeviceIdle">'+$.l10n.__('DeviceIdle')+': '+json.DeviceIdle+'</span> | '
		+'<span class="DeviceAlarmed">'+$.l10n.__('DeviceAlarmed')+': '+json.DeviceAlarmed+'</span> | '
		+'<span class="DeviceVital">'+$.l10n.__('DeviceVital')+': '+json.DeviceVital+'</span>';
	$d.html(html);
}
