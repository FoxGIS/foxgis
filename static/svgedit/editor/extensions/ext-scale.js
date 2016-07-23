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
	
	function scaleClick(){
		drawScale()
	}
	function drawScale(){
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
		text.textContent = "比例尺：1:200000";
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
