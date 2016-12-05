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

svgEditor.addExtension('ext-scale', function() {
	'use strict';
	var canv = svgEditor.canvas;
	var options = window.OPTIONS;
	var merc = new SphericalMercator({
		size:256
	});
	function scaleClick(){
		canv.setMode("select");
		if(!window.OPTIONS.scale){
			var ppi = 288;
			var scale = calculateScale(ppi);
			window.OPTIONS.scale = scale;
		}
		drawScale(window.OPTIONS.scale)
	}
	function drawScale(scale){
		if(canv.setCurrentLayer("比例尺")){
			canv.deleteCurrentLayer();
		}
		canv.createLayer("比例尺");
		var current_layer = canv.getCurrentDrawing().getCurrentLayer();
		current_layer.setAttribute("id","scale");
		var text = canv.addSvgElementFromJson({//创建“图例”文字
			'element': 'text',
			'curStyles': true,
			'attr': {
				x: 0,
				y: 0,
				id: "scale-text",
				fill: '#000000',
				'stroke-width': 0,
				'font-size': 12,
				'text-anchor': 'middle',
				'font-family':"serif",
				'xml:space': 'preserve',
				opacity: 1
			}
		});
		text.textContent = "比例尺：1:"+scale;
		var frameWidth = $("#svgcontent rect#background").attr("width");//地图边框
		var frameHeight = $("#svgcontent rect#background").attr("height");
		current_layer.setAttribute("transform","translate("+(frameWidth/2)+","+(frameHeight-20)+")");
		canv.recalculateDimensions(current_layer);
	}

	function calculateScale(ppi){
		var bbox = options.bbox;
		var center = [(bbox[0]+bbox[2])/2,(bbox[1]+bbox[3])/2];
		var diff = (bbox[3]-bbox[1])/20;
		var point1 = [center[0],center[1]+diff];
		var point2 = [center[0],center[1]-diff];
		var topPX = merc.px(point1,Math.ceil(options.zoom));
		var bottomPX = merc.px(point2,Math.ceil(options.zoom));
		var topXY = merc.forward(point1);
		var bottomXY = merc.forward(point2);
		var pixelDif = Math.abs(topPX[1]-bottomPX[1]);
		var metersDif = Math.abs(topXY[1]-bottomXY[1]);
		var scale = parseInt(metersDif/(pixelDif*0.0254/ppi));
		return scale;

	}
	return {
		name: 'Extension Scale',
		svgicons: svgEditor.curConfig.extPath + 'ext-scale.xml',
		buttons: [{
			id: 'ext-scale',
			type: 'mode',
			title: '添加比例尺',
			events: {
				click: scaleClick
			}
		}]
	};//return结束
	
});
