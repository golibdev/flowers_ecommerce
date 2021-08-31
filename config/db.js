const mongoose = require('mongoose')

const connectDB = async () => {
   const MONGO_URI = process.env.MONGO_URI
   const conn = await mongoose.connect(MONGO_URI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
   })

   console.log(`MongoDB connected to: ${conn.connection.host}`)
}

module.exports = connectDB