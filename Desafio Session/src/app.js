import express from 'express'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import session from 'express-session'
import MongoStore from 'connect-mongo'


const app = express()

app.use(session({
  store: MongoStore.create({
      mongoUrl: 'mongodb+srv://coder:coder@cluster0.qgkzyz6.mongodb.net/',
      dbName: 'ecommerce',
      mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true
      }
  }),
  secret: 'victoriasecret',
  resave: true,
  saveUninitialized: true
}))

app.use(express.json())

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.use('/products', productRouter)
app.use('/carts', cartRouter)

const uri = 'mongodb+srv://coder:coder@cluster0.qgkzyz6.mongodb.net/'

app.get('/user/profile', (req, res) => {
  const user = {
      username: 'admin@coderhouse.com',
      password: 'coder1234',
      ui_preference: 'dark',
      language: 'es',
      location: 'ar'
  }
  req.session.user = user
  res.json({ status: 'success', message: 'Session creada!', reqUser: req.session.user })
})

app.get('/user/getpreference', (req, res) => {
  res.send(req.session.user.username)
})

app.get('/user/deletepreference', (req, res) => {
  req.session.destroy(err => {
      if (err) return res.json({ status: 'error', message: 'Ocurrio un error' })
      return res.json({ status: 'success', message: 'Cookie deleteada!' })
  })
})

try {
    await mongoose.connect(uri, {
        dbName: 'ecommerce'
    })
    console.log('dbconnected')
    app.listen(8080, () => console.log('Server running on PORT: 8080'))
} catch(err) {
    console.log(err.message)
}