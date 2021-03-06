var express = require('express')
var bodyParser = require('body-parser')

var router = require('./router')

var app = express()

// 开放node_modules、public目录
app.use('/node_modules', express.static('node_modules'))
app.use('/public', express.static('public'))

// 配置art-template
app.engine('html', require('express-art-template'));

// 配置body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 把路由容器挂载到app服务中
app.use(router)

app.listen(3000, function () {
  console.log('3000 running')
})
