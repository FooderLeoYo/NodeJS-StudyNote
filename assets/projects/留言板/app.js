var http = require('http')
var fs = require('fs')
var url = require('url')
var template = require('art-template')

// 由于内容较多，将模板引擎中的替换部分抽离出来
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
  },
  {
    name: '张三3',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  },
  {
    name: '张三4',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  },
  {
    name: '张三5',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  }
]

http
  .createServer(function (req, res) { // 简写方式，该函数会直接被注册为 server 的 request 请求事件处理函数
    // 使用 url.parse 方法将路径解析为一个方便操作的对象
    var parseObj = url.parse(req.url, true)

    // 单独获取不包含查询字符串的路径部分（该路径不包含 ? 之后的内容）
    var pathname = parseObj.pathname

    if (pathname === '/') {
      // 进入首页
      fs.readFile('./views/index.html', function (err, data) {
        if (err) {
          return res.end('404 Not Found.')
        }
        var htmlStr = template.render(data.toString(), {
          comments: comments
        })
        res.end(htmlStr)
      })
    } else if (pathname === '/post') {
      // 进入发新评论页面
      fs.readFile('./views/post.html', function (err, data) {
        if (err) {
          return res.end('404 Not Found.')
        }
        res.end(data)
      })

    } else if (pathname.indexOf('/public/') === 0) {
      // 如果请求路径是以 /public/ 开头的，则我认为你要获取 public 中的某个资源
      // 接着就直接可以通过拼接"."把请求路径当作文件路径，进行读取文件
      fs.readFile('.' + pathname, function (err, data) {
        if (err) {
          return res.end('404 Not Found.')
        }
        res.end(data)
      })
    } else if (pathname === '/pinglun') {
      // 发送提交评论请求

      // 表单提交的请求路径由于其中具有用户动态填写的内容，不可能通过判断完整的url来处理这个请求
      // 因此之前才通过url.parse取出pathname，这里根据pathname而不是完整url来做判断
      // 这个时候无论 /pinglun?xxx 之后是什么，我都不用担心了，因为我的 pathname 是不包含 ? 之后的那个路径

      // 获取用户原评论
      var comment = parseObj.query
      // 添加发表时间（这里写死了，实际不会这样）
      comment.dateTime = '2017-11-2 17:11:22'
      // 将用户提交的这条评论放进comments中
      // unshift是添加到前面,如果用push的话则是添加到后面
      comments.unshift(comment)

      // 重新请求'/'，返回首页，就可以看到最新的留言内容了
      res.statusCode = 302
      // 这里'/'就是重定向回首页
      res.setHeader('Location', '/')
      res.end()
    } else {
      // 其它的都处理成 404 找不到
      fs.readFile('./views/404.html', function (err, data) {
        if (err) {
          return res.end('404 Not Found.')
        }
        res.end(data)
      })
    }
  })
  .listen(3000, function () {
    console.log('running...')
  })
