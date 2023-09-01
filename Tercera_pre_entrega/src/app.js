import "dotenv/config.js";
import express from 'express'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import viewRouter from './routes/view.router.js'
import sessionRouter from './routes/session.router.js'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import session from 'express-session'
// import MongoStore from 'connect-mongo'
import passport from "passport";
import initializePassport from "./config/passport.config.js"
import __dirname, {passportCall} from "./utils.js"
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json()) // para poder leer json desde los requests
app.use(express.urlencoded({extended: true})) // para poder recibir datos desde un formulario en una vista (login)
app.use(cookieParser('secret'))
app.use(express.static(__dirname + "/public"))
const hbs = handlebars.create({ //agrego esta validacion en handelbars para poder validar en el if del products.handlebars
  helpers: {
    and: function (a, b) {
      return a && b;
    },
    notEqual: function (a, b) {
      return a !== b;
    }
    // pueden ir otros helpers aca
  }
})
app.engine('handlebars', hbs.engine)
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(session({
  // store: MongoStore.create({ //se usaba para guardar la session en la bd
  //     mongoUrl: process.env.MONGO_DB_URI,
  //     dbName: process.env.MONGO_DB_NAME,
  //     mongoOptions: {
  //         useNewUrlParser: true,
  //         useUnifiedTopology: true
  //     }
  // }),
  secret: 'mysecret',
  resave: true,
  saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//falta agregar el views y cambiar products y carts a api/..
//falta agregar el home.handlebars
//falta agregar la pagina de cargar productos desde el public/index

app.use('/api/products',  passportCall('jwt'), productRouter)
//ejemplo de /products usando de middleware un handlePolicies
//app.use("/products", passportCall('jwt'), handlePolicies(['ADMIN']), productViewsRouter)
app.use('/api/carts',  passportCall('jwt'), cartRouter)
app.use("/session", sessionRouter)
app.use("/products", passportCall('jwt'), viewRouter)
app.use("/carts", passportCall('jwt'), viewRouter)

app.use("/", (_req, res) => res.redirect("/session/login"))

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