;(function($) {
	"use strict";

	if (typeof $ === 'undefined') {
			
		$ = window.Zepto || window.jQuery;		
		if (!$) return;
	}
	
	var win = $(window);
	var $body = $('body');
	
	var defaults = {
			headTitle: document.title,
			goBack: '',
			docheight: 40,
			setUpHead: true,
			backUrl:''
	};

	function Plugin($ele, options) {		
		this.$ele = $ele;
		this.options = options = $.extend(defaults, options || {});
		this.init();
	}
	
	Plugin.prototype = {
		constructor: Plugin,
		router: [],
		menuIcons: [],
		host: function() {
			return window.location.host;
		},
		init: function () {
			
			this.renderHtml();
			this.bindGoBackEvent();
		},
		local: function() {

			var prefix = "";//前缀不能随便加，等到全部切换到vue的时候在加，否则页面跳转到page/xx.html的时候获取不到local
			var args = Array.prototype.slice.call( arguments );
			var key,value;
			key = prefix + args[0];
			if(args.length == 1){
					return window.localStorage.getItem(key);
			}
			if(args.length == 2){
				value = args[1];

				if($.type(value)=='null'){
						return window.localStorage.removeItem(key);
				}

				if($.type(value) === 'object'  ){
						value = JSON.stringify(value);
				}

				try{
						return window.localStorage.setItem(key, value);
				}catch(e){
						alert('您开启了秘密浏览或无痕浏览模式，请关闭');
				}
			}
		},
		createHead: function(request) {

			var html = $([
				'<div class="ymc-native-head">',
				'<a class="ymc-native-back" href="javascript:;"><i></i>返回</a>',
				'<h4>'+request.title+'</h4>',
				'</div>'	
			].join(""));

			return html;
		},
		removeHead: function() {
			var that = this;
			console.log(that.head);
			if(that.head) {
				that.head.remove();
			}
		},
		setupHead: function(request) {
			
			var that = this;
			var value = request;
			console.log(value)
			that.head.find('h4').text(request.title);
			that.head.css({
				'background': request.bgcolor,
				'height': request.docheight+'px',
				'line-height': request.docheight + 'px'
			});	
			that.head.siblings('div').css('margin-top', request.docheight+'px');		
			
			if(that.router.length > 0){
				for(var i = 0; i < that.router.length; i++) {
					if(that.router[i].hash === value.hash) {
						value = null;
						break;
					}
				}
			}
			if(value !== null) {
				that.router.push(value);
			}		
			window.localStorage.setItem('routeList',JSON.stringify(that.router));
		},
		renderHtml: function () {
			
			var options = this.options;
			var that = this;
			var html = that.createHead({
				title: options.headTitle
			});

			that.head = $(html);
			that.$ele.append(html);
			that.head.siblings('div').css('margin-top', options.docheight+'px');
		},
		bindGoBackEvent: function (request) {				
			var that = this;
			
			that.head.find('a').bind("click", function () {
				
				var rlist = JSON.parse(that.local('routeList')) || [];
				var iconlist = that.menuIcons || [];

				var len = that.router.length;
				if(rlist && rlist.length > 1) {
					var rt = rlist[rlist.length-2];

					that.setupHead(rt);
					that.router = that.router.slice(0,len-1);					
					that.local('routeList',JSON.stringify(that.router));	

					for(var i = 0; i < iconlist.length; i++){
						if(iconlist[i].hash == rt.hash) {

							that.bindMenuIconEvent(iconlist[i]);
							break;
						}						
					}


				}else {
					that.local('routeList', null);
					if(window.Vue){
						return;
					}
					
				}

				if(!request) {
					if(window.Vue) {
						router.go(history.back())
					}else{
						history.back();
					}
				}

			});
		},
		bindMenuIconEvent: function (request) {
			var that = this;
			var html = '';
			that.menuIcon = $([
				'<span data-id="itemicon" class="ymc-native-menuicon">'+request.inner+'</span>'
			].join(""));

			if(request) {
				html = that.menuIcon;
			}

			that.head.append(html);
			that.head.find('span').unbind("click").bind('click',request.success);

			if(that.menuIcons.length > 0) {
				for(var i = 0; i <= that.menuIcons.length; i++) {
					if(that.menuIcons[i].hash === request.hash) {

						return;
					}
				}
			}

			that.menuIcons.push(request);

			window.localStorage.setItem('menuIcons',JSON.stringify(that.menuIcons));
		},
		removeMenuIcon: function(cmd, request) {
			console.log(cmd);
			if(this.menuIcon) {
				//this.local('menuIcons', null);
				this.menuIcon.remove();
			}
		},
		openWebPage: function (reuqest) {
			var that = this;
			console.log(reuqest);
			that.setupHead({
				title: reuqest.title,
				hash: reuqest.hash
			});
			that.removeMenuIcon('hide/optionmenu');
			window.location.href = reuqest.linkUrl;

		},
		goBackToPage: function (request) {
			var that = this;
			var routerLocal = JSON.parse(that.local('routeList')) || [];
			var menuLocal = that.menuIcons || [];
			console.log(routerLocal);
			console.log(that.host());

			//window.location.href = '/';
			that.head.find('a').unbind("click").bind('click',function() {
				that.local('routeList',routerLocal[0]);
				that.setupHead(routerLocal[0]);

				for(var i = 0; i < menuLocal.length; i++){
					if(menuLocal[i].hash == routerLocal[0].hash) {

						that.bindMenuIconEvent(menuLocal[i]);
						break;
					}						
				}

				if(window.Vue) {
					console.log(Vue);
					router.go('/');
				}else {
					window.location.href = '/';
				}					
			});
		},
		showToast: function(request) {

			var showHint = $('<span class="alert fadeInError alert-warning">' + request.msg + '</span>');
			var time = request.time || 3500;
			$body.append(showHint);

			setTimeout(function() {
					showHint.remove();
			},time);
		},
		showDialog: function(request) {
			var button = '';
			if(request.button1) {
				button += ['<a href="javascript:;" data-button="button1" class="weui_btn_dialog default">'+ request.button1 +'</a>',
									'<a href="javascript:;" data-close="true" class="weui_btn_dialog primary">取消</a>'].join('');
			}else {
				button += '<a href="javascript:;" data-close="true" class="weui_btn_dialog primary">确定</a>';
			}
			var DIALOG_STR = $([
					'<div class="weui_dialog_confirm ">',
							'<div class="weui_mask"></div>',
							'<div class="weui_dialog">',
									'<div class="weui_dialog_hd"><strong class="weui_dialog_title">'+ request.title +'</strong></div>',
									'<div class="weui_dialog_bd">'+ request.msg +'</div>',
									'<div class="weui_dialog_ft">',
											button,
									'</div>',
							'</div>',
					'</div>'
			].join('')); 
			$body.append(DIALOG_STR);

			$('[data-close]').bind('click',function() {
				DIALOG_STR.remove();
			});
			$('[data-button="button1"]').bind('click', request.button1action)
		},
		showLoadingView: function(cmd, request) {
			console.log(cmd);
			var that = this;
			var $loading = $([
					'<div class="weui_loading_toast">',
						'<div class="weui_mask_transparent"></div>',
						'<div class="weui_toast">',
								'<div class="weui_loading">',
										'<div class="weui_loading_leaf weui_loading_leaf_0"></div>',
										'<div class="weui_loading_leaf weui_loading_leaf_1"></div>',
										'<div class="weui_loading_leaf weui_loading_leaf_2"></div>',
										'<div class="weui_loading_leaf weui_loading_leaf_3"></div>',
										'<div class="weui_loading_leaf weui_loading_leaf_4"></div>',
										'<div class="weui_loading_leaf weui_loading_leaf_5"></div>',
										'<div class="weui_loading_leaf weui_loading_leaf_6"></div>',
										'<div class="weui_loading_leaf weui_loading_leaf_7"></div>',
										'<div class="weui_loading_leaf weui_loading_leaf_8"></div>',
										'<div class="weui_loading_leaf weui_loading_leaf_9"></div>',
										'<div class="weui_loading_leaf weui_loading_leaf_10"></div>',
										'<div class="weui_loading_leaf weui_loading_leaf_11"></div>',
								'</div>',
								'<p class="weui_toast_content">'+request.msg+'</p>',
						'</div>',
				'</div>'
			].join(''));
			
			that.loading = $loading;
			
			if(cmd === 'show/loading') {
				$body.append(that.loading);
			}
					
		},
		hideLoadingView: function(cmd, request) {
			console.log(cmd);
			var that = this;
			
			if(that.loading) {
				that.loading.remove();
			}
		}
			
		
	};
	
	$.fn.Plugin = function (options) {
			options = $.extend(defaults, options || {});

			return new Plugin($(this), options);
	}

	window.Plugins = $body.Plugin();
}());

