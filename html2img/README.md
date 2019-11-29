## 运行

node node.js

## 运行地址

http://172.16.16.39:8484

## 对应的代码
[html转img](http://172.16.16.39:8484)
[img转base64和base64转img](http://172.16.16.39:8484/base64tofile.html)
[长按生成图片](http://172.16.16.39:8484/longpress.html)

## 应用场景

> 后端需要前端页面生成图片的时候
> 需要将前端html生成图片便于客户长按保存

## 将base64转化成图片文件格式

> 1. 通过new File()将 base64 转换成 file 文件，此方式需考虑ios11.4以下的系统浏览器兼容问题。

```javascript
    function base64ToFile(base64, fileName) {
        var arr = base64.split(','),
	        mime = arr[0].match(/:(.*?);/)[1],
	        bstr = atob(arr[1]),
	        n = bstr.length,
	        u8arr = new Uint8Array(n);
	    while (n--) {
	        u8arr[n] = bstr.charCodeAt(n);
	    }
	    return new File([u8arr], filename, { type: mime });
    }
    //调用
    var file = base64ToFile(base64Data, imgName);

```

> 2.先将base64转换成blob，再将blob转换成file文件，此方法不存在浏览器不兼容问题。

```javascript
    //将base64转换为blob
    function base64ToBlob(base64) {
        var arr = base64.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    //将blob转换为file
    function blobToFile(theBlob, fileName) {
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
    }
    //调用
    var blob = base64ToBlob(base64Data);
    var file = blobToFile(blob, imgName);
```
## 将图片文件格式转化成base64格式

> 方法1将图片的url地址生成图片画到canvas上面通过canvas.toDataURL的方法

```javascript
    function getBase64(url, callback){
        //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
        var Img = new Image(),
        dataURL='';
        Img.src=url;
        Img.onload=function(){ //要先确保图片完整获取到，这是个异步事件
            var canvas = document.createElement("canvas"), //创建canvas元素
                width=Img.width, //确保canvas的尺寸和图片一样
                height=Img.height;
                canvas.width=width;
                canvas.height=height;
                canvas.getContext("2d").drawImage(Img,0,0,width,height); //将图片绘制到canvas中
                dataURL=canvas.toDataURL('image/png'); //转换图片为dataURL
                callback?callback(dataURL):null; //调用回调函数
        };
    }

    getBase64('//upload.jianshu.io/users/upload_avatars/555630/fdd1b798e6b0.jpg',(dataURL)=>{
        console.log(dataURL);
    });
```
> 使用FileReader对象的readAsDataURL方法生成base64

```javascript
    // 将fiel文件转化为base64
    function fileToBase64(file, callback) {
        var reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = function(e){
            // 这里e.target和this指向的都是reader这个对象
            console.log(e.target)
            console.log(this)
            callback? callback(this.result) : null
        }
    }
    // 方法调用
    fileToBase64(file,(newBase64)=>{
        console.log('新的base64',newBase64)
    })
```