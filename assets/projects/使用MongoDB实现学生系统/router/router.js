let express = require('express')

/* 拿到数据库model */
let dataTProcess = require('../assets/dataProcess')

/* 1. 创建一个路由容器 */
let router = express.Router()

/* 2. 把路由都挂载到 router 路由容器中 */

/* 渲染学生信息列表 */
router.get('/', (req, res) => {
  dataTProcess.find((err, data) => {
    if (err) return res.status(500).send('Server error.')
    res.render('index.html', {
      students: data
    })
  })
})

/* 渲染新增学生信息页 */
router.get('/add', (req, res) => {
  res.render('add.html')
})

/* 处理新增学生信息请求 */
router.post('/add', (req, res) => {
  // req.body是body-parser的API
  new dataTProcess(req.body).save(err => {
    if (err) return res.status(500).send('Server error.')
    res.redirect('/')
  })
})

/* 渲染编辑信息页面 */
router.get('/edit', (req, res) => {
  // req.query.id是Express的API
  dataTProcess.findOne({ _id: req.query.dataBaeId }, (err, data) => {
    if (err) return res.status(500).send('Server error.')
    res.render('edit.html', {
      student: data
    })
  })
})

/* 处理编辑学生信息请求 */
router.post('/edit', (req, res) => {
  dataTProcess.updateOne({ dataBaeId: req.query.dataBaeId }, req.body, err => {
    if (err) return res.status(500).send('Server error.')
    res.redirect('/')
  })
})


/* 删除学生信息 */
router.get('/delete', (req, res) => {
  dataTProcess.deleteOne({ _id: req.query.dataBaeId }, err => {
    if (err) return res.status(500).send('Server error.')
    res.redirect('/')
  })
})

/* 3. 把 router 导出 */
module.exports = router

