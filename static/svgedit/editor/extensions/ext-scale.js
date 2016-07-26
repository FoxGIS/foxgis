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
		var ppi = 288;
		var scale = calculateScale(ppi);
		drawScale(scale)
	}
	function drawScale(scale){
		canv.createLayer("比例尺");
		var current_layer = canv.getCurrentDrawing().getCurrentLayer();
		var rect = canv.addSvgElementFromJson({//创建图例矩形框
			'element': 'rect',
			'curStyles': true,
			'attr': {
				stroke:"#000000",
				fill:"#ffffff",
				'stroke-linejoin':"round",
				'stroke-width':"0",
				x:25,
				y:85,
				width:200,
				height:30,
				opacity: 1
			}
		});
		var text = canv.addSvgElementFromJson({//创建“图例”文字
			'element': 'text',
			'curStyles': true,
			'attr': {
				x: 120,
				y: 106,
				id: canv.getNextId(),
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
	}

	function calculateScale(ppi){
		var bbox = options.bbox;
		console.log(bbox);
		var center = [(bbox[0]+bbox[2])/2,(bbox[1]+bbox[3])/2];
		console.log(center);
		var diff = (bbox[3]-bbox[1])/20;
		console.log(diff);
		var point1 = [center[0],center[1]+diff];
		console.log(point1);
		var point2 = [center[0],center[1]-diff];
		console.log(point2);
		var topPX = merc.px(point1,Math.ceil(options.zoom));
		console.log(topPX);
		var bottomPX = merc.px(point2,Math.ceil(options.zoom));
		console.log(bottomPX);
		var topXY = merc.forward(point1);
		console.log(topXY);
		var bottomXY = merc.forward(point2);
		console.log(bottomXY);
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
