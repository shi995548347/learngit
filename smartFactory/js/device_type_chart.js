var INTERVAL=1000;

$(function () {
	loadEnergyData(10);
	loadNumberData(10);
	loadUsageData(10);
	loadMalfunctionData(10);
});

function loadEnergyData(num){
	/*var data={}
	if(num){
		data.num=num;
	}
	AJAX({
		url:'get_latest'
		,success:parseData
		,data:data
	});*/
	if(!num)num=1;
	var d=[];
	for(var i=0;i<num;i++){
		d.push(rand(0,100));
	}
	parseEnergyData(d);
}

function parseEnergyData(data){
	loadEnergyChart(data);
}


function loadEnergyChart(data){
	if(window.chartEnergy){
		window.chartEnergy.series[0].addPoint(data[0], true, true);
		return;
	}
	var $g=$('#energy > div');
	$g.highcharts({
		title: {text:''}
		,credits:false
		,legend:{enabled:false}
		,xAxis: {
			type: 'datetime'
            /*,labels: {
				formatter: function(){
					return dateTimeToString(new Date(this.value),'hh:mm:ss');
                }
			}*/
		}
		,yAxis:[{title:{text:'kwh'}}]
		,series:[{
			type: 'column'
			,color:'#76ab2f'
			,data:data
		}]
	});
	window.chartEnergy=$g.highcharts();
}

function loadNumberData(num){
	/*var data={}
	if(num){
		data.num=num;
	}
	AJAX({
		url:'get_latest'
		,success:parseData
		,data:data
	});*/
	if(!num)num=1;
	var d=[];
	for(var i=0;i<num;i++){
		d.push(rand(0,100));
	}
	parseNumberData(d);
}

function parseNumberData(data){
	loadChartNumber(data);
}


function loadChartNumber(data){
	if(window.chartNumber){
		window.chartNumber.series[0].addPoint(data[0], true, true);
		return;
	}
	var $g=$('#number > div');
	$g.highcharts({
		title: {text:''}
		,credits:false
		//,legend:{enabled:false}
		,xAxis: {
			type: 'datetime'
            /*,labels: {
				formatter: function(){
					return dateTimeToString(new Date(this.value),'hh:mm:ss');
                }
			}*/
		}
		,yAxis:[{title:{text:'kwh'}}]
		,series:[{
			type: 'pie'
			,color:'#5fd0f8'
			,data:data
		}]
	});
	window.chartNumber=$g.highcharts();
}


function loadUsageData(num){
	/*var data={}
	if(num){
		data.num=num;
	}
	AJAX({
		url:'get_latest'
		,success:parseData
		,data:data
	});*/
	if(!num)num=1;
	var d=[];
	for(var i=0;i<num;i++){
		d.push(rand(0,100));
	}
	parseUsageData(d);
}

function parseUsageData(data){
	loadChartUsage(data);
	//setTimeout(loadUsageData,INTERVAL)
}


function loadChartUsage(data){
	if(window.chartUsage){
		window.chartUsage.series[0].addPoint(data[0], true, true);
		return;
	}
	var $g=$('#usage > div');
	$g.highcharts({
		title: {text:''}
		,credits:false
		,legend:{enabled:false}
		,xAxis: {type: 'category'}
		,yAxis:[{title:{text:'kwh'}}]
		,series:[{
			type: 'column'
			,color:'#f7bd05'
			,data:data
		}]
	});
	window.chartUsage=$g.highcharts();
}


function loadMalfunctionData(num){
	/*var data={}
	if(num){
		data.num=num;
	}
	AJAX({
		url:'get_latest'
		,success:parseData
		,data:data
	});*/
	if(!num)num=1;
	var d=[];
	for(var i=0;i<num;i++){
		d.push(rand(0,100));
	}
	parseMalfunctionData(d);
}

function parseMalfunctionData(data){
	loadChartMalfunction(data);
	//setTimeout(loadMalfunctionData,INTERVAL)
}


function loadChartMalfunction(data){
	if(window.chartMalfunction){
		window.chartMalfunction.series[0].addPoint(data[0], true, true);
		return;
	}
	var $g=$('#malfunction > div');
	$g.highcharts({
		title: {text:''}
		,credits:false
		,legend:{enabled:false}
		,xAxis: {type: 'category'}
		,yAxis:[{title:{text:'kwh'}}]
		,series:[{
			type: 'bar'
			,color:'#f7931e'
			,data:data
		}]
	});
	window.chartMalfunction=$g.highcharts();
}