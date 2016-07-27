/*globals svgEditor, svgCanvas*/
/*jslint eqeq: true*/
/*
 * ext-legend.js
 *
 */
 
/* 
	@创建者：万炎炎
	@主要功能：添加比例尺按钮及相关函数
*/

svgEditor.addExtension('ext-legend', function() {
	'use strict';
	var canv = svgEditor.canvas;
	var svgroot = canv.getRootElem();
	var lastBBox = {};
	var options = window.OPTIONS;
	var styleObj = {};
	/**
 	* 点击图例按钮的响应函数，向服务器请求地图样式，根据样式筛选图例单元
 	*
 	* @参数 无
 	* @返回值 无
 	*/
	function legendClick(){
		//alert("调用函数弹出")
		if(!options){return;}
		var url = options.API.styles+"/"+options.username+"/"+options.style_id+"?access_token="+options.access_token;
		$.get(url,function(result){//请求地图样式
			styleObj = result;
			var layers = styleObj.layers;//地图样式图层
			var legendArr = getLegendArray(layers);	
			console.log("legend--60--legendArr:");
			console.log(legendArr);
			drawLegend(legendArr);
		},"json");
	}


	function drawLegend(legendArr){
		console.log(canv);
		console.log(svgEditor);
		var fill_d = "m74.49659,136.10344c0,0.62855 -0.46923,1.13819 -1.04807,1.13819l-38.51549,0c-0.5788,0 -1.04803,-0.50959 -1.04803,-1.13819l0,-14.39536c0,-0.62855 0.46923,-1.13819 1.04803,-1.13819l38.51549,0c0.5788,0 1.04807,0.50959 1.04807,1.13819l0,14.39536z";
		var flag = 0;//用于识别图例在那一列，一共两列
		var username = options.username;
		var tem = styleObj.sprite.split("/");
		var prefix = styleObj.sprite.replace(new RegExp(tem[tem.length-1]+"$"),"");
		var rectHeight = (Math.ceil(legendArr.length/2)+1)*30;
		canv.createLayer("图例");
		var current_layer = canv.getCurrentDrawing().getCurrentLayer();
		var rect = canv.addSvgElementFromJson({//创建图例矩形框
			'element': 'rect',
			'curStyles': true,
			'attr': {
				stroke:"#000000",
				fill:"#ffffff",
				'stroke-linejoin':"round",
				'stroke-width':"2",
				x:25,
				y:85,
				width:380,
				height:rectHeight,
				opacity: 1
			}
		});
		var text = canv.addSvgElementFromJson({//创建“图例”文字
			'element': 'text',
			'curStyles': true,
			'attr': {
				x: 194,
				y: 106,
				id: canv.getNextId(),
				fill: '#000000',
				'stroke-width': 0,
				'font-size': 18,
				'text-anchor': 'middle',
				'font-family':"serif",
				'xml:space': 'preserve',
				opacity: 1
			}
		});
		text.textContent = "图     例";
		for(var i=0;i<legendArr.length;i++){
			if(legendArr[i].type === "symbol"){
				flag++;
				var iconUrl = prefix+legendArr[i].styles[0]['icon-image']+"?access_token="+options.access_token;
				var res = $.ajax({url:iconUrl,async:false});
				var svgStr = res.responseText;
				var newDoc = $.parseXML(svgStr);
				// set new svg document
				// If DOM3 adoptNode() available, use it. Otherwise fall back to DOM2 importNode()
				if (document.adoptNode) {
					var svgcontent = document.adoptNode(newDoc.documentElement);
				}
				else {
					var svgcontent = document.importNode(newDoc.documentElement, true);
				}
				var icon_height = $(svgcontent).attr("height");
				var icon_width = $(svgcontent).attr("width");
				var curr_width = legendArr[i].styles[0]['icon-size']*icon_width;
				var curr_height = legendArr[i].styles[0]['icon-size']*icon_height;
				svgcontent.setAttribute("width",curr_width);
				svgcontent.setAttribute("height",curr_height);
				
				current_layer.appendChild(svgcontent);
				canv.groupSvgElem(svgcontent);
				if(flag%2===0){
					svgcontent.setAttribute("x",234-curr_width/2);
					svgcontent.setAttribute("y",128-curr_height/2+parseInt((flag/2)-1)*30);
				}else{
					svgcontent.setAttribute("x",54-curr_width/2);
					svgcontent.setAttribute("y",128-curr_height/2+parseInt(flag/2)*30);
				}
				//canv.getElem("legend-group").appendChild(svgcontent);
				var cur_text = canv.addSvgElementFromJson({
					'element': 'text',
					'curStyles': true,
					'attr': {
						x: 80,
						y: 132,
						id: canv.getNextId(),
						fill: '#000000',
						'stroke-width': 0,
						'font-size': 12,
						'text-anchor': 'left',
						'xml:space': 'preserve',
						opacity: 1
					}
				});
				cur_text.textContent = legendArr[i].name;
				if(flag%2===0){
					cur_text.setAttribute('transform', 'translate(180,'+parseInt((flag/2)-1)*30+')');
				}else{
					cur_text.setAttribute('transform', 'translate(0,'+parseInt(flag/2)*30+')');
				}
				canv.recalculateDimensions(cur_text);				
				//canv.getElem("legend-group").appendChild(cur_text);
			}else if(legendArr[i].type === "line"){
				flag++;
				for(var j=0;j<legendArr[i].styles.length;j++){
					var cur_line = canv.addSvgElementFromJson({
						element: 'line',
						curStyles: true,
						attr: {
							x1: 34,
							y1: 128,
							x2: 75,
							y2: 128,
							id: canv.getNextId(),
							stroke: legendArr[i].styles[j]['line-color'],
							'stroke-width': legendArr[i].styles[j]['line-width'],
							'stroke-dasharray': legendArr[i].styles[j]['line-dasharray'],
							'stroke-linejoin': 'round',
							'stroke-linecap': null,
							'stroke-opacity': legendArr[i].styles[j]['line-opacity'],
							fill: 'none',
							opacity: legendArr[i].styles[j]['line-opacity'],
							style: 'pointer-events:none'
						}
					});
					if(flag%2===0){
						cur_line.setAttribute('transform', 'translate(180,'+(parseInt(((flag/2)-1))*30+legendArr[i].styles[j]['line-offset'])+')');
					}else{
						cur_line.setAttribute('transform', 'translate(0,'+(parseInt(flag/2)*30+legendArr[i].styles[j]['line-offset'])+')');
					}
					canv.recalculateDimensions(cur_line);
					//canv.getElem("legend-group").appendChild(cur_line);
				}
				var cur_text = canv.addSvgElementFromJson({
					'element': 'text',
					'curStyles': true,
					'attr': {
						x: 80,
						y: 132,
						id: canv.getNextId(),
						fill: '#000000',
						'stroke-width': 0,
						'font-size': 12,
						'text-anchor': 'left',
						'xml:space': 'preserve',
						opacity: 1
					}
				});
				cur_text.textContent = legendArr[i].name;
				if(flag%2===0){
					cur_text.setAttribute('transform', 'translate(180,'+parseInt((flag/2)-1)*(30)+')');
				}else{
					cur_text.setAttribute('transform', 'translate(0,'+parseInt(flag/2)*(30)+')');
				}
				canv.recalculateDimensions(cur_text);				
				//canv.getElem("legend-group").appendChild(cur_text);
			}else if(legendArr[i].type === "fill"){
				flag++;
				var cur_shape = canv.addSvgElementFromJson({
					'element': 'path',
					'curStyles': true,
					'attr': {
						'd': fill_d,
						'id': canv.getNextId(),
						'opacity': legendArr[i].styles[0]['fill-opacity'],
						'fill':legendArr[i].styles[0]['fill-color'],
						'stroke-width':1,
						'stroke':legendArr[i].styles[0]['fill-outline-color'],
						'style': 'pointer-events:none'
					}
				});
				var cur_text = canv.addSvgElementFromJson({
					'element': 'text',
					'curStyles': true,
					'attr': {
						x: 80,
						y: 132,
						id: canv.getNextId(),
						fill: '#000000',
						'stroke-width': 0,
						'font-size': 12,
						'text-anchor': 'left',
						'xml:space': 'preserve',
						opacity: 1
					}
				});
				cur_text.textContent = legendArr[i].name;
				if (/[a-z]/.test(fill_d)) {
					fill_d = canv.pathActions.convertPath(cur_shape);
					cur_shape.setAttribute('d', fill_d);
					canv.pathActions.fixEnd(cur_shape);
				}
				if(flag%2===0){
					cur_shape.setAttribute('transform', 'translate(180,'+parseInt((flag/2)-1)*(30)+')');
					cur_text.setAttribute('transform', 'translate(180,'+parseInt((flag/2)-1)*(30)+')');
				}else{
					cur_shape.setAttribute('transform', 'translate(0,'+parseInt(flag/2)*(30)+')');
					cur_text.setAttribute('transform', 'translate(0,'+parseInt(flag/2)*(30)+')');
				}
				canv.recalculateDimensions(cur_shape);
				canv.recalculateDimensions(cur_text);				
				//canv.getElem("legend-group").appendChild(cur_shape);
				//canv.getElem("legend-group").appendChild(cur_text);
			}
		}
		var viewBox = $("#svgcontent").attr("viewBox").split(" ");
		console.log(viewBox);
		var frameWidth = parseFloat(viewBox[2]);
		var frameHeight = parseFloat(viewBox[3]);
		//图例的默认起点是（25,85），需要根据画布大小进行偏移到右下角
		current_layer.setAttribute("transform","translate("+(frameWidth-455)+","+(frameHeight-135-rectHeight)+")");
		canv.recalculateDimensions(current_layer);
	}
	/**
 	* 根据地图样式中的layers筛选图例单元,该函数返回已筛选和分组完成的图例数组
 	*
 	* @参数 {Array} layers
 	* @返回值 {Array} legendArr
 	*/
	function getLegendArray(layers){
		var pointLayers=[];
		var lineLayers=[];
		var polygonLayers=[];
		for(var i=0;i<layers.length;i++){//遍历样式集，按点线面分成三类
		    if(layers[i].type==="symbol"){
		        pointLayers.push(layers[i]);
		    }else if(layers[i].type==="line"){
		        lineLayers.push(layers[i]);
		    }else if(layers[i].type==="fill"){
		        polygonLayers.push(layers[i]);
		    }
		}
		var pointLegend = filterLegend("symbol",pointLayers);
		var lineLegend = filterLegend("line",lineLayers);
		var fillLegend = filterLegend("fill",polygonLayers);
		var legendArr = pointLegend.concat(lineLegend).concat(fillLegend);
		for(var i=1;i<legendArr.length;i++){ 
			var flag=0;//标示是否存在相同的图层,“flag=0”为不存在，“flag=1”为存在
			for(var j=0;j<i;j++){
			    if(legendArr[i].type===legendArr[j].type&&legendArr[i].source===legendArr[j].source&&
			    	legendArr[i].source_layer===legendArr[j].source_layer&&legendArr[i].filter.toString()===legendArr[j].filter.toString()){
			        legendArr[j].styles=legendArr[j].styles.concat(legendArr[i].styles);
			    	legendArr[j].name = legendArr[i].name;
			    	legendArr.splice(i,1);
			    	i = i-1; flag=1;
			    }
			}
		}
		return legendArr;
	}

	/**
 	* 根据地图样式图层layer，返回该图层的图例样式
 	*
 	* @参数 {type} 图层类型，包括symbol、line、fill
 	* @参数 {styleLayer} 地图的一个样式图层
 	* @返回值 {layer} 图例的一个样式图层
 	*/
	function getLegendLayer(type,styleLayer){//获取图例的渲染样式层
	    if(type==="line"){//线
	        var layer = [{
                "line-opacity":getCurrentValue({type:'exponential',value:styleLayer.paint["line-opacity"]})||1,
                "line-color":getCurrentValue({type:'interval',value:styleLayer.paint["line-color"]})||"#000000",
                "line-width":getCurrentValue({type:'exponential',value:styleLayer.paint["line-width"]})||1,
                "line-gap-width":getCurrentValue({type:'exponential',value:styleLayer.paint["line-gap-width"]})||0,
                "line-blur":getCurrentValue({type:'exponential',value:styleLayer.paint["line-blur"]})||0,
                "line-offset":getCurrentValue({type:'exponential',value:styleLayer.paint["line-offset"]})||0,
                "line-dasharray":getCurrentValue({type:'interval',value:styleLayer.paint["line-dasharray"]})||[100,0]
	        }]
	    }else if(type==="symbol"){//点
	        var layer = [{
                "icon-image": getCurrentValue({type:'interval',value:styleLayer.layout["icon-image"]}),
                "icon-size":getCurrentValue({type:'exponential',value:styleLayer.layout["icon-size"]})||1,
                "icon-opacity":getCurrentValue({type:'exponential',value:styleLayer.paint["icon-opacity"]})||1,
                "icon-color":getCurrentValue({type:'interval',value:styleLayer.paint["icon-color"]})||"#000000"
	        }]
	    }else if(type==="fill"){//面
	        var layer = [{
                "fill-opacity":getCurrentValue({type:'exponential',value:styleLayer.paint["fill-opacity"]})|1,
                "fill-color":getCurrentValue({type:'interval',value:styleLayer.paint["fill-color"]})||'#000000',
                "fill-outline-color":getCurrentValue({type:'interval',value:styleLayer.paint["fill-outline-color"]})||styleLayer.paint["fill-color"]||'#000000'
	        }]
	    }
	    return layer;
	}

	function getCurrentValue(parameters){
		if(!parameters.value){
			return undefined;
		}else if(!glfun.isFunctionDefinition(parameters.value)){
			return parameters.value;
		}else{
			var experiement = glfun.interpolated({type:parameters.type,stops:parameters.value.stops});
			var zoom = options.zoom;
			return experiement(zoom);
		}
	}
	/**
 	* 过滤所有的地图样式图层，筛选出需要绘制图例的样式图层
 	*
 	* @参数 {type} 图层类型，包括symbol、line、fill
 	* @参数 {typeLayers} 对应类型的所有样式图层，例如pointLayers、lineLayers、polygenLayers
 	* @返回值 {temdArr} 返回需要绘制图例的所有样式图层
 	*/
	function filterLegend(type,typeLayers){
		var zoom = window.OPTIONS.zoom;//地图级别
		var temdArr = [];
		for(var i=0;i<typeLayers.length;i++){
			var temLegend = {name:'',type:'',source:'',source_layer:'',filter:[],styles:[]};
		    if(!typeLayers[i].minzoom){typeLayers[i].minzoom=0;}
		    if(!typeLayers[i].maxzoom){typeLayers[i].maxzoom=22;}		    //判断存在icon属性，并且当前级别在显示级别之内，并且visibility属性为true，都满足才作为候选图例条目
		    if(!typeLayers[i].layout){typeLayers[i].layout={};}
		    if(!typeLayers[i].layout.visibility){typeLayers[i].layout.visibility="visible";}
		    if(typeLayers[i].minzoom<=zoom&&typeLayers[i].maxzoom>=zoom&&typeLayers[i].layout.visibility==="visible"){
		        if(type==="symbol"&&!typeLayers[i].layout["icon-image"]){
		        	continue;
		        }
		        temLegend.name = typeLayers[i].id;
		        temLegend.type = type;
		        temLegend.source = typeLayers[i].source;
		        temLegend.source_layer = typeLayers[i]['source-layer'];
		        temLegend.filter = typeLayers[i].filter||[];
		        temLegend.styles=getLegendLayer(type,typeLayers[i]);
		        temdArr.push(temLegend);
		    }
		}
		return temdArr;
	}
	/*---------*/
	return {
		name: 'Extension Legend',
		svgicons: svgEditor.curConfig.extPath + 'ext-legend.xml',
		buttons: [{
			id: 'ext-legend',
			type: 'mode',
			title: '添加图例',
			events: {
				click: legendClick
			}
		}],
		mouseDown: function() {
			if (svgCanvas.getMode() == 'ext-panning') {
				svgEditor.setPanning(true);
				return {started: true};
			}
		},
		mouseUp: function() {
			if (svgCanvas.getMode() == 'ext-panning') {
				svgEditor.setPanning(false);
				return {
					keep: false,
					element: null
				};
			}
		}
	};//return结束



	
});
