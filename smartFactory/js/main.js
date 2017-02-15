$(layout)

function layout(){
	var menus={
		'Ω SmartFactory':{
			items:{'map':{}}
			// items:{'system_user':{url:'form'},'quit':{func:API.quit}},
		}
		,'device_alarm':{
			// deny:['local']
			items:{'device_alarm':{url:'page'},'device_alarm_history':{url:'page'}
			// ,'device_alarm_rule':{url:'page'}
		}
		}
		// ,'domain':{
		// 	items:{'domain':{deny:['vendor','local']}
		// 	// 'device_type_chart':{}
		// }
		// }
		,'system':{
			allow:['admin']
			,items:{'domain':{deny:['vendor','local']},'device':{url:'page'},'system_users':{url:'page'},
			// ,'system_log':{url:'page'},'system_alarm':{url:'page'}
		}
		}
		,'current user':{
			items:{'system_user':{url:'form'},'quit':{func:API.quit}
		}
		}
	};
	$('body').tags(menus);
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

function addTag(o){
	var o=$.extend({active:true},o);
	document.body.menu.newTag(o);
}