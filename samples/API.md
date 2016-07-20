# API 文档

- [API](#API)
  - [`<setNativeHead>`](#setNativeHead)
  - [`<showOptionMenu>`](#showOptionMenu)
  - [`<hideOptionMenu>`](#hideOptionMenu)
  - [`<openNewPage>`](#openNewPage)
  - [`<showDialog>`](#showDialog)
  - [`<showToast>`](#showToast)
  - [`<showLoadingView>`](#showLoadingView)
		
## 调用方式  
	npm install ymc-hybridui
	
	
	CMD调用方式
	Hybridui = request('ymc-hybridui')
	
	内联调用
	<script src="../dist/js/ymc.hybridui.js"></script>
	
## API

##### `<setNativeHead>`
向页面添加头部导航条
```js
	//////////
	//
	// addNativeHead 向页面添加头部导航条.
	//
	// request:示例
	// {
	//        "title":title,  // title
	//        "bgcolor":backgroundColor, // head 背景色
	//        "docheight":"40", // head高度
	//				"hash": "demo" // 页面唯一标示，必填，作为判断页面回退的依据
	//          
	// }
	//
	//////////
	
	Hybridui.setNativeHead({
		"title": "setNativeHead",
		"hash": "Demo"
	});
```

##### `<showOptionMenu>`
showOptionMenu展示右侧按钮
```js
	//////////
	//
	// showOptionMenu展示右侧按钮
	//
	// request:示例
	// {
	//    inner: "分享", // 按钮内容
	//		hash: "demo", // 页面唯一标示
	//		success: function() { // 回调
	//			alert("分享");
	//		}
	//		
	// }
	//
	//////////
	
	Hybridui.showOptionMenu({
		inner: "分享",
		hash: "Demo",
		success: function() {
			alert("分享");
		}
	});
```

##### `<hideOptionMenu>`

hideOptionMenu隐藏导航菜单

```js
	//////////
	//
	// hideOptionMenu
	//
	//
	//////////
	
	Hybridui.hideOptionMenu();
```

##### `<openNewPage>`

openNewPage

```js
	//////////
	//
	// openNewPage打开新页面
	//
	// request:示例
	// {
	//         "linkUrl": linkurl, // 打开页面url
	//         "hash": 'hash', // 页面唯一标示
	//         "title":title
	// }
	//
	//////////
	
	Hybridui.openNewPage({
		title: "openPage",
		linkUrl: "openPage.html",
		hash: "openPage"
	});
```
##### `<showDialog>`

showDialog

```js
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
	
	Hybridui.showDialog({
		"title": "showDialog",
		"msg": "你是否还会牵挂我 我最亲爱的朋友啊 当我决定放下所有 走上去自由的路 你是否还会陪着我 你是否还会陪着我 我最思念的亲人啊 ",
		"button1": "去支付",
		"button1action": function() {
			alert('131');
		}
	});
```

##### `<showToast>`

showToast显示toast提示

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
	
	Hybridui.showToast({
		"msg": "showToast"
	});
```

##### `<showLoadingView>`

showLoadingView展示加载动画

```js
	//////////
	//
	// showLoadingView展示加载动画
	// request:示例
	// { 
	//   msg : "msg"
	// }
	//////////
	
	Hybridui.showLoadingView({
		"msg": "数据加载中"
	});
```
##### `<showLoadingView>`

```js
	//////////
	//
	// hideLoadingView隐藏加载动画
	//
	//////////	
	
	Hybridui.hideLoadingView();
```


