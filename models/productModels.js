const { Schema, model } = require('mongoose')

const productSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   image: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   amount_small_size: {
      type: Number,
      required: true
   },
   amount_medium_size: {
      type: Number,
      required: true
   },
   amount_big_size: {
      type: Number,
      required: true
   },
   amount_with_lamp: {
      type: Number,
      required: true
   },
   category: {
      type: String, 
      required: true
   },
   comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
   }]
})

module.exports = model('Product', productSchema)