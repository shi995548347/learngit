var INTERVAL=1000;
var CHARTS={};
var PIES={}
var COLORS= ['#04c4ae','#f7931e','#4c9189','#c49604','#91804c','#5fd0f8','#d171d1','#457826']
var DIR_ID=getRequest('id');
var data={}; 

$(function() {
	initDevices();
});

function initDevices(){
	API.factory.device({
		data:{id:DIR_ID}
		,success:function(json){
			init(json);
		}
	});
}

function loadDevices(){
	API.factory.device({
		data:{id:DIR_ID}
		,success:function(json){
			_parseDevice(json);
		}
	});
}

function init(json){
	var rt = json.device.rt[0];
	if(jQuery.isEmptyObject(data)){
		data =config[rt];
	}
	var html1='';
	var html2='';
	var html3='';
	var pieNo=0;
	var chartNo =0;
	for(var p in data){
		if(data[p].type.t=='tb1'){
			html1 +='<table id="'+p+'" width="100%" cellpadding="10" cellspacing="10"><thead><tr><th colspan="'+data[p].type.colspan+'">'+$.l10n.__(p)+'</th></tr></thead><tbody></tbody></table>';
		}else if(data[p].type.t=='tb2'){
			html2 +='<div><table id="'+p+'" width="100%" cellpadding="10" cellspacing="10"><thead><tr><th colspan="'+data[p].type.colspan+'">'+$.l10n.__(p)+'</th>';
			if(data[p].type.othername){
				for( var l in data[p].type.othername){
					html2 +='<th colspan="'+data[p].type.colspan+'">'+$.l10n.__((data[p].type.othername)[l])+'</th>'
				}
			}
			html2 +='</tr></thead><tbody>'
			for(var i in data[p]){
				if(i=='type') continue;
				switch(data[p][i].type){
					default:
				 		html2+='<tr><td>'+$.l10n.__(i)+'</td><td id="'+i+'"></td></tr>'
					break;
					case 'pie':
						if(data[p].type.othername){
							html2+='<tr><td width="50%"><div id="'+i+'"></div></td> <td><div id="'+data[p].type.othername+'"></div></td></tr>';
						}else html2+='<tr><td rowspan="4" width="50%"><div id="'+i+'"></div></td></tr>';
						PIES[i]=[COLORS[pieNo],'#999999']
						pieNo++;
					break;
				};
			}
			html2 +='</tbody></table></div>';
		}else if(data[p].type.t=='td'){
			html3 +='<table id="'+p+'" width="100%" cellpadding="10" cellspacing="10"><thead><tr><th colspan="'+data[p].type.colspan+'">'+$.l10n.__(p)+'</th></tr></thead><tbody>';
			for(var i in data[p]){
				if(i=='type') continue;
				switch(data[p][i].type){
					default:
						html3+='<tr><td>'+$.l10n.__(i)+'</td><td id="'+i+'"></td></tr>'
					break;
					case 'chart':
						CHARTS[i+'_chart']=COLORS[chartNo];
						html3+='<tr><td>'+$.l10n.__(i)+'</td><td id="'+i+'"></td></tr>'
						html3+='<tr><td colspan="'+data[p].type.colspan+'"><div id="'+i+'_chart"></div></td></tr>';
						chartNo++;
					break;
					case 'value':
						html3+='<tr><td>'+$.l10n.__(i)+'</td><td id="'+i+'">'+$.l10n.__((data[p][i].value)[0])+'('+$.l10n.__((data[p][i].value)[1])+')</td></tr>'
					break;
				};
			}
			html3 +='</tbody></table>';
		}
	}
	html2 += '<div id="img"></div>';
	$("body>div").eq(0).html(html1);
	$("body>div").eq(1).html(html2);
	$("body>div").eq(2).html(html3);
	var html_img = '<img src="images/device/'+json.data.rt+'.png" width="100%" />';
	$("#img").html(html_img);
	 _parseDevice(json);
}

