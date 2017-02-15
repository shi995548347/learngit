(function(){
	$.extend({
		tags:function(options,target){
			var G={
				init:function(){
					G.addDom();
					G.addMenu();
					G.bindEvent();
					G.loadSaved();
				}
				,addDom:function(){
					var menu=document.createElement('div');
					var tag=document.createElement('div');
					var main=document.createElement('div');
					var more=document.createElement('span');
					var moremenu=document.createElement('label');
					G.menu=menu;
					G.tag=tag;
					G.main=main;
					G.more=more;
					G.moremenu=moremenu;
					menu.className='menubar';
					tag.className='tagbar';
					main.className='main';
					$(more).append(moremenu).appendTo(tag);
					$(target).append([menu,tag,main]);
					var ul=document.createElement('ul');
					G.menuul=ul;
					ul.className='menu';
					$(menu).append(ul);
				}
				,addMenu:function(p,m){
					if(!p)p=G.menuul;
					if(!m)m=options;
					for(var i in m){
						var I=m[i];
						if(I.deny){
							if($.inArray(USERINFO.node_type,I.deny)>=0)continue;
						}
						if(I.allow){
							if($.inArray(USERINFO.node_type,I.allow)<0)continue;
						}
						var li=document.createElement('li');
						var a=document.createElement('a');
						I.name=i;
						if(i =='system_user'){
							I.title=I.title?I.title:localStorage.lastuser;
						}
						I.title=I.title?I.title:$.l10n.__(i);
						I.__menu=a;
						a.innerHTML=I.title;
						a.obj=I;
						$(li).append(a).appendTo(p);
						if(I.hide===true){
							$(li).hide();
							$(a).click();
						}
						if(I.items){
							var sul=document.createElement('ul');
							$(li).append(sul);
							G.addMenu(sul,I.items);
						}
					}
				}
				,bindEvent:function(){
					$(target).on('click','.menu a',G.newTag);
					$(G.tag).on('click','a',G.activeTag);
					$(G.tag).on('click','a > div',G.closeTag);
					$(G.more).on('click','a',G.activeMore);
					$(window).resize(G.showMore);
				}
				,loadSaved:function(){
					if(!localStorage.users)return;
					var users=JSON.parse(localStorage.users);
					var u=users[localStorage.lastuser];
					if(!u)u ={menu:[]};
					var m=u.menu;
					if(m.length==0){
						m=[{"url":"map.html","title":"地图","active":true}];
					}
					for(var i in m){
						var I=m[i];
						G.newTag(I);
					}
					G.showMore();
					G.save();
				}
				,newTag:function(e){
					var a=e.currentTarget||e;
					var o=a.obj||a;
					if(o.func){o.func();return;}
					if(o.items){return;}
					var u=o.url;
					if(!/\.html/.test(u)){
						if(u){
							if(u==='page'||u==='form')u=u+'.html?api='+o.name+(o.param?'&'+o.param:'');
							else u=u+'.html'+(o.param?'?'+o.param:'');
						}else{
							u=o.name+'.html'+(o.param?'?'+o.param:'');
						}
					}
					o.url=u;
					if(!o.__tag){
						var $a=$('a[url="'+o.url+'"]',G.tag);
						if($a[0]){
							o =$a[0].obj;
							o.__tag=$a[0];
						}
					}
					if(o.__tag){
						$(o.__tag).click();
						return;
					}
					var A=document.createElement('a');
					A.obj=o;
					A.url=o.url;
					A.title=o.title;
					A.innerHTML=o.title+'<div></div>'; 
					A.setAttribute('url',o.url);
					$(A).appendTo(G.tag);
					o.__tag=A;
					G.newMore(A);
					if(a.active||e.currentTarget)$(A).click();
				}
				,activeTag:function(e){
					var a=e.tagName?e:e.currentTarget;
					$(a).addClass('selected').siblings().removeClass('selected');
					G.newWindow(a);
					G.showMore(a);
					G.save();
				}
				,closeTag:function(e){
					e.stopPropagation();
					var div=e.currentTarget;
					var a=div.parentNode;
					var s=$(a).hasClass('selected');
					var $n=$(a).next();
					if(!$n[0])$n=$(a).prev();
					var o=a.obj;
					var __win=o.__win;
					
					$(__win).remove();
					delete(o.__win);
					$(a).remove();
					delete(o.__tag);
					o.__more.remove();
					if(s&&$n[0]&&$n[0].tagName.toLowerCase()==='a'){
						$n.click();
					}else{
						G.save();
					}
				}
				,newWindow:function(a){
					var n=a.name;
					var o=a.obj||{};
					if(o.__win){
						G.activeWin(a);
						return;
					}
					var f=document.createElement('iframe');
					o.__win=f;
					f.obj=o;
					f.src=o.url;
					$(G.main).append(f);
					G.activeWin(a);
				}
				,activeWin:function(a){
					$('iframe',G.main).hide();
					$(a.obj.__win).show();
				}
				,newMore:function(a){
					var n=a.name;
					var o=a.obj;
					var A=document.createElement('a');
					A.innerHTML=a.title||a.innerHTML; 
					A.name=n;
					A.obj=o;
					$(A).appendTo(G.moremenu);
					o.__more=A;
				}
				,showMore:function(a){
					if(!a||!a.tagName)a=$('.selected',G.tag)[0];
					if(!a)return;
					var w=G.tag.offsetWidth;
					var s=G.tag.scrollWidth;
					var l=G.tag.scrollLeft;
					var L=a.offsetLeft;
					$(G.more).hide();
					if(s>w){
						var L=a.offsetLeft;
						G.tag.scrollLeft=L;
						$(G.more).show();
						if(L+a.offsetWidth>w||L<l)G.tag.scrollLeft=L;
					}
				}
				,hideMore:function(){
					var w=G.tag.offsetWidth;
					var s=G.tag.scrollWidth;
					if(s<=w){
						$(G.more).hide();
					}
				}
				,activeMore:function(e){
					var a=e.currentTarget;
					console.log(a.obj)
					G.activeTag(a.obj.__tag);
				}
				,save:function(){
					var $as=$('>a',G.tag);
					var s=[];
					$as.each(function(){
						var $this=$(this);
						var t={
							url:this.url
							,title:this.title
						}
						if($this.hasClass('selected'))t.active=true;
						s.push(t);
					});
					if(localStorage.users){
						var users=JSON.parse(localStorage.users);
					}else{
						var users={};
					}
					if(!users[localStorage.lastuser])users[localStorage.lastuser]={menu:[]};
					users[localStorage.lastuser].menu=s;
					localStorage.users=JSON.stringify(users);
				}
			};
			G.init();
			target.menu=G;
		}
	})
	
	$.fn.extend({
		tags:function(opts){
			this.each(function(){
				$.tags(opts,this);
			});
		}
	});
})();