/*===========================
Plugin AMD Export
===========================*/
if (typeof(module) !== 'undefined'){
    module.exports = window.Plugins;
	
}else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.Plugins;
    });
}

/*jslint forin: true, plusplus: true, sloppy: true, vars: true*/
//
//  ymcJsBridge.js
//  Version 1.0.0
//
//  Created by pandali on 16-6-14.
//  Copyright (c) 2016年 yaomaiche. All rights reserved.
//

'use strict';

if(!window.browser) {
	
	var jsBrowser_Init = (function(){
		
		console.log("browser_init");
	  var $body = $('body');
		var browser= window.browser = {};
		var YmcJsBridge = window.Plugins;
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
		// showOptionMenu展示导航菜单
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
    // showAlert显示警告弹窗
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

///Prius JS

/**
 * 加解密操作
 */
;if (!window._base64) {
  var _base64 = (function() {

    var base64 = {};

    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var lookup = null;

    base64.encode = function (s) {
      var buffer = base64.toUtf8(s),
        position = -1,
        result,
        len = buffer.length,
        nan0, nan1, nan2, enc = [, , ,];

      result = '';
      while (++position < len) {
        nan0 = buffer[position];
        nan1 = buffer[++position];
        enc[0] = nan0 >> 2;
        enc[1] = ((nan0 & 3) << 4) | (nan1 >> 4);
        if (isNaN(nan1))
          enc[2] = enc[3] = 64;
        else {
          nan2 = buffer[++position];
          enc[2] = ((nan1 & 15) << 2) | (nan2 >> 6);
          enc[3] = (isNaN(nan2)) ? 64 : nan2 & 63;
        }
        result += alphabet[enc[0]] + alphabet[enc[1]] + alphabet[enc[2]] + alphabet[enc[3]];
      }
      return result;
    };

    base64.toUtf8 = function (s) {
      var position = -1,
        len = s.length,
        chr, buffer = [];

      if (/^[\x00-\x7f]*$/.test(s)) {
        while (++position < len) {
          buffer.push(s.charCodeAt(position));
        }
      } else {
        while (++position < len) {
          chr = s.charCodeAt(position);
          if (chr < 128)
            buffer.push(chr);
          else if (chr < 2048)
            buffer.push((chr >> 6) | 192, (chr & 63) | 128);
          else
            buffer.push((chr >> 12) | 224, ((chr >> 6) & 63) | 128, (chr & 63) | 128);
        }
      }
      return buffer;
    };

    base64.decode = function (s) {
      s = s.replace(/\s/g, '');
      if (s.length % 4) {
        throw new Error('InvalidLengthError: decode failed: The string to be decoded is not the correct length for a base64 encoded string.');
      }

      if(/[^A-Za-z0-9+\/=\s]/g.test(s)) {
        throw new Error('InvalidCharacterError: decode failed: The string contains characters invalid in a base64 encoded string.');
      }

      var buffer = base64.fromUtf8(s),
        position = 0,
        result,
        len = buffer.length;

      result = '';
      while (position < len) {
        if (buffer[position] < 128) {
          result += String.fromCharCode(buffer[position++]);
        } else if (buffer[position] > 191 && buffer[position] < 224) {
          result += String.fromCharCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63));
        } else {
          result += String.fromCharCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63));
        }
      }
      return result;
    };

    base64.fromUtf8 = function (s) {
      var position = -1,
        len, buffer = [],
        enc = [, , ,];

      if (!lookup) {
        len = alphabet.length;
        lookup = {};
        while (++position < len) {
          lookup[alphabet.charAt(position)] = position;
        }
        position = -1;
      }

      len = s.length;
      while (++position < len) {
        enc[0] = lookup[s.charAt(position)];
        enc[1] = lookup[s.charAt(++position)];
        buffer.push((enc[0] << 2) | (enc[1] >> 4));
        enc[2] = lookup[s.charAt(++position)];
        if (enc[2] === 64) {
          break;
        }
        buffer.push(((enc[1] & 15) << 4) | (enc[2] >> 2));
        enc[3] = lookup[s.charAt(++position)];
        if (enc[3] === 64) {
          break;
        }
        buffer.push(((enc[2] & 3) << 6) | enc[3]);
      }
      return buffer;
    };

    return base64;
  }());
}


