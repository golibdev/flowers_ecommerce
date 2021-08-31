const path = require('path')
const fs = require('fs')
const Product = require('../models/productModels')
const Category = require('../models/categoryModels')
const Order = require('../models/orderModels')
const Comment = require('../models/commentModels')
const fullDate = require('../config/date')

const dashboard = async (req, res) => {
   try {
      const allOrders = await Order.find()
      let countCancelled = 0, countSuccess = 0
      allOrders.forEach(order => {
         if(order.status === 'cancelled'){
            countCancelled++
         }
         
         if(order.status === 'done') {
            countSuccess++
         }
      })
      const todayOrders = await Order.find({today: fullDate()}).lean()
      const countToday = await Order.find({today: fullDate()}).countDocuments()
      const countAll = await Order.find().countDocuments()

      const comments = await Comment.find().lean()
      const newComment = await Comment.find({commentStatus: false}).lean()

      let countNewComment = 0

      comments.forEach(comment => {
         if(comment.commentStatus === false) {
            countNewComment++
         }
      })

      res.render('admin/home', {
         title: 'Admin panel',
         fullDate: fullDate(),
         count: countAll,
         countToday,
         countCancelled,
         countSuccess,
         todayOrders: todayOrders.reverse(),
         countNewComment,
         newComment: newComment.reverse(),
         firstName: req.session.user.firstName,
         lastName: req.session.user.lastName,
      })
   } catch(err) {
      console.log(err)
   }
}

const getallOrders = async (req, res) => {
   try {
      const pagelimit = 10
      const limit = parseInt(req.query.limit)
      const page = parseInt(req.query.page)
      const total = await Order.countDocuments()

      //Redirect if queires [page, limit] doesn't exist
      if(req.url === '/orders'){
         return res.redirect(`?page=1&limit=${pagelimit}`)
      }

      const orders = await Order
         .find()
         .skip((page * limit) - limit)
         .limit(limit)
         .lean()

      res.render('admin/allOrders', {
         orders: orders.reverse(),
         pagination: {
            page,
            limit,
            pageCount: Math.ceil(total/limit)
         },
         total
      })
   } catch (err) {
      console.log(err)
   }
}

const getComments = async (req, res) => {
   try{
      const comments = await Comment.find().lean()

      let countNewComment = 0

      comments.forEach(async (c) => {
         if(c.commentStatus === false) {
            countNewComment++
            await Comment.findByIdAndUpdate(c._id, {commentStatus: true})
         }
      })
      res.render('admin/commentsPage', {
         title: 'Izohlar',
         comments: comments.reverse()
      })
   }catch(err) {
      console.log(err)
   }
}

const addProduct = async (req, res) => {
   try {
      const categories = await Category.find().lean()
      const comments = await Comment.find().lean()
      let countNewComment = 0

      comments.forEach(comment => {
         if(comment.commentStatus === false) {
            countNewComment++
         }
      })
      const newComment = await Comment.find({commentStatus: false}).lean()
      res.render('admin/addProducts', {
         title: "Maxsulot qo'shish",
         categories,
         fileErr: req.flash('fileErr')[0],
         countNewComment,
         newComment: newComment.reverse()
      })
   } catch(err) {
      console.log(err)
   }
}

const addNewProduct = async (req, res) => {
   try{
      if(!req.files) {
         req.flash('fileErr', 'Fayl yuklanmagan')
         return res.redirect('/admin/add')
      }

      const image = req.files.image

      if(!image.mimetype.startsWith('image')){
         req.flash('fileErr', 'Faqat rasm yuklashingiz mumkin')
         return res.redirect('/admin/add')
      }

      if(image.size > process.env.MAX_FILE_UPLOAD_SIZE) {
         req.flash('fileErr', 'File hajmi 10mb dan oshmasligi kerak')
         return res.redirect('/admin/add')
      }

      image.name = `photo_${new Date().getTime()}${path.parse(image.name).ext}`

      image.mv(`public/uploads/${image.name}`, async err => {
         if(err) {
            console.log(err)
         }
      })

      const { title, description, amount_small_size, amount_medium_size, amount_big_size, amount_with_lamp, category } = req.body

      const product = await Product({
         title,
         image: `/uploads/${image.name}`,
         description,
         amount_small_size,
         amount_medium_size,
         amount_big_size,
         amount_with_lamp,
         category
      })

      await product.save()
      res.redirect('/admin/add')
   }catch(err) {
      console.log(err)
   }
}

