const { Router } = require('express')
const { 
   limitProduct,
   getAllProduct,
   getOneProduct,
   getComment,
   deleteComment,
   getCategoryProducts
} =require('../controllers/homeController')

const router = Router()

router.get('/', limitProduct)
router.get('/all/products', getAllProduct)
router.get('/products', getCategoryProducts)
router.get('/product/:id', getOneProduct)
router.post('/comment/:id', getComment)
router.post('/comment/delete/:id', deleteComment)

module.exports = router