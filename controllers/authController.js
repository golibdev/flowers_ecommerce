const User = require('../models/userMoodels')
const bcrypt = require('bcryptjs')


const register = (req, res) => {
   res.render('auth/reg', {
      title: 'Ro`yxatdan o`tish',
      regErr: req.flash('regErr')[0]
   })
}

const login = (req, res) => {
   res.render('auth/log', {
      title: 'Kirish',
      logErr: req.flash('logErr')[0]
   })
}

// Register
const userRegister = async (req, res) => {
   try {
      const { firstName, lastName, email, password, confirmPassword } = req.body
      const userExist = await User.findOne({email})

      if(userExist) {
         req.flash('regErr', 'Bunday foydalanuvchi mavjud')
         return res.redirect('/auth/register')
      }

      if(password.lenght < 6) {
         req.flash('regErr', 'Parol kamida 6 ta belgidan iborat bo`lishi kerak')
         return res.redirect('/auth/register')
      }

      const matchPassword = password === confirmPassword

      if(!matchPassword) {
         req.flash('regErr', 'Parollar to`gri kelmadi!!!')
         return res.redirect('/auth/register')
      }
      const hashPassword = await bcrypt.hash(password, 10)
      await User.create({
         firstName,
         lastName,
         email,
         password: hashPassword
      })

      res.redirect('/auth/login')
   } catch (err) {
      console.log(err)
   }
}

// login
const userLogin = async (req, res) => {
   try {
      const { email, password } = req.body

      const userExist = await User.findOne({ email })

      if(!userExist) {
         req.flash('logErr', 'Ma`lumotlar mos kelmadi')
         return res.redirect('/auth/login')
      }

      const comparePass = await bcrypt.compare(password, userExist.password)
      if(!comparePass) {
         req.flash('logErr', 'Ma`lumotlar mos kelmadi')
         return res.redirect('/auth/login')
      }

      req.session.user = userExist
      req.session.isLogged = true
      res.redirect('/admin/dashboard')

   } catch(err) {
      console.log(err)
   }
}

const logOut = (req, res) => {
   req.session.user = undefined
   req.session.isLogged = false
   req.session.destroy()
   res.redirect('/')
}

module.exports = {
   register,
   login,
   userRegister,
   userLogin,
   logOut
}