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
import errorHandler from './middleware/error.middleware.js'
import logger from "./logger.js";

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

//falta agregar el home.handlebars
//falta agregar la pagina de cargar productos desde el public/index

app.use('/api/products',  passportCall('jwt'), productRouter)
app.use('/api/carts',  passportCall('jwt'), cartRouter)
app.use("/session", sessionRouter)
app.use("/products", passportCall('jwt'), viewRouter)
app.use("/carts", passportCall('jwt'), viewRouter)
app.use(errorHandler)

app.post('/loggerTest', (req, res) => {
  logger.debug('Logging a debug log type')
  logger.http('Logging a http log type')
  logger.info('Logging an info log type')
  logger.warning('Logging a warning log type')
  logger.error('Logging an error log type')
  logger.fatal('Logging a fatal log type')
  res.json({ status: 'success' })
})

app.use('/', (_req, res) => res.redirect("/session/login"))



try {
    await mongoose.connect(process.env.MONGO_DB_URI, 
      {
        dbName: process.env.MONGO_DB_NAME
      })
      logger.info('dbconnected!')
      const httpServer = app.listen(8080, () => logger.info('Server running on PORT: 8080'))
      httpServer.on("error", (e) => logger.fatal("ERROR: " + e))

} catch(err) {
  logger.fatal(err.message)
}