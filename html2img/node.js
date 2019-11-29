var http = require('http');
var path = require('path');
var fs = require('fs');
os   = require('os');

function getIPv4(){
    var interfaces = os.networkInterfaces();//获取网络接口列表
    var ipv4s = [];//同一接口可能有不止一个IP4v地址，所以用数组存

    Object.keys(interfaces).forEach(function (key){
        interfaces[key].forEach(function (item){

            //跳过IPv6 和 '127.0.0.1'
            if ( 'IPv4' !== item.family || item.internal !== false )return;

            ipv4s.push(item.address);//可用的ipv4s加入数组
            console.log(key+'--'+item.address);
        })        
    })

    return ipv4s[0];//返回一个可用的即可
}
let mime={
 '.js':'application/javascript',
 '.css':'text/css',
'.html' : 'text/html;charset=utf-8'
}
http.createServer((req,res)=>{// 发送 HTTP 头部
// HTTP 状态值: 200 : OK
// 内容类型: text/plain
if(req.url==="/"){
  //设置编码
  res.setHeader('Content-Type','text/html;charset=utf-8');
  fs.createReadStream('index.html').pipe(res);
 }else{

     if(req.url.indexOf('?') > -1){
        req.url = req.url.slice(0,req.url.indexOf('?'))
     }

  if(fs.existsSync(`.${req.url}`)) {
   res.setHeader('Content-Type',mime[req.url.match(/\.\w+$/)[0]] +';charset=utf-8');
   fs.createReadStream(`.${req.url}`).pipe(res);
  }else{

   res.statusCode=404;
    res.end();
  }
 }

}).listen(8484,()=>{
  console.log('服务已启动');
});

// 终端打印如下信息
console.log('Server running at '+getIPv4()+':8484');
