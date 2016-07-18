(function($) {
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
					return;
				}

				if(!request) {
					history.back();
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

				if(Vue) {
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