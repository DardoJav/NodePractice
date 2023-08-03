import "dotenv/config";
import express from 'express'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import sessionRouter from './routes/session.router.js'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import __dirname from "./utils.js"

const app = express()

app.use(express.json()) // para poder leer json desde los requests
app.use(express.urlencoded({extended: true})) // para poder recibir datos desde un formulario en una vista (login)
app.use(express.static(__dirname + "/public"))
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(session({
  store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB_URI,
      dbName: process.env.MONGO_DB_NAME,
      mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true
      }
  }),
  secret: 'mysecret',
  resave: true,
  saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//////////////////////////////////////////////////////////////////Seguir el video 43350 - 13/07 - Autorización y autenticación desde hora 1.08.00
//////////////////////////////////////////////////////////////////despues agregar lo de github
//falta agregar el views y cambiar products y carts a api/..
//falta agregar el home.handlebars
//falta agregar la pagina de login 
//falta agregar la pagina de registrar usuario
//falta agregar la pagina de cargar productos desde el public/index
app.use('/products', productRouter)
app.use('/carts', cartRouter)
app.use("/session", sessionRouter)

// const uri = 'mongodb+srv://coder:coder@cluster0.qgkzyz6.mongodb.net/'

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

app.use("/", (_req, res) => res.send("HOME"))

try {
    await mongoose.connect(process.env.MONGO_DB_URI, 
      {
        dbName: process.env.MONGO_DB_NAME
      })
    console.log('dbconnected!')

    const httpServer = app.listen(8080, () => console.log('Server running on PORT: 8080'))
    httpServer.on("error", (e) => console.log("ERROR: " + e))
    
} catch(err) {
    console.log(err.message)
}