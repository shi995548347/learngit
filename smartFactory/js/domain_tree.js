(function($){
	$.extend({
		domaintree:function(o,t){
			var g={
				$t:$(t)
				,$container:$(t)
				,API:API.domain
				,param:SCHEMA.domain.param
				,init:function(){
					o=$.extend({
						selectable:false
					},o);
					if(t.tagName.toLowerCase()==='input'){
						g.create();
						o.selectable=true;
					}
					g.loadRoots();
					g.initForm();
					g.bindEvent();
				}
				,create:function(){
					var div=document.createElement('div');
					g.$t.addClass('dropdown').after(div);
					g.$container=$(div);
					g.$container.hide();
					g.$t.click(g.showContainer);
					$('body').click(g.hideContainer);
				}
				,bindEvent:function(){
					g.$container.on('click','a',g.showNode);
					g.$container.on('click','label',g.selectNode);
					g.$container.on('change','input',g.checkNode);
					g.$container.on('click','.add',g.addNode);
					g.$container.on('click','.edit',g.editNode);
					g.$container.on('click','.del',g.delNode); 
					g.$table.on('dblclick','input[uitype="geojson"]',g.initMap);
				}
				,showContainer:function(e){
					e.stopPropagation();
					g.$container.hide();
					var p=g.$t.position();
					var l=p.left;
					var tp=p.top+t.offsetHeight;
					var th=t.offsetHeight;
					var w=t.offsetWidth;
					var $p=$(t).parentsUntil('html');
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
					g.$container.css({position:'absolute',left:l,top:tp,width:w,height:h,overflow:'auto'}).show();
				}
				,hideContainer:function(){
					g.$container.hide();
				}
				,loadRoots:function(){
					g.$container.empty();
					var ids=USERINFO.nodes;
					for(var i in ids){
						g.loadNodes(ids[i]);
					}
				}
				,loadNodes:function(id){
					g.API.get({
						data: {
							id:id
							,recursive: true
						}
						,success:g.parseNodes
					});
				}
				,parseNodes:function(json,u){
					if(!u){
						var ul=document.createElement('ul');
						ul.className='domaintree';
						g.$container.append(ul);
					}else{
						var ul=u;
					}
					var li=document.createElement('li');
					var a=document.createElement('a');
					a.innerHTML=(o.selectable?'<input type="checkbox"/>':'')+'<label>'+json.name+'</label>'+(o.selectable?'':'<span class="add"></span></span><span class="del"></span>');//<span class="edit"></span><span class="info"></span>
					a.id=json.id;
					a.data=json;
					$(li).append(a).appendTo(ul);
					var children=json.children_node;
					if(children&&children.length>0){
						var sul=document.createElement('ul');
						$(li).append(sul);
						for(var i in children){
							var child=children[i]
							g.parseNodes(child,sul);
						}
					}
					if(!u){
						$('a:first',ul).addClass('open');
					}
				}
				,showNode:function(e){
					e.stopPropagation();
					var a=e.target;
					$(a).toggleClass('open');
				}
				,setNode:function(e){
					e.stopPropagation();
					var s=e.target;
					var a=s.parentNode;
					g.curNode=a;
				}
				,checkNode:function(e){
					e.stopPropagation();
					var i=e.target;
					var a=i.parentNode;
					var li=a.parentNode;
					var $ul=$(a).next();
					var $p=$(li).parentsUntil('.domaintree','li');
					$('>a input',$p).prop('checked',false);
					$('input',$ul).prop('checked',false);
					g.setInput();
				}
				,setInput:function(){
					var $c=$('input:checked',g.$container);
					var c=[];
					var s=[];
					$c.each(function(){
						var id=this.parentNode.id;
						var name=this.nextSibling.innerHTML;
						c.push(id);
						s.push(name);
					});
					c=JSON.stringify(c);
					s=JSON.stringify(s);
					t.true_value=c;
					g.$t.val(s).change();
				}
				,selectNode:function(e){
					e.stopPropagation();
					var l=e.target;
					var a=l.parentNode;
					$('.selected',t).removeClass('selected');
					$(a).addClass('selected');
					g.editNode(e);
				}
				,addNode:function(e){
					g.setNode(e);
					g.showAddForm();
				}
				,editNode:function(e){
					g.setNode(e);
					g.showEditForm();
				}
				,delNode:function(e){
					g.setNode(e);
					if(confirm($.l10n.__('delete items'))){
						g.del();
					}
				}
				,initForm:function(){
					var table=document.createElement('table');
					table.className='Utable';
					for(var i in g.param){
						var I=g.param[i];
						if(I.group){
							for(var j in I.items){
								var J=I.items[j];
								var tr=g.addRow(J);
								$(tr).attr('group',I.group).appendTo(table);
							}
						}else{
							var tr=g.addRow(I);
							$(tr).appendTo(table);
						}
					}
					var tr=document.createElement('tr');
					var td1=document.createElement('td');
					var td2=document.createElement('td');
					var add=document.createElement('button');
					add.innerHTML=$.l10n.__('add');
					var edit=document.createElement('button');
					edit.innerHTML=$.l10n.__('update');
					var cancel=document.createElement('button');
					cancel.innerHTML=$.l10n.__('cancel');
					$(td2).attr('colspan','2').append([add,edit,cancel]).appendTo(tr).before(td1);
					g.table=table;
					g.$table=$(table);
					g.$table.append(tr).appendTo(o.form).hide();
					g.$add=$(add);
					g.$edit=$(edit);
					g.$add.click(g.add);
					g.$edit.click(g.edit);
					$(cancel).click(function(){
						g.$table.hide();
					});
				}
				,addRow:function(J){
					var input=document.createElement('input');
					input.name=J.field;
					if(J.type==='parent'||J.key){
						input.type='hidden';
						input.className=J.key?'key':'parent';
						return input;
					}
					input.type=J.type;
					if(J.placeholder)input.placeholder=$.l10n.__(J.placeholder);
					if(J.uitype)input.setAttribute('uitype',J.uitype);
					var tr=document.createElement('tr');
					var td1=document.createElement('td');
					var td2=document.createElement('td');
					td1.innerHTML=$.l10n.__(J.caption||J.field);
					$(input).appendTo(td2);
					$(tr).append([td1,td2]);
					if(J.desc)$(td1).addClass('desc').mouseover(function(){$(td1).w2overlay({align:'right',html:$.l10n.__(J.desc)})});
					return tr;
				}
				,showAddForm:function(){
					var id=g.curNode.id;
					$('input',g.$table).val('');
					$('input.parent',g.$table).val(id);
					$('[group]',g.$table).show();
					$('button',g.$table).show();
					g.$edit.hide();
					g.$table.hide().show('slow');
				}
				,showEditForm:function(){
					var json=g.curNode.data;
					$('input',g.$table).empty();
					$('input.key',g.$table).val(json.id);
					$('button',g.$table).show();
					$('[group]',g.$table).hide();
					var group=[];
					for(var i in json.types){
						var I=json.types[i];
						group.push(I);
						$('[group="'+I+'"]',g.$table).show();
					}
					g.$add.hide();
					g.$table.hide().show('slow');
					for(var i in g.param){
						var I=g.param[i];
						if(I.group&&$.inArray(I.group,group)>-1){
							for(var j in I.items){
								var J=I.items[j];
								var v=json[I.group][J.field];
								$('[name="'+J.field+'"]',g.$table).val(v).attr('original_value',v);
							}
						}else{
							var v=json[I.field];
							$('[name="'+I.field+'"]',g.$table).val(v).attr('original_value',v);
						}
					}
				}
				,add:function(){
					g.save('add');
				}
				,edit:function(){
					g.save('edit');
				}
				,del:function(){
					g.API.del({
						data:{id:g.curNode.id}
						,success:function(json){
							g.$table.hide();
							$(g.curNode.parentNode).remove();
						}
					});
				}
				,save:function(api){
					var types=g.curNode.data.types;
					var data={types:[]};
					for(var i in g.param){
						var I=g.param[i];
						if(I.group){
							if(api==='edit'&&$.inArray(I.group,types)===-1)continue;
							data[I.group]={};
							for(var j in I.items){
								var J=I.items[j];
								if((J.addable&&api==='add')||((J.editable||J.key)&&api==='edit')){
									var $input=$('[name="'+J.field+'"]',g.$table);
									var v=$input.val();
									var ov=$input.attr('original_value');
									if((api==='add'&&v!=='')||(api==='edit'&&v!==ov)){
										data[I.group][J.field]=g.parseValue(v,J.type);
									}
								}
							}
							if($.isEmptyObject(data[I.group])){
								//delete(data[I.group]);
								data[I.group]={};
							}else{
								if(api==='add')data.types.push(I.group);
							}
						}else{
							if((I.addable&&api==='add')||((I.editable||I.key)&&api==='edit')){
								var v=$('[name="'+I.field+'"]',g.$table).val();
								data[I.field]=g.parseValue(v,I.type);
							}
						}
					}
					if($.isEmptyObject(data.types)){
						delete(data.types);
					}
					if(api==='edit'){
						data.types=types;
					}
					data=JSON.stringify(data);
					g.API[api]({
						data:data
						,success:function(json){
							g.$table.hide();
							if(api==='edit')g.refreshNode(json);
							else g.insertNode(json);
						}
					});
				}
				,parseValue:function(v,tp){
					switch(tp){
						case 'number':
							return v-0;
						break;
						default:
							return v;
						break;
					}
				}
				,refreshNode:function(json){
					g.curNode.data=json;
					$('label',g.curNode).html(json.name);
				}
				,insertNode:function(json){
					var $c=$(g.curNode);
					var ul=$c.next()[0];
					if(!ul){
						var ul=document.createElement('ul');
						$c.after(ul);
					}
					g.parseNodes(json,ul);
					if(!$c.hasClass('open'))$c.addClass('open');
				}
				,initMap:function(e) {
					g.marker=null;
					var i=e.target;
					var l='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
					var p,c;
					try{
						c=JSON.parse(i.value);
						c=[c.lat,c.lng];
						p=c; 
					}catch(e){}
					w2popup.open({
						title: $.l10n.__('map')
						,body:'<div id="domaintreemap" style="width:100%;height:100%"></div>'
						,width:640
						,height:480
						,modal:true
						,showClose: true
						,showMax:true
					});
					var op={zoom:8};
					if(c)op.center=c;
					g.MAP=L.map('domaintreemap',op);
					L.tileLayer.grayscale(l,{}).addTo(g.MAP); 
					if(!c)g.MAP.locate({setView:true});
					if(p){
						g.marker=L.marker(p).addTo(g.MAP); 
					}
					g.MAP.on('click', function(e){
						var p=e.latlng;
						if(g.marker){
							g.marker.setLatLng(p);
						}else{
							g.marker=L.marker(p).addTo(g.MAP); 
						}
						i.value=JSON.stringify(p);
					});
				}
			}
			g.init();
		}
	});

	$.fn.extend({
		domaintree:function(o){
			this.each(function(){
				return $.domaintree(o,this);
			});
		}
	})
})(jQuery);
