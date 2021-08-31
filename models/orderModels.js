const { Schema, model } = require('mongoose')
const fullDate = require('../config/date')

const orderSchema = new Schema({
   fullName: {
      type: String,
      required: true
   },
   region: {
      type: String,
      required: true
   },
   phone: {
      type: String,
      required: true
   },
   withLamp: {
      type: Boolean,
      required: true
   },
   typeFlowers: {
      type: String,
      required: true
   },
   productName: {
      type: String
   },
   totalPrice: {
      type: Number
   },
   today: {
      type: String,
      default: fullDate()
   },
   status: {
      type: String,
      enum: ['new', 'process', 'cancelled', 'done'],
      default: 'new'
   }
})

module.exports = model('Order', orderSchema)