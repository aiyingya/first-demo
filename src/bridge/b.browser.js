/*jslint forin: true, plusplus: true, sloppy: true, vars: true*/
//
//  ymcJsBridge.js
//  Version 1.0.0
//
//  Created by pandali on 16-6-14.
//  Copyright (c) 2016年 yaomaiche. All rights reserved.
//

'use strict';

var jsBrowser = require('../core/core.base.js');

if(!window.browser) {
	
	var jsBrowser_Init = (function(){
		
		
		console.log("browser_init");
	
		var browser= window.browser = {};
		var YmcJsBridge = jsBrowser;
		/////////
    //
    // 调用容器的一个方法。可以从容器获得异步回调
    //
    /////////
    var CLIENTCALLS = browser.CLIENTCALLS = {
        GET_APP_VERSION: "getappversion", //获取app version
        GET_API_VERSION: "getapiversion", //获取api version
        SEND_MESSAGE: "sendmessage", //发送消息
        GET_APP_CONFIG: "getappconfig", //获取appconfig
        GET_AUTH_INFO: "getauthinfo", //获取用户信息
        GET_LBS_INFO: "getlbsinfo", //获取当前位置信息
        SHOW_CITY_PICKER: "showcitypicker", //显示城市选择框
        SHOW_OPTION_PICKER: "showoptionpicker", //显示option选择框
        REQUIRE_AUTH: "requireauth", //申请授权,
        SHOW_MODEL_SELECTOR: "showmodelselector", //显示车款选择器,
        GET_CARBUY_ORDER: "getcarbuyorder", //获取购车订单
        SHOW_CAR_SELECTOR: "showcarselector", //显示车型/车款/品牌选择器,
        SET_PAGE_ATTR: "setpageattr", //设置pageId等页面属性,
        SHOW_SHARE: "showshare", //需要回调的分享,
        SHOW_ALERT: "showalert", //需要回调的Alert,
				GO_BACK_HOME: "gobackhome"
    };
		
		browser.versoin = '1.0.0';

		//vueHeader.install(Vue);
		//////////
		//
		// addNativeHead 向页面添加头部导航条.
		//
		// request:示例
		// {
		//         "title":title,  // title
		//         "bgcolor":backgroundColor,
		//         "docheight":"40", //是否打开新页面，"1"为打开新页面，"0"在当前页面打开
		//         "itemicon":{
		//						"inner": "分享",
		//            "success": callback
		//					}, // 添加按钮.
		//          
		// }
		//
		//////////
		browser.setNativeHead = function(request) {
			console.log('set native head');
			var parameters = {
				"title": request.title,  // title
			  "bgcolor": request.bgcolor,
 				"docheight": request.docheight,
				"hash": request.hash
			}
			YmcJsBridge.setupHead(parameters);
		}


		//////////
		//
		// showOptionMenu展示右侧按钮
		//
		// request:示例
		// {
		//    "menuitems":menuitems
		// }
		// menuitems:
		//[
		//    {iconpath,title,scheme,badgenumber},
		//    {iconpath,title,scheme,badgenumber}
		//]
		//
		//////////
		browser.showOptionMenu = function(request) {
			
			YmcJsBridge.bindMenuIconEvent({
				inner: request.inner,
				hash: request.hash,
				success: request.success
			});
		};
		
		//////////
    //
    // hideOptionMenu隐藏导航菜单
    //
    //////////
    browser.hideOptionMenu = function () {
        var parameters = {};
        YmcJsBridge.removeMenuIcon("hide/optionmenu", parameters);
    };
		
		//////////
		//
		// openNewPage打开新页面
		//
		// request:示例
		// {
		//         "package":packageName,
		//         "packagepath":packagePath,
		//         "newpage":"1", //是否打开新页面，"1"为打开新页面，"0"在当前页面打开
		//         "authrequired":"0", // "0"标识页面不需要登录,"1"标识页面不需要登录
		//         "pageidentifier":pageidentifier,
		//         "backpageidentifier":backpageidentifier,
		//         "title":title
		// }
		//
		//////////
		browser.openNewPage = function (request) {
				var parameters = {
						"linkUrl": request.linkUrl,
						"showTitle": request.showTitle,
						"hash": request.hash,
						"title": request.title
				};
				YmcJsBridge.openWebPage(parameters);
		};

		//////////
		//
		// goBackToPage返回上一个页面
		//
		// request:示例
		// {
		//         "backurl": ''
		// }
		//
		//////////
		browser.goBackToPage = function(request) {
			console.log('backurl');
			var parameters = {
				"backurl": CLIENTCALLS.GO_BACK_HOME
			};
			
			YmcJsBridge.goBackToPage(parameters);
		}
		
		//////////
    //
    // goBackToRootPage返回根页面
    //
    //////////
    browser.goBackToRootPage = function () {
			YmcJsBridge.goBackToPage({
					pageidentifier: "root"
			});
    };
		
		//////////
    //
    // showToast 显示toast提示
    //
    // request:示例
    // {
    //         "msg":msg
    // }
    //
    //////////
    browser.showToast = function (request) {
			console.log('show toast');
			var parameters = {};
			
			if ("string" === typeof (request)) {
					parameters.msg = request;
			} else {
					parameters.msg = request.msg;
			}
			
			YmcJsBridge.showToast(parameters);
    };
		
		//////////
    //
    // showDialog显示警告弹窗
    //
    // request:示例
    // {
    //        title : "title",
    //        msg : "msg",
    //        button1 : "buttion1Title",
    //        button1action: function(){},//action支持传scheme或者方法
    //        button2 : "buttion2Title",
    //        button2action : function(){},
    // }
    //
    //////////
    browser.showDialog = function (request) {
			var parameters = {
					title : request.title,
					msg : request.msg,
					button1 : request.button1,
					button1action : request.button1action,
					button2 : request.button2,
					button2action : request.button2action
			};

			YmcJsBridge.showDialog(parameters);
    };
		
		//////////
    //
    // showLoadingView展示加载动画
    // request:示例
    // { 
    //   msg : "msg"
    // }
    //////////
    browser.showLoadingView = function (request) {
			
			var parameters = {};
			
			if ("string" === typeof (request)) {
				parameters.msg = request;
			} else {
				parameters.msg = request ? request.msg : '';
			}
			
      YmcJsBridge.showLoadingView("show/loading", parameters);
    };

    //////////
    //
    // hideLoadingView隐藏加载动画
    //
    //////////
    browser.hideLoadingView = function () {
			var parameters = {};
			YmcJsBridge.hideLoadingView("hide/loading", parameters);
    };
		
		return browser;
		
	}());	
}

module.exports = window.browser;