function _parseDevice(json){
	for(var p in data){
		if(data[p].type.t=='tb1'){
			var html='';
			for(var i in data[p]){
				if(i=='type') continue;
				var value =parseJson(json,data[p][i].pos);
				switch(data[p][i].type){
					case 'date':
						value = new Date(Number(value)*1000).toLocaleString();
					break;
					case 'status':
						value =parseStatus(value);
					break;
					case 'day':
						value =timeStamp(value);
					break;
					case 'error':
						html+='<tr><td colspan="2" class="vital">'
						+'<pre>'+value+'</pre></td></tr>';
						continue  ;
					break;
				};
				html+='<tr><td>'+$.l10n.__(i)+'</td><td>'+value+'</td></tr>'
			}
			$("#"+p+" tbody").html(html);
		}else{
			for(var i in data[p]){
				if(i=='type') continue;
				var value =parseJson(json,data[p][i].pos);
				switch(data[p][i].type){
					default:
						$("#"+i).html(value);
					break;
					case 'chart':
						$("#"+i).html(value);
						parseData(i+'_chart',[value]);
					break;
					case 'pie':
						 if(data[p][i].data){
						 	var total =(data[p][i].data)[1]?parseJson(json,(data[p][i].data)[1]):1;
						 	var current =parseJson(json,(data[p][i].data)[0]);
						 	parsePie(i,[current,total-current]);
						 }
					break;
					case 'v2':
						$("#"+i).html(parseJson(json,(data[p][i].value)[0])+"("+parseJson(json,(data[p][i].value)[1])+")");
					break;
					case 'value':
					break;
					case 'percent':
						$("#"+i).html((parseJson(json,(data[p][i].value)[0])/parseJson(json,(data[p][i].value)[1]) *100).toFixed(2)+'%');
					break;
				};
			}
		}
	}
	 window.setTimeout(loadDevices,INTERVAL);
}

function parseJson(json,pos){

	var value =json;
	try{

		var l = pos.split('.');
		for(j in l){
			value =value[l[j]];
		}
	}catch(e){}
	return value
}

function parseData(name,data){
	addChart(name,data);
}

function parseStatus(status){
	switch(status){
		default:
			status ='开机';
		break;
		case 0:
			status ='关机';
		break;
		case 1:
			status ='开机';
		break;
		case 2:
			status ='运行';
		break;
		case 3:
			status ='停机';
		break;
	};
	return status;
}

function addChart(name,data){
	var c=window['chart'+name];
	if(c){
		c.series[0].addPoint(data[0], true, true);
		return;
	}
	var d=[];
	for(var i=0;i<30;i++){
		d.push(0);
	}
	var $g=$('#'+name);
	$g.highcharts({
		chart: {
			backgroundColor: 'rgba(0,0,0,0)'
			,margin: 0
			,padding:0
		}
		,title: {text:''}
		,credits:false
		,legend:{enabled:false}
		,xAxis: {
			type: 'datetime'
            ,visible:false
		}
		,yAxis:[{visible:false}]
		,series:[{
			color:CHARTS[name]
			,marker:{enabled:false}
			,data:d
		}]
	});
	window['chart'+name]=$g.highcharts();
}

function parsePie(name,data){
	addPie(name,data);
}

function addPie(name,data){
	var $g=$('#'+name);

	$g.highcharts({
		chart: {
			backgroundColor: 'rgba(0,0,0,0)'
			,margin: 0
			,padding:0
		}
		,title: { text:(data[0]/(data[0]+data[1])*100).toFixed(2)+'%', y:70,style:{color:'#000'}}
		,credits:false
		,tooltip:{enabled:false}
		,plotOptions: {
			pie: {
				dataLabels: {enabled: false}
				,size:'100%'
				,borderColor:'none'
			}
		}
		,series: [{
			type: 'pie'
			,colors:PIES[name]
			,data: data
			,animation:false
		}]
	});
}

function timeStamp( second_time ){  

    var time = parseInt(second_time);  
    if( parseInt(second_time )> 60){  
        var second = parseInt(second_time) % 60;  
        var min = parseInt(second_time / 60);  
        time = min + ":" + second; 
        if( min > 60 ){  
            min = parseInt(second_time / 60) % 60;  
            var hour = parseInt( parseInt(second_time / 60) /60 );  
            time = hour + ":" + min + ":" + second ;  
            if( hour > 24 ){  
                hour = parseInt( parseInt(second_time / 60) /60 ) % 24;  
                var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );  
                time = day + "d " + hour + ":" + min + ":" + second ;  
            }  
        }
    }  
    return time;          
}  