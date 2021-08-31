const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
   email: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   commentStatus: {
      type: Boolean,
      enum: [true, false],
      default: false
   }
})

module.exports = model('Comment', commentSchema)