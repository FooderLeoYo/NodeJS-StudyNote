# Web服务器开发

---

## 目录

[地址和端口](#jump4)

[响应内容类型](#jump5)
                      
[在node中使用模板引擎](#jump6)

[客户端渲染和服务端渲染](#jump7)

[处理网站中的静态资源](#jump8)

[处理表单](#jump9)

[综合案例：留言板](#jump10)

---	

<span id="jump4"></span>

## 地址和端口

IP地址用来定位计算机

端口号用来定位具体的应用程序，所有需要联网通信的应用程序都会占用一个端口号；

服务器和请求方都需要知道对方的IP地址和端口号

---

<span id="jump5"></span>

## 响应内容类型Content-tye

### 编码类型charset

在服务端默认发送的数据时utf8编码的内容，但是浏览器并不知道，就会按照当前操作系统的默认编码去解析

因此中文内容就会变成乱码，解决办法是通过Content-tye，告知浏览器编码类型

```
server.on('request', function(req, res) {
	res.setHeader('Content-tye', 'text/plain; charset=utf-8')
	res.end('这样中文就不会乱码了')
})
```

图片不需要指明编码类型

### 内容类型

可在以下表格中查询不同的资源类型对应的Mime-type

[HTTP Mime-type对照表](https://tool.oschina.net/commons)

---

<span id="jump6"></span>
## 在node中使用模板引擎

### 通过实现仿Apache目录列表，认识模板引擎的使用方法

#### 第一步：通过fs.readdir，得到目录列表中的文件名和目录名

注意路径中的斜杠必须是/而不能是\

例子：

```
fs.readdir('D:/Movie/www', function (err, files) {
  if (err) {
    return console.log('目录不存在')
  }
  console.log(files)
})
```

console的结果就是D:/Movie/www目录下所有的文件夹、文件

#### 第二步：使用模板引擎将得到的文件名和目录名渲染到 template.html 中

  1 安装：npm i art-template

  2 导入：var template = require('art-template')

  3 使用render方法将需要替换的内容渲染到模板html中：

render()有两个参数，第一个是模板html数据，第二个是供替换的内容，例如：

```
var htmlStr = template.render(data.toString(), {
	title: '标题',
	file: files
})
```

两个注意点：

1. data是二进制数据，要使用toString转成字符串

2. title、file是在模板html文件中被替换部分的特殊标记

成品：

[简单的仿Apache目录列表](https://github.com/FooderLeoYo/Nodejs-StudyNote/tree/master/assets/projects/%E7%AE%80%E5%8D%95%E7%9A%84%E4%BB%BFApache%E7%9B%AE%E5%BD%95%E5%88%97%E8%A1%A8)

### 替换内容可以单独抽离出来，实现替换较多的内容

js文件中：

```
// 抽离出替换内容
var comments = [
  {
    name: '张三',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  },
  {
    name: '张三2',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  }
]
// 将替换内容渲染到模板中
fs.readFile('./views/template.html', function (err, data) {
	if (err) {
	  return res.end('404 Not Found.')
	}
	var htmlStr = template.render(data.toString(), {
	  comments: comments
	})
	res.end(htmlStr)
})
```

html文件中，使用art-template模板语法each，遍历渲染需要替换的内容：

```
{{each 需要遍历的内容}}
<li>{{ $value }} </li>
{{/each}}
```

---

<span id="jump7"></span>

## 客户端渲染和服务端渲染

### 两种渲染方式过程的区别：

服务端渲染

![pic](https://github.com/FooderLeoYo/NodeJS-StudyNote/blob/master/assets/img/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93.png)

客户端渲染

![pic](https://github.com/FooderLeoYo/NodeJS-StudyNote/blob/master/assets/img/%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%B8%B2%E6%9F%93.png)

### 两种渲染方式使用时机的区别

服务端渲染是可以被爬虫抓取到的；而客户端渲染则很难，不利于SEO

因此真正的网站都是同时使用两种渲染方式的

例如京东的商品列表采用服务端渲染便于SEO；而商品评论列表无需SEO，同时为了提升用户体验，采用客户端渲染

### 一个快速识别的方法

1. F12查看网页源代码，如果有源代码则是服务端渲染，没有则是客户端异步渲染的

2. 点击链接后需要等待加载的服务端渲染，不需要等待的是客户端渲染的

---

<span id="jump8"></span>
## 处理网站中的静态资源

这些静态资源通常是提供给客户端进行异步渲染的，比如css、img、js等文件

把所有的静态资源都存放在public文件夹中，public再进一步细分

之后就可以通过判断请求路径，实现分类控制哪些资源能被用户访问

### 步骤

1. 服务器端js文件中筛选出请求路径是以 /public/ 开头的

这种情况则认为用户是要获取public中的资源，就直接可以把请求路径当作文件路径来直接进行读取

```
else if (pathname.indexOf('/public/') === 0) {
  fs.readFile('.' + pathname, function (err, data) {
	if (err) {
	  return res.end('404 Not Found.')
	}
	res.end(data)
  })
}
```

这里'.' + pathname巧妙的拿到了当前目录路径：./xxx

2. html文件中需要获取静态资源的地方，外链格式不再采用相对路径，因为在上一步readFile时已经拼接了"."

使用：

```
  <link rel="stylesheet" href="/public/css/bootstrap.css">
```

而不是：

```
  <link rel="stylesheet" href="./public/css/bootstrap.css">
```

---

<span id="jump9"></span>
## 处理表单

### url.parse方法取出url中需要的属性

url.parse方法将路径解析为一个方便操作的对象，里面可以取出pathname、端口、主机、哈希等属性

parse方法有两个参数

第一个参数是url

第二个参数为true时，会将query转为一个对象，以分隔符隔开的内容会分别单独作为对象中的一个属性

```
var url = require('url')

var obj = url.parse('/pinglun?name=的撒的撒&message=的撒的撒的撒', true)

console.log(obj) // url包含的各类息
console.log(obj.query) // { name: '的撒的撒', message: '的撒的撒的撒' }
```

### 表单提交重定向

 1. 通过statusCode将状态码设置为 302 临时重定向
	 
 2. 通过setHeader将设置响应头中通过 Location 告诉客户端往哪儿重定向
	 
如果客户端发现收到服务器的响应的状态码是 302 就会自动去响应头中找 Location ，然后对该地址发起新的请求

```
res.statusCode = 302
res.setHeader('Location', '/')
```

---

<span id="jump10"></span>
## 综合案例：留言板

[一个简单的具有发布功能的留言板](https://github.com/FooderLeoYo/Nodejs-StudyNote/tree/master/assets/projects/%E7%95%99%E8%A8%80%E6%9D%BF)