if (!window.Prius) {
  var Prius = (function() {

    var prius = {};
    prius.scheme = "ymcar://";

    prius.isInsideApp = false; // 判断是否在APP应用内
    prius.isYaomaiche = false; // 是否在要买车应用内
    prius.isCarMaster = false; // 是否在车达人应用内
    prius.clientVersion = null; // 获得当前终端的版本号

    if (window.navigator.userAgent) {
      var ua = window.navigator.userAgent.toLocaleLowerCase();
      prius.isInsideApp = ua.indexOf("yuntubrowser", 0) != -1;
      prius.isYaomaiche = ua.indexOf("yaomaiche", 0) != -1;
      prius.isCarMaster = ua.indexOf("carmaster", 0) != -1;
      prius.isAndroid = ua.indexOf("yuntuandroid", 0) != -1;
      prius.isIOS = ua.indexOf("yuntuios", 0) != -1;

      if (prius.isInsideApp) {
        var versionReg = /([\s\S]*)yuntubrowser-(\S*)\/(\S*)(nettype[\S\s]*)/;
        var version = ua.replace(versionReg, "$3");
        if (version !== '#') {
          prius.clientVersion = version;
        }

        if (ua.indexOf("deviceid", 0) != -1 && ua.indexOf("pushtoken", 0) != -1) {
          var reg = /([\s\S]*)yuntubrowser-(\S*)\/(\S*)nettype\/(\S*)deviceid\/(\S*)pushtoken\/(\S*)(yuntu[\S\s]*)/;
          var nettype = ua.replace(reg, "$4");
          if (version !== '#') {
            prius.netType = nettype;
          }
          var deviceid = ua.replace(reg, "$5");
          if (version !== '#') {
            prius.deviceID = deviceid;
          }
          var pushtoken = ua.replace(reg, "$6");
          if (version !== '#') {
            prius.pushToken = pushtoken;
          }
        }
      }
    }

    /**
     * 全局事件监听listener
     * event structure
     * {
     *  eventId: "事件名称，字符串",
     *  listener: "事件回调"
     * }
     * listener structure
     * {
     *  onGlobalEvent(data) //其中的data需要做base64加密
     * }
     */
    var globalListener = {};

    /**
     * 触发全局监控事件
     * @param eventId eventId
     * @param data data
     * data的数据结构为 （其中的data需要做base64加密）
     * {
     *  token: "xxxx"
     *  other: "xxxx"
     * }
     */
    prius.fireGlobalEvent = function(eventId, data) {
      if (globalListener && eventId && globalListener[eventId]) {
        globalListener[eventId].onGlobalEvent(data ? JSON.parse(data) : "");
      }
    };

    /**
     * native执行全局事件
     * @param encodeEvent encodeEvent
     * @param encodeData encodeData
     */
    prius.nativeFireGlobalEvent = function(encodeEvent, encodeData) {
      if (encodeEvent) {
        var event = encodeEvent ? _base64.decode(encodeEvent) : "";
        var data = encodeData ? _base64.decode(encodeData) : "";
        prius.fireGlobalEvent(event, data);
      }
    };

    /**
     * 添加全局监听事件
     * @param eventId eventId
     * @param listener listener
     * @returns {boolean} 是否添加成功
     * listener的数据结构
     * {
     *  onGlobalEvent(data)
     * }
     */
    prius.addGlobalEventListener = function(eventId, listener) {
      if (eventId && listener) {
        if (globalListener[eventId]) {
          return true;
        }
        globalListener[eventId] = listener;
        return true;
      }
      return false;
    };

    /**
     * 删除全局监控事件
     * @param eventId eventId
     * @returns {boolean} 是否删除成功
     */
    prius.removeGlobalEventListener = function(eventId) {
      if (eventId) {
        if (globalListener[eventId]) {
          delete globalListener[eventId];
          return true;
        }
      }
      return false;
    };

    /**
     * 执行访问native的url
     */
    prius.nativeExecute = function(actionUrl) {
      setTimeout(function() {
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", actionUrl);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
      }, 0);
    };


    /**
     * 将请求体Json数据加密后处理成scheme格式
     * @param path path
     * @param params params
     */
    prius.executeActionUrl = function(path, params) {
      var actionUrl = prius.scheme + path;
      if (params) {
        actionUrl += "?param=" + _base64.encode(
            "string" === typeof params ? params : JSON.stringify(params));
      }
      prius.nativeExecute(actionUrl);
    };


    /**
     * 通用操作PATH列表
     */
    var PATH_LIST = prius.PATH_LIST = {
      LOCATION_CITY: "location/city",   // 获取定位城市
      LOCATION_ADDRESS: "location/address",   // 获取定位地址
      LOCATION_COORDINATES: "location/coordinates", // 获取经纬度
      SHARE_INFO: "share/info",   // 内容分享
      SHARE_APP: "share/app",   // 分享APP
      PAY_WEIXIN: "pay/weixin",   // 微信支付订单
      PAY_ALIPAY: "pay/alipay",   // 支付宝支付订单
      OPEN_NEW_PAGE: "open/newpage", // 打开新页面
      APP_TELEPHONE: "app/telephone", // 拨打电话
      APP_STATISTIC: "app/statistic", // UBT统计
      APP_TOAST: "app/toast", // 显示toast
      APP_DIALOG: "app/dialog", // 显示Dialog
      APP_SHOW_LOADING: "app/showloading", //显示loading加载
      APP_HIDE_LOADING: "app/hideloading", //隐藏loading加载
      APP_SHOW_LOADING_DIALOG: "app/showloadingdialog", //显示loading dialog
      APP_HIDE_LOADING_DIALOG: "app/hideloadingdialog", //隐藏loading dialog
      MENU_ICON: "menu/icon", //添加icon menu
      MENU_WORD: "menu/word", //添加word menu
      MENU_SHARE: "menu/share", //添加share menu
      MENU_DELETE_ALL: "menu/deleteall", //删除全部menu
      USER_LOGIN_IN: "user/loginin", // 用户登录后回调
      USER_LOGIN_OUT: "user/loginout", // 用户退出后回调
      USER_LOGIN: "user/login", //获取用户信息
      USER_BIND: "user/bind", //不同APP之间，不同经纪人之间用户绑定
      PAGE_HOME: "page/home", //打开首页
      PAGE_MYINFO: "page/userinfo", //打开我的个人信息页面
      PAGE_LOGIN: "page/login", //打开用户登录页面
      PAGE_REGIST: "page/regist", //打开用户注册页面
      PAGE_URL_OVERRIDE: "page/urloverride", //是否控制当前链接
      PAGE_END: "page/end", //page end
      PAGE_REQUEST: "page/request", //修改page属性或者跳转
    };

    /**
     * callback 数据结构
     * {
     *    callId: "XXX",
     *    onSuccess: "xxxx",
     *    onFail: "xxxx",
     *    onCancel: "xxxxx",
     * }
     * 保存所有的callback回调
     */
    var callbackList = {};

    /**
     * 添加一个交互回调
     * @param callback callback
     * @return {boolean} 是否添加回调成功
     */
    prius.addCallback = function (callback) {
      if (callback && callback.callId && callbackList) {
        callbackList[callback.callId] = callback;
        return true;
      }
      return false;
    };


    /**
     * 移除一个交互回调
     * @param callback callback
     * @return {boolean} 是否删除回调成功
     */
    prius.removeClientCall = function (callback) {
      if (callback && callback.callId && callbackList && callbackList[callback.callId]) {
        delete callbackList[callback.callId];
        return true;
      }
      return false;
    };


    /**
     * 回调成功事例，json数据格式为以下
     * {
     *    callId: "xxxx/xxxx",
     *    data: {
     *    }
     *  }
     */
    prius.onCallbackDone = function (origin) {
      if (origin) {
        var result = JSON.parse(_base64.decode(origin));
        if (result && result.callId) {
          var callback = callbackList[result.callId];
          if (callback && callback.onSuccess) {
            var params = result.data || "";
            callback.onSuccess(params);
            if (result.callId.indexOf("menu/") == -1) {
              prius.removeClientCall(callback);
            }
            return;
          } else {
            console.log("Callbackdone is null or CallbackDone.onSuccess is null!");
          }
        } else {
          console.log("CallbackDone.callId is null!");
        }
      }
      console.log("Fail onCallbackDone, something wrong can't callback!");
    };


    /**
     * 回调失败
     * @param origin 原始数据
     * {
     *   scheme: "xxxx/xxxx",
     *   callId: "xxxx/xxxx",
     *   data: {
     *     msg: "一般为用户取消的原因"
     *   }
     * }
     */
    prius.onCallbackFail = function (origin) {
      if (origin) {
        var result = JSON.parse(_base64.decode(origin));
        if (result && result.callId) {
          var callback = callbackList[result.callId];
          if (callback && callback.onFail) {
            callback.onFail(result.data || "");
            return;
          } else {
            console.log("CallbackFail is null or CallbackDone.onFail is null!");
          }
        } else {
          console.log("CallbackFail.callId is null!");
        }
      }
      console.log("Fail onCallbackFail, something wrong can't callback!");
    };


    /**
     * 取消执行
     * @param origin 原始数据
     * {
     *   scheme: "xxxx/xxxx",
     *   callId: "xxxx/xxxx",
     *   data: {
     *     msg: "一般为用户操作失败原因"
     *   }
     * }
     */
    prius.onCallbackCancel = function (origin) {
      if (origin) {
        var result = JSON.parse(_base64.decode(origin));
        if (result && result.callId) {
          var callback = callbackList[result.callId];
          if (callback && callback.onCancel) {
            callback.onCancel(result.data || "");
            return;
          } else {
            console.log("CallbackCancel is null or CallbackDone.onCancel is null!");
          }
        } else {
          console.log("CallbackCancel.callId is null!");
        }
      }
      console.log("Fail onCallbackCancel, something wrong can't callback!");
    };

    var addCallbackListener = function(callId, listener) {
      if (!callId) {
        console.log("Fail addCallback listener, callId is null");
        return false;
      }

      if (!listener) {
        console.log("Fail addCallback listener, callback listener is null");
        return false;
      }

      var callback = {
        callId: callId,
        onSuccess: listener.onSuccess,
        onCancel: listener.onCancel,
        onFail: listener.onFail
      };
      prius.addCallback(callback);
    };

    /**
     * 弹Toast
     * @param phoneNumber phoneNumber
     */
    prius.dialPhone = function(phoneNumber) {
      if (phoneNumber) {
        var param = {
          callId: PATH_LIST.APP_TELEPHONE,
          data: {
            tel: phoneNumber || ""
          }
        };
        prius.executeActionUrl(PATH_LIST.APP_TELEPHONE, param);
      }
    };


    /**
     * 弹Toast
     * @param message message
     */
    prius.showToast = function(request) {
      if (request) {
        var param = {
          callId: PATH_LIST.APP_TOAST,
          data: {
            content: request.msg || ""
          }
        };
        prius.executeActionUrl(PATH_LIST.APP_TOAST, param);
      }
    };

    /**
     * 弹Dialog
     * @param request
     *  @param title 弹窗标题
     *  @param content 弹窗内容
     *  @param button1Name 按钮1的名字 (假如为空则不会显示)
     *  @param button1Name 按钮2的名字  (假如为空则不会显示)
     *  @param one2Suc 按钮1即为成功的回调 假如不传则默认为onSuccess回调, {value: "1", "2"}
     * @param listener listener 回调（onSuccess/onCancel/onFail)
     */
    prius.showDialog = function(request) {
      listener = listener || {};
      if (request && listener) {
        var params = {
          callId: PATH_LIST.APP_DIALOG,
          data: {
            title: request.title || "",
            content: request.content || "",
            button1Name: request.button1Name || "",
            button2Name: request.button2Name || "",
            one2Success: request.one2Success || "1"
          }
        };
        addCallbackListener(PATH_LIST.APP_DIALOG, request.listener);
        prius.executeActionUrl(PATH_LIST.APP_DIALOG, params);
      }
    };

    /**
     * 显示loading加载效果
     */
    prius.showLoadingView = function(message) {
      var param = {
        callId: PATH_LIST.APP_SHOW_LOADING,
        data: {
          content: message || ""
        }
      };
      prius.executeActionUrl(PATH_LIST.APP_SHOW_LOADING, param);
    };

    /**
     * 隐藏loading加载效果
     */
    prius.hideLoadingView = function() {
      var param = {
        callId: PATH_LIST.APP_HIDE_LOADING
      };
      prius.executeActionUrl(PATH_LIST.APP_HIDE_LOADING, param);
    };

    /**
     * 显示loading dialog加载效果
     */
    prius.showLoadingDialog = function(message) {
      var param = {
        callId: PATH_LIST.APP_SHOW_LOADING_DIALOG,
        data: {
          content: message || ""
        }
      };
      prius.executeActionUrl(PATH_LIST.APP_SHOW_LOADING_DIALOG, param);
    };

    /**
     * 隐藏loading dialog加载效果
     */
    prius.hideLoadingDialog = function() {
      var param = {
        callId: PATH_LIST.APP_HIDE_LOADING_DIALOG
      };
      prius.executeActionUrl(PATH_LIST.APP_HIDE_LOADING_DIALOG, param);
    };

    /**
     * 获取定位城市
     * @param listener listener
     */
    prius.getLocationCity = function(listener) {
      listener = listener || {};
      addCallbackListener(PATH_LIST.LOCATION_CITY, listener);
      var params = {
        callId: PATH_LIST.LOCATION_CITY
      };
      prius.executeActionUrl(PATH_LIST.LOCATION_CITY, params);
    };


    /**
     * 获取定位地址信息
     * @param listener listener
     */
    prius.getLocationAddress = function(listener) {
      listener = listener || {};
      addCallbackListener(PATH_LIST.LOCATION_ADDRESS, listener);
      var params = {
        callId: PATH_LIST.LOCATION_ADDRESS
      };
      prius.executeActionUrl(PATH_LIST.LOCATION_ADDRESS, params);
    };

    /**
     * 获取经纬度信息
     * @param listener listener
     */
    prius.getCoordinates = function(listener) {
      listener = listener || {};
      addCallbackListener(PATH_LIST.LOCATION_COORDINATES, listener);
      var params = {
        callId: PATH_LIST.LOCATION_COORDINATES
      };
      prius.executeActionUrl(PATH_LIST.LOCATION_COORDINATES, params);
    };

    /**
     * 启动分享
     * @param listener listener
     * @param title 分享标题
     * @param content 分享内容
     * @param link 分享链接
     */
    prius.shareInfo = function(title, content, link, listener) {
      listener = listener || {};
      addCallbackListener(PATH_LIST.SHARE_INFO, listener);
      var params = {
        callId: PATH_LIST.SHARE_INFO,
        data: {
          title: title || "",
          content: content || "",
          link: link || ""
        }
      };
      prius.executeActionUrl(PATH_LIST.SHARE_INFO, params);
    };

    /**
     * 启动分享
     * @param listener listener
     * @param title 分享标题
     * @param content 分享内容
     * @param link 分享链接
     * @param imgLink 分享的图片地址
     */
    prius.shareInfoWithImg = function(title, imgLink, content, link, listener) {
      listener = listener || {};
      addCallbackListener(PATH_LIST.SHARE_INFO, listener);
      var params = {
        callId: PATH_LIST.SHARE_INFO,
        data: {
          title: title || "",
          content: content || "",
          link: link || "",
          imgLink: imgLink || ""
        }
      };
      prius.executeActionUrl(PATH_LIST.SHARE_INFO, params);
    };

    /**
     * 微信支付
     * @param originData 微信支付的参数加上订单号
     * @param listener 回调
     */
    prius.wechatPay = function(originData, listener) {
      listener = listener || {};
      addCallbackListener(PATH_LIST.PAY_WEIXIN, listener);
      var params = {
        callId: PATH_LIST.PAY_WEIXIN,
        data: originData || {}
      };
      prius.executeActionUrl(PATH_LIST.PAY_WEIXIN, params);
    };

    /**
     * 支付宝支付
     * @param originData 支付宝支付参数加上订单号
     * @param listener 回调
     */
    prius.aliPay = function(originData, listener) {
      listener = listener || {};
      addCallbackListener(PATH_LIST.PAY_ALIPAY, listener);
      var params = {
        callId: PATH_LIST.PAY_ALIPAY,
        data: originData || {}
      };
      prius.executeActionUrl(PATH_LIST.PAY_ALIPAY, params);
    };

    /**
     * 外链打开新的页面加载，并且是带返回按钮
     * @param linkUrl 需要打开的网页链接
     * @param showTitle {value: "0"-不添加actionbar， “1”-添加actionbar}
     */
    var lastOpenTime = 0;
    prius.openNewPage = function(request) {
      var curTime = new Date().getTime();
      if (curTime - lastOpenTime < 500) {
        return;
      }
      lastOpenTime = curTime;
      var params = {
        callId: PATH_LIST.OPEN_NEW_PAGE,
        data: {
          title: request.title || "",
          link: request.linkUrl || "",
          showTitle: request.showTitle || "0"
        }
      };
      prius.executeActionUrl(PATH_LIST.OPEN_NEW_PAGE, params);
    };

    /**
     * UBT统计传给本地去上传
     * @param ubtData ubtData
     */
    prius.uploadUBTStatistic = function(ubtData) {
      var params = {
        callId: PATH_LIST.APP_STATISTIC,
        data: {
          ubtData: ubtData || ""
        }
      };
      prius.executeActionUrl(PATH_LIST.APP_STATISTIC, params);
    };

    /**
     * 用户登录通知native端
     * @param token 用户token
     * @param userId 用户userId
     * @param userName 用户
     */
    prius.appLoginIn = function(token, userId, userName) {
      var params = {
        callId: PATH_LIST.USER_LOGIN_IN,
        data: {
          token: token || "",
          userId: userId || "",
          userName: userName || ""
        }
      };
      prius.executeActionUrl(PATH_LIST.USER_LOGIN_IN, params);
    };

    /**
     * 用户退出通知native端
     * 退出登录不需要传参数
     */
    prius.appLoginOut = function() {
      var params = {
        callId: PATH_LIST.USER_LOGIN_OUT
      };
      prius.executeActionUrl(PATH_LIST.USER_LOGIN_OUT, params);
    };


    /**
     * 调取原生的接口，登录
     * @param listener 回调
     */
    prius.login = function(listener) {
      listener = listener || {};
      addCallbackListener(PATH_LIST.USER_LOGIN, listener);
      var params = {
        callId: PATH_LIST.USER_LOGIN
      };
      prius.executeActionUrl(PATH_LIST.USER_LOGIN, params);
    };

    /**
     * 回到首页
     */
    prius.gotoHomePage = function() {
      var params = {
        callId: PATH_LIST.PAGE_HOME
      };
      prius.executeActionUrl(PATH_LIST.PAGE_HOME, params);
    };

    /**
     * 跳转登录页面
     */
    prius.gotoLoginPage = function(listener) {
      listener = listener || {};
      addCallbackListener(PATH_LIST.PAGE_LOGIN, listener);
      var params = {
        callId: PATH_LIST.PAGE_LOGIN
      };
      prius.executeActionUrl(PATH_LIST.PAGE_LOGIN, params);
    };

    /**
     * 跳转注册页面
     * @param listener listener
     */
    prius.gotoRegistPage = function(listener) {
      listener = listener || {};
      addCallbackListener(PATH_LIST.PAGE_REGIST, listener);
      var params = {
        callId: PATH_LIST.PAGE_REGIST
      };
      prius.executeActionUrl(PATH_LIST.PAGE_REGIST, params);
    };

    /**
     * 跳转用户详情信息页面
     */
    prius.gotoMyInfoPage = function() {
      var params = {
        callId: PATH_LIST.PAGE_MYINFO
      };
      prius.executeActionUrl(PATH_LIST.PAGE_MYINFO, params);
    };

    /**
     * 是否拦截跳转链接
     * @param toUrl 下一个跳转链接
     * @param to 跳转的路由
     * @param from 来自的路由
     * @param listener 回调函数
     */
    prius.shouleOverrideUrl = function(toUrl, to, from, fromQuery, toQuery, listener) {

      var callbackFlag = PATH_LIST.PAGE_URL_OVERRIDE + (new Date().getTime());

      prius.addCallback({
        callId: callbackFlag,
        onSuccess: function(data) {
          console.log("shouleOverideUrl onSuccess: " + toUrl);
          listener(true, data);
        },
        onCancel: function(data) {
          console.log("shouleOverideUrl onCancel: " + toUrl);
          listener(false, data);
        },
        onFail: function(data) {
          console.log("shouleOverideUrl onFail: " + toUrl);
          listener(false, data);
        }
      });

      try {
        prius.executeActionUrl(PATH_LIST.PAGE_URL_OVERRIDE, {
          callId: callbackFlag,
          data: {
            toUrl: toUrl,
            to: to,
            from: from,
            toQuery: toQuery,
            fromQuery: fromQuery
          }
        });
      } catch(err) {
        console.log("catch onFail: " + url);
        listener(false);
      }

    };

    /**
     * 页面结束
     */
    prius.pageEnd = function() {
      var params = {
        callId: PATH_LIST.PAGE_END
      };
      prius.executeActionUrl(PATH_LIST.PAGE_END, params);
    };

    /**
     * 页面属性修改
     * @param request request
     * request:
     * {
     *  title: "这是页面标题",
     *  pageId: "这是页面标识",
     *  backPageId: "这是回退页面标识",
     *  lastPageId: "这是上一个页面标识",
     *  background: "页面背景颜色 #000000， #FFFFFF",
     * }
     */
    prius.sendPageRequest = function(request) {
      if (!request) {
        request = {};
      }
      var params = {
        callId: PATH_LIST.PAGE_REQUEST,
        data: {
          title: request.title || "",
          pageId: request.pageId || "",
          backPageId: request.backPageId || "",
          lastPageId: request.lastPageId || "",
          background: request.background || ""
        }
      };
      prius.executeActionUrl(PATH_LIST.PAGE_REQUEST, params);
    };

    /**
     * 判断版本是否小于2.0.0
     * @returns {boolean}
     */
    prius.isVersionLessV2 = function(){
      var appVer = Prius.clientVersion;
      if(appVer){
        if( ( +appVer.slice(0,1) ) >= 2){
          //app2.0 之后的版本隐藏底部
          return false;
        }
        //之前的不隐藏
        return true;
      }
      //不在app中，正常逻辑
      return true;
    };

    /**
     * 执行ymcar的schema，调起应用
     * dataMap: {
     *  url: "http://m.yaomaiche.com/#/?uid=123"
     *  ...
     * }
     */
    prius.bindUserAccount = function(dataMap) {
      var params = {
        callId: PATH_LIST.USER_BIND,
        data: dataMap || {}
      };
      var actionUrl = prius.scheme + PATH_LIST.USER_BIND;
      if (params) {
        actionUrl += "?param=" + _base64.encode(
            "string" === typeof params ? params : JSON.stringify(params));
      }
      if (actionUrl) {
        window.location = actionUrl;
      }
    };

    /**
     * 添加share menu
     * @param request request
     * request {
     *  title: "share title",
     *  content: "share content",
     *  link: "share link"
     * }
     */
    prius.addShareMenu = function(request) {
      var params = {
        callId: PATH_LIST.MENU_SHARE,
        data: {
          title: request.title || "",
          content: request.content || "",
          link: request.link || "",
          imgLink: request.imgLink || ""
        }
      };
      prius.executeActionUrl(PATH_LIST.MENU_SHARE, params);
    };


    /**
     * 添加icon menu
     * @param request request
     * @param listener listener
     * request {
     *  iconUrl: "http://....img"
     *  rule: {value: ("0" left), ("1", right)}
     * }
     * listener {
     *  onSuccess: function(data) {
     *  },
     *  onFail: function(data) {
     *  }
     * }
     */
    prius.addIconMenu = function(request, listener) {
      listener = listener || {};
      var menuSign = PATH_LIST.MENU_ICON + (new Date().getTime());
      addCallbackListener(menuSign, listener);
      var params = {
        callId: menuSign,
        data: {
          iconUrl: request.iconUrl || "",
          rule: request.rule || "1"
        }
      };
      prius.executeActionUrl(PATH_LIST.MENU_ICON, params);
    };

    /**
     * 添加word menu
     * @param request request
     * @param listener
     * request {
     *  word: "按钮"
     *  rule: {value: ("0" left), ("1", right)}
     * }
     * listener {
     *  onSuccess: function(data) {
     *  },
     *  onFail: function(data) {
     *  }
     * }
     */
    prius.showOptionMenu = function(request) {
      listener = request.success || {};
      var menuSign = PATH_LIST.MENU_WORD + (new Date().getTime());
      addCallbackListener(menuSign, listener);
      var params = {
        callId: menuSign,
        data: {
          word: request.inner || "",
          rule: request.rule || "1"
        }
      };
      prius.executeActionUrl(PATH_LIST.MENU_WORD, params);
    };

    /**
     * 删除左边或者右边的所有的menu
     * @param request request
     * request {
     *  rule: {value: ("0" left), ("1", right)}
     * }
     */
    prius.hideOptionMenu = function(request) {
      var params = {
        callId: PATH_LIST.MENU_DELETE_ALL,
        data: {
          rule: request.rule || "1"
        }
      };
      prius.executeActionUrl(PATH_LIST.MENU_DELETE_ALL, params);
    };


    return prius;

  }());
}

window.Prius = Prius;

var Hybridui = window.Hybridui = (function(){
	
	var jsInit = {};
	
	jsInit.setting = function() {
		
		if(Prius.isInsideApp) {
      
			jsInit = Prius;		
    }else {
			
			jsInit = jsBrowser_Init;
    }	
	}
	
	jsInit.setting();	
	
	return jsInit;
}());

if (typeof(module) !== 'undefined'){
    module.exports = Hybridui;
	
}else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.Hybridui;
    });
}