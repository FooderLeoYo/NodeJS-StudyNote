# Express

## 目录

[起步](#jump1)

[Express开放静态资源](#jump2)
                      
[配置使用`art-templete`模板引擎](#jump3)

[通过body-parser获取表单post请求数据](#jump4)

[使用express-session插件记录用户登录信息](#jump7)

[路由](#jump5)

[中间件](#jump8)

[综合案例：具备增删改查功能的学生信息系统](#jump6)

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
let express = require('express');

// 创建app
let app = express();

app.get('/', (req,res) => {
    res.send('hello world');
})

app.listen(3000, () => {
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
## Express开放静态资源

### app.use()

app.use是用来给path注册中间函数的，这个path默认是’/’

path当然可以自定义，此时表示对应该path的url请求将会交给注册的中间函数来处理

### express.static()

用于提供对静态资源文件(图片、csss文件、javascript文件)的服务

### 开放静态资源

+ url别名与资源别名一致

	- 例如下面的例子中：当url以```/public/```开头的时候，去```./public/```目录中找找对应的资源

	- 这种方式更容易辨识，推荐这种方式

```javascript
app.use('/public/', express.static(path.join(__dirname, './public/')));
```

+ 第一个参数是自定义的url别名，所以也可以起别的名字，此时url必须是以```/别名```开头才能访问到静态资源

```javascript
app.use('/alias/', express.static(path.join(__dirname, './public/')));
```

+ 第一个参数也可以省略，这种情况访问时，url以```/```开头（即所有url）时即可访问到静态资源

```javascript
app.use(express.static(path.join(__dirname, './public/')));
```

---

<span id="jump3"></span>
## 配置使用`art-templete`模板引擎

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
app.get('/', (req,res) => {
    res.render('index1.html',{
           title:'hello world'     
    });
})
// 模板文件index2.html'在views文件夹内的insideFolder文件夹中
app.get('/', (req,res) => {
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
## 通过body-parser获取表单post请求数据

### 获取get请求数据：

Express内置了一个api，可以直接通过`req.query`来获取数据

```javascript
// 通过requery方法获取用户输入的数据
// req.query只能拿到get请求的数据
 let comment = req.query;
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
let express = require('express')
// 引包
let bodyParser = require('body-parser')

let app = express()

// 配置body-parser
// 只要加入这个配置，则在req请求对象上会多出来一个属性：body
// 也就是说可以直接通过req.body来获取表单post请求数据
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
```

+ 使用

```javascript
app.post('/post', (req, res) => {
	let comment = req.body // 可以通过req.body来获取表单请求数据
    comments.unshift(comment)
	res.redirect('/')
})
```

---

<span id="jump7"></span>

## 使用express-session插件记录用户登录信息

如果仅仅使用cookie将用户信息保存在客户端，将无法阻止客户端恶意篡改信息（如篡改是否为vip会员）等安全问题的发生

因此，需要实现将将用户登录信息保存到服务端，express-session便是一个实现这一功能的插件

> 参考文档：https://github.com/expressjs/session

安装：

```javascript
npm install express-session
```

配置：

```javascript
app.use(session({
  //配置加密字符串，他会在原有的基础上和字符串拼接起来去加密
  //目的是为了增加安全性，防止客户端恶意伪造
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,//无论是否适用Session，都默认直接分配一把钥匙
  cookie: { secure: true }
}))
```

使用：

```javascript
//添加Session数据
req.session.foo = 'bar';

//获取session数据
req.session.foo

//删
req.session.foo = null;
delete req.session.foo
```

提示：

默认Session数据是内存储数据，服务器一旦重启，真正的生产环境会把Session进行持久化存储

---

<span id="jump5"></span>
## 路由

### 路由使用实例

- router.js文件：

```javascript
let express = require('express');

// 1 创建一个路由容器
let router = express.Router();

// 2 把路由都挂载到路由容器中
router.get('/students/new', (req,res) => {
    res.render('new.html')
});


// 3 把router导出
module.exports = router;
```

- app.js文件：

```
let router = require('./router');

// 注意，这一句一定要放在其他app.use的后面
app.use(router);
```

---

<span id="jump8"></span>

## 中间件

### 中间件的概念

一个请求发送到服务器后，它的生命周期是 先收到request（请求），然后服务端处理，处理完了以后发送response（响应）回去

而这个服务端处理的过程就有文章可做了，为了明确和便于维护，需要把处理的事情分一下，分配成几个部分来做，而每个部分就是一个中间件

从本质上来说，一个 Express 应用就是在调用各种中间件

app.use()就是通常所说的使用中间件

中间件本身是一个方法，该方法接收三个参数：

```
Request 请求对象
Response 响应对象
next     下一个中间件
```

当请求进来，会从第一个中间件开始进行匹配

   如果匹配，则进来

      如果请求进入中间件之后，没有调用 next 则代码会停在当前中间件

      如果调用了 next 则继续向后找到第一个匹配的中间件

   如果不匹配，则继续判断匹配下一个中间件

如果没有能匹配的中间件，则 Express 会默认输出：Cannot GET 路径

### 中间件的分类:

#### 应用程序级别的中间件

将应用级中间件绑定到app对象

绑定方式包括app.use或app.METHOD()，其中 METHOD 是中间件函数处理的请求的小写 HTTP 方法（例如 get、put 或 post）

万能匹配（不关心任何请求路径和请求方法的中间件）：

```javascript
app.use(function(req,res,next){
    console.log('Time',Date.now());
    next();
});
```

关心请求路径的中间件：

```javascript
app.use('/a',function(req,res,next){
    console.log('Time',Date.now());
    next();
});
```

#### 路由级别的中间件

路由级中间件和应用级中间件类似，只不过是它绑定对象为express.Router()

此类中间件包括：get、post、put、delete等

此类中间件将严格匹配请求方法和请求路径

如下列中间件，就指定了请求方法为get，请求路径为'/'

```javascript
app.get('/',function(req,res){
	res.send('get');
});
```

#### 错误处理中间件

必须提供四个自变量，以将函数标识为错误处理中间件函数

错误处理中间件函数的定义方式与其他中间件函数基本相同，差别在于错误处理函数有四个自变量而不是三个，专门具有特征符 (err, req, res, next)

```javascript
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

#### 内置中间件

Express 中唯一内置的中间件函数是 express.static，负责提供 Express 应用程序的静态资源

```javascript
express.static(root, [options])
```
示例：

```javascript
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}

app.use(express.static('public', options));
```

对于每个应用程序，可以有多个静态目录：

```javascript
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.static('files'));
```

#### 第三方中间件

> 参考文档：http://expressjs.com/en/resources/middleware.html

- body-parser
- compression
- cookie-parser
- mogran
- response-time
- server-static
- session

---

<span id="jump6"></span>
## 综合案例：具备增删改查功能的学生信息系统
[学生信息系统](https://github.com/FooderLeoYo/NodeJS-StudyNote/tree/master/assets/projects/学生信息系统)
