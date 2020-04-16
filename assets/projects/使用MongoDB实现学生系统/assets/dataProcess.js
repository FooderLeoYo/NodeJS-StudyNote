let mongoose = require('mongoose');

let Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/studentSys', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let studentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true //添加约束，保证数据的完整性，让数据按规矩统一
  },
  gender: {
    type: Number,
    enum: [0, 1], // 枚举，只能是0或1
    default: 0,
    require: true
  },
  age: {
    type: Number,
    require: true
  },
  hobbies: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model('Student', studentSchema)
