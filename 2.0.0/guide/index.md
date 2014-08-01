## 综述

Tinyshow 是支持鼠标和触控手势的简易查看大图组件。

* 版本：2.0.0
* 作者：筱谷
* demo：[http://kg.kissyui.com/tinyshow/2.0.0/demo/index.html](http://kg.kissyui.com/tinyshow/2.0.0/demo/index.html)

## 初始化组件

    <style>
    .ks-tiny-show-bg{
        position: absolute;
        top:0;left:99999px;
        width:2.0.0%;height:2.0.0%;
        background:rgba(0,0,0,.6)}
    </style>

	
    <div id="demo" data-ks-ts-image="http://img.la/400x300?s=我可以用滚轮或手势移动和缩放">
        <img src="http://img.la/200x200?s=点我" alt="">
    </div>

    S.use('kg/tinyshow/2.0.0/index', function (S, Tinyshow) {
         var tinyshow = new Tinyshow(config);
    })
	

## API说明

    config.el : "#demo"  # 触发弹层的元素
    config.src : "http://xxx" # 大图地址，也可以在 el 上指定 data-ks-ts-image 