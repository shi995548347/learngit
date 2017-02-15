(function($){
	$.extend({
		l10n:{
			opts:{
				dir:"./languages"
				,lang:"auto"
			}
			,messages:{}
			,__:function(words){
				if(this.opts.lang&&this.messages[this.opts.lang]&&this.messages[this.opts.lang][words]){
					words=this.messages[this.opts.lang][words]
				}
				return words;
			}
			,load:function(L){
				var l=L;
				if(!l)l=this.opts.lang;
				if($.l10n.messages[l])return $.l10n.messages[l];
				var uri=this.opts.dir+"/"+l+".json";
				$.ajax({
					url:uri
					,dataType:'json'
					,cache:true
					,async:false
					,success:$.l10n.callback
					,error:function(){
						if(!L&&$.l10n.opts.lang!='en'){
							$.l10n.load('en');
						}
					}
				});
			}
			,callback:function(json){
				if(!$.l10n.messages[$.l10n.opts.lang])$.l10n.messages[$.l10n.opts.lang]=json;
			}
			,init:function(opts){
				$.extend(this.opts,opts);
				if(this.opts.lang=="auto"){
					this.opts.lang=window.navigator.systemLanguage||window.navigator.language;;
				}
				this.opts.lang=this.opts.lang.toLowerCase();
				if(this.opts.lang!=""){this.load();}
			}
		}
	});

	$.fn.extend({
		l10n:function(opts){
			$.l10n.init(opts);
			this.each(function(){
				var l10n,words,tag;
				l10n=this.getAttribute("l10n");
				if(l10n==='')l10n=this.innerHTML;
				tag=this.tagName.toLowerCase();
				words=$.l10n.__(l10n);
				switch(tag){
					case "input":
						if(this.getAttribute("placeholder")!==null)$(this).attr("placeholder",words);
						if(this.getAttribute("type")==="submit")$(this).val(words);
					break;
					case "img":
						this.alt=words;
					break;
					default:
						this.innerHTML=words;
						if(this.getAttribute("title"))$(this).attr("title",words);
					break;
				}
			});
		}
	})
})(jQuery);