const category = async (req, res) => {
   try{
      const categories = await Category.find().lean()
      const comments = await Comment.find().lean()
      let countNewComment = 0
      const newComment = await Comment.find({commentStatus: false}).lean()

      comments.forEach(comment => {
         if(comment.commentStatus === false) {
            countNewComment++
         }
      })
      res.render('admin/addCategory', {
         title: "Kategoriya qo'shish",
         categories,
         countNewComment,
         newComment: newComment.reverse()
      })
   } catch(err) {
      console.log(err)
   }
}

const addCategory = async (req, res) => {
   try{
      const categoryTitle = req.body.categoryTitle

      function convertSlugText(text){
         return text.toLowerCase().
         replace(/ /g,'-')
         .replace(/[^\w-]+/g,'')
      }

      const category = Category({
         categoryTitle,
         categorySlugUrl: convertSlugText(categoryTitle)
      })

      category.save()
      res.redirect('/admin/category')
   } catch(err) {
      console.log(err)
   }
}

const deleteCategory = async (req, res) => {
   try{
      const categoryId = req.params.id
      await Category.findByIdAndDelete(categoryId)

      res.redirect('/admin/category')
   }catch(err) {
      console.log(err)
   }
}

const updateCategory = async (req, res) => {
   try{
      const comments = await Comment.find().lean()
      let countNewComment = 0
      comments.forEach(comment => {
         if(comment.commentStatus === false) {
            countNewComment++
         }
      })
      const query = req.query.category
      const editedCategory = await Category.findOne({categorySlugUrl: query}).lean()
      const newComment = await Comment.find({commentStatus: false}).lean()

      res.render('admin/editCategory', {
         title: 'Kategoriya tahrirlash',
         editedCategory,
         countNewComment,
         newComment: newComment.reverse()
      })
   } catch(err){
      console.log(err)
   }
}

const updatedCategory = async (req, res) => {
   try{
      const query = req.query.category
      const editCategory = await Category.findOne({categorySlugUrl: query})

      const editedCategory = await Category.findByIdAndUpdate(editCategory._id, req.body)

      res.redirect('/admin/category')
   } catch(err) {
      console.log(err)
   }
}

const productList = async (req, res) => {
   try {
      if(req.query.search){
         const newComment = await Comment.find({commentStatus: false}).lean()
         const regex = new RegExp(escapeRegex(req.query.search), 'gi')
         const products = await Product.find({title: regex}).sort({ $natural: -1 }).lean()
         let countNewComment = 0
         const comments = await Comment.find().lean()

         comments.forEach(comment => {
            if(comment.commentStatus === false) {
               countNewComment++
            }
         })
         res.render('admin/productList', {
            title: 'Mahsulotlar ro`yhati',
            products,
            countNewComment,
            newComment: newComment.reverse()
         })
      } else {
         const newComment = await Comment.find({commentStatus: false}).lean()
         let countNewComment = 0
         const comments = await Comment.find().lean()

         comments.forEach(comment => {
            if(comment.commentStatus === false) {
               countNewComment++
            }
         })
         const products = await Product.find().sort({ $natural: -1 }).lean()
         res.render('admin/productList', {
            title: 'Mahsulotlar ro`yhati',
            products,
            countNewComment,
            newComment: newComment.reverse()
         })
      }
   } catch(err) {
      console.log(err)
   }
} 

const deleteProduct = async (req, res) => {
   try{
      const id = req.params.id
      const product = await Product.findById(id)
      const filePath = path.join(__dirname, '..', `public${product.image}`)
      fs.unlinkSync(filePath)

      await Product.findByIdAndDelete(id)

      res.redirect('/admin/products')
   }catch(err) {
      console.log(err)
   }
}

const updateProduct = async (req, res) => {
   try {
      const newComment = await Comment.find({commentStatus: false}).lean()
      const comments = await Comment.find().lean()
      let countNewComment = 0
      comments.forEach(comment => {
         if(comment.commentStatus === false) {
            countNewComment++
         }
      })
      const id = req.params.id
      const product = await Product.findById(id).lean()
      
      res.render('admin/updateProduct', {
         title: product.title,
         product,
         countNewComment,
         newComment: newComment.reverse()
      })
   } catch(err) {
      console.log(err)
   }
}

const updatedProduct = async (req, res) => {
   try{
      const productId = req.params.id

      await Product.findByIdAndUpdate(productId, req.body)

      res.redirect('/admin/products')
   }catch(err){
      console.log(rrr)
   }
}

function escapeRegex(text) {
   return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

module.exports = {
   dashboard,
   getComments,
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
   getallOrders
}