const { Router } =require('express')
const { isAuth } = require('../middlewares/auth')
const {
   register, 
   login,
   userRegister,
   userLogin,
   logOut
} = require('../controllers/authController')

const router = Router()

router.get('/register', isAuth, register)
router.get('/login', isAuth , login)
router.post('/register', isAuth ,userRegister)
router.post('/login', isAuth ,userLogin)
router.get('/logout', logOut)

module.exports = router