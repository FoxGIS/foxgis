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
	/*定义变量*/

	/*---------*/
	/*定义函数*/
	function legendClick(){
		
	}
	/*---------*/
	return {
		name: 'Extension Legend',
		svgicons: svgEditor.curConfig.extPath + 'ext-legend.xml',
		buttons: [{
			id: 'ext-legend',
			type: 'mode',
			title: '添加比例尺',
			events: {
				click: function() {
					svgCanvas.setMode('ext-legend');
				}
			}
		}],
	};//return结束
});
