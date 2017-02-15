$(bindEvent);

function bindEvent(){
	if(localStorage.lastuser&&localStorage.lastuser!=='')$('#username').val(localStorage.lastuser);
	$('#login').click(toLogin);
	$('#lang').change(function(){
		var v=this.value;
		setLang(v);
	});
	$('input').keypress(function(e){
		if(e.which===13){
			var $u=$('#username');
			var $p=$('#password');
			var u=$u.val();
			var p=$p.val();
			if(p==='')$p.focus();
			if(u==='')$u.focus();
			toLogin();  
		}
	});
	var htmlstyle = "<style>body{padding:0;margin:0;}.msg{color:#FFF;width:100%;height:3rem;text-align:center;font-size:1.2rem;line-height:3rem;position:fixed;top:-3rem;z-index:20;}"
    +".msg_success{background-color:#1fcc6c;}"
    +".msg_warning{background-color:#FFA54F;}"
    +".msg_primary{background-color:#337ab7;}"
    +".msg_info{background-color:#5bc0de;}</style>";
	$('head').append(htmlstyle);
    $('body').prepend('<div class="msg msg_success"></div>'
        +'<div class="msg msg_warning"></div>'
        +'<div class="msg msg_primary"></div>'
        +'<div class="msg msg_info"></div>');
}

function toLogin(){
	if(!toValidate())return;
	var u=$('#username').val();
	var p=$('#password').val();
	API.login({
		data:{
			username:u
			,password:p
		}
	});

}

function toValidate(){
	var $up=$('#username,#password');
	window.setTimeout(function(){
		$up.removeClass('animation').removeClass('shake');
	},2000);
	var $u=$('#username');
	var $p=$('#password');
	var u=$u.val();
	var p=$p.val();
	if(u==='')$u.addClass('shake');
	if(p==='')$p.addClass('shake');
	if(u===''||p==='')return false;
	return true;
}
