import { Router } from 'express'
import { ProductManager } from '../controllers/ProductManager.js'

const router = Router()
const productManager = new ProductManager('./src/public/productos.json')

router.get('/', async (req, res) => {
    const limit = req.query.limit
    const products = await productManager.getProducts(limit)
    res.render('home', {products})
})

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {})
})

export default router