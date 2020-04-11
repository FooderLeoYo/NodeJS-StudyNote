# Express

## 目录

[起步](#jump1)

[Express静态服务API](#jump2)
                      
[在Express中配置使用`art-templete`模板引擎](#jump3)

[在Express中获取表单请求数据](#jump4)

[路由](#jump5)




[处理表单](#jump9)

[综合案例：留言板](#jump10)

---	

<span id="jump1"></span>
## 起步

### 安装

```javascript
cnpm install express
```

### hello wolrd

```javascript
// 引入express
var express = require('express');

// 1. 创建app
var app = express();

//  2. 
app.get('/',function(req,res){
    // 1
    // res.write('Hello');
    // res.write('World');
    // res.end()

    // 2
    // res.end('hello world');

    // 3
    res.send('hello world');
})

app.listen(3000,function(){
    console.log('express app is runing...');
})
```

### 基本路由

路由：

- 请求方法

- 请求路径
- 请求处理函数

```javascript
//当你以get方法请求/的时候，执行对应的处理函数
app.get('/',function(req,res){
    res.send('hello world');
})
```

---

<span id="jump2"></span>
## Express静态服务API

### 使用.use方法开放静态资源

+ url别名与资源别名一致

	- 例如下面的例子中：当url以 /public 开头的时候，去 public 目录中找找对应的资源

	- 这种方式更容易辨识，推荐这种方式

```
app.use('/public', express.static('public'));
```

+ 第一个参数是自定义的url别名，所以也可以起别的名字，此时url必须是以/别名开头才能访问到

```
app.use('/alias', express.static('public'))
```

+ 第一个参数也可以省略，这种情况访问时，url以省略 /public 的方式来访问

```
app.use(express.static('public'))
```

---

<span id="jump3"></span>
### 在Express中配置使用`art-templete`模板引擎

+ 安装：

```shell
npm install --save art-template
npm install --save express-art-template

+ 配置：

```javascript
app.engine('html', require('express-art-template'));
```

'html'也可以写成其他的，如art，那么模板文件的后缀名也要改成art

+ 使用：

res.render('html模板名', {模板数据})

第一个参数不能写路径，默认会去项目中的 views 目录查找该模板文件

```javascript
// 模板文件index1.html就在views文件夹下
app.get('/',function(req,res){
    res.render('index1.html',{
           title:'hello world'     
    });
})
// 模板文件index2.html'在views文件夹内的insideFolder文件夹中
app.get('/',function(req,res){
    res.render('insideFolder/index2.html',{
           title:'hello world'     
    });
})
```

+ 如果希望修改默认的`views`视图渲染存储目录，可以：

```javascript
// 第一个参数views千万不要写错
app.set('views',目录路径);
```

---

<span id="jump4"></span>
## 在Express中获取表单请求数据

### 获取get请求数据：

Express内置了一个api，可以直接通过`req.query`来获取数据

```javascript
// 通过requery方法获取用户输入的数据
// req.query只能拿到get请求的数据
 var comment = req.query;
```

### 获取post请求数据

在Express中没有内置获取表单post请求体的api，这里我们需要使用一个第三方包`body-parser`来获取数据

+ 安装：

```javascript
npm install --save body-parser
```

+ 配置

配置解析表单 POST 请求体插件（注意：一定要在 app.use(router) 之前 ）

```javascript
var express = require('express')
// 引包
var bodyParser = require('body-parser')

var app = express()

// 配置body-parser
// 只要加入这个配置，则在req请求对象上会多出来一个属性：body
// 也就是说可以直接通过req.body来获取表单post请求数据
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
```

+ 使用

```javascript
app.post('/post', function (req, res) {
	var comment = req.body // 可以通过req.body来获取表单请求数据
    comments.unshift(comment)
	res.redirect('/')
})
```

---

<span id="jump5"></span>
## 路由

### 路由使用实例

- router.js文件：

```javascript
var fs = require('fs');

var express = require('express');

// 1 创建一个路由容器
var router = express.Router();

// 2 把路由都挂载到路由容器中
router.get('/students/new',function(req,res){
    res.render('new.html')
});

router.get('/students/edit',function(req,res){
    
});

// 3 把router导出
module.exports = router;
```

- app.js文件：

```
var router = require('./router');

app.use(router);
```
