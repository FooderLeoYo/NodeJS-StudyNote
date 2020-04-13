// 这个文件封装了几个异步数据处理函数
// 这样router.js就专注于处理路由，而无需处理数据
// 精髓是将回调函数作为参数传进各个方法中，数据处理完成后再执行回调函数，解决了数据是异步的问题

var fs = require('fs')

var dbPath = './db.json'

/* 获取学生列表 */
// 主要工作：拿到学生列表数据后转成对象
exports.getList = function (callback) {
  fs.readFile(dbPath, 'utf8', function (err, data) {
    if (err) {
      return callback(err)
    }
    callback(null, JSON.parse(data).students)
  })
}

/* 新增学生信息 */
// 主要工作：给student添加id后加到学生列表中
exports.addNew = function (student, callback) {
  fs.readFile(dbPath, 'utf8', function (err, data) {
    if (err) {
      return callback(err)
    }
    // 把字符串数据转成对象。注意在db.json中.student后才是列表数据
    var students = JSON.parse(data).students

    // 给student添加 id ，当前最大的id+1，以保证唯一不重复
    student.id = students[students.length - 1].id + 1

    // 把用户传递的对象保存到数组中
    students.push(student)

    // 把对象数据转换为字符串
    var fileData = JSON.stringify({
      students: students
    })

    // 把字符串保存到db.json文件中
    fs.writeFile(dbPath, fileData, function (err) {
      if (err) {
        // 错误就是把错误对象传递给它
        return callback(err)
      }
      // 成功就没错，所以错误对象是 null
      callback(null)
    })
  })
}

/* 根据 id 获取某个学生信息对象 */
// 主要工作：根据提供的id从数据库中找到目标学生数据，返回给app.js渲染
exports.getById = function (id, callback) {
  fs.readFile(dbPath, 'utf8', function (err, data) {
    if (err) {
      return callback(err)
    }
    var students = JSON.parse(data).students
    // EcmaScript 6 中的一个数组方法：find
    // 需要接收一个函数作为参数
    // 当某个对象符合 item.id === student.id 条件的时候，find 会终止遍历，同时返回该对象
    var targetStu = students.find(function (item) {
      return item.id === parseInt(id)
    })
    callback(null, targetStu)
  })
}

/* 编辑学生信息 */
// 主要工作：将传过来的某个学生的新数据整体覆盖老数据
exports.updateById = function (student, callback) {
  // student是用户传进来的改动后的学生信息
  fs.readFile(dbPath, 'utf8', function (err, data) {
    if (err) {
      return callback(err)
    }
    var students = JSON.parse(data).students

    // 注意：这里记得把 id 统一转换为数字类型
    student.id = parseInt(student.id)

    // 在students中，找到要修改的那个学生对象
    var targetStu = students.find(function (item) {
      return item.id === student.id
    })

    // 将新数据student遍历拷贝到targetStu中
    // 这里是把student中所有的数据都拷贝到targetStu中，哪怕是没有改动数据
    // 例如，student只改了名字，但是gender、age等其他数据也会被拷贝到targetStu中
    // 相当于用同样的数据覆盖了旧数据
    for (var key in student) {
      targetStu[key] = student[key]
    }

    // 把对象数据转换为字符串
    var fileData = JSON.stringify({
      students: students
    })

    // 把字符串保存到文件中
    fs.writeFile(dbPath, fileData, function (err) {
      if (err) {
        // 错误就是把错误对象传递给它
        return callback(err)
      }
      // 成功就没错，所以错误对象是 null
      callback(null)
    })
  })
}

/* 删除学生信息 */
// 主要工作：
exports.deleteById = function (id, callback) {
  fs.readFile(dbPath, 'utf8', function (err, data) {
    if (err) {
      return callback(err)
    }
    var students = JSON.parse(data).students

    // findIndex 方法专门用来根据条件查找元素的下标
    // 这里的下标指的是在db.json的students数组中的index，而不是id
    var deleteId = students.findIndex(function (item) {
      return item.id === parseInt(id)
    })

    // 根据下标从数组中删除对应的学生对象
    students.splice(deleteId, 1)

    // 把对象数据转换为字符串
    var fileData = JSON.stringify({
      students: students
    })

    // 把字符串保存到文件中
    fs.writeFile(dbPath, fileData, function (err) {
      if (err) {
        // 错误就是把错误对象传递给它
        return callback(err)
      }
      // 成功就没错，所以错误对象是 null
      callback(null)
    })
  })
}
