const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
  owner:{
      type:mongoose.Schema.Types.ObjectId,//Id from Foreign field
      required:true,
      ref:'Users'

  }
},{timestamps:true})

const Task = mongoose.model('task',TaskSchema)
module.exports = Task