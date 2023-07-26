import express from 'express'
import productRouter from './routes/product.router.js'
// import cartRouter from './routes/cart.router.js'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'

const app = express()
app.use(express.json())

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.use('/products', productRouter)
// app.use('/carts', cartRouter)

const uri = 'mongodb+srv://coder:coder@cluster0.qgkzyz6.mongodb.net/'

try {
    await mongoose.connect(uri, {
        dbName: 'ecommerce'
    })
    console.log('dbconnected')
    app.listen(8080, () => console.log('Server running on PORT: 8080'))
} catch(err) {
    console.log(err.message)
}