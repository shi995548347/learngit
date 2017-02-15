var FACTORY_ID=window.parent.FACTORY_ID;
var DEVICES={};
var PLOTS=[];
var COLORS=['#ff0000','#00ff00','#ff9900','#0099ff','#6600ff','#0000ff','#ff0099'];
var TIMEOUT=30000;

$(function(){
	bindEvent();
	loadDevices(0);
})

function bindEvent(){
	$('body').on('click','#list a',showPlot);
}

function loadDevices(n){
	API.factory.devices({
		data:{dir_id:FACTORY_ID}
		,success:function(json){
			if(n===0)parseDevices(json);
			else _parseDevices(json);
		}
	});
}

function parseDevices(json){
	_parseDevices(json);
	loadDomain();
}

function _parseDevices(json){
	for(var j in json){
		var I=json[j];
		if(!I.device.rt)I.device.rt=['default'];
		var p=I.device.position.split(',');
		I.name=I.device.name;
		I.type=I.device.rt[0];
		I.x=p[0];
		I.y=p[1];
		I.r=p[2];
		var o={data:{mt_data:{mt_status:0,mt_operation_time:0,part_current_cunt:0,spindle_speed_actual_:0}},kpi:{availability:0}}
		if(!I.data)I.data=o.data;
		if(!I.kpi)I.kpi=o.kpi;
		I.DATA={
			id:I.id
			,'name':I.device.name
			,'rt':I.device.rt?I.device.rt[0]:'default'
			,'mt_status':I.data.mt_data.mt_status
			//,'energy'
			,'operation_time':I.data.mt_data.mt_operation_time
			,'part_current_cunt':I.data.mt_data.part_current_cunt
			,'spindle_speed_actual_':I.data.mt_data.spindle_speed_actual_
			,'availability':I.kpi.availability
		};
		DEVICES[I.id]=I;
	}
	window.setTimeout(loadDevices,TIMEOUT);
}

function loadDomain(){
	API.domain.get({
		data:{id:FACTORY_ID,recursive:true}
		,success:parseDomain
	});
}

function parseDomain(json){
	_parseDomain(json);
	createPlots();
}

function _parseDomain(json){
	if(!$.isArray(json))json=[json];
	for(var i in json){
		var I=json[i];
		if(I.factory&&I.factory.graphic&&$.trim(I.factory.graphic)!==''){
			PLOTS.push(I);
		}
		if(I.children_node&&I.children_node.length>0)_parseDomain(I.children_node);
	}
}

function createPlots(){
	var div=document.createElement('div'); 
	div.id='list';
	$('body').append(div);
	for(var i in PLOTS){
		var I=PLOTS[i];
		// console.log(JSON.stringify(I));
		var a=document.createElement('a'); 
		a.innerHTML=I.name;
		a.id=I.id;
		a.plot=PLOT(I);
		$(a).appendTo(div);
	}
	$('#list a:first').click();
}

function showPlot(e){
	var t=e.currentTarget;
	var id=t.id;
	$(t).addClass('selected').siblings().removeClass('selected');
	$('.plot').hide();
	t.plot.$container.show();
}

