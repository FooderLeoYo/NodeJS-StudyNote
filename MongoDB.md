# MongoDB

## 目录

[关系型和非关系型数据库](#jump1)

[启动和关闭数据库](#jump2)
                      
[基本命令](#jump3)

[使用mongoose在Node中操作MongoDB数据库](#jump4)

[综合案例：使用MongoDB优化学生系统](#jump5)

---	

<span id="jump1"></span>
## 关系型和非关系型数据库

### 关系型数据库（表就是关系，或者说表与表之间存在关系）。

- 所有的关系型数据库都需要通过`sql`语言来操作
- 所有的关系型数据库在操作之前都需要设计表结构
- 而且数据表还支持约束
  - 唯一的
  - 主键
  - 默认值
  - 非空

### 非关系型数据库

- 非关系型数据库非常的灵活
- 有的关系型数据库就是key-value对儿
- 但MongDB是长得最像关系型数据库的非关系型数据库
  - 数据库 -》 数据库
  - 数据表 -》 集合（数组）
  - 表记录 -》文档对象

一个数据库中可以有多个数据库，一个数据库中可以有多个集合（数组），一个集合中可以有多个文档（表记录）

---

<span id="jump2"></span>
## 启动和关闭数据库

启动

```shell
# mongodb 默认使用执行mongod 命令所处盘符根目录下的/data/db作为自己的数据存储目录
# 所以在第一次执行该命令之前先自己手动新建一个 /data/db
mongod
```

启动后想要使用数据库，需要再开另外一个控制台

- 如果想要修改默认的数据存储目录，可以：

```javascript
mongod --dbpath = 数据存储目录路径
```

但是这么改的话每次重新进入时都要打--dbpath = 数据存储目录路径，因此推荐使用默认路径

停止：

```javascript
在开启服务的控制台，直接Ctrl+C;
或者直接关闭开启服务的控制台。
```

---

<span id="jump3"></span>
## 基本命令

连接：

```javascript
# 该命令默认连接本机的 MongoDB 服务
mongo
```

退出：

```javascript
# 在连接状态输入 exit 退出连接
exit
```

数据库、集合、文档的基本命令：

数据库：

- `show dbs`
  - 查看数据库列表(数据库中的所有数据库)
- `use 数据库名称`
  - 切换到指定的数据库（如果没有会新建）
- `db.dropDatabase()`
  - 删除当前数据库
- `db`
  - 查看当前连接的数据库

集合：

- `show collections`
  - 查看当前数据库下的所有集合
- `db.createCollection(name, options)`
  - 创建集合
- `db.集合名.drop()`
  - 删除集合

文档对象：
- `db.集合名.insert(document)`
  - 插入文档
- `db.集合名.remove()`
  - 删除文档
- `db.集合名.update()`
  - 更新文档
- `db.集合名.find()`
  - 查看集合中的文档

---

<span id="jump4"></span>
## 使用mongoose在Node中操作MongoDB数据库

### 使用官方的`MongoDB`包来操作

> http://mongodb.github.io/node-mongodb-native/
>

但是官方包较为麻烦，一般是使用三方包

### 使用第三方包`mongoose`来操作MongoDB数据库

第三方包：`mongoose`基于MongoDB官方的`mongodb`包再一次做了封装

> https://mongoosejs.com/
>

### 设计Scheme 发布Model (创建表)

```javascript
// 1.引包
// 注意：按照后才能require使用
let mongoose = require('mongoose');

// 2.连接数据库
// 指定连接数据库后不需要存在，当你插入第一条数据库后会自动创建数据库
mongoose.connect('mongodb://localhost/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 3.设计集合结构（表结构）
// 用户表
let userSchema = new mongoose.Schema({
	username: { 
		type: String,
		require: true //添加约束，保证数据的完整性，让数据按规矩统一
	},
	password: {
		type: String,
		require: true
	},
	email: {
		type: String
	}
});

// 4.将文档结构发布为模型
// mongoose.model方法就是用来将一个架构发布为 model
// 		第一个参数：传入一个大写名词单数字符串用来表示你的数据库的名称
// 					mongoose 会自动将大写名词的字符串生成 小写复数 的集合名称
// 					例如 这里会变成users集合名称
// 		第二个参数：架构
// 	返回值：模型构造函数
/* 发布 */
let User = mongoose.model('User', userSchema); // 在本文件中使用Schema
// 或
module.exports = mongoose.model('User', userSchema); // 在别的文件中使用Schema
```

### 配置个人的Promise

如果想要在mongoose中使用Promise，则需要安装第三方Promise并并将mongoose的Promise设置为该Promise

官方说明：

```shell
Mongoose: mpromise (mongoose's default promise library) is deprecated
plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
```

安装自己喜欢的Promise，并将mongoose的Promise设置为该Promise:

```javascript
// bluebird是三方Promise，也可以改成自己喜欢的
mongoose.Promise = require('bluebird');
```

### 添加数据

- 成功后拿到的res为新增的表的数据

```javascript
new User({ // 新建表数据
  username: 'admin',
  password: '123456',
  email: 'xiaochen@qq.com'
}).save((err, res) => { // 存入表数据
  if (err) return handleError(err);
  // do something with res
})
```

### 查询

#### .findOne()

- 按条件查询匹配的第一个表

- 成功后拿到的res为查找到的表的数据

```javascript
User.findOne(查询条件, (err, res) => {
  if (err) return handleError(err);
  // do something with res
})
```

#### .find()

- 查询所有符合条件的表，如果条件不写，则是查询所有的表

- 成功后拿到的res为查找到的表的数据

```javascript
User.find(查询条件, (err, res) => {
  if (err) return handleError(err);
  // do someting with res
})
```

### 删除

#### .deleteOne()

- 删除第一个符合条件的表

```javascript
User.deleteOne(查询条件, err => {
  if (err) return handleError(err);
})
```

#### .deleteMany()

- 删除所有符合条件的表

```javascript
User.deleteMany(查询条件, err => {
  if (err) return handleError(err);
})
```

### 更新

#### .updateOne()

- 更新第一个符合条件的表

- 成功拿到的res不是修改后的表，而是：{ n: 0, nModified: 0, ok: 1 }，基本没用因此回调只写err

```javascript
User.updateOne(查询条件, 修改后的数据, err => {
  if (err) return handleError(err);
})
```

#### .updateMany()

- 更新所有符合条件的表

- 成功拿到的res不是修改后的表，而是：{ n: 0, nModified: 0, ok: 1 }，基本没用因此回调只写err

```javascript
User.updateMany(查询条件, 修改后的数据, err => {
  if (err) return handleError(err);
})
```

### .findOneAndUpdate()

- 拿到改动前的数据，然后进行更新

- 成功拿到的res是改动前的数据

```javascript
// 想使用findOneAndUpdate，官方要求必须先set
mongoose.set('useFindAndModify', false); 

User.findOneAndUpdate(查询条件, 修改后的数据 (err, res) => {
  if (err) return handleError(err);
  // do something with old data(res)
})
```

---

<span id="jump5"></span>
## 综合案例：使用MongoDB优化学生系统

[MongoDB重构学生系统](https://github.com/FooderLeoYo/NodeJS-StudyNote/tree/master/assets/projects/使用MongoDB实现学生系统)
