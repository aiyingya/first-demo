
# Vue-jsBridge

	Vue单页框架与Native交互控制器。	
	
	Notes:
	所有api调用时传入的参数值都必须使用字符串（特别说明的除外）
	
-	Version 1.0.0
	1. 增加 v-linkurl方法
	2. 增加 checkInsideApp方法
	3. 增加 openNewPage方法
	4. 增加 showLoadingDialog展示加载对话框
	5. 增加 hideLoadingDialog隐藏加载对话框
	6. 增加 showLoadingView展示加载对话框
	7. 增加 hideLoadingView隐藏加载对话框
	
- Version 1.1.0
	1. 增加 showToast 方法
	2. 增加 showAlert 方法
	3. 增加 gotoLoginPage 方法
	4. 增加 addIconMenu 方法
	5. 增加 addWordMenu 方法
	6. 增加 addShareMenu 方法
	7. 增加 deleteMenu 方法

- Version 1.1.8
	1. 解决安卓兼容性BUg
	
- Version 1.1.9
	1. 增加 setTapHead 方法
	2. 增加 setListHead 方法
	2. 增加 setDocTitle 方法
	
- Version 1.2.7
	1. 修改addWordMenu方法，增加可配置color&size参数

- Version 1.2.8
	1. 增加离线包跳转判断
	
- Version 1.3.0
	1. 增加 gotoHomePage 方法
	
- Version 1.3.1
	1. 增加版本判断，在V3.1.0以下的版本， checkInsideApp返回的值为false

- Version 1.3.2
	1. 增加 requireAuth 方法
	
- Version 1.3.5
	1. 修改v-linkurl方法，使其兼容3.1.0版本以下APP版本.
	
- Version 1.3.11
	1. 增加 requireAuthCenter 方法

- Version 1.3.22
	1. 增加 rollbackPreviousPage 方法
	
- Version 1.3.23
	1. 增加 hideBackMenu 方法
	
- Version 1.3.27
	1. 增加 showShareWindow 方法
	
