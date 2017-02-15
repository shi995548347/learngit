var FACTORY_ID=getRequest('id');
$(function(){
	bindEvent();
	loadStatistics();
	showEnergy();
	showCO2();
	showTemp();
	showHumi();
})

function bindEvent(){
	var f=document.getElementById('frame');
	$('#view > div').click(function(){showWin(this.id);});
	$('#view > div:first').click();
	$('#left,#right').click(function(){$(this).toggleClass('closed');});
}

function loadStatistics(){
	API.factory.statistics({
		data:{id:FACTORY_ID}
		,success:parseStatistics
	});
}

function parseStatistics(json){
	$('#DeviceTotal label').html(json.DeviceTotal);
	$('#DeviceRunning label').html(json.DeviceRunning);
	$('#DeviceIdle label').html(json.DeviceIdle);
	$('#DeviceAlarmed label').html(json.DeviceAlarmed);
	$('#DeviceVital label').html(json.DeviceVital);if(window.PIE){
		window.PIE.series[0].addPoint(data, true, true);
		return;
	}
	var data=[json.DeviceRunning,json.DeviceIdle,json.DeviceAlarmed,json.DeviceVital];
	var $g=$('#pie');
	$g.highcharts({
		chart: {
			backgroundColor: 'rgba(0,0,0,0)'
			,margin: 0
			,padding:0
			,animation:false
		}
		,title: { text: ''}
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
			,colors:['#00ff00','#fbb03b','#ff0000','#00bff3']
			,data: data
		}]
	});
	window.PIE=$g.highcharts();
}

function showWin(id){ 
	var $f=$('#frame'+id);
	var $fs=$('iframe');
	if($f[0]){
		$fs.hide();
		$f.show();
		return;
	};
	$fs.hide();
	var f=document.createElement('iframe');
	f.id='frame'+id;
	f.src='factory_'+id+'.html';
	$('body').append(f);
}


function showEnergy(){
	var $g=$('#energy');
	$g.highcharts({
		credits:false
		,title: {text: ''}
		,chart: {type: 'gauge',margin: 0,padding:0,backgroundColor: 'rgba(0,0,0,0)'}
		,pane: {
			startAngle: -150,
			endAngle: 150,
			background: [
				{background: null,borderWidth: 0,outerRadius: '100%',innerRadius: '100%'}
			]
		}
		,yAxis: {
			min: 0
            ,max: 200
			,tickPosition: 'inside'
			,tickColor:'#cccccc'
			,title: {text: 'kwh/min',y:20,style:{color:'#cccccc'}}
			,labels:{style:{color:'#cccccc'}}
		}
		,plotOptions : {
			gauge : {
				dataLabels : {enabled : true,borderWidth:0, style:{textOutline:'none',boxShadow:'none',textShadow:'none',color:'#fff',fontSize:'22px'}}
				,dial : {backgroundColor: '#fbb03b',radius : '100%'}
				,pivot: {backgroundColor: '#fbb03b'}
			}
		}
		,series: [{
			name: 'Energy'
			,data: [80]
		}]
	}
	,function (chart) {
		setInterval(function () {
			var point = chart.series[0].points[0];
			point.update(rand(0,200));
		}, 3000);
	}
	);
}


