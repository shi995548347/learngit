function getRequest(name){ 
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r!=null) return decodeURI(r[2]); return null; 
} 


function getPathName(){
	var p=location.pathname;
	p=p.substr(p.lastIndexOf('/')+1); 
	p=p.substr(0,p.lastIndexOf('.')); 
	return p;
}

function dateTimeToString(d,t){
	var Y=d.getFullYear();
	var M=d.getMonth()+1;
	var D=d.getDate();
	var h=d.getHours();
	var m=d.getMinutes();
	var s=d.getSeconds();
	var MM=(M>9)?M:'0'+M;
	var DD=(D>9)?D:'0'+D;
	var hh=(h>9)?h:'0'+h;
	var mm=(m>9)?m:'0'+m;
	var ss=(s>9)?s:'0'+s;
	switch(t){
		case 'YYYYMMDD':
			return Y+''+MM+''+DD;
		break;
		case 'YYYY-MM-DD':
			return Y+'-'+MM+'-'+DD;
		break;
		case 'YYYY-MM-DD hh:mm':
			return Y+'-'+MM+'-'+DD+' '+hh+':'+mm;
		break;
		case 'YYYY-MM-DD hh:mm:ss':
			return Y+'-'+MM+'-'+DD+' '+hh+':'+mm+':'+ss;
		break;
		case 'YYYY/MM/DD':
			return Y+'/'+MM+'/'+DD;
		break;
		case 'YYYY/MM/DD hh:mm':
			return Y+'/'+MM+'/'+DD+' '+hh+':'+mm;
		break;
		case 'YYYY/MM/DD hh:mm:ss':
			return Y+'/'+MM+'/'+DD+' '+hh+':'+mm+':'+ss;
		break;
		case 'hh:mm':
			return hh+':'+mm;
		break;
		case 'hh:mm:ss':
			return hh+':'+mm+':'+ss;
		break;
		default:
			return Y+'-'+MM+'-'+DD+' '+hh+':'+mm+':'+ss;
		break;
	}
}

function rand(begin,end){
	return Math.floor(Math.random()*(end-begin))+begin;
}

function msgAlert(type,msg) {
    $('.msg_'+type).html(msg);
    $('.msg_'+type).animate({'top': 0},500);
    setTimeout(function(){$('.msg_'+type).animate({'top': '-3rem'},500)},2000);
}

function setLang(lang){
	if(typeof(lang)!=='string')lang=null;
	if(!lang)lang=window.top.Lang;
	if(!lang)lang=localStorage.language;
	if(!lang)lang=window.navigator.systemLanguage || window.navigator.language;
	lang=lang.toLowerCase();
	if(lang.indexOf('-')>-1){
		var l=lang.split('-');
		if(l[0]==='zh'){
			if(lang!=='zh-cn'){
				lang='zh-tw';
			}
		}else{
			lang=l[0];
		}
	}
	window.top.Lang=lang;
	$('[l10n]').l10n({
		lang:lang
	});
}
$(setLang);