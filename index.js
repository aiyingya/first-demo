/*jslint forin: true, plusplus: true, sloppy: true, vars: true*/
//
//  init.js
//  Version 1.0.0
//
//  Created by pandali on 16-6-14.
//  Copyright (c) 2016年 yaomaiche. All rights reserved.
//

;(function($) {
  "use strict";
  var vueJsbridge = {};
  var Prius = typeof require === 'function' ? require('./src/b.prius.js') : window.Prius;
	
  if(typeof $ === 'undefined') {
    $ = window.Zepto || window.jQuery;
    if (!$) return;
  }

  if(!Prius) {
    throw new Error('[vue-jsbridge] cannot locate Prius.js.');
  }
	var $body = $('body');
  var trailingSlashRE = /\/$/;
  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
  var queryStringRE = /\?.*$/;
	// exposed global options
  vueJsbridge.config = {};
  vueJsbridge.install = function(Vue) {
    var _Vue$util = Vue.util;
    var _bind = _Vue$util.bind;
    var isObject = _Vue$util.isObject;
    var addClass = _Vue$util.addClass;
    var removeClass = _Vue$util.removeClass;
    var onPriority = Vue.directive('on').priority;
    var LINK_UPDATE = '__vue-router-link-update__';
    // 检测是否在APP内.
    Vue.prototype.checkInsideApp = function() {
			// 判断APP版本号，version3.0之前的返回false.
			var isInspectAppVersion = function() {
				if(Prius.isInsideApp) {
					if((+Prius.clientVersion.slice(0,3)) <= 3){
						//app3.0 之前的版本显示头部
						return false;
					}
					//app3.0 之后的版本隐藏头部
					return true;
				}
			}();
      return isInspectAppVersion;
    }();

    // 开放Prius接口.
    Vue.prototype.Prius = function(request) {

      return Prius;
    }();
    //////////
    //
    // openNewPage打开新页面
    //
    // request:示例
    // {
    //         "title": title, // 新页面标题栏
    //         "url": url, // 新页面地址
    //         "name": hash, // 单页打开 {name: 'home', title:'要买车', query: {serch : 's','test': '123','cmd': '111'}}
    //         "query": query, //  query信息
    //       
    // }
    //
    //////////
    Vue.prototype.openNewPage = function(request) {
      console.log('openNewPage');
      var URL = request.url ? request.url:getOpenUrl(request);
      if(Prius.isInsideApp && (+Prius.clientVersion.slice(0,3)) > 3) {
        Prius.openNewPage({
          title: request.title,
          linkUrl: URL
        });
        return;
      } else {
        if(request.url) {
          window.location.href = request.url;
        } else {
          this.$router.go(request);
        }
      }
    };

    //////////
    //
    // showLoadingDialog展示加载对话框
    //
    //////////
    Vue.prototype.showLoadingDialog = function(request) {

      if(!Prius.isInsideApp) return true;
      Prius.showLoadingDialog(request);
    };

    //////////
    //
    // hideLoadingDialog展示加载对话框
    //
    //////////
    Vue.prototype.hideLoadingDialog = function() {

      if(!Prius.isInsideApp) return false;
      Prius.hideLoadingDialog();
    };

    //////////
    //
    // showLoadingView展示加载对话框
    //
    //////////
    Vue.prototype.showLoadingView = function(request) {

      if(!Prius.isInsideApp) return true;

      Prius.showLoadingView(request);
    };

    //////////
    //
    // hideLoadingDialog展示加载对话框
    //
    //////////
    Vue.prototype.hideLoadingView = function() {

      if (!Prius.isInsideApp) return false;

      Prius.hideLoadingView();
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
    Vue.prototype.showToast = function(request) {
      var parameters = {};
      if("string" === typeof(request)) {
        parameters.msg = request;
      } else {
        parameters.msg = request.msg;
      }

      if(Prius.isInsideApp) {
        Prius.showToast(request);
      } else {
        var showHint = $('<span class="fadeInError show-toast">' + parameters.msg + '</span>');
        $body.append(showHint);

        setTimeout(function() {
          showHint.remove();
        },
        3500);
      }
      console.log($body);
    };

    //////////
    //
    // showAlert显示警告弹窗
    //
    // request:示例
    // {
    //        title : "title", // 弹窗标题.
    //        content : "msg", // 弹窗内容
    //        button1Name : "buttion1Title",
    //        button2Name : "buttion2Title",
    //        one2Success : function(){},
    // }
    //
    //////////
    Vue.prototype.showAlert = function(request) {
      var parameters = {
        title: request.title,
        content: request.content,
        button1Name: request.button1,
        button2Name: request.button2,
        one2Success: request.one2Success
      };

      if(Prius.isInsideApp) {
        Prius.showDialog(parameters);
      } else {
        showDialog(request);
      }
    };

    //////////
    //
    // gotoLoginPage 跳转登录页面.
    //
    // request: {
    //		success: function() {}	
    // }
    //
    //////////
    Vue.prototype.gotoLoginPage = function(request) {
      var parameters = {
        success: request.success
      };

      if(Prius.isInsideApp) {
        Prius.gotoLoginPage(parameters.success);
      } else {
        return true;
      }
    };

    //////////
    //
    // addIconMenu 向头部添加icon Menu.
    //
    // request:示例
    // {
    //    iconUrl: "http://....img",
    //		rule: {value: ("0" left), ("1", right)},
    //		listener: {
    //			onSuccess: function(data) {
    // 			},
    //			onFail: function(data) {
    // 			}
    // 		}
    // }
    // 
    //////////
    Vue.prototype.addIconMenu = function(request) {
      var parameters = {
        iconUrl: request.iconUrl,
        rule: request.rule
      };
      var listener = request.listener;

      if(Prius.isInsideApp) {
        Prius.addIconMenu(parameters, listener);
      } else {

        return true;
      }
    };

    //////////
    //
    // addTextMenu 向头部添加文字 Menu.
    //
    // request:示例
    // {
    //    text: "分享",
    //		rule: {value: ("0" left), ("1", right)},
    //		listener: {
    //			onSuccess: function(data) {
    // 			},
    //			onFail: function(data) {
    // 			}
    // 		}
    // }
    // 
    //////////
    Vue.prototype.addWordMenu = function(request) {

      var parameters = {
        word: request.word,
        rule: request.rule,
				fontColor: request.fontColor,
				fontSize: request.fontSize
      };
      var listener = request.listener;
			
      if(Prius.isInsideApp) {
        Prius.addWordMenu(parameters, {
          onSuccess: listener.onSuccess
        });
        return true;
      } else {

        return true;
      }
    }

    //////////
    //
    // addShareMenu 添加分享menu.
    //
    // request:示例
    // {
    //    title : '' // 分享标题.
    // 		content: '' // 分享内容描述.
    //		link: ''  // 分享链接地址.
    //		imgLink: // 分享标题图片.
    // }
    // 
    //////////
    Vue.prototype.addShareMenu = function(request) {

      var parameters = {
        title: request.title,
        content: request.content,
        link: request.link,
        imgLink: request.imgLink
      };

      if(Prius.isInsideApp) {

        Prius.addShareMenu(parameters);
      } else {

        return true;
      }
    };

    /////////
    //
    // 删除左边或者右边的所有的menu
    // 
    // request {
    // 	rule: {value: ("0" left), ("1", right)}
    // }
    /////////
    Vue.prototype.deleteMenu = function(request) {

      if(Prius.isInsideApp) {
        Prius.deleteMenu(request);
      } else {

        return false;
      }
    };

    //////////
    //
    // 设置tap切换头
    //
    // request:示例
    // {
    //        items : [
    //					{	
    //							tap: 'tap name', 
    //							url: 'tap 跳转URL',
    //							tapaction: function() {
    //								// tap点击回调.
    //								...
    //							}
    //					}
    //				],
    //        styles: {							
    //					headBackGround: "#f1f1f1",  // tap导航栏背景色.
    //					fontSize: "16",					// tap标题文字size.
    //					fontColor: "#666",				// tap标题文字color.
    //					activeColor: "#f0687d",	// tap选中状态文字color.
    //					activeBgColor: "#e21535" // tap选中状态背景color.
    //				}
    // }
    //
    //////////
    Vue.prototype.setTapHead = function(request) {
      var parameters = {
        items: request.items,
        styles: request.styles
      };

      if(Prius.isInsideApp) {
        Prius.setTapHead(parameters)
      } else {
        return true;
      }
      console.log("set tap head.");
    };

    //////////
    //
    // 设置list menu头
    //
    // request:示例
    // {
    //        items : [
    //					{	
    //							list: 'list name', 
    //							url: 'list 跳转URL',
    //							listaction: function() {
    //								// list点击回调.
    //								...
    //							}
    //					}
    //				],
    //        styles: {							
    //					headBackGround: "#f1f1f1",    // tap导航栏背景色.
    //					fontSize: "16",					  // tap标题文字size.
    //					fontColor: "#666",				// tap标题文字color.
    //					activeColor: "#f0687d",	  // tap选中状态文字color.
    //					activeBgColor: "#e21535"  // tap选中状态背景color.
    //				}
    // }
    //
    //////////
    Vue.prototype.setListHead = function(request) {

      var parameters = {
        items: request.items,
        styles: request.styles
      }

      if(Prius.isInsideApp) {
        Prius.setListHead(parameters)
      } else {

        return true;
      }
      console.log("set tap head.");
    };

    //////////
    //
    // setDocTitle 设置doc title.
    //
    // request:示例
    // {
    //         "title":"首页"
    // }
    //
    //////////
    Vue.prototype.setDocTitle = function(request) {

      var parameters = {};
      if("string" === typeof(request)) {
        parameters.title = request;
      } else {
        parameters.title = request.title;
      }

      if (Prius.isInsideApp) {
        Prius.setDocTitle(parameters);
      } else {
        return true;
      }
    };
		
		//////////
    //
    // gotoHomePage 回到首页.
    //
    // request:示例
    // {
    //         
    // }
    //
    //////////
		Vue.prototype.gotoHomePage = function() {
			console.log('go home');
			if (Prius.isInsideApp) {
        Prius.gotoHomePage();
      } else {
        this.$router.go('/');
      }		
		};
		
		//////////
    //
    // requireAuth唤起登录
    //
    // request:示例
    // {
		//   type: 0  // 0 验证码登录， 1 密码登录
		//   name: '',
		//   query: '',
		//   listener: {
    //         success:function(authInfo){
    //
    //         },
    //         error:function(error){
    //
    //         },
    //         cancel:function(error){
    //
    //         }
		//   }
    // }
		Vue.prototype.requireAuth = function(request) {
			var H5_parameters = {
				name: request.name,
				query: request.query
			};
			var N_parameters = {
				type: request.type,
				listener: request.listener
			};
			
			if(Prius.isInsideApp && (+Prius.clientVersion.slice(0,3)) > 3) {
				Prius.gotoLoginPage(N_parameters);
			}else {
				this.$router.replace(H5_parameters);
			}
		};
		
		//////////
    //
    // getAuthInfo获取授权信息
    //
    // request:示例
    // {
    //         success:function(authinfo){
    //
    //         },
    //         error:function(error){
    //
    //         },
    //         cancel:function(error){
    //
    //         }
    // }
    //
    // authinfo 示例:
    //    {
    //        "email":null,
    //        "id":0,
    //        "mobilePhone":null,
    //        "name":null,
    //        "sex":null,
    //        "accountType":null,
    //        "token":null,
    //        "tokenInvalidTime":null,
    //        "lastLoginTimestamp":null
    //    };
    //
    //////////
    Vue.prototype.getAuthInfo = function (request) {
        console.log("getAuthInfo");

        var clientCall = {
            onSuccess: request.onSuccess,
            onFail: request.onFail,
            onCancel: request.onCancel
        };
        Prius.login(clientCall);
    };
		
		//////////
		// 
		// 跳转到个人中心.
		//
		//////////
		Vue.prototype.requireAuthCenter = function(request) {
			var parameters = {
				name: request.name,
				query: request.query
			};
			if(Prius.isInsideApp) {
				Prius.gotoMyInfoPage();
			}else {
				this.$router.go(parameters);
			}
		};
		
		/////////
		// * 页面属性修改
		// * @param request request
		// * request:
		// * {
		// *  title: "这是页面标题",
		// *  pageId: "这是页面标识",
		// *  backPageId: "这是回退页面标识",
		// *  lastPageId: "这是上一个页面标识",
		// *  background: "页面背景颜色 #000000， #FFFFFF",
		// * }
		//////////
		Vue.prototype.sendPageRequest = function(request) {
			
			if(Prius.isInsideApp) {
				Prius.sendPageRequest(request)
			}
		};
		
		//////////
		//
		// 会退到上一个页面
		//
		//////////
		Vue.prototype.rollbackPreviousPage = function() {
			console.log('rollback previous page');
			if(Prius.isInsideApp) {
				Prius.goBackToPage();
			}
		};
		
		//////////
		//
		// hideBackMenu 隐藏返回按钮.
		//
		//
		//////////
		Vue.prototype.hideBackMenu = function (request) {
			console.log('hide back menu');
			if(Prius.isInsideApp) {
				Prius.hideBackMenu();
			}else {
				return false;
			}	
		};
		//////////
    //
    // showShareWindow展示分享视图
    //
    // request:示例
    // {
    //        "content":content,
    //        "title":title,
		//				"link": link,
		//				"imgLink": imgLink,
		//				"listener": {
    //        	"success":function(){},
    //        	"error":function(){},
    //        	"cancel":function(){}
		//				}
    // }
    //
    //////////
    Vue.prototype.showShareWindow = function (request) {
			var parameters = {
				"title": request.title,
				"content": request.content,
				"link": request.link,
				"imgLink": request.imgLink
			};
			if(request.type && request.productId){
				parameters.type = request.type;
				parameters.originId = request.productId;
			}
			if(Prius.isInsideApp){
				Prius.shareInfoWithImg(parameters);
			}
    };
    //////////
    //
    // 重写v-link 方法.
    //
    // 示例：
    // <a v-linkurl="{name: 'home', title: '首页', query: {s:1,q:2}}"></a>
    // 
    //
    //////////
    Vue.directive('linkurl', {
      priority: onPriority - 2,
      bind: function bind() {
        var vm = this.vm;
        /* istanbul ignore if */
        if(!vm.$route) {
          warn$1('v-link can only be used inside a router-enabled app.');
          return;
        }
        this.router = vm.$route.router;
        // update things when the route changes
        this.unwatch = vm.$watch('$route', _bind(this.onRouteUpdate, this));
        // check v-link-active ids
        var activeIds = this.el.getAttribute(LINK_UPDATE);
        if(activeIds) {
          this.el.removeAttribute(LINK_UPDATE);
          this.activeIds = activeIds.split(',');
        }
        // no need to handle click if link expects to be opened
        // in a new window/tab.
        /* istanbul ignore if */
        if(this.el.tagName === 'A' && this.el.getAttribute('target') === '_blank') {
          return;
        }
        // handle click
        this.handler = _bind(this.onClick, this);
        this.el.addEventListener('click', this.handler);
      },

      update: function update(target) {
        this.target = target;
        if(isObject(target)) {
          this.append = target.append;
          this.exact = target.exact;
          this.prevActiveClass = this.activeClass;
          this.activeClass = target.activeClass;
        }
        this.onRouteUpdate(this.vm.$route);
      },

      onClick: function onClick(e) {
        // don't redirect with control keys
        /* istanbul ignore if */
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        // don't redirect when preventDefault called
        /* istanbul ignore if */
        if (e.defaultPrevented) return;
        // don't redirect on right click
        /* istanbul ignore if */
        if (e.button !== 0) return;

        var target = this.target;
        if(target) {
          // v-link with expression, just go
          if(Prius.isInsideApp && (+Prius.clientVersion.slice(0,3)) > 3) {
            var URL = getOpenUrl(target);
            Prius.openNewPage({
              title: target.title,
              linkUrl: URL
            });

            return;

          } else {
            e.preventDefault();
            if (target.url) {
              window.location.href = target.url;
            }
            this.router.go(target);
          }
        } else {
          // no expression, delegate for an <a> inside
          var el = e.target;
          while (el.tagName !== 'A' && el !== this.el) {
            el = el.parentNode;
          }
          if(el.tagName === 'A' && sameOrigin(el)) {
            e.preventDefault();
            var path = el.pathname;
            if(this.router.history.root) {
              path = path.replace(this.router.history.rootRE, '');
            }
            this.router.go({
              path: path,
              replace: target && target.replace,
              append: target && target.append
            });
          }
        }
      },

      onRouteUpdate: function onRouteUpdate(route) {
        // router.stringifyPath is dependent on current route
        // and needs to be called again whenver route changes.
        var newPath = this.router.stringifyPath(this.target);
        if(this.path !== newPath) {
          this.path = newPath;
          this.updateActiveMatch();
          // 避免个a标签添加href属性.
					if(!Prius.isInsideApp || (+Prius.clientVersion.slice(0,3)) <= 3) {
						this.updateHref()
					}
        }
        if(this.activeIds) {
          this.vm.$emit(LINK_UPDATE, this, route.path);
        } else {
          this.updateClasses(route.path, this.el);
        }
      },

      updateActiveMatch: function updateActiveMatch() {
        this.activeRE = this.path && !this.exact ? new RegExp('^' + this.path.replace(/\/$/, '').replace(queryStringRE, '').replace(regexEscapeRE, '\\$&') + '(\\/|$)') : null;
      },

      updateHref: function updateHref() {
        if (this.el.tagName !== 'A') {
          return;
        }
        var path = this.path;
        var router = this.router;
        var isAbsolute = path.charAt(0) === '/';
        // do not format non-hash relative paths
        var href = path && (router.mode === 'hash' || isAbsolute) ? router.history.formatPath(path, this.append) : path;
        if(href) {
          this.el.href = href;
        } else {
          this.el.removeAttribute('href');
        }
      },

      updateClasses: function updateClasses(path, el) {
        var activeClass = this.activeClass || this.router._linkActiveClass;
        // clear old class
        if(this.prevActiveClass && this.prevActiveClass !== activeClass) {
          toggleClasses(el, this.prevActiveClass, removeClass);
        }
        // remove query string before matching
        var dest = this.path.replace(queryStringRE, '');
        path = path.replace(queryStringRE, '');
        // add new class
        if(this.exact) {
          if (dest === path ||
          // also allow additional trailing slash
          dest.charAt(dest.length - 1) !== '/' && dest === path.replace(trailingSlashRE, '')) {
            toggleClasses(el, activeClass, addClass);
          } else {
            toggleClasses(el, activeClass, removeClass);
          }
        } else {
          if(this.activeRE && this.activeRE.test(path)) {
            toggleClasses(el, activeClass, addClass);
          } else {
            toggleClasses(el, activeClass, removeClass);
          }
        }
      },

      unbind: function unbind() {
        this.el.removeEventListener('click', this.handler);
        this.unwatch && this.unwatch();
      }
    })
  }

  function sameOrigin(link) {
    return link.protocol === location.protocol && link.hostname === location.hostname && link.port === location.port;
  }

  function getOpenUrl(value) {
    if (!value) return;
		// 离线判断.
    var linkHost = window.location.origin === 'file://'? 'file://'+window.location.pathname+'#/': window.location.host + '/#/';
    var str = [];
    var count = 0;
    for (var key in value.query) {
      console.log(key);
      console.log(value.query[key]);
      str[count] = key + '=' + value.query[key];
      count++;
    }
    console.log(str.join('&'));
    var openNewUrl = window.location.origin === 'file://' 
			? linkHost + value.name + '?' + str.join('&') 
			: window.location.protocol + '//' + linkHost + value.name + '?' + str.join('&');

    if (value.url) {
      return value.url;
    } else {

      return openNewUrl;
    }
  }

  // this function is copied from v-bind:class implementation until
  // we properly expose it...
  function toggleClasses(el, key, fn) {
    key = key.trim();
    if (key.indexOf(' ') === -1) {
      fn(el, key);
      return;
    }
    var keys = key.split(/\s+/);
    for (var i = 0,
    l = keys.length; i < l; i++) {
      fn(el, keys[i]);
    }
  }

  // showDialog
  function showDialog(request) {
    var parameters = {
      title: request.title,
      content: request.content,
      button1: request.button1,
      button1action: request.button1action,
      button2: request.button2,
      button2action: request.button2action
    };
    var button = '';
    if ((!parameters.button1action || "string" === typeof parameters.button1action) && (!parameters.button2action || "string" === typeof parameters.button2action)) {
      //都是字符型/没定义，那么用show/alert来执行，这种方式不需要webView上下文
      button += '<a href="javascript:;" data-close="1" class="weui-dialog__btn weui-dialog__btn_primary">知道了</a>';
    } else {
      button += [' <a href="javascript:;" data-close="1" class="weui-dialog__btn weui-dialog__btn_default">' + parameters.button1 + '</a>', '<a href="javascript:;" data-button2="2" class="weui-dialog__btn weui-dialog__btn_primary">' + parameters.button2 + '</a>'].join("");
    }

    var DIALOG_STR = $(['<div class="js_dialog">', '<div class="weui-mask"></div>', '<div class="weui-dialog">', '<div class="weui-dialog__hd"><strong class="weui-dialog__title">' + parameters.title + '</strong></div>', '<div class="weui-dialog__bd">' + parameters.content + '</div>', '<div class="weui-dialog__ft">', button, '</div>', '</div>', '</div>'].join(""));

    var button1fun = parameters.button1action;
    var button2fun = parameters.button2action;

    $body.append(DIALOG_STR);

    if (button2fun && button2fun !== "string") {
      $('[data-button2]').bind('click',
      function() {
        button2fun();
        setTimeout(function() {
          DIALOG_STR.remove();
        });
      });
    }

    $('[data-close]').bind('click',
    function() {
      DIALOG_STR.remove();
    });

  }

  if (typeof exports == "object") {
    module.exports = vueJsbridge;
  } else if (typeof define == "function" && define.amd) {
    define([],
    function() {
      return vueJsbridge;
    })
  } else if (window.Vue) {
    window.vueJsbridge = vueJsbridge;
    Vue.use(vueJsbridge);
  }
})();