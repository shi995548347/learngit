(function(){
$.datetimepicker=function(t,o){
	var g={
		MONTHS:['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
		,WEEKS:['SUN','MON','TUE','WED','THU','FRI','SAT']
		,init:function(){
			o=$.extend({
				start:new Date()
				,linked:false//'body'
			},o);
			g.start=o.start;
			if(t.tagName.toLowerCase()==='input')delete(o.end);
			g.create();
		}
		,create:function(){
			g.container=document.createElement('div');
			g.container.g=g;
			g.$container=$(g.container);
			g.$container.addClass('datetimepicker');
			g.button=document.createElement('button');g.$button=$(g.button);
			g.$container.appendTo(t.parentNode);
			if(o.start)g.createCanlendar(o.start); 
			if(o.end)g.createCanlendar(o.end); 
			g.createButton(); 
			g.createLink(); 
			g.setDatetime();
			$(t).click(g.show);
			$('body').click(g.hide);
		}
		,createLink:function(){
			if(!o.linked)return;
			g.linked=true;
			if($('.datetimepicker_link',o.linked)[0]){return;}
			var header=document.createElement('header');header.className='datetimepicker_link';
			var input=document.createElement('input');input.type='checkbox';
			var label=document.createElement('label');label.innerHTML=$.l10n.__('bind settings');
			label.for=input;
			$(header).append([input,label]).prependTo(o.linked);
			$(input).prop('checked',true).change(function(){
				var c=$(this).is(':checked');
				var $ds=$('.datetimepicker',o.linked);
				$ds.each(function(){this.g.linked=c;});
			});
		}
		,createButton:function(){
			var b=document.createElement('button');
			var c=document.createElement('button');
			b.innerHTML=$.l10n.__('OK');
			c.innerHTML=$.l10n.__('cancel');
			$(b).appendTo(g.$container).before('<hr/>').after(c).click(g.set);
			$(c).click(function(){g.$container.hide();});
		}
		,createCanlendar:function(d,div){
			if(!div){
				div=document.createElement('div');
				g.$container.append(div);
				g.bindEvent(div);
			}
			div.month=new Date(d.getFullYear(),d.getMonth(),d.getDate());
			if(!div.selected)div.selected=new Date(d);
			var Y=d.getFullYear(),M=d.getMonth(),D=d.getDate(),W=d.getDay(),h=d.getHours(),m=d.getMinutes(),s=d.getSeconds();
			var T=new Date(),_TY=T.getFullYear(),_TM=T.getMonth(),_TD=T.getDate();
			var TD=new Date(_TY,_TM,_TD);
			var S=new Date(div.selected.getFullYear(),div.selected.getMonth(),div.selected.getDate());
			var F=new Date(Y,M,1);
			var FW=F.getDay();
			var L=new Date(Y,M+1,0);
			var LD=L.getDate(),LW=L.getDay();
			var html=['<hr/><table cellpdding="0" cellspacing="0"><thead><tr><th class="year_prev">«</th><th class="month_prev">‹</th><th colspan="3"><span>'+Y+'</span> <span>'+$.l10n.__(g.MONTHS[M])+'</span></th><th class="month_next">›</th><th class="year_next">»</th></tr>'];
			html.push('<tr>');
			for(var i=0;i<7;i++){
				html.push('<th>'+$.l10n.__(g.WEEKS[i])+'</th>');
			}
			html.push('</tr></thead><tbody>');
			for(var i=1-FW,l=LD+6-LW;i<=l;i++){
				var _d=new Date(Y,M,i);
				var _Y=_d.getFullYear();
				var _M=_d.getMonth();
				var _D=_d.getDate();
				var _W=_d.getDay();
				if(_W===0)html.push('<tr>');
				html.push('<td datetime="'+_d.getTime()+'" class="'+(_d.getTime()===S.getTime()?'selected ':'')+(_d.getTime()===TD.getTime()?'today ':'')+(_M!==M?'sibling ':'')+'">'+_D+'</td>');
				if(_W===6)html.push('</tr>');
			}
			html.push('</tbody><tfoot><th colspan="7"><input type="number" class="h" value="'+g.pad(h)+'"/> : <input type="number" class="m" value="'+g.pad(m)+'"/> : <input type="number" class="s" value="'+g.pad(s)+'"/></th></tfoot></table>');
			$(div).html(html.join(''));
		}
		,bindEvent:function(div){
			$(div).on('click','.year_prev',function(e){
				e.stopPropagation();
				g.redrawCalendar(div,'Y',-1);
			}).on('click','.year_next',function(e){
				e.stopPropagation();
				g.redrawCalendar(div,'Y',1);
			}).on('click','.month_prev',function(e){
				e.stopPropagation();
				g.redrawCalendar(div,'M',-1);
			}).on('click','.month_next',function(e){
				e.stopPropagation();
				g.redrawCalendar(div,'M',1);
			}).on('click','tbody td',function(e){
				e.stopPropagation();
				g.select(div,$(this).attr('datetime'));
			}).on('change','input',function(e){
				e.stopPropagation();
				g.change(div,this);
			}).on('click','input',function(e){
				e.stopPropagation();
			});
		}
		,_redrawCalendar:function(div,d,n){
			var D=g.getDate(div);
			if(d==='Y')D.d.setFullYear(D[d]+n); 
			if(d==='M')D.d.setMonth(D[d]+n); 
			g.createCanlendar(D.d,div);
		}
		,redrawCalendar:function(div,d,n){
			if(!g.linked){
				g._redrawCalendar(div,d,n);
				return;
			}
			var $cs=$('.datetimepicker',o.linked);
			var i=$(div).index();
			$cs.each(function(){
				this.g._redrawCalendar($('div',this)[i],d,n);
			});
		}
		,_select:function(div,dt){
			var $td=$('[datetime="'+dt+'"]',div);
			$('.selected',div).removeClass('selected');
			$td.addClass('selected');
			div.selected=new Date(dt-0);
			div.selected.setHours($('.h',div).val());
			div.selected.setMinutes($('.m',div).val());
			div.selected.setSeconds($('.s',div).val());
		}
		,select:function(div,dt){
			if(!g.linked){
				g._select(div,dt);
				return;
			}
			var $cs=$('.datetimepicker',o.linked);
			var i=$(div).index();
			$cs.each(function(){
				this.g._select($('div',this)[i],dt);
			});
		}
		,_change:function(div,i,v){
			console.log(v)
			var input=$('input',div)[i];
			console.log(input)
			console.log(input.value)
			var $input=$(input);
			if(!/\d+/.test(v))v=0;
			v=v-0;
			if(i===0){
				if(v>24)v=23;
				if(v<0)v=0;
			}else{
				if(v>60)v=59;
				if(v<0)v=0;
			}
			$input.val(g.pad(v));
			if(i===0)div.selected.setHours(v);
			if(i===1)div.selected.setMinutes(v);
			if(i===2)div.selected.setSeconds(v);
		}
		,change:function(div,input){
			var i=$(input).index();
			var v=input.value;
			if(!g.linked){
				g._change(div,i,v);
				return;
			}
			var $cs=$('.datetimepicker',o.linked);
			var j=$(div).index();
			$cs.each(function(){
				this.g._change($('div',this)[j],i,v);
			});
		}
		,_redrawCalendar:function(div,d,n){
			var D=g.getDate(div);
			if(d==='Y')D.d.setFullYear(D[d]+n); 
			if(d==='M')D.d.setMonth(D[d]+n); 
			g.createCanlendar(D.d,div);
		}
		,redrawCalendar:function(div,d,n){
			if(!g.linked){
				g._redrawCalendar(div,d,n);
				return;
			}
			var $cs=$('.datetimepicker',o.linked);
			var i=$(div).index();
			$cs.each(function(){
				this.g._redrawCalendar($('div',this)[i],d,n);
			});
		}
		,getDate:function(div){
			var d=new Date(div.month);
			var Y=d.getFullYear();
			var M=d.getMonth();
			return {d:d,Y:Y,M:M}
		}
		,getDatetime:function(div){
			var $ds=$('>div',g.$container);
			var d=[];
			$ds.each(function(){
				d.push(this.selected);
			});
			return d;
		}
		,_setDatetime:function(dt){
			var $ds=$('>div',g.$container);
			var str=[];
			for(var i=0,l=$ds.length;i<l;i++){
				var I=$ds[i];
				var d=dt?new Date(dt[i]):(I.selected);
				var Y=d.getFullYear();
				var M=d.getMonth();
				var D=d.getDate();
				var h=d.getHours();
				var m=d.getMinutes();
				var s=d.getSeconds();
				$('.selected',I).removeClass('selected');
				$('[datetime="'+new Date(Y,M,D).getTime()+'"]',I).addClass('selected');
				var S=Y+'/'+g.pad(M+1)+'/'+g.pad(D)+' '+g.pad(h)+':'+g.pad(m)+':'+g.pad(s);
				str.push(S);
			};
			var _str=str.join(' - ');
			t.value=_str;
			t.innerHTML=_str;
			g.datetime=str.length===1?str[0]:str;
		}
		,setDatetime:function(){
			if(!g.linked){
				g._setDatetime();
				return;
			}
			var d=g.getDatetime();
			var $cs=$('.datetimepicker',o.linked);
			$cs.each(function(){
				this.g._setDatetime(d);
			});
		}
		,pad:function(n){
			n=n-0;
			if(n<10)return '0'+n;
			return n;
		}
		,show:function(e){
			e.stopPropagation();
			var x=$(t).position().left;
			var y=$(t).position().top+$(t).height();
			g.$container.css({left:x,top:y}).show();
		}
		,hide:function(e){
			g.$container.hide();
		}
		,set:function(){
			g.setDatetime();
			g.callback();
		}
		,_callback:function(){
			g.hide();
			if(o.callback)o.callback(g.datetime);
		}
		,callback:function(){
			if(!g.linked){
				g._callback();
				return;
			}
			var $cs=$('.datetimepicker',o.linked);
			$cs.each(function(){
				this.g._callback();
			});
		}
	}
	g.init();
};
$.fn.datetimepicker = function(o) {
	if(!o)o={};
	return this.each( function() {
		$.datetimepicker(this,o);
	});
}; 
})();