- [API](#API)
  - [`<v-linkurl>`](#v-linkurl)
  - [`<checkInsideApp>`](#checkInsideApp)
  - [`<openNewPage>`](#openNewPage)
  - [`<showLoadingView>`](#showLoadingView)
  - [`<hideLoadingView>`](#hideLoadingView)
  - [`<showLoadingDialog>`](#showLoadingDialog)
  - [`<hideLoadingDialog>`](#hideLoadingDialog)
  - [`<showToast>`](#showToast)
  - [`<showAlert>`](#showAlert)
  - [`<gotoLoginPage>`](#gotoLoginPage)
  - [`<addIconMenu>`](#addIconMenu)
  - [`<addWordMenu>`](#addWordMenu)
  - [`<addShareMenu>`](#addShareMenu)
  - [`<deleteMenu>`](#deleteMenu)
  - [`<setTapHead>`](#setTapHead)
  - [`<setListHead>`](#setListHead)
  - [`<setDocTitle>`](#setDocTitle)
  - [`<gotoHomePage>`](#gotoHomePage)
  - [`<requireAuth>`](#requireAuth)
  - [`<requireAuthCenter>`](#requireAuthCenter)
  - [`<rollbackPreviousPage>`](#rollbackPreviousPage)
  - [`<hideBackMenu>`](#hideBackMenu)
  - [`<showShareWindow>`](#showShareWindow)
		
## 调用方式  

>	npm install vue-jsbridge
>	
>	Vue调用方式
>
>	var vueBridge = require('vue-jsbridge');
>
>	Vue.use(vueBridge);
	
## API

##### `<v-linkurl>`

>	重写vuejs的v-link方法，业务端无需判断环境，直接使用，使用方法和v-link差不多，不过v-linkurl加了一个必传参数
>
>	其中 title是必传参数 它是作为Native头部的标题栏用， name和url必传其一，name是跳转的hash, url是跳转的url
>
>	有url的时候 优先url作为跳转


```js

// v-linkurl 页面间的跳转方法.
// request:示例

//v-linkurl的用法：	 
<a v-linkurl="{name: 'home', query: {},title: '首页',url: 'http://xxxx'}">XXX</a>

```

##### `<checkInsideApp>`

>	checkInsideApp 判断是否在APP内 全站方法，返回 true 和 false
>	
>	要求是在所有的H5头部都加上该判断.
	
```js
//////////
//
// checkInsideApp
//
// request:示例
//
//////////

<header v-if="checkInsideApp">title</header>

console.log(this.checkInsideApp);


```

##### `<openNewPage>`

>
>	openNewPage打开新页面,和v-linkurl差不多，考虑到有的地方是@click时间，所以加了这个方法。

```js
//////////
//
// openNewPage打开新页面
//
// request:示例
// {
//       "name": 'home', // hash
//       "title": '首页', // 页面标题
//       "query": {},
//       "url": 'http://xxx'
// }
//
//////////

this.openNewPage({
	name: 'home',
	query: {w:1},
	title: '首页'
})
```

##### `<showLoadingView>`

>
>	showLoadingView 加载loadling页面 不在APP内时 返回 true,在APP内会调出APP的loadingView
	

```js
//////////
//
// showLoadingView打开loading
//
// request:示例
// 
//
//////////

this.showLoadingView();

```
##### `<hideLoadingView>`

>
>	hideLoadingView 隐藏loadingView 不在APP返回false

```js
//////////
//
// showLoadingView隐藏loading
//
//
//////////

this.hideLoadingView();

```

##### `<showLoadingDialog>`

>
>	showLoadingDialog 加载loadling页面 不在APP内时 返回 true,在APP内会调出APP的loadingView
	

```js
//////////
//
// showLoadingDialog打开loadingDialog
//
// request:示例
// 
//
//////////

this.showLoadingDialog();

```
##### `<hideLoadingView>`

>
>	hideLoadingView 隐藏loadingView 不在APP返回false

```js
//////////
//
// showLoadingDialog隐藏loadingDialog
//
//
//////////

this.showLoadingDialog();

```

##### `<showToast>`

> showToast显示toast提示
>
> 需要引入css vue-jsbridge.css

```js
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

this.showToast({
	"msg": "showToast"
});

```

##### `<showAlert>`

> showAlert 弹出alert提示
>
> 需要引入css vue-jsbridge.css

```js
//////////
//
// showAlert 弹出alert提示
//
// title : "title",
// content : "msg",
// button1 : "buttion1Title",
// button1action: function(){},//action支持传scheme或者方法
// button2 : "buttion2Title",
// button2action : function(){},
//
//////////

this.showAlert({
	"title": "提示"
	"msg": "showToast"
});

```

##### `<gotoLoginPage>`

>
> gotoLoginPage 跳转到登录页
>

```js
//////////
//
// gotoLoginPage 
//
//
//////////

this.gotoLoginPage({
	success: function() {
		// 跳转成功后回调
		...
	}
});

```

##### `<addIconMenu>`

>
> addIconMenu 添加icon menu
>

```js
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

this.addIconMenu({
	iconUrl: "http://....img",
	rule: "1"
});

```

##### `<addWordMenu>`

>
> addWordMenu 添加文字 menu
>

```js
//////////
//
// addWordMenu 向头部添加文字 Menu.
//
// request:示例
// {
//    word: "常见问题",
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

this.addWordMenu({
	word: "常见问题",
	rule: "1",
	listener: {
		onSuccess: function() {
			this.openNewPage({...})
		}
	}
	
});

```

##### `<addShareMenu>`

>
> addShareMenu 添加分享 menu
>

```js
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

this.addShareMenu({
	title: '分享',
	content: 'testtestetsteststtetstststetststtettstststetstststt',
	link: window.location.href,
	imgLink: ''
})

```

##### `<deleteMenu>`

> deleteMenu 删除 menu
>
> 在执行addMenu的时候 先要执行 deleteMenu，这可能是Native 的一个bug.

```js
/////////
//
// 删除左边或者右边的所有的menu
// 
// request {
// 	rule: {value: ("0" left), ("1", right)}
// }
/////////

var _this = this;
_this.deleteMenu({
	rule: "1"
});
_this.addShareMenu({
	title: '分享',
	content: 'testtestetsteststtetstststetststtettstststetstststt',
	link: window.location.href,
	imgLink: ''
});

```

##### `<setTapHead>`

> 
> setTapHead 设置标题栏为tap切换
> 

```js
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

var _this = this;
_this.setTapHead({
	items: [
		{
			tap: "商品",
			tapaction: function() {
				_this.showToast('1')
			}
		},
		{
			tap: "详情",
			tapaction: function() {
				_this.showToast('2')
			},
			active: 1
		},
		{
			tap: "评价",
			tapaction: function() {
				_this.showToast('3')
			}
		}
	],
	styles: {
		headBackGround: "#242930",
		fontSize: "14",
		fontColor: "#ffffff",
		activeColor: "#c9051c",
		activeBgColor: "#c9051c"
	}
});

```

##### `<setListHead>`

> 
> setListHead 设置标题栏为list menu
> 

```js
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
//					fontSize: "16",					  // menu标题文字size.
//					fontColor: "#666",				// meun标题文字color.
//					activeColor: "#f0687d",	  // menu选中状态文字color.
//					activeBgColor: "#e21535"  // menu选中状态背景color.
//				}
// }
//
//////////

this.setListHead({
	items: [
		{
			list: "商品",
			listaction: function() {
				_this.showToast('1')
			}
		},
		{
			list: "详情",
			listaction: function() {
				_this.showToast('2')
			},
			active: 1
		},
		{
			list: "评价",
			listaction: function() {
				_this.showToast('3')
			}
		}
	],
	styles: {
		headBackGround: "#242930",
		fontSize: "14",
		fontColor: "#ffffff",
		activeColor: "#c9051c",
		activeBgColor: "#c9051c"
	}
});

```

##### `<setDocTitle>`

> 
> setDocTitle 设置标题栏 doctitle
> 

```js
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

this.setDocTitle({
	title: '首页'
})

```

##### `<gotoHomePage>`

> 
> gotoHomePage 跳转到首页
> 

```js
//////////
//
// gotoHomePage .
//
//
//////////

this.gotoHomePage();

```

##### `<requireAuth>`

> 
> requireAuth 唤起登录页
> 

```js
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

this.requireAuth({
	type: 0,
	name: '_smslogin',
	query: {
		productid: xxxx
	},
	listener: {
		onSuccess: function{
			// 登录成功后回调
			...
		}
	}
});

```

#### `<requireAuthCenter>`

> 
> requireAuthCenter 跳转到个人中心.
> 

```js
this.requireAuthCenter({
	name: '',
	query: ''
})
```


#### `<shareInfoWithImg>`

> 
> shareInfoWithImg 唤起分享.
> 

```js
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

this.showShareWindow({
	"content":content,
	"title":title,
	"link": link,
	"imgLink": imgLink
})

```