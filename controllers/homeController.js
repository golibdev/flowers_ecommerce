const Product = require('../models/productModels')
const Category = require('../models/categoryModels')
const Comment = require('../models/commentModels')

const limitProduct = async (req, res) => {
   try {
      const products = await Product.find().limit(6).sort({$natural: -1}).lean()
      const categories = await Category.find().lean()
      res.render('home', {
         title: 'Bosh sahifa',
         isLogged: req.session.isLogged,
         products,
         categories
      })
   } catch (err) {
      console.log(err)
   }
}

const getAllProduct = async (req, res) => {
   try{
      const pagelimit = 9
      const limit = parseInt(req.query.limit)
      const page = parseInt(req.query.page)
      const total = await Product.countDocuments()

      //Redirect if queires [page, limit] doesn't exist
      if(req.url === '/all/products'){
         return res.redirect(`?page=1&limit=${pagelimit}`)
      }

      const categories = await Category.find().lean()
      const products = await Product
         .find()
         .skip((page * limit) - limit)
         .limit(limit)
         .lean()

      res.render('all/allProduct', {
         title: "Barcha mahsulotlar",
         categories,
         products: products.reverse(),
         pagination: {
            page,
            limit,
            pageCount: Math.ceil(total/limit)
         }
      })
   } catch(err) {
      console.log(err)
   }
}

const getCategoryProducts = async (req, res) => {
   try{
      const categoryName = req.query.category
      const total = await Product.find({category: categoryName}).countDocuments()
      const pagelimit = 9
      const limit = parseInt(req.query.limit)
      const page = parseInt(req.query.page)

      const categories = await Category.find().lean()

      if(req.url === `/products?category=${categoryName}`){
         return res.redirect(`?category=${categoryName}&page=1&limit=${pagelimit}`)
      }

      const products = await Product
               .find({ category: categoryName })
               .skip((page*limit)-limit)
               .limit(limit)
               .lean()
      res.render('categoryPage', {
         title: "Kategoriya",
         categories: categories,
         products: products.reverse(),
         pagination: {
            page,
            limit,
            pageCount: Math.ceil(total/limit)
         }
      })

   } catch(err) {
      console.log(err)
   }
}

const getOneProduct = async (req, res) => {
   try{
      const id = req.params.id
      const categories = await Category.find().lean()
      const product = await Product.findById(id).populate('comments').lean()
      res.render('aboutProduct', {
         title: product.title,
         image: product.image,
         description: product.description,
         small: product.amount_small_size,
         medium: product.amount_medium_size,
         big: product.amount_big_size,
         lamp: product.amount_with_lamp,
         categories,
         id: product._id,
         comments: product.comments.reverse()
      })
   } catch(err) {
      console.log(err)
   }
}

const getComment = async (req, res) => {
   try{
      const {email, description } = req.body

      const comment = await Comment.create({
         email,
         description
      })

      await Product.findByIdAndUpdate(req.params.id, {
         $push: { comments: comment._id }
      })

      res.redirect(`/product/${req.params.id}`)
   } catch(err){
      console.log(err)
   }
}

const deleteComment = async (req, res) => {
   try{
      const commentId = req.params.id
      const product = await Product.findOne({comments: {_id: commentId}})
      await Product.findByIdAndUpdate(product._id, { $pullAll: {comments: [commentId]}})
      await Comment.findByIdAndRemove(commentId)
      res.redirect('/admin/comments')
   } catch(err) {
      console.log(err)
   }
}

module.exports = {
   limitProduct,
   getAllProduct,
   getOneProduct,
   getComment,
   deleteComment,
   getCategoryProducts
}