function showCO2(){
	var $g=$('#co2');
	$g.highcharts({
		credits:false
		,title: {text: ''}
		,chart: {type: 'gauge',margin: 0,padding:0,backgroundColor: 'rgba(0,0,0,0)',plotShadow: false}
		,pane: {
			startAngle: -150,
			endAngle: 150,
			background: [
				{background: null,borderWidth: 0,outerRadius: '100%',innerRadius: '100%'}
			]
		}
		,yAxis: {
			min: 0
            ,max: 5000
			,tickPosition: 'inside'
			,tickColor:'#000000'
			,title: {text: '°C',y:15,style:{color:'#cccccc'}}
			,labels:{style:{color:'#cccccc'}}
			,plotBands: [
				{from: 0,to: 1000,color: '#00bff3'}
				,{from: 1000,to: 2000, color: '#55BF3B'}
				,{from: 2000,to: 5000,color: '#d9c27d' }
			]
		}
		,plotOptions : {
			gauge : {
				dataLabels : {enabled : true,borderWidth:0, style:{textOutline:'none',boxShadow:'none',textShadow:'none',color:'#fff',fontSize:'16px'}}
				,dial : {backgroundColor: '#fbb03b',radius : '100%'}
				,pivot: {backgroundColor: '#fbb03b'}
			}
		}
		,series: [{
			name: 'CO2'
			,data: [800]
		}]
	}
	,function (chart) {
		setInterval(function () {
			var point = chart.series[0].points[0];
			point.update(rand(0,5000));
		}, 3000);
	}
	);
}

function showTemp(){
	var $g=$('#temp');
	$g.highcharts({
		credits:false
		,title: {text: ''}
		,chart: {type: 'gauge',margin: 0,padding:0,backgroundColor: 'rgba(0,0,0,0)',plotShadow: false}
		,pane: {
			startAngle: -150,
			endAngle: 150,
			background: [
				{background: null,borderWidth: 0,outerRadius: '100%',innerRadius: '100%'}
			]
		}
		,yAxis: {
			min: -50
            ,max: 50
			,tickPosition: 'inside'
			,tickColor:'#000000'
			,title: {text: '°C',y:15,style:{color:'#cccccc'}}
			,labels:{style:{color:'#cccccc'}}
			,plotBands: [
				{from: -50,to: 15,color: '#00bff3'}
				,{from: 15,to: 30, color: '#55BF3B'}
				,{from: 30,to: 50,color: '#DF5353' }
			]
		}
		,plotOptions : {
			gauge : {
				dataLabels : {enabled : true,borderWidth:0, style:{textOutline:'none',boxShadow:'none',textShadow:'none',color:'#fff',fontSize:'16px'}}
				,dial : {backgroundColor: '#fbb03b',radius : '100%'}
				,pivot: {backgroundColor: '#fbb03b'}
			}
		}
		,series: [{
			name: 'Temperature'
			,data: [22]
		}]
	}
	,function (chart) {
		setInterval(function () {
			var point = chart.series[0].points[0];
			point.update(rand(-50,50));
		}, 3000);
	}
	);
}


function showHumi(){
	var $g=$('#humi');
	$g.highcharts({
		credits:false
		,title: {text: ''}
		,chart: {type: 'gauge',margin: 0,padding:0,backgroundColor: 'rgba(0,0,0,0)',plotShadow: false}
		,pane: {
			startAngle: -150,
			endAngle: 150,
			background: [
				{background: null,borderWidth: 0,outerRadius: '100%',innerRadius: '100%'}
			]
		}
		,yAxis: {
			min: 0
            ,max: 100
			,tickPosition: 'inside'
			,tickColor:'#000000'
			,title: {text: '°C',y:15,style:{color:'#cccccc'}}
			,labels:{style:{color:'#cccccc'}}
			,plotBands: [
				{from: 0,to: 30,color: '#c7b299'}
				,{from: 30,to: 60, color: '#55BF3B'}
				,{from: 60,to: 100,color: '#7da7d9' }
			]
		}
		,plotOptions : {
			gauge : {
				dataLabels : {enabled : true,borderWidth:0, style:{textOutline:'none',boxShadow:'none',textShadow:'none',color:'#fff',fontSize:'16px'}}
				,dial : {backgroundColor: '#fbb03b',radius : '100%'}
				,pivot: {backgroundColor: '#fbb03b'}
			}
		}
		,series: [{
			name: 'Humidity'
			,data: [60]
		}]
	}
	,function (chart) {
		setInterval(function () {
			var point = chart.series[0].points[0];
			point.update(rand(0,100));
		}, 3000);
	}
	);
}