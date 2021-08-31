const Order = require('../models/orderModels')
const Product = require('../models/productModels')

const orderProduct = async (req, res) => {
   try{
      const productId = req.params.id
      const { fullName, region, phone, withLamp, typeFlowers } = req.body
      let withLamps = false

      if(withLamp == 'on') {
         withLamps = true
      } 
      const product = await Product.findById(productId).lean()
      let totalPrice

      if(typeFlowers == 'amount_small_size' && withLamps === true){
         totalPrice = product.amount_small_size + product.amount_with_lamp
      } else if(typeFlowers === 'amount_small_size' && withLamps == false) {
         totalPrice = product.amount_small_size
      } 
      if(typeFlowers === 'amount_medium_size' && withLamps === true) {
         totalPrice = product.amount_medium_size + product.amount_with_lamp
      } else if(typeFlowers === 'amount_medium_size' && withLamps === false) {
         totalPrice = product.amount_medium_size
      } 
      
      if(typeFlowers === 'amount_big_size' && withLamps === true) {
         totalPrice = product.amount_big_size + product.amount_with_lamp
      } else if(typeFlowers === 'amount_big_size' && withLamps === false) {
         totalPrice = product.amount_big_size
      }

      let typeFlower
      if(typeFlowers == 'amount_small_size'){
         typeFlower = "Kichik o'lcham"
      } else if(typeFlowers == 'amount_medium_size'){
         typeFlower = "o'rtacha o'lcham"
      } else {
         typeFlower = "Katta o'lcham"
      }

      const order = await Order({
         fullName,
         phone,
         region,
         withLamp: withLamps,
         typeFlowers: typeFlower,
         totalPrice,
         productName: product.title
      })

      await order.save()

      res.redirect(`/product/${productId}`)
   } catch(err) {
      console.log(err)
   }
}

const orderCancelled = async (req, res) => {
   try {
      const orderId = req.params.id
      const orders = await Order.findById(orderId)

      if(orders.status === 'done' || orders.status === 'process') {
         return res.redirect('/admin/dashboard')
      }else {
         const order = await Order.findByIdAndUpdate(orderId, {status: 'cancelled'})
      }

      res.redirect('/admin/dashboard')
   } catch (err) {
      console.log(err)
   }
}

const orderSuccess = async (req, res) => {
   try{
      const orderId = req.params.id

      const order = await Order.findById(orderId)

      if(order.status === 'cancelled') {
         return res.redirect('/admin/dashboard')
      } else {
         await Order.findByIdAndUpdate(orderId, {status: 'done'})
      }
      
      res.redirect('/admin/dashboard')
   } catch(err) {
      console.log(err)
   }
}

module.exports = {
   orderProduct,
   orderCancelled,
   orderSuccess
}