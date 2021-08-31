const { Schema, model } =require('mongoose')

const categorySchema  = new Schema({
   categoryTitle: {
      type: String,
      required: true,
      unique: true
   },
   categorySlugUrl: {
      type: String,
      required: true
   }
})

module.exports = model('Category', categorySchema)