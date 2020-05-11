# Koa

## 目录

[开发环境搭建](#jump1)

[Get请求的接收](#jump2)

[POST请求的接收](#jump3)

[Koa-router中间件](#jump4)

[Koa2中使用cookie](#jump5)

[Koa2的模板初识（ejs）](#jump6)

[koa-static静态资源中间件](#jump7)

---	

<span id="jump1"></span>

## 开发环境搭建

1. 初始化生产package.json 文件

```shell
npm init -y
```

2. 安装

```shell
cnpm install --save koa
```

3. 使用

```javascript
const Koa = require('koa')
const app = new Koa()

app.use( async ( ctx ) => {
  ctx.body = 'hello koa2'
})

app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')
```

---

<span id="jump2"></span>

## Get请求的接收

### query和querystring区别

- query：返回的是格式化好的参数对象

- querystring：返回的是请求字符串

### 直接从ctx中获取Get请求

可以直接在ctx中得到GET请求。ctx中也分为query和querystring

```javascript
app.use(async (ctx) => {
  let ctx_query = ctx.query;
  let ctx_querystring = ctx.querystring;

  ctx.body = {
    ctx_query,
    ctx_querystring
  }
});
```

---

<span id="jump"></span>

## POST请求的接收

### ctx.request和ctx.req的区别

- ctx.request

	- 是Koa2中context经过封装的请求对象
	
	- 它用起来更直观和简单

- ctx.req

	- 是context提供的node.js原生HTTP请求对象
	
	- 这个虽然不那么直观，但是可以得到更多的内容，适合我们深度编程

### ctx.method 得到请求类型

Koa2中提供了ctx.method属性，可以轻松的得到请求的类型

然后根据请求类型编写不同的相应方法

### koa-bodyparser中间件

对于POST请求的处理，koa-bodyparser中间件可以把koa2上下文的formData数据解析到ctx.request.body中

1. 安装

```shell
cnpm install --save koa-bodyparser
```

2. 引入使用

```javascript
const bodyParser = require('koa-bodyparser');
```

3. app挂载

```javascript
app.use(bodyParser());
```

4. 用ctx.request.body获取POST请求参数

```javascript
let postData= ctx.request.body;
```

### 使用示例

```javascript
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');

app.use(bodyParser());

app.use(async (ctx) => {
  // 使用ctx.method方法获取请求方法类型
  if (ctx.url === '/' && ctx.method === 'GET') {
    //显示表单页面
    let html = `
            <h1>Koa2 request POST</h1>
            <form method="POST" action="/">
                <p>userName</p>
                <input name="userName" /><br/>
                <p>age</p>
                <input name="age" /><br/>
                <p>website</p>
                <input name="webSite" /><br/>
                <button type="submit">submit</button>
            </form>
        `;
    ctx.body = html;
  } else if (ctx.url === '/' && ctx.method === 'POST') {
    // 获取POST请求参数
    let postData = ctx.request.body;
    ctx.body = postData;
  } else {
    ctx.body = '<h1>404!</h1>';
  }
});

app.listen(3000, () => {
  console.log('[demo] server is starting at port 3000');
});
```

---

<span id="jump4"></span>

## Koa-router中间件

### 基本使用

1. 安装

```shell
cnpm install --save koa-router
```

2. 创建Router实例

```javascript
const router = new Router();
```

3. 配置路由

```javascript
router.get('/', function (ctx, next) {
    ctx.body="Hello JSPang";
});
```

4. 将路由实例包含的路由和方法装载到app

```javascript
app
  .use(router.routes())
  .use(router.allowedMethods());
```

### 多页面配置

其实多页面的添加只要继续在下面填写get或者Post就可以了

比如我们再加一个todo的页面：

```javascript
router.get('/', function (ctx, next) {
    ctx.body="Hello JSPang";
})
.get('/todo',(ctx,next)=>{
    ctx.body="Todo page"
});
```

### 层级

### 设置前缀

路由在创建的时候是可以指定一个前缀的，这个前缀会被至于路由的最顶层

```javascript
const router = new Router({
  prefix:'/jspang'
})
```

### 路由层级

设置前缀一般都是全局的

如果想为单个页面设置层级，则父路由需装载其子路由，然后app再装载父路由

例如：

```javascript
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');


// 子路由1
let child1 = new Router();
child1.get('/page1', async (ctx) => {
  ctx.body = "child1 page1";
}).get('/page2', async (ctx) => {
  ctx.body = 'child1 page2';
})

// 子路由2
let child2 = new Router();
child2.get('/page1', async (ctx) => {
  ctx.body = "child2 page1";
}).get('/page2', async (ctx) => {
  ctx.body = 'child2 page2';
})


// 父路由装载所有子路由
let parent = new Router();
parent.use('/child1', child1.routes(), child1.allowedMethods());
parent.use('/child2', child2.routes(), child2.allowedMethods());


// app装载父路由
app.use(parent.routes()).use(parent.allowedMethods());


app.listen(3000, () => {
  console.log('[demo] server is starting at port 3000');
});
```

---

<span id="jump5"></span>

## Koa2中使用cookie

### 写入Cookie操作

```javascript
ctx.cookies.set(name,value,[options])
```

### Cookie选项

- domain：写入cookie所在的域名

- path：写入cookie所在的路径

- maxAge：Cookie最大有效时长

- expires：cookie失效时间

- httpOnly:是否只用http请求中获得

- overwirte：是否允许重写

```javascript
ctx.cookies.set(
  'MyName', 'JSPang', {
  domain: '127.0.0.1', // 写cookie所在的域名
  path: '/index',       // 写cookie所在的路径
  maxAge: 1000 * 60 * 60 * 24,   // cookie有效时长
  expires: new Date('2018-12-31'), // cookie失效时间
  httpOnly: false,  // 是否只用于http请求中获取
  overwrite: false  // 是否允许重写
});
```

### 读取Cookie

```javascript
ctx.cookies.get(name,[optins])
```

---

<span id="jump6"></span>

## Koa2的模板初识（ejs）

1. 安装中间件

```shell
cnpm install --save koa-views
```

2. 安装ejs模板引擎

```shell
cnpm install --save ejs
```

3. 编写模板

待替换的部分为：<%=  %>

```html
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <h1><%= title %></h1>
    <p>EJS Welcome to <%= title %></p>
</body>
</html>
```

4. 编写koa文件

```javascript
app.use( async ( ctx ) => {
  let title = 'hello koa2'
  await ctx.render('index', {
    title
  })
})
```

---

<span id="jump7"></span>

## koa-static静态资源中间件

1. 安装koa-static

```shell
cnpm install --save koa-static
```

2. 新建static文件夹，把需要开放的静态资源都放到这个文件夹中

3. 新建静态资源路径变量

```javascript
const staticPath = './static'
```

4. app装载koa-static中间件

```javascript
app.use(static(
  path.join( __dirname,  staticPath)
))
```