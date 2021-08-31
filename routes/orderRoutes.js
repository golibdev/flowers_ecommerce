const { Router } = require('express')
const {
   orderProduct,
   orderCancelled,
   orderSuccess
} = require('../controllers/orderController')
const router = Router()

router.post('/products/:id', orderProduct)
router.post('/cancel/:id', orderCancelled),
router.post('/success/:id', orderSuccess)

module.exports = router