import express from 'express'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import session from 'express-session'

const app = express()
app.use(express.json())

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.use('/products', productRouter)
app.use('/carts', cartRouter)

const uri = 'mongodb+srv://coder:coder@cluster0.qgkzyz6.mongodb.net/'

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017',
        dbName: 'clase19',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: 'victoriasecret',
    resave: true,
    saveUninitialized: true
}))

const auth = (req, res, next) => {
  if (req.session?.user && req.session.user.username === 'admin@coderhouse.com') {
      return next()
  }
  return res.status(401).json({ status: 'fail', message: 'Auth error' })
}

app.get('/', (_req, res) => res.json({ status: 'success', message: 'Que la fueza te acompañe!' }))

app.get('/products', auth, (req, res) => {
    //lectura de los prodyctos de la bd
    const products = [{ name: 'coca cola'}, { name: 'pepsi' }]
    res.render('products', {
        username: req.session.user.username,
        products: products
    })
  })
  app.get('/user/profile', (req, res) => {
    const user = {
        username: 'admin@coderhouse.com',
        ui_preference: 'dark',
        language: 'es',
        location: 'pe'
    }
    // res.cookie('preference', JSON.stringify(user), {signed: true}).json({ status: 'success', message: 'Cookie creada!' })
    req.session.user = user
    res.json({ status: 'success', message: 'Session creada!' })
  })
  
  app.get('/user/getpreference', (req, res) => {
    res.send(req.session.user.username)
  })
  
  app.get('/user/deletepreference', (req, res) => {
    // res.clearCookie('preference').json({ status: 'success', message: 'Cookie deleteada!' })
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