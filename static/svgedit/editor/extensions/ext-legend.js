/*globals svgEditor, svgCanvas*/
/*jslint eqeq: true*/
/*
 * ext-legend.js
 *
 */
 
/* 
 *	@创建者：万炎炎
 *	@主要功能：添加比例尺按钮及相关函数
 */

svgEditor.addExtension('ext-legend', function() {
	'use strict';
	var canv = svgEditor.canvas;
	var svgroot = canv.getRootElem();
	var lastBBox = {};
	var options = window.OPTIONS;
	var styleObj = {};
	var total_legend=0;
	var previewSnap = Snap("#preview-drawing");
	var legend_group = previewSnap.g();
	legend_group.attr('id','legend-group');
	var selected_count = 0;//记录legend_group中的图例数目
	var col = 2;//图例显示的列数
	var colWidth = 150;
	var rowHeight = 30;
	var scale = 1;
	$("#preview-drawing").attr({
		width:col*colWidth+20,
		height:200
	});
	/**
 	* 点击图例按钮的响应函数，向服务器请求地图样式，根据样式筛选图例单元
 	*
 	* @参数 无
 	* @返回值 无
 	*/
	function legendClick(){
		//alert("调用函数弹出")
		canv.setMode("select");
		if(!options||$("#legend-panel").is(":visible")){return;}
		var url = options.API.styles+"/"+options.username+"/"+options.style_id+"?access_token="+options.access_token;
		$.get(url,function(result){//请求地图样式
			styleObj = result;
			var layers = styleObj.layers;//地图样式图层
			var legendArr = getLegendArray(layers);	
			total_legend = legendArr.length;
			//drawLegend(legendArr);
			setLegend(legendArr);
		},"json");
	}

	/**
 	* 弹出图例设置对话框，设置图例显示数目、顺序、样式等
 	*
 	* @参数 {Array} legendArr
 	* @返回值 无
 	*/
	function setLegend(legendArr){
		$("#legend-panel").css("display","block");
		if($("#preview-drawing #legend-group").children().length!==0){
			return;
		}
		$("#legend-ok").bind("click",onLegendOk);
		$("#legend-cancel").bind("click",onLegendCancel);
		$("#set-drawing").css("height",rowHeight*legendArr.length+'px');
		$("#property-set input[name='col-num']").val(col);
		$("#property-set input[name='col-width']").val(colWidth);
		$("#property-set input[name='text-size']").val(12);
		//$("#property-set input[name='legend-zoom']").val(1);
		$("#property-set input[name='title-size']").val(18);
		$("#property-set input[name='col-num']").bind("change",colChange);
		$("#property-set input[name='col-width']").bind("change",colWidthChange);
		$("#property-set input[name='text-size']").bind("change",textSizeChange);
		//$("#property-set input[name='legend-zoom']").bind("change",zoomChange);
		$("#property-set select[name='text-font']").bind("change",fontChange);
		$("#property-set input[name='title-size']").bind("change",textSizeChange);
		$("#property-set select[name='title-font']").bind("change",fontChange);
		var legend_item = $("#legend-set .legend-item").clone()[0];
		$("#legend-set .legend-item").remove();
		var tem = styleObj.sprite.split("/");
		var prefix = styleObj.sprite.replace(new RegExp(tem[tem.length-1]+"$"),"");
		var snap = Snap("#set-drawing");
		for(var i=0;i<legendArr.length;i++){
			if(legendArr[i].type === "symbol"){
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
				$(svgcontent).children("title").remove();
				var icon_height = svgcontent.getAttribute("height");
				var icon_width = svgcontent.getAttribute("width");
				var curr_width = legendArr[i].styles[0]['icon-size']*icon_width;
				var curr_height = legendArr[i].styles[0]['icon-size']*icon_height;
				svgcontent.setAttribute("width",curr_width);
				svgcontent.setAttribute("height",curr_height);
				svgcontent.setAttribute("x",45-curr_width/2);
				svgcontent.setAttribute("y",i*rowHeight+15-curr_height/2);
				svgcontent.setAttribute("name",'legend'+i);
				document.getElementById("set-drawing").appendChild(svgcontent);
				var elem = $(legend_item).clone();
				elem.attr("name",'legend'+i);
				elem.children("input[name='legend-text']").val(legendArr[i].name);
				$("#legend-set").append(elem);		
			}else if(legendArr[i].type === "line"){
				for(var j=0;j<legendArr[i].styles.length;j++){
					var line_offset = legendArr[i].styles[j]['line-offset'];
					var line = snap.line(20,(i+1)*rowHeight-15+line_offset,70,(i+1)*rowHeight-15+line_offset);
					$(line.node).attr({
						name:'legend'+i,
						stroke: legendArr[i].styles[j]['line-color'],
						'stroke-width': legendArr[i].styles[j]['line-width'],
						'stroke-dasharray': legendArr[i].styles[j]['line-dasharray'],
						'stroke-linejoin': 'round',
						'stroke-linecap': null,
						'stroke-opacity': legendArr[i].styles[j]['line-opacity'],
						fill: 'none',
						opacity: legendArr[i].styles[j]['line-opacity'],
					})
				}
				var elem = $(legend_item).clone();
				elem.attr("name",'legend'+i);
				elem.children("input[name='legend-text']").val(legendArr[i].name);
				$("#legend-set").append(elem);
			}else if(legendArr[i].type === "fill"){
				var rect = snap.rect(20,i*rowHeight+5,50,20);
				$(rect.node).attr({
					name:'legend'+i,
					opacity: legendArr[i].styles[0]['fill-opacity'],
					fill:legendArr[i].styles[0]['fill-color'],
					'stroke-width':1,
					stroke:legendArr[i].styles[0]['fill-outline-color'],
				});
				var elem = $(legend_item).clone();
				elem.attr("name",'legend'+i);
				elem.children("input[name='legend-text']").val(legendArr[i].name);
				$("#legend-set").append(elem);
			}
		}

		var rect = previewSnap.rect(0,0,col*colWidth+20,200);
		$(rect.node).attr({
			id:"legend-background",
			stroke:"#000000",
			fill:"#ffffff",
			'stroke-linejoin':"round",
			'stroke-width':"2",
			opacity: 1
		});
		legend_group.add(rect);
		var text = previewSnap.text((col*colWidth)/2+10,20,"图    例");
		$(text.node).attr({
			id:'bacground-text',
			fill: '#000000',
			'stroke-width': 0,
			'font-size': 18,
			'text-anchor': 'middle',
			'font-family':"serif",
			opacity: 1
		});
		legend_group.add(text);
		//监听事件
		$("#legend-set input[name='addon']").bind("change",legendSelected);
		$("#legend-set input[name='legend-text']").bind("change",textChange);
		$("#legend-set i[name='legend-up']").bind("click",legendUp);
		$("#legend-set i[name='legend-down']").bind("click",legendDown);
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
 	* @参数 {String} type 图层类型，包括symbol、line、fill
 	* @参数 {Object} styleLayer 地图的一个样式图层
 	* @返回值 {Object} layer 图例的一个样式图层
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

	/**
 	* 利用gl-function计算stops函数在当前级别的值
 	*
 	* @参数 {Object} parameters 包括type和stops对象
 	* @返回值 {Number||Object||String}} 当前级别的值
 	*/
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
 	* @参数 {String} type 图层类型，包括symbol、line、fill
 	* @参数 {Array} typeLayers 对应类型的所有样式图层，例如pointLayers、lineLayers、polygenLayers
 	* @返回值 {Array} temdArr 返回需要绘制图例的所有样式图层
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

	/**
 	* 图例设置完成，将设置完成的图例添加到画布
 	*
 	* @参数 无
 	* @返回值 无
 	*/
	function onLegendOk(){
		$("#legend-panel").css("display","none");
		if(canv.setCurrentLayer("图例")){
			canv.deleteCurrentLayer();
		}
		canv.createLayer("图例");
		var current_layer = canv.getCurrentDrawing().getCurrentLayer();
		current_layer.setAttribute("id","legend");
		current_layer.appendChild($("#legend-group").clone()[0]);
		var frameWidth = $("#svgcontent rect#background").attr("width");//地图边框
		var frameHeight = $("#svgcontent rect#background").attr("height");
		var rectWidth = (col*colWidth+20)*scale;//图例边框
		var rectHeight = (Math.ceil(selected_count/col)*rowHeight+30)*scale;
		console.log("frameWidth:"+frameWidth);
		console.log("frameHeight:"+frameHeight);
		var transX = frameWidth-rectWidth-50;
		var transY = frameHeight-rectHeight-50;
		if(scale===1){
			var c = $(current_layer).children("#legend-group").children();
			for(var i=0;i<c.length;i++){
				if(c[i].tagName==="svg"){
					c[i].removeAttribute("name");
					var temX = parseFloat(c[i].getAttribute("x"));
					var temY = parseFloat(c[i].getAttribute("y"));
					c[i].setAttribute("x",temX+transX);
					c[i].setAttribute("y",temY+transY);
				}
			}
		}
		//图例的默认起点是（0,0），需要根据画布大小进行偏移到右下角
		document.getElementById("legend").setAttribute("transform","translate("+transX+","+transY+")");
		canv.recalculateDimensions(current_layer);
		//init();
	}

	/**
 	* 图例设置取消
 	*
 	* @参数 无
 	* @返回值 无
 	*/
	function onLegendCancel(){
		$("#legend-panel").css("display","none");
		if(canv.setCurrentLayer("图例")){
			return;
		}else{
			init();
		}
	}

	/**
 	* 图例设置面板中的选择事件，勾选多选框时触发。选择图例或取消选择，并在图例预览中实时预览
 	*
 	* @参数 {Event} e DOM事件
 	* @返回值 无
 	*/
	function legendSelected(e){
		var name = $(e.target.parentElement).attr('name');
		var text = $(".legend-item[name="+name+"] input[name='legend-text']").val();
		var font_family = $("#property-set select[name='text-font']").val();
		var font_size = $("#property-set input[name='text-size']").val();
		var pindex = 0;//当前图例在设置视图中的索引
		var index = 0;//当前图例在预览视图中的索引
		/*1、遍历所有的复选框，找出当前操作的图例在设置视图中的索引pindex以及在预览图中的索引index*/
		$(".legend-item input[type='checkbox']").each(function(i){
			if(e.target===this){
				index++;
				pindex = i+1;
				return false;
			}
			if(this.checked){
				index++
			}
		});
		if(e.target.checked){//图例选中
			/*2、根据图例选中前后的位置，将图例偏移至新的位置，并将图例name属性设置为“new-add”*/
			var oldOpts = {index:pindex-1,col:1,count:total_legend,colWidth:colWidth}
			var opts = {index:index,col:col,count:selected_count+1,colWidth:colWidth}
			var current_item = $('#set-drawing [name='+name+']').clone();//获取选中的图例元素
			for(var i=0;i<current_item.length;i++){
				var s = Snap(current_item[i]);
				s.attr({"name":"new-add"});
				legend_group.add(s);
			}
			translate(oldOpts,opts,current_item);
			/*3、根据文本框的图例内容创建text元素，将其name属性设置为“new-add”，并将其偏移到图例对应位置*/
			var t = previewSnap.text(80,18,text);
			$(t.node).attr({
				name:"new-add",
				fill: '#000000',
				'stroke-width': 0,
				'font-size': font_size,
				'font-family':font_family,
				'text-anchor': 'left',
				opacity: 1
			});
			legend_group.add(t);
			translate({index:0,col:1,count:1,colWidth:colWidth},opts,$(t.node));
			/*4、更新预览框中的图例总数目*/
			selected_count++;
			/*5、更新该图例之后的所有图例的位置，并更新他们的name属性，使其name属性与其index索引相一致*/
			for(var j=selected_count;j>index;j--){
				var oldOpts = {index:j-1,col:col,count:selected_count-1,colWidth:colWidth}
				var opts = {index:j,col:col,count:selected_count,colWidth:colWidth}
				var element = $('#preview-drawing [name=legend'+(j-1)+']');
				translate(oldOpts,opts,element);
				element.each(function(){
					this.setAttribute("name","legend"+j);
				});
			}
			/*6、更新新增加的图例的name属性，与之index属性一致*/
			$("#preview-drawing [name='new-add']").each(function(){
				this.setAttribute("name","legend"+index);
			});
		}else{
			var current_item = $('#preview-drawing [name=legend'+index+']');
			current_item.remove();
			for(var j=index+1;j<=selected_count;j++){
				var oldOpts = {index:j,col:col,count:selected_count,colWidth:colWidth}
				var opts = {index:j-1,col:col,count:selected_count-1,colWidth:colWidth}
				var element = $('#preview-drawing [name=legend'+j+']');
				translate(oldOpts,opts,element);
				element.each(function(){
					this.setAttribute("name","legend"+(j-1));
				});
			}
			selected_count--;
		}
		updateLegendPreview();
	}

	/**
 	* 设置图例的translate属性，当图例位置发生变化时，计算图例的偏移并更新视图
 	*
 	* @参数 {Object} oldOpts 位置改变之前的选项，包括索引、图例总数、总列数、列宽
 	* @参数 {Object} opts 位置改变之后的选项，包括索引、图例总数、总列数、列宽
 	* @参数 {Object} element 设置的图例对象，这是一个DOM元素，一般为svg元素
 	* @返回值 无
 	*/
	function translate(oldOpts,opts,element){//已知图例之前的索引以及新的索引，计算图例元素的偏移量
		var oldCurrRow = Math.ceil(oldOpts.index/oldOpts.col);//当前行数，索引除以总行数取余
		var oldCurrCol = (oldOpts.index%oldOpts.col)||oldOpts.col;//当前列数，索引除以总行数向上取整
		var newCurrRow = Math.ceil(opts.index/opts.col);//当前行数，索引除以总行数取余
		var newCurrCol = (opts.index%opts.col)||opts.col;//当前列数，索引除以总行数向上取整
		var x = (newCurrCol-1)*opts.colWidth-(oldCurrCol-1)*oldOpts.colWidth;
		var y = (newCurrRow-oldCurrRow)*rowHeight;
		for(var i=0;i<element.length;i++){
			if(element[i].tagName==="svg"){//svg元素不支持transform属性，只能手动更改x、y坐标
				var oldX = Number(element[i].getAttribute("x"));
				var oldY = Number(element[i].getAttribute("y"));
				element[i].setAttribute("x",oldX+x);
				element[i].setAttribute("y",oldY+y);
			}else{
				element[i].setAttribute("transform","translate("+x+","+y+")");
				canv.recalculateDimensions(element[i]);
			}	
		}	
	}

	/**
 	* 图例设置面板初始化
 	*
 	* @参数 无
 	* @返回值 无
 	*/
	function init(){
		total_legend=0;
		selected_count = 0;//记录legend_group中的图例数目
		col = 2;//图例显示的列数
		colWidth = 150;
		rowHeight = 30;
		$(legend_group.node).children().remove();
		$("#set-drawing").children().remove();
		$("#preview-drawing").attr({
			width:col*colWidth+20,
			height:200
		});
		$(".legend-item input[type='checkbox']").each(function(){
			this.checked=false;
		})
		$("#legend-ok").unbind("click",onLegendOk);
		$("#legend-ok").unbind("click",onLegendCancel);
		$("#property-set input[name='col-num']").unbind("change",colChange);
		$("#property-set input[name='col-width']").unbind("change",colWidthChange);
		$("#property-set input[name='text-size']").unbind("change",textSizeChange);
		//$("#property-set input[name='legend-zoom']").unbind("change",zoomChange);
	}

	/**
 	* 更新图例预览的视图，主要是更新图例整体的宽高、矩形框的宽高以及“图例”两个字的位置
 	*
 	* @参数 无
 	* @返回值 无
 	*/
	function updateLegendPreview(){
		var totalRow = Math.ceil(selected_count/col);
		$("#legend-preview #preview-drawing").attr({
			"width":(colWidth*col+20)*scale,
			"height":(rowHeight*totalRow+30)*scale
		});
		$("#legend-preview #legend-background").attr({
			"width":colWidth*col+20,
			"height":rowHeight*totalRow+30
		});
		$("#legend-preview #bacground-text").attr({
			"x":colWidth*col/2+10,
			"y":20
		});
	}

	/**
 	* 图例设置面板中的图例顺序调整事件，点击上移按钮时触发。调整图例的显示顺序
 	*
 	* @参数 {Event} e DOM事件
 	* @返回值 无
 	*/
	function legendUp(e){
		var name = $(e.target.parentElement).attr('name');
		var index = parseInt(name.replace("legend",""));//当前图例在设置中的索引（从0开始）
		if(index===0){return;}

		//如果前后两个都是选中状态，则调整预览中的顺序，否则只用调整设置中的顺序
		if($(".legend-item[name=legend"+(index-1)+"] input[type='checkbox']").attr("checked")&&$(".legend-item[name=legend"+index+"] input[type='checkbox']").attr("checked")){
			var viewIndex = 0; //当前图例在预览中的索引（从1开始）
			$(".legend-item input[type='checkbox']").each(function(){//遍历checkbox，获取viewIndex
				if(this.checked){
					viewIndex++;
				}
				if($(this.parentElement).attr('name')===name){
					return false;
				}
			});
			var preItem = $("#preview-drawing [name=legend"+(viewIndex-1)+"]");
			var currItem = $("#preview-drawing [name=legend"+viewIndex+"]");
			translate({index:viewIndex-1,col:col,count:selected_count,colWidth:colWidth},{index:viewIndex,col:col,count:selected_count,colWidth:colWidth},preItem);
			translate({index:viewIndex,col:col,count:selected_count,colWidth:colWidth},{index:viewIndex-1,col:col,count:selected_count,colWidth:colWidth},currItem);
			preItem.each(function(){
				this.setAttribute("name","legend"+viewIndex);
			});
			currItem.each(function(){
				this.setAttribute("name","legend"+(viewIndex-1));
			});
		}

		var preItem = $("#legend-set .legend-item[name=legend"+(index-1)+"]");//上一个元素
		var currItem = $("#legend-set .legend-item[name=legend"+index+"]");//当前元素
		preItem.before(currItem);//交换两个元素的顺序
		currItem.attr("name","legend"+(index-1));//更新name
		preItem.attr("name","legend"+index);//更新name
		
		var preLegend = $("#set-drawing [name=legend"+(index-1)+"]");
		var currLegend = $("#set-drawing [name=legend"+index+"]");
		translate({index:index,col:1,count:total_legend,colWidth:colWidth},{index:index+1,col:1,count:total_legend,colWidth:colWidth},preLegend);
		translate({index:index+1,col:1,count:total_legend,colWidth:colWidth},{index:index,col:1,count:total_legend,colWidth:colWidth},currLegend);
		currLegend.each(function(){
			this.setAttribute("name","legend"+(index-1));
		});
		preLegend.each(function(){
			this.setAttribute("name","legend"+index);
		});
	}

	/**
 	* 图例设置面板中的图例顺序调整事件，点击下移按钮时触发。调整图例的显示顺序
 	*
 	* @参数 {Event} e DOM事件
 	* @返回值 无
 	*/
	function legendDown(e){
		var name = $(e.target.parentElement).attr('name');
		var index = parseInt(name.replace("legend",""));//当前图例在设置中的索引（从0开始）
		if(index===total_legend-1){return;}

		//如果前后两个都是选中状态，则调整预览中的顺序，否则只用调整设置中的顺序
		if($(".legend-item[name=legend"+(index+1)+"] input[type='checkbox']").attr("checked")&&$(".legend-item[name=legend"+index+"] input[type='checkbox']").attr("checked")){
			var viewIndex = 0; //当前图例在预览中的索引（从1开始）
			$(".legend-item input[type='checkbox']").each(function(){//遍历checkbox，获取viewIndex
				if(this.checked){
					viewIndex++;
				}
				if($(this.parentElement).attr('name')===name){
					return false;
				}
			});
			var laterViewItem = $("#preview-drawing [name=legend"+(viewIndex+1)+"]");//预览窗口中的图例元素
			var currViewItem = $("#preview-drawing [name=legend"+viewIndex+"]");
			translate({index:viewIndex+1,col:col,count:selected_count,colWidth:colWidth},{index:viewIndex,col:col,count:selected_count,colWidth:colWidth},laterViewItem);
			translate({index:viewIndex,col:col,count:selected_count,colWidth:colWidth},{index:viewIndex+1,col:col,count:selected_count,colWidth:colWidth},currViewItem);
			laterViewItem.each(function(){
				this.setAttribute("name","legend"+viewIndex);
			});
			currViewItem.each(function(){
				this.setAttribute("name","legend"+(viewIndex+1));
			});
		}

		var laterItem = $("#legend-set .legend-item[name=legend"+(index+1)+"]");//上一个元素
		var currItem = $("#legend-set .legend-item[name=legend"+index+"]");//当前元素
		currItem.before(laterItem);//交换两个元素的顺序
		currItem.attr("name","legend"+(index+1));//更新name
		laterItem.attr("name","legend"+index);//更新name
		
		var laterLegend = $("#set-drawing [name=legend"+(index+1)+"]");
		var currLegend = $("#set-drawing [name=legend"+index+"]");
		translate({index:index+2,col:1,count:total_legend,colWidth:colWidth},{index:index+1,col:1,count:total_legend,colWidth:colWidth},laterLegend);
		translate({index:index+1,col:1,count:total_legend,colWidth:colWidth},{index:index+2,col:1,count:total_legend,colWidth:colWidth},currLegend);
		currLegend.each(function(){
			this.setAttribute("name","legend"+(index+1));
		});
		laterLegend.each(function(){
			this.setAttribute("name","legend"+index);
		});
	}

	/**
 	* 图例设置面板中的文字设置事件，文字改变时触发。调整图例的显示内容
 	*
 	* @参数 {Event} e DOM事件
 	* @返回值 无
 	*/
	function textChange(e){
		var name = $(e.target.parentElement).attr('name');
		var index = parseInt(name.replace("legend",""));//当前图例在设置中的索引（从0开始）
		if(!$(".legend-item[name=legend"+index+"] input[type='checkbox']").attr("checked")){
			return;
		}
		var viewIndex = 0; //当前图例在预览中的索引（从1开始）
		var value = e.target.value;
		$(".legend-item input[type='checkbox']").each(function(){//遍历checkbox，获取viewIndex
			if(this.checked){
				viewIndex++;
			}
			if($(this.parentElement).attr('name')===name){
				return false;
			}
		});
		$("#preview-drawing text[name='legend"+viewIndex+"']").text(value);
	}
	/**
 	* 图例设置面板中的列数设置事件，列数改变时触发。调整图例的列数
 	*
 	* @参数 {Event} e DOM事件
 	* @返回值 无
 	*/
	function colChange(e){
		var oldCol = col;
		var newCol = parseInt(e.target.value);
		col = newCol;
		for(var j=1;j<=selected_count;j++){
			var oldOpts = {index:j,col:oldCol,count:selected_count,colWidth:colWidth}
			var opts = {index:j,col:newCol,count:selected_count,colWidth:colWidth}
			var element = $('#preview-drawing [name=legend'+j+']');
			translate(oldOpts,opts,element);
		}
		updateLegendPreview();
	}

	/**
 	* 图例设置面板中的列宽设置事件，列宽改变时触发。调整图例的列宽
 	*
 	* @参数 {Event} e DOM事件
 	* @返回值 无
 	*/
	function colWidthChange(e){
		var oldColWidth = colWidth;
		var newColWidth = parseInt(e.target.value);
		colWidth = newColWidth;
		for(var j=1;j<=selected_count;j++){
			var oldOpts = {index:j,col:col,count:selected_count,colWidth:oldColWidth}
			var opts = {index:j,col:col,count:selected_count,colWidth:newColWidth}
			var element = $('#preview-drawing [name=legend'+j+']');
			translate(oldOpts,opts,element);
		}
		updateLegendPreview();
	}



 	/**
 	* 图例设置面板中的文本大小设置事件，文字大小改变时触发。调整图例的文字大小
 	*
 	* @参数 {Event} e DOM事件
 	* @返回值 无
 	*/
	function textSizeChange(e){
		var newSize = parseInt(e.target.value);
		if(e.target.name==="text-size"){
			$("#preview-drawing text[name^='legend']").each(function(){
				this.setAttribute("font-size",newSize);
			});
		}
		if(e.target.name==="title-size"){
			$("#preview-drawing #bacground-text").each(function(){
				this.setAttribute("font-size",newSize);
			});
		}
	}

	/**
 	* 图例设置面板中的字体设置事件，字体改变时触发。调整图例的文字字体
 	*
 	* @参数 {Event} e DOM事件
 	* @返回值 无
 	*/
	function fontChange(e){
		var newFont = e.target.value;
		if(e.target.name==="text-font"){
			$("#preview-drawing text[name^='legend']").each(function(){
				this.setAttribute("font-family",newFont);
			});
		}
		if(e.target.name==="title-font"){
			$("#preview-drawing #bacground-text").each(function(){
				this.setAttribute("font-family",newFont);
			});
		}
	}

		/**
	 	* 图例设置面板中的图例缩放设置事件
	 	*
	 	* @参数 {Event} e DOM事件
	 	* @返回值 无
	 	*/

	 	function zoomChange(e){
	 		var newScale = parseFloat(e.target.value);
	 		scale = newScale;
	 		var g = $("#preview-drawing #legend-group")[0];
	 		g.setAttribute("transform","scale("+scale+")");
	 		updateLegendPreview();
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
		}]
	};//return结束
});
