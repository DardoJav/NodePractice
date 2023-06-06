import express from 'express'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/carrito.router.js'

const app = express()
app.use(express.json())

app.use('/products', productRouter)
app.use('/carts', cartRouter)

app.listen(8080, () => console.log('Server running on PORT: 8080'))