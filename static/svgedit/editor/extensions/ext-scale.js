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

	
	function scaleClick(){

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
