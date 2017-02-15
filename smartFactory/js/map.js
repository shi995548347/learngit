var MAP
,FACTORIES={}
,ALERT_MARKER = {
	icon: L.icon({iconUrl: 'js/leaflet/images/marker-icon-red.png', popupAnchor: [1, -50]}),
	popupClass: 'wks-popup alert'
}
,NORMAL_MARKER = {
	icon: L.icon({iconUrl: 'js/leaflet/images/marker-icon.png', popupAnchor: [1, -50]}),
	popupClass: 'wks-popup'
};
$(function(){
	bindEvent();
	loadData();
});

function bindEvent(){
	$('body').on('click','.factory',showFactory);
}

function loadData(){
	var ids=USERINFO.nodes;
	for(var i in ids){
		loadNodes(ids[i]);
	}
}

function loadNodes(id){
	API.domain.get({
		data: {
			id:id
			,recursive: true
		}
		,success:parseNodes
	});
}

function parseNodes(json){
	// if(json.parent&&json.factory==null){
	// 	loadNodes(json.parent);
	// }
	_parseNodes(json);
	initMap();
}

function _parseNodes(json){
	if(json.factory&&json.factory.geojson!==''){
		try{
			FACTORIES[json.id]=json;
		}catch(e){}
	}
	var children=json.children_node;
	if(children&&children.length>0){
		for(var i in children){
			var child=children[i]
			_parseNodes(child);
		}
	}
}

function loadStatistics(id,success){
	API.factory.statistics({
		data:{
			id:id
		}
		,success:success
	});
}

function initMap() {
	MAP=new L.Map('map');
	L.tileLayer.grayscale('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{}).addTo(MAP);
	var bound=initMakers();
	if(bound)MAP.fitBounds(bound);    
}

function initMakers() {
	var makers=[];
	for (var i in FACTORIES) {
		var I=FACTORIES[i];
		if(I.factory.geojson==='')continue;
		makers.push(getMarker(JSON.parse(I.factory.geojson),I));
	}
	if(makers.length===0) return false;
	return L.featureGroup(makers);
}     


function getMarker(p,f) {
	var opt={
		className: 'wks-popup'
	};
	return L
		.marker(p)
		.addTo(MAP).bindPopup('', opt)
		.on('mouseover', function (e) {
			var THIS=this;
			loadStatistics(f.id,function(json){
				var html='<div class="factory" id="'+f.id+'" name="'+f.name+'">'
					+'<img src="images/factory/'+f.name+'.jpg" width="150px" height="80px"/>'
					+'<h2>'+f.name+'</h2>'
					+'<div class="DeviceTotal"><span>'+$.l10n.__('DeviceTotal')+'</span>: <label>'+json.DeviceTotal+'</label></div>'
					+'<div class="DeviceRunning"><span>'+$.l10n.__('DeviceRunning')+'</span>: <label>'+json.DeviceRunning+'</label></div>'
					+'<div class="DeviceIdle"><span>'+$.l10n.__('DeviceIdle')+'</span>: <label>'+json.DeviceIdle+'</label></div>'
					+'<div class="DeviceAlarmed"><span>'+$.l10n.__('DeviceAlarmed')+'</span>: <label>'+json.DeviceAlarmed+'</label></div>'
					+'<div class="DeviceVital"><span>'+$.l10n.__('DeviceVital')+'</span>: <label>'+json.DeviceVital+'</label></div>'
					+'</div>';
				THIS._popup._content=html;
				THIS.openPopup();
			});
		});
}    

function showFactory(e){
	var t=e.currentTarget;
	var id=$(t).attr('id');
	var title=$(t).attr('name');
	window.top.addTag({title:title,url:'factory.html?id='+id});
}