function PLOT(o){
	var $b=$('body');
	var G={
		INTERSECTED:null
		,OBJECS:[]
		,DEVICES:{}
		,STATUS:{
			running:0x00aa00
			,vital:0xff0000
			,alarm:0xee8800
			,idle:0x0066cc
		}
		,init:function(){
			G.addDOM();
			G.addScene();
			G.addCamera();
			G.addGrid();
			G.addGround();
			G.addLine();
			G.addMouse();
			G.addLight();
			// G.addBox();
			G.render();
			G.animate();
			G.setDeviceStatus();
			G.$container.hide();
		}
		,addDOM:function(){
			G.container=document.createElement('div');
			G.container.id='plot'+o.id;
			G.$container=$(G.container);
			G.$container.addClass('plot').css({width:'100%',height:'100%',position:'fixed'});
			G.info=document.createElement('div');
			G.info.id='info';
			$(G.info).hide();
			$('body').append(G.container).append(G.info);
		}
		,addScene:function(){
			var lw=o.factory.graphic.split(',');
			G.o={l:lw[0],w:lw[1]};
			G.scene=new THREE.Scene();
		}
		,addLight:function(){
			var obj=new THREE.DirectionalLight(0xaaaaaa, 1);
			obj.position.set(0,Math.max(G.o.l,G.o.w)*1,0);
			obj.target=G.ground;
			obj.castShadow=true;
			G.scene.add(obj);
			var obj=new THREE.DirectionalLight(0xffffff, .75);
			obj.position.set(G.o.l, 0, G.o.w);
			obj.castShadow=false;
			G.scene.add(obj);
			var obj=new THREE.DirectionalLight(0xffffff, .75);
			obj.position.set(-G.o.l, 0, -G.o.w);
			obj.castShadow=false;
			G.scene.add(obj);
		}
		,addCamera:function(){
			var w=$b.width();
			var h=$b.height();
			var f=Math.max(G.o.l||G.o.w)*10;
			var obj=new THREE.PerspectiveCamera(50, w/h, 1, f ); //fov,aspect,near,far,可视角度，可视范围的长宽比，近距，远距
			obj.position.set(0, Math.max(G.o.l,G.o.w),0);
			obj.lookAt(0,0,0);
			G.camera=obj;
			G.scene.add(obj);
		}
		,addGrid:function(){
			var w=Math.max(G.o.l,G.o.w)*10
			var obj = new THREE.GridHelper(w, w);
			obj.castShadow=false;
			obj.receiveShadow=false;
			obj.position.set(0,-0.1,0);
			G.scene.add(obj);
		}
		,addGround:function(){
			var g=new THREE.PlaneBufferGeometry(G.o.l, G.o.w);
			var m=new THREE.MeshPhongMaterial({color:0x495465});
			var obj=new THREE.Mesh(g, m);
			obj.rotation.x=-Math.PI/2;
			obj.position.set(0,0,0);
			obj.castShadow=false;
			obj.receiveShadow=true;
			G.ground=obj;
			G.scene.add(obj);
		}
		,addBox:function(){
			var m=new THREE.MeshPhongMaterial({color:0xff0000,specular:0x000000});
			var g=new THREE.BoxGeometry(1,1,1);
			var obj=new THREE.Mesh(g,m);
			var x=10,z=10;
			var x=x-G.o.l/2,z=z-G.o.w/2,y=0;
			obj.position.set(x,y,z);
			G.scene.add(obj);
		}
		,addLine:function(children){
			if(!children)children=[o]
			var idx=0;
			for(var i in children){
				var I=children[i];
				var points=G.addDevice(I.devices);
				var g=new THREE.Geometry();
				var m=new THREE.LineDashedMaterial({color:COLORS[idx],dashSize:.025,gapSize:.05});
				for(var n in points){
					var p = new THREE.Vector3();
					var N=points[n];
					p.set(N.x,N.y,N.z);
					g.vertices.push(p);
				}
				g.computeLineDistances();
				var l=new THREE.Line(g,m);
				l.type = THREE.Lines;
				G.scene.add(l);
				if(I.children_node&&I.children_node.length>0){
					G.addLine(I.children_node);
				}
				idx++;
				if(idx>=COLORS.length)idx=0;
			}
		}
		,addDevice:function(devices){
			var points=[];
			for(var i in devices){
				var I=DEVICES[devices[i]];
				var x=I.x-G.o.l/2,z=I.y-G.o.w/2,y=1;
				points.push({x:x,y:y,z:z});
				G.loadModel(I,i);
			}
			return points;
		}
		,loadModel:function(I,i){
			var id=I.id,t=I.type,x=I.x-G.o.l/2,z=I.y-G.o.w/2,y=0,r=I.r||0,n=I.name;
			var mtlLoader = new THREE.MTLLoader();
			mtlLoader.load( 'models/'+t+'.mtl', function( materials ) {
				materials.preload();
				var loader = new THREE.OBJLoader();
				loader.setMaterials(materials);
				loader.load('models/'+t+'.obj',function (obj){
					obj.position.set(x,y,z);
					obj.rotation.y=r/180*Math.PI;
					obj.name=n;
					obj.DATA=I.DATA;
					var b=new THREE.Box3().setFromObject(obj);
					obj.size={x:b.max.x-b.min.x,y:b.max.y-b.min.y,z:b.max.z-b.min.z}
					obj.traverse(function(child){G.OBJECS.push(child);child.castShadow=true;child.receiveShadow=true;}); 
					G.DEVICES[i]=obj;
					G.scene.add(obj);
					G.addTitle(obj);
				});
			});
		}
		,setDeviceStatus:function(){
			window.setTimeout(G._setDeviceStatus,1000);
		}
		,_setDeviceStatus:function(){
			/*G.setTitle(G.DEVICES['11111'],G.STATUS.vital);
			G.DEVICES['11111'].hex=G.STATUS.vital;
			G.setHex(G.DEVICES['11111'],G.STATUS.vital);
			
			G.setTitle(G.DEVICES['22222'],G.STATUS.alarm);
			G.DEVICES['22222'].hex=G.STATUS.alarm;
			G.setHex(G.DEVICES['22222'],G.STATUS.alarm);
			
			G.setTitle(G.DEVICES['33333'],G.STATUS.idle);
			G.DEVICES['33333'].hex=G.STATUS.idle;
			G.setHex(G.DEVICES['33333'],G.STATUS.idle);
			
			//window.setTimeout(G._setDeviceStatus,5000);*/
		}
		,addMouse:function(){
			G.mouse=new THREE.Vector3();
			G.raycaster=new THREE.Raycaster();
		}
		,render:function(){
			var r=new THREE.WebGLRenderer();
			var w=$b.width(),h=$b.height();
			r.setPixelRatio(window.devicePixelRatio);
			r.setSize(w,h);
			r.gammaInput = true;
			r.gammaOutput = true;
			r.shadowMap.enabled = false;
			r.shadowMap.renderReverseSided = false;
			r.domElement.addEventListener('mousemove', G.mouseMove );
			r.domElement.addEventListener('dblclick', G.click );
			G.renderer=r;
			var c=new THREE.OrbitControls(G.camera, r.domElement);
			c.enablePan=true;
			c.minDistance=1;
			c.maxDistance=Math.max(G.o.l,G.o.w)*2;
			c.maxPolarAngle=Math.PI*.45;
			c.target.set(0, 0, 0);
			G.container.appendChild(r.domElement);
			$(window).resize(G.resize);
		}
		,animate:function(){
			requestAnimationFrame(G.animate);
			G.selectObj();
			G.renderer.render(G.scene,G.camera);
		}
		,resize:function(){
			var w=$b.width(),h=$b.height();
			G.camera.aspect=w/h;
			G.camera.updateProjectionMatrix();
			G.renderer.setSize(w,h);
		}
		,mouseMove:function(e){
			e.preventDefault();
			var w=$b.width(),h=$b.height();
			G.mouse.x=(e.clientX/w)*2-1;
			G.mouse.y=-(e.clientY/h)*2+1;
			$(G.info).css({left:e.clientX+16,top:e.clientY+16});
		}
		,click:function(e){
			e.preventDefault();
			var obj=G.INTERSECTED;
			if(obj){
				obj=obj.parent.DATA;
				window.top.addTag({title:obj.name,url:'device_detail.html?id='+obj.id});
			}
		}
		,selectObj:function(){
			G.raycaster.setFromCamera(G.mouse,G.camera);
			var objs=G.raycaster.intersectObjects(G.OBJECS);
			var obj=objs[0];
			if (obj) {
					if (G.INTERSECTED&&G.INTERSECTED!=obj.object)G._setHex(G.INTERSECTED,G.INTERSECTED.parent.hex||0);
					G.INTERSECTED=obj.object;
					G._setHex(G.INTERSECTED,G.INTERSECTED.parent.hex?(G.INTERSECTED.parent.hex+0x3333):0x333333);
					G.showInfo(G.INTERSECTED.parent);
			}else{
				if(G.INTERSECTED)G._setHex(G.INTERSECTED,G.INTERSECTED.parent.hex||0);
				G.INTERSECTED = null;
				G.hideInfo();
			}
		}
		,showInfo:function(obj){
			var data=obj.DATA;
			var html=[];
			for(var i in data){
				var I=data[i];
				html.push('<div class="'+i+'"><span>'+$.l10n.__(i)+'</span>: <label>'+I+'</label></div>');
			}
			html=html.join('');
			$(G.info).html(html).show();
		}
		,hideInfo:function(){
			$(G.info).hide();
		}
		,setTitle:function(obj,c){
			var t=obj.name;
			var s=obj.tag;
			G.addTitle(t,s,c);
		}
		,addTitle:function(obj,p){
			var t=obj.name;
			var s=obj.tag;
			if(typeof(p)==='string'){
				p=G.hexToString(p);
				p={borderColor:p,backgroundColor:p};
			}
			p=$.extend({
				fontface:'"Microsoft YaHei","Microsoft JhengHei","Meiryo","Malgun Gothic","Arial"'
				,fontsize:50
				,borderThickness:20
				,borderColor:G.hexToString(G.STATUS.running)
				,backgroundColor:G.hexToString(G.STATUS.running)
				,color:'rgba(255, 255, 255, 1)'
			},p);
			var canvas=document.createElement('canvas');
			var context=canvas.getContext('2d');
			context.font=p.fontsize + 'px ' + p.fontface;
			var textWidth=context.measureText(t).width;
			var x=0
				,y=p.borderThickness
				,w=textWidth + p.borderThickness*2
				,h=p.fontsize + p.borderThickness*2
				,r=5;
				x=x+w/2;
			context.canvas.width=w*2;
			context.canvas.height=h*2;
			context.fillStyle=p.backgroundColor;
			context.strokeStyle=p.borderColor;
			context.lineWidth=p.borderThickness;
			G.creatTag(context,x, y, w, h, r);
			context.font=p.fontsize + 'px ' + p.fontface;
			context.fillStyle=p.color;
			context.fillText(t, x+p.borderThickness, h-y/2);
			var texture = new THREE.Texture(canvas) 
			texture.needsUpdate=true;
			var spriteMaterial=new THREE.SpriteMaterial({map:texture});
			if(s){
				s.material=spriteMaterial;
			}else{
				var s=new THREE.Sprite(spriteMaterial);
				s.scale.set(w/h*1.5,1.5);
				s.position.set(obj.position.x, obj.position.y+obj.size.y+.5, obj.position.z);
				G.scene.add(s);
				obj.tag=s;
			}
		}
		,creatTag:function(ctx, x, y, w, h, r){
			ctx.beginPath();
			ctx.moveTo(x+r, y);
			ctx.lineTo(x+w-r, y);
			ctx.quadraticCurveTo(x+w, y, x+w, y+r);
			ctx.lineTo(x+w, y+h-r);
			ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
			ctx.lineTo(x+1/2*w+15, y+h);
			ctx.lineTo(x+1/2*w, y+h+1/4*h);
			ctx.lineTo(x+1/2*w-15, y+h);
			ctx.lineTo(x+r, y+h);
			ctx.quadraticCurveTo(x, y+h, x, y+h-r);
			ctx.lineTo(x, y+r);
			ctx.quadraticCurveTo(x, y, x+r, y);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();   
		}
		,_setHex:function(obj,c){
			var p=obj.parent;
			G.setHex(p,c);
		}
		,setHex:function(obj,c){
			obj.traverse(function(child){if(child.material&&child.material.emissive)child.material.emissive.setHex(c);}); 
		}
		,hexToString:function(h){
			var h=h.toString(16);
			for(var i=0,l=6-h.length;i<l;i++){
				h='0'+h;
			}
			return '#'+h;
		}
	};
	G.init();
	return G;
}