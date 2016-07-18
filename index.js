/*jslint forin: true, plusplus: true, sloppy: true, vars: true*/
//
//  init.js
//  Version 1.0.0
//
//  Created by pandali on 16-6-14.
//  Copyright (c) 2016年 yaomaiche. All rights reserved.
//

'use strict';

var Prius = require('./src/bridge/b.prius.js');
var Browser = require('./src/bridge/b.browser.js');

var init = (function(){
	
	var jsInit = {};
	
	jsInit.setting = function() {
		
		if(Prius.isInsideApp) {
      
			jsInit = Prius;		
    }else {
			
			jsInit = Browser;
    }	
	}
	
	jsInit.setting();	
	
	return jsInit;
}());

module.exports = init;