const isAuth = (req, res, next) => {
   if(req.session.isLogged) {
      return res.redirect('/admin/dashboard')
   }
   next()
}

const protected = (req, res, next) => {
   if(!req.session.isLogged) {
      return res.redirect('/auth/login')
   }
   next()
}

module.exports = {
   isAuth,
   protected
}