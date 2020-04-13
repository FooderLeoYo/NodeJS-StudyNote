var fs = require('fs')

var express = require('express')

var Student = require('./student')

// 1. 创建Router实例
var router = express.Router()

// 2. 把路由都挂载到 router 路由容器中

// 渲染首页
router.get('/students', function (req, res) {
  Student.getList(function (err, students) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.render('index.html', {
      students: students
    })
  })
})

// 渲染新增学生信息页
router.get('/students/new', function (req, res) {
  res.render('new.html')
})

// 处理新增学生信息请求
router.post('/students/new', function (req, res) {
  // req.body是body-parser的API
  Student.addNew(req.body, function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/students')
  })
})

/* 渲染编辑信息页面 */
router.get('/students/edit', function (req, res) {
  // req.query.id是Express的API
  Student.getById(parseInt(req.query.id), function (err, student) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.render('edit.html', {
      student: student
    })
  })
})

/* 处理编辑学生信息请求 */
router.post('/students/edit', function (req, res) {
  Student.updateById(req.body, function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/students')
  })
})

/* 删除学生信息 */
router.get('/students/delete', function (req, res) {
  Student.deleteById(req.query.id, function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/students')
  })
})

// 3. 把 router 导出
module.exports = router


