var FORM = function(o){
	var g={
		STRINGS:{
			}
		,init:function(){
			g.name=getRequest('api');
			g.SCHEMA=SCHEMA[g.name];
			g.API=API[g.name];
			g.url=g.SCHEMA.api.edit.url;
			g.param=g.SCHEMA.param;
			//g.bindEvent();
			g.initDOM();
			g.initForm();
			g.get();
		}
		,initDOM(){
			var f=document.createElement('div');
			$(f).css({width:'100%',height:'100%',margin:0,padding:0}).addClass('Utable').appendTo('body');
			g.form=f;
		}
		,initForm:function(){
			for(var i=0,l=g.param.length;i<l;i++){
				var I=g.param[i];
				if(!I.html)I.html={caption:$.l10n.__(I.caption||I.field),attr:I.key?'key="true"':''}
				if(I.uitype==='password'){}
			};
			var f={ 
				name:'form'
				,url:g.url
				,fields:g.param
				,actions:{}
			}
			f.actions[$.l10n.__('OK')]=g.edit;
			$(g.form).w2form(f);
			$('input[type="password"]',g.form).attr('placeholder','******');
			$('input[key="true"]',g.form).parent().parent().hide();
		}
		,get:function(){
			g.API.get({success:g.parse});
		}
		,parse:function(json){
			for(var i=0,l=g.param.length;i<l;i++){
				var I=g.param[i];
				var $i=$('#'+I.field);
				$i.val(json[I.field]);
			};
		}
		,edit:function(){
			var data={};
			for(var i=0,l=g.param.length;i<l;i++){
				var I=g.param[i];
				var $i=$('#'+I.field);
				data[I.field]=$i.val();
			};
			data=JSON.stringify(data);
			g.API.edit({
				data:data
				,success:function(json){
					alert($.l10n.__('saved'));
				}
			});
		}
	}
	g.init();
}
$(FORM);