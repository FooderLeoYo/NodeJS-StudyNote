# Node中的JS

---

## 目录

[读写文件](#jump1)

[创建一个简单的http服务器](#jump2)

[核心模块](#jump3)

---	

<span id="jump1"></span>

## 读写文件

### 写文件fs.writeFile

```
fs.writeFile('文件路径',data,[options],function(err) {
	if(err) {
		// do something
	}
	// do something
})
```

第一个参数：文件路径

第二个参数：文件内容

第三个参数：回调函数

回调函数包含一个参数err：	
成功	
err：null	
失败	
err：错误对象

### 读文件fs.readFile

```
fs.readFile('文件路径', function(err, data) {
	if(err) {
		// do something
	}else {
		// do something with data
	}
})
```

第一个参数：要读取的文件路径

第二个参数：一个回调函数

回调函数包含两个参数data和err：

data默认是二进制数据，可以通过.toString转为用户能识别的字符串

成功	
data：数据	
erro：null	
失败	
data：null	
error：错误对象	

---	

<span id="jump2"></span>

## 创建一个简单的http服务器	
### http模块	
在node中专门提供了http模块，帮助编写服务器	
步骤：	
1. 加载http核心模块	
```
var http = require('http')
```	
2. 创建一个服务器实例	
``` 
var server = http.createServer()
```		
3. 注册request请求事件	
当客户端请求发送过来，就会触发服务器的request事件，然后执行回调函数		
回调函数需要接收两个参数：	
1. request请求对象：用来获取客户端的一些请求信息，例如请求路径	
2. response响应对象：用来给客户端发送响应信息	
response对象有一个write方法，可以用来给客户端发送数据	
write方法可以使用多次，但最后一次使用后一定要用end来结束相应，否则客户端会一直等待

```
server.on('request', function(req, res) {
	console.log('浏览器的请求已收到，路径为：' + req.url)
	
	res.write('服务器发送的数据1')
	res.write('服务器发送的数据2')

	res.end()
})
```		
4. 绑定端口号，启动服务器	
```
server.listen(3000, function() {
	console.log('服务器启动成功')
})
```

但是一般直接在end的同时，发送数据。例如：res.end('数据')

响应内容只能是二进制数据或者字符串，因此其他类型的数据要进行类型转换

```
res.end(JSON.stringify(products))
```

---

<span id="jump3"></span>

## 模块

### 核心模块

Node为js提供了很多服务器级别的API，这些API绝大多数都被包装到一个具名的核心模块中

如：fs、http、path、os等

使用这些核心前，必须先require并赋给一个新建变量，例如：var fs =require('fs')

### 模块作用域

在node中， 没有全局作用域只有模块作用域

模块内外部之间不能相互访问

### require和exports

#### require

require方法有两个作用：

1. 加载文件模块并执行里面的代码

2. 拿到被加载模块导出的接口对象

#### exports

在每个模块中都提供了一个exports对象，默认为空

你要做的就是把所有需要被外部访问的成员挂载到这个exports对象中
