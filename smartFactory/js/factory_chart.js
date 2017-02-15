var INTERVAL=3000;
var FACTORY_ID=window.parent.FACTORY_ID;

$(function () {
	// loadEnergyData(100);
	// loadUtilizationData(100);
	// loadUsageData(50);
	// loadMalfunctionData(10);
	$('#energytime').datetimepicker({
		start:new Date(new Date().getTime()-24*60*60*7000)
		,end:new Date()
		,linked:document.body
		,callback: function(date){
			loadKpi(date[0].replace(/\//g,'-'),date[1].replace(/\//g,'-'));
		} 
	});
	loadKpi(formatter(new Date(new Date().getTime()-24*60*60*7000)),formatter(new Date()));
	$('.granuality span').click(function(){
		var c=$('.datetimepicker_link input').is(':checked');
		if(c){
			var $c=$('.granuality');
			var i=$(this).index();
			$c.each(function(){
				var s=$('span',this)[i];
				$(s).addClass('selected').siblings().removeClass('selected');
			});
		}else{
			$(this).addClass('selected').siblings().removeClass('selected');
		}
	});
	$('.granuality span:first','#availability').click();
	
});

function formatter(date) {  
	return Highcharts.dateFormat('%Y-%m-%d', date);  
}  
 
function loadKpi(stime,etime){
	API.factory.kpi({
		data:{
			localdms_id:FACTORY_ID
			,start_date:stime
			,end_date:etime
		}
		,success:function(responseText){
			_parseDevice(responseText);
		}
	});
}

function _parseDevice(responseText){
	// responseText=[{"id": "","date": "2017-01-14","event_time": "2017-01-18T17:00:00.094Z","availability": 0.1,"performance": 0.43333334,"quality": 0.9,"oee": 0.3,"loading_time": 0.5,"teep": 0.4},{"id": "","date": "2017-01-15","event_time": "2017-01-18T17:00:00.094Z","availability": 0.8,"performance": 0.5,"quality": 0.6,"oee": 0.4,"loading_time": 0.7,"teep": 0.6},{"id": "","date": "2017-01-16","event_time": "2017-01-18T17:00:00.094Z","availability": 0.6,"performance": 0.6,"quality": 0.7,"oee": 0.4,"loading_time": 0.8,"teep": 0.2},{"id": "","date": "2017-01-17","event_time": "2017-01-18T17:00:00.094Z","availability": 0.4,"performance": 0.2,"quality": 0.7,"oee": 0.5,"loading_time": 0.6,"teep": 1},{"id": "","date": "2017-01-18","event_time": "2017-01-18T17:00:00.094Z","availability": 0.9,"performance": 0.33333334,"quality": 1,"oee": 0.3,"loading_time": 1,"teep": 0.3},{"id": "","date": "2017-01-19","event_time": "2017-01-18T17:00:00.094Z","availability": 1,"performance": 0.8,"quality": 0.1,"oee": 0.8,"loading_time": 1,"teep": 0.6},{"id": "","date": "2017-01-20","event_time": "2017-01-18T17:00:00.094Z","availability": 0.4,"performance": 0.9,"quality": 0.6,"oee": 0.3,"loading_time": 0.4,"teep": 0.9}]
	var availability =[];
	var loading_time=[];
	var oee=[];
	var performance=[];
	var quality=[];
	var teep=[];
	var time = [];
	for(var i in responseText){
		availability.push(responseText[i].availability*100);
		loading_time.push(responseText[i].loading_time*100);
		oee.push(responseText[i].oee*100);
		performance.push(responseText[i].performance*100);
		quality.push(responseText[i].quality*100);
		teep.push(responseText[i].teep*100);
		time.push(responseText[i].date);
	}
	loadChart(availability,time,'availability','#76ab2f','area');
	loadChart(loading_time,time,'loading_time','#5fd0f8','area');
	loadChart(oee,time,'oee','#f7bd05','bar');
	loadChart(performance,time,'performance','#99cd45','bar');
	loadChart(quality,time,'quality','#11ff01','line');
	loadChart(teep,time,'teep','#ccff99','column');
}

function parseData(data,time){
	loadChart(data,time);
	// setTimeout(loadEnergyData,INTERVAL)
}


function loadChart(data ,time,name,color,type){
	
	var $g=$('#'+name+' > div');
	$g.highcharts({
		title: {text:''}
		,credits:false
		,legend:{enabled:false}
		,xAxis: {
			type: 'linear'
			,categories:time
		}
		,yAxis:[{
			title:{text:'%'}
			,tickPositions: [0, 20, 50, 100]
		}]
		,series:[{
			type: type
			,color:color
			,data:data
		}]
		,plotOptions: {
            column: {
                pointWidth:20//设置柱状图宽度
            }
            ,bar: {
                pointWidth:20//设置柱状图宽度
            }
        }
	});
}

