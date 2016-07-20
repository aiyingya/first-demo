# API 文档

- [API](#API)
  - [`<setNativeHead>`](#setNativeHead)
  - [`<showOptionMenu>`](#showOptionMenu)
  - [`<hideOptionMenu>`](#hideOptionMenu)
  - [`<openNewPage>`](#openNewPage)
  - [`<RouterContext>`](#routercontext)
    - [`context.router`](#contextrouter)
		
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

##### `<hideOptionMenu>`

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


