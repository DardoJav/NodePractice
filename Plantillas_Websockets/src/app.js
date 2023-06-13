import express from 'express'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import {Server} from 'socket.io'
import { ProductManager } from './controllers/ProductManager.js'
const productManager = new ProductManager('./src/public/productos.json')

const app = express()
app.use(express.json())
app.engine('handlebars',handlebars.engine())
app.set('views','./src/views')
app.set('view engine','handlebars')

// app.use representa un middleware
app.use(express.static('./src/public'))
app.use('/', viewsRouter)

const serverHttp = app.listen(8080, () => console.log('Server running on PORT: 8080'))
const io = new Server(serverHttp)

io.on('connection', async(socket) => {
    const products = await productManager.getProducts()
    console.log('Se ha realizado una coneccion')
    socket.emit('products', products)
})

//como haria para que este endpoint este dentro de product.router usando websockets ?
app.post('/products', async (req, res) => {
    const result = await productManager.addProduct(req.body.title, req.body.description, req.body.code, req.body.price, req.body.status, req.body.stock, req.body.category, req.body.thumbnail)
    if (result != 'passed') return res.status(400).json({status: 'error', detalle: result})
    const products = await productManager.getProducts()
    io.emit('products', products) //como hago para poner socket.emit en lugar de io.emit ?
    return res.status(200).json({status: 'success', detalle: 'producto agregado con exito'})
})