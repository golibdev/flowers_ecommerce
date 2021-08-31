const { Router } = require('express')
const { protected } = require('../middlewares/auth')

const {
   dashboard,
   addProduct,
   addNewProduct,
   productList,
   updateProduct,
   deleteProduct,
   updatedProduct,
   category,
   addCategory,
   deleteCategory,
   updateCategory,
   updatedCategory,
   getComments,
   getallOrders
} = require('../controllers/dashboardController')

const router = Router()

router.get('/dashboard', protected , dashboard)
router.get('/orders', protected , getallOrders)
router.get('/comments', protected, getComments)
router.get('/add', protected, addProduct)
router.post('/add', protected, addNewProduct)
router.get('/category', protected, category)
router.post('/category', protected, addCategory)
router.post('/category/delete/:id', protected, deleteCategory)
router.get('/edit', protected, updateCategory)
router.post('/edit', protected, updatedCategory)
router.get('/products', protected, productList)
router.post('/delete/:id', protected, deleteProduct)
router.get('/update/:id', protected, updateProduct)
router.post('/update/:id', protected, updatedProduct)

module.exports = router