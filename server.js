const express = require('express')
const path = require('path')
require('dotenv').config()
const connectDB = require('./config/db')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const flash = require('express-flash')
const fileUpload = require('express-fileupload')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const helpers = require('./utils/hbsHelpers')


const app = express()

const store = new MongoStore({
   uri: process.env.MONGO_URI,
   collection: 'sessions'
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Register handlebars helpers
helpers(Handlebars)

app.use(session({
   secret: process.env.SECRET_KEY,
   store: store,
   resave: true,
   saveUninitialized: true
}))

app.use(flash())
app.use(fileUpload())

// Create static folder
app.use(express.static(path.join(__dirname, 'public')))

// Set hbs shablonizator
app.engine('hbs', exphbs({ extname: 'hbs' }))
app.set('view engine', 'hbs')


app.use('/', require('./routes/homeRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/admin', require('./routes/dashboardRoutes'))
app.use('/order', require('./routes/orderRoutes'))


connectDB()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
   console.log(`Server running on port: ${PORT}`)
})