var DIR ={};
var PAGE = function(o){
	var g={
		STRINGS:{
				Search:$.l10n.__('search')
				,Add:$.l10n.__('add')
				,Edit:$.l10n.__('edit')
				,ButtonClose:'<button class="w2ui-btn" id="close">'+$.l10n.__('close')+'</button>'
				,ButtonCancel:'<button class="w2ui-btn" id="cancel">'+$.l10n.__('cancel')+'</button>'
				,ButtonOK:'<button class="w2ui-btn" id="OK">'+$.l10n.__('OK')+'</button>'
				,delAlarm:$.l10n.__('delete items')
			}
		,init:function(){
			g.loadDomain();
			g.name=getRequest('api');
			g.SCHEMA=SCHEMA[g.name];
			g.API=API[g.name];
			g.get_url=g.SCHEMA.api.get.url;
			g.search_form=[];
			g.add_form=[];
			g.edit_form=[];
			g.grid_columns=[];
			var p=g.SCHEMA.param;
			$(p).each(function(){
				this.caption = $.l10n.__(this.caption);
				if(this.key)g.key=this.field;
				if(this.searchable)g.search_form.push(this);
				if(this.addable)g.add_form.push(this);
				if(this.editable)g.edit_form.push(this);
				if(this.listable){g.grid_columns.push(this);if(!this.size)this.size=100;}
			});
			g.layout();
			g.bindEvent();
			g.initSearchForm(g.search_form);
			g.initDataGrid(g.grid_columns);
		}
		,loadDomain:function(){
			API.domain.get({
				data:{recursive:true,async:false}
				,success:g.parseDomain
			});
		}
		,parseDomain:function(json){
			DIR[json.id]=json.name
			if(json.children_node){
				for(var i in json.children_node){
					g.parseDomain(json.children_node[i])
				}
			}
		}
		,layout:function(){
			if(g.search_form.length===0)return;
			$('body').w2layout({
				name: 'layout'
				,panels: [
					{type: 'left',content:'<div id="side"></div>',size:220,title:g.STRINGS.Search,resizable:true}
					,{type: 'main'}
				]
			});
			g.$side=$('#side');
		}
		,bindEvent:function(){
			$('body')
				.on('click','#close,#cancel',function(){w2popup.close();})
				.on('click','#search',g.Search);
		}
		,initDataGrid:function(c){
			var p=g.$side?'#layout_layout_panel_main .w2ui-panel-content':'body';
			var grid=document.createElement('div');
			g.$grid=$(grid);
			g.$grid.css({width:'100%',height:'100%'}).appendTo(p).w2grid({ 
				url:g.get_url
				,name:'grid'
				,postData:{}
				,show: {
					selectColumn: true
					,lineNumbers: true
					,toolbar:true
					,footer: true
					,toolbarAdd: (g.API.add&&g.add_form.length>0)||false
					,toolbarEdit: (g.API.edit&&g.edit_form.length>0)||false
					,toolbarDelete: g.API.del||false
					,toolbarSearch: false
					,toolbarInput:false
					//,toolbarColumns:false
					}
				,searches:false
				,toolbar:o.toolbar||false
				,autoLoad:true
				,multiSelect: false
				,reorderColumns: true
				,recordHeight:25
				,columns: c
				,recid:g.key
				,onAdd:g.initAddForm
				,onEdit:g.initEditForm
				,onDelete:g.Delete
				,parser: g.parser
			});
		}
		,parser:function(responseText) {
			var data=JSON.parse(responseText);
			$(data).each(function(){
				$(this).each(function(){
					for(var p in this){
						if(p == 'nodes')this[p]=DIR[this[p]];
						if(typeof(this[p])==='object'){this[p]=JSON.stringify(this[p])}
					}
				});
			});
			var json={
				total:data.length
				,records:data
			};
			if(typeof(data[0])==='string'){
				json.records =[];
				for (var _ in data){
					json.records.push({'name':data[_]});
				}
			}
			
			return json;
		}
		,reloadGrid:function(e){
			w2ui.grid.reload();
		}
		,initSearchForm:function(d){
			if(!g.$side)return;
			var d=g.search_form;
			if(d.length===0)return;
			$(d).each(function(){
				switch(this.type){
					case 'select':
						if($.isArray(this.source.list)){
							var s=document.createElement('select');
							s.name=this.field;
							var v=this.source.value;
							var n=this.source.text;
							var l=this.source.list;
							for(var i in l){
								var o=document.createElement('option');
								o.value=l[i][v];
								o.text=l[i][n];
								$(o).appendTo(s);
							}
							g.$side.append('<div>'+this.caption+':</div>');
							g.$side.append(s);
						}else{
							g.$side.append('<div>'+this.caption+':</div><input type="text" name="'+this.field+'"/>');
						}
					break;
					case 'datetime':
						g.$side.append('<div>'+this.caption_from+':</div><input type="datetime" name="'+this.field+'__from"/>');
						g.$side.append('<div>'+this.caption_to+':</div><input type="datetime" name="'+this.field+'__to"/>');
					break;
					default:
						g.$side.append('<div>'+this.caption+':</div><input type="text" name="'+this.field+'"/>');
					break;
				}
			});
			$('input[type=datetime]',g.$side).w2field('date',{format: 'yyyy-mm-dd'});
			g.$side.append('<button id="search">'+g.STRINGS.Search+'</button>');
			
		}
		,initAddForm:function(){
			g.initForm(g.add_form,'Add');
		}
		,initEditForm:function(){
			g.initForm(g.edit_form,'Edit');
		}
		,initForm:function(d,f){
			var tb=document.createElement('table');
			g.table=tb;
			var $tb=$(tb);
			$(tb).addClass('Utable');
			var id=w2ui.grid.getSelection()[0];
			$(d).each(function(){
				var tr=document.createElement('tr');
				var td1=document.createElement('td');
				var td2=document.createElement('td');
				if(this.required)td1.className='required';
				switch(this.uitype){
					default:
						var input=document.createElement('input');
						input.type='text';
					break
					case 'textarea':
						var input=document.createElement('textarea');
					break
					case 'checkbox':
						var input=document.createElement('input');
						input.type='checkbox';
					break
					case 'select':
						var input=document.createElement('select');
						if(this.options.multiple){input.multiple='multiple';}
						if(this.options.list){
							var items=this.options.list;
							for(var i in items){
								var I=items[i];
								var op=document.createElement('option');
								op.value=I.value;
								op.text=I.name;
								$(op).appendTo(input);
							};
						}
					break;
				};
				input.name=this.field;
				input.id=f+'_'+this.field;
				input.define=this;
				$(td1).html(this.caption);
				$(input).addClass('w2ui-input').appendTo(td2).change(g.Validate);
				$(tr).append(td1).append(td2).appendTo(tb);
				if(this.desc)$(td1).addClass('desc').mouseover(function(){$(this).w2overlay({align:'right',html:$.l10n.__(input.define.desc)})});
				if(f==='Edit'){
					var data=w2ui.grid.get(id);
					var v=data[this.field];
					switch(this.uitype){
						case 'password':
							input.placeholder='******';
						break;
						case 'checkbox':
							if(v===true)input.setAttribute('checked','checked');
						break;
						case 'json':
							//v=JSON.stringify(v);
						break;
						case 'select':
							if(this.options.multiple){
								var V=v?JSON.parse(v):[];
								for(var i in V){
									$('option[value="'+V[i]+'"]',input).attr('selected','selected');
								}
							}else{
								$('option[value="'+v+'"]',input).attr('selected','selected');
							}
						break;
					}
					input.value=v;
					input.original_value=v;
				}
				switch(this.uitype){
					case 'select':
						if(this.options.multiple)g.multiSelect(input);
					break;
					case 'domaintree':
						$(input).domaintree();
					break;
				}
			});
			w2popup.open({
				title: g.STRINGS[f]
				,body: $tb
				,buttons:g.STRINGS.ButtonOK+g.STRINGS.ButtonCancel
				,width:400
				,height:40*(d.length+5)
				,modal:true
				,showClose: true
				,showMax:true
			});
			$('select[multiple]',tb).each(function(){
				var p=this.define;
				if(p.options.source){
					g.getList(this,p.options,f);
				}
			});
			$('#OK').click(function(){
				g[f](d,id);
			});
		}
		,Search:function(d){
			var d=g.search_form;
			var p={};
			$(d).each(function(){
				var v=$('[name='+this.field+']',g.$side).val();
				if(v!=='')p[this.field]=v;
			});
			w2ui.grid.postData=p;
			g.reloadGrid();
		}
		,Add:function(d){
			g.Save(d);
		}
		,Edit:function(d,id){
			g.Save(d,id);
		}
		,Validate:function(d){
			if(d.currentTarget){d=[d.currentTarget.define]}
			var r=true;
			$(d).each(function(){
				var e=true;
				var $input=$('[name='+this.field+']',g.table);
				var input=$input[0];
				var v=input.true_value||input.value;
				$input.removeClass('error');
				if(this.required){
					if($.trim(v)===''){
						if(input.placeholder!=='******')r=e=false;
					}
				}
				if(this.min){
					if($.trim(v).length<this.min){
						r=e=false;
					}
				}
				switch(this.type){
					case 'json':
						
					break;
					case 'phone':
						if(!$.isNumeric(v))r=e=false;
					break;
					case 'number':
						if(!$.isNumeric(v))r=e=false;
					break;
					case 'email':
						if(!/^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/.test(v))r=e=false;
					break;
				}
				if(!e)$input.addClass('error'); //alert($.l10n.__(input.define.desc))};
			});
			return r;
		}
		,Save:function(d,id){
			if(!g.Validate(d))return;
			var p={
				data:{}
				,success:function(){
					g.reloadGrid();
					w2popup.close();
				}
			};
			if(id)p.data.id=id;
			$(d).each(function(){
				var input=$('[name='+this.field+']',g.table)[0];
				var v=input.true_value||input.value;
				var ov=input.original_value;
				if(id){
					if(v!==ov)p.data[this.field]=v;
				}else{
					p.data[this.field]=v;
				}
				switch(this.type){
					case 'json':
					try{
						p.data[this.field]=JSON.parse(v);
					}catch(e){}
					break;
					case 'number':
						p.data[this.field]=v-0;
					break;
					case 'boolean':
						p.data[this.field]=p.data[this.field]==='on'?true:false;
					break;
				}
				//if(this.source&&this.source.multiple)p.data[this.field]=JSON.stringify(v);
			});
			p.data=JSON.stringify(p.data);
			if(id)g.API.edit(p);
			else g.API.add(p);
		}
		,Delete:function(event){
			event.preventDefault();
			var d=function(b){
				if(b==='No')return;
				var id=w2ui.grid.getSelection()[0];
				var p={
					data:{id:id}
					,success:g.reloadGrid
				};
				g.API.del(p);
			}
			w2confirm(g.STRINGS.delAlarm, d)
		}
		,getList:function(s,p,f){
			if(f==='Edit'){
				var id=w2ui.grid.getSelection()[0];
				var d=w2ui.grid.get(id);
				var v=d[s.name];
				var V=v?((p.multiple)?JSON.parse(v):[v]):[];
			}
			var $s=$(s);
			var fn=eval(p.source.api);
			var n=p.name;
			var v=p.value;
			var data={};
			if(p.source.param){
				data=p.source.param.data;
				if(p.source.param.get){
					for(var i in p.source.param.get){
						var input=$('[name='+i+']',g.table)[0];
						if(!input)continue;
						data[i]=input.true_value||input.value;
					}
				}
			}
			fn({
				data:data
				,success:function(json){
					for(var i in json){
						var I=json[i];
						var op=document.createElement('option');
						op.text=I[n];
						op.value=I[v];
						if(f==='Edit'&&$.inArray(I[v],V)>-1){op.setAttribute('selected','selected');}
						$s.append(op);
					};
				}
			});
		}
		,multiSelect:function(input){
			var dinput=document.createElement('input');
			var ddiv=document.createElement('div');
			var $dinput=$(dinput);
			var $ddiv=$(ddiv);
			dinput.type='text';
			dinput.ddiv=ddiv;
			dinput.input=input;
			input.dinput=dinput;
			$dinput.addClass('dropdown');
			$ddiv.css({position:'absolute'}).hide();
			$(input).hide().after(ddiv).after(dinput);
			$dinput.val(input.original_value).focus(function(e){
				e.stopPropagation();
				var $this=$(this);
				$ddiv.hide();
				if($ddiv.html()===''){
					$('option',input).each(function(){
						var d=document.createElement('div');
						d.option=this;
						$(d).html(this.text).appendTo($ddiv);
						if($(this).attr('selected')==='selected')$(d).addClass('selected');
						$(d).mousedown(function(){
							$(this).toggleClass('selected');
							var $op=$(this.option);
							if($(this).hasClass('selected'))$op.attr('selected','selected');
							else $op.removeAttr('selected');
							var v=[];
							$('.selected',$ddiv).each(function(){
								v.push(this.innerHTML)
							});
							$this.val(JSON.stringify(v));
							setTimeout(function(){$this.focus();},1);
						});
					});
				}
				var p=$this.position();
				var l=p.left;
				var tp=p.top+this.offsetHeight;
				var th=this.offsetHeight;
				var w=this.offsetWidth;
				var $p=$this.parentsUntil('html');
				for(var i in $p){
					var I=$p[i];
					if(I.scrollHeight!=I.offsetHeight){
						$p=$(I);
						break;
					}
				}
				var ph=$($p[$p.length-1]).height();
				var h=ph-tp-100;
				if(h<50){
					h=tp-50;
					tp=p.top-h;
				}
				$ddiv.css({position:'absolute',left:l,top:tp,width:w,height:h,overflow:'auto'}).show();
			}).blur(function(e){
				$ddiv.hide();
			});
		}
	}
	g.init();
}
$(PAGE);