$(function() {
	layout();
	initTree();
});

function layout(){
	$('body').w2layout({
		name: 'layout',
		panels: [
			{type:'left',size:300,resizable:true, content: $('#side') }
			,{type:'main',content:$('#main')}
		]
	});
}

function initTree(){
	$('#side').domaintree({form:'#